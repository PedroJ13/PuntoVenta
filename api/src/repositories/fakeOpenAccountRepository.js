import { httpError } from "../auth/fakeAuth.js";

export function createFakeOpenAccountRepository({ store }) {
  return {
    async list({ companyId, status = "open" }) {
      return store.openAccounts
        .filter((account) => account.companyId === companyId && (!status || account.status === status))
        .map(toAccountSummary);
    },

    async create({ auth, payload, now }) {
      const terminal = findTerminal(store, auth.companyId, payload.terminalId);
      const shift = findOpenShift(store, auth.companyId, payload.cashShiftId, payload.terminalId);
      const name = requiredText(payload.name, "name", 80);

      const account = {
        id: store.nextAccountId,
        companyId: auth.companyId,
        terminalId: terminal.id,
        cashShiftId: shift.id,
        customerId: payload.customerId ?? null,
        name,
        status: "open",
        createdAt: now.toISOString(),
        createdByUserId: auth.userId,
        cancelledReason: null,
        lines: []
      };
      store.nextAccountId += 1;
      store.openAccounts.push(account);
      return toAccountDetail(account);
    },

    async get({ companyId, accountId }) {
      return toAccountDetail(findAccount(store, companyId, accountId));
    },

    async update({ companyId, accountId, payload }) {
      const account = findAccount(store, companyId, accountId);
      if (account.status !== "open") {
        throw httpError("INVALID_STATE", "Only open accounts can be changed.", 409);
      }

      if (payload.name !== undefined) {
        account.name = requiredText(payload.name, "name", 80);
      }

      if (payload.status === "cancelled") {
        account.cancelledReason = requiredText(payload.reason, "reason", 160);
        account.status = "cancelled";
      }

      return toAccountDetail(account);
    },

    async addLine({ auth, accountId, payload }) {
      const account = findOpenAccount(store, auth.companyId, accountId);
      const item = findSaleableItem(store, auth.companyId, payload.itemId);
      const line = normalizeLinePayload({ auth, item, payload, lineId: store.nextLineId });
      store.nextLineId += 1;
      account.lines.push(line);
      return toAccountDetail(account);
    },

    async updateLine({ auth, accountId, lineId, payload }) {
      const account = findOpenAccount(store, auth.companyId, accountId);
      const line = findLine(account, lineId);
      const item = findSaleableItem(store, auth.companyId, line.itemId);
      const merged = { ...line, ...payload };
      const updated = normalizeLinePayload({ auth, item, payload: merged, lineId: line.id });
      Object.assign(line, updated);
      return toAccountDetail(account);
    },

    async removeLine({ companyId, accountId, lineId }) {
      const account = findOpenAccount(store, companyId, accountId);
      const index = account.lines.findIndex((line) => line.id === Number(lineId));
      if (index === -1) throw httpError("NOT_FOUND", "Open account line not found.", 404);
      account.lines.splice(index, 1);
      return toAccountDetail(account);
    },

    async markPaid({ companyId, accountId, saleId }) {
      const account = findOpenAccount(store, companyId, accountId);
      account.status = "paid";
      account.saleId = saleId;
      return toAccountDetail(account);
    }
  };
}

export function findAccount(store, companyId, accountId) {
  const account = store.openAccounts.find((candidate) => {
    return candidate.companyId === companyId && candidate.id === Number(accountId);
  });
  if (!account) throw httpError("NOT_FOUND", "Open account not found.", 404);
  return account;
}

export function findOpenAccount(store, companyId, accountId) {
  const account = findAccount(store, companyId, accountId);
  if (account.status !== "open") {
    throw httpError("INVALID_STATE", "Open account is not editable.", 409);
  }
  return account;
}

export function findTerminal(store, companyId, terminalId) {
  const terminal = store.terminals.find((candidate) => {
    return candidate.companyId === companyId && candidate.id === Number(terminalId) && candidate.isActive;
  });
  if (!terminal) throw httpError("NOT_FOUND", "Terminal not found.", 404);
  return terminal;
}

export function findOpenShift(store, companyId, cashShiftId, terminalId) {
  const shift = store.cashShifts.find((candidate) => {
    return (
      candidate.companyId === companyId &&
      candidate.id === Number(cashShiftId) &&
      candidate.terminalId === Number(terminalId) &&
      candidate.status === "open"
    );
  });
  if (!shift) throw httpError("SHIFT_REQUIRED", "An open cash shift is required.", 409);
  return shift;
}

export function findSaleableItem(store, companyId, itemId) {
  const item = store.items.find((candidate) => {
    return candidate.companyId === companyId && candidate.id === Number(itemId) && candidate.isActive;
  });
  if (!item || !["prepared_product", "purchased_product"].includes(item.itemType)) {
    throw httpError("NOT_FOUND", "Saleable item not found.", 404);
  }
  return item;
}

function normalizeLinePayload({ auth, item, payload, lineId }) {
  const quantity = positiveNumber(payload.quantity, "quantity");
  const unitPrice = payload.unitPrice === undefined ? item.salePrice : nonNegativeNumber(payload.unitPrice, "unitPrice");
  const discountAmount =
    payload.discountAmount === undefined ? 0 : nonNegativeNumber(payload.discountAmount, "discountAmount");

  if (unitPrice !== item.salePrice && !auth.permissions.includes("sales.override_price")) {
    throw httpError("FORBIDDEN", "User does not have permission to change prices.", 403, [
      { field: "unitPrice", message: "sales.override_price required." }
    ]);
  }

  if (discountAmount > 0 && !auth.permissions.includes("sales.discount")) {
    throw httpError("FORBIDDEN", "User does not have permission to apply discounts.", 403, [
      { field: "discountAmount", message: "sales.discount required." }
    ]);
  }

  return {
    id: Number(lineId),
    itemId: item.id,
    name: item.name,
    quantity,
    unitPrice,
    discountAmount,
    taxRate: item.taxRate,
    notes: typeof payload.notes === "string" ? payload.notes.trim().slice(0, 160) : ""
  };
}

function findLine(account, lineId) {
  const line = account.lines.find((candidate) => candidate.id === Number(lineId));
  if (!line) throw httpError("NOT_FOUND", "Open account line not found.", 404);
  return line;
}

function toAccountSummary(account) {
  const totals = calculateTotals(account.lines);
  return {
    id: account.id,
    name: account.name,
    status: account.status,
    terminalId: account.terminalId,
    cashShiftId: account.cashShiftId,
    lineCount: account.lines.length,
    totalAmount: totals.totalAmount,
    createdAt: account.createdAt
  };
}

function toAccountDetail(account) {
  return {
    ...toAccountSummary(account),
    customerId: account.customerId,
    cancelledReason: account.cancelledReason,
    lines: account.lines.map((line) => {
      const amounts = calculateLineAmounts(line);
      return { ...line, ...amounts };
    }),
    totals: calculateTotals(account.lines)
  };
}

export function calculateLineAmounts(line) {
  const subtotalAmount = roundMoney(line.quantity * line.unitPrice);
  const discountAmount = roundMoney(line.discountAmount || 0);
  const taxableAmount = roundMoney(subtotalAmount - discountAmount);
  const taxAmount = roundMoney(taxableAmount * (line.taxRate || 0));
  return {
    subtotalAmount,
    discountAmount,
    taxAmount,
    lineTotal: taxableAmount,
    totalAmount: roundMoney(taxableAmount + taxAmount)
  };
}

export function calculateTotals(lines) {
  return lines.reduce(
    (totals, line) => {
      const amounts = calculateLineAmounts(line);
      totals.subtotalAmount = roundMoney(totals.subtotalAmount + amounts.subtotalAmount);
      totals.discountAmount = roundMoney(totals.discountAmount + amounts.discountAmount);
      totals.taxAmount = roundMoney(totals.taxAmount + amounts.taxAmount);
      totals.totalAmount = roundMoney(totals.totalAmount + amounts.totalAmount);
      return totals;
    },
    { subtotalAmount: 0, discountAmount: 0, taxAmount: 0, totalAmount: 0 }
  );
}

export function roundMoney(value) {
  return Math.round(Number(value) + Number.EPSILON);
}

function requiredText(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Required field." }
    ]);
  }
  return value.trim().slice(0, maxLength);
}

function positiveNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Must be greater than zero." }
    ]);
  }
  return number;
}

function nonNegativeNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Must be zero or greater." }
    ]);
  }
  return number;
}

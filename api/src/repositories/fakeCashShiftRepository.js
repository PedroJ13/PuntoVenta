import { httpError } from "../auth/fakeAuth.js";
import { roundMoney } from "./fakeOpenAccountRepository.js";

const VALID_MOVEMENT_TYPES = ["cash_in", "cash_out", "cash_adjustment"];
const VALID_PAYMENT_METHODS = ["cash", "card", "transfer", "other"];

export function createFakeCashShiftRepository({ store }) {
  return {
    async current({ companyId, terminalId }) {
      const shift = findCurrentShift(store, companyId, terminalId);
      return shift ? toShiftDetail(store, shift) : null;
    },

    async get({ companyId, shiftId }) {
      return toShiftDetail(store, findShift(store, companyId, shiftId));
    },

    async open({ auth, payload, now }) {
      const terminalId = normalizePositiveInt(payload.terminalId, "terminalId");
      findTerminal(store, auth.companyId, terminalId);

      if (findCurrentShift(store, auth.companyId, terminalId)) {
        throw httpError("CONFLICT", "Terminal already has an open cash shift.", 409, [
          { field: "terminalId", message: "Terminal already has an open shift." }
        ]);
      }

      const shift = {
        id: store.nextCashShiftId,
        companyId: auth.companyId,
        terminalId,
        status: "open",
        openingCashAmount: normalizeNonNegativeMoney(payload.openingCashAmount, "openingCashAmount"),
        openedAt: now.toISOString(),
        openedByUserId: auth.userId,
        openingNote: optionalText(payload.note, 160),
        closedAt: null,
        closedByUserId: null,
        countedCashAmount: null,
        expectedCashAmount: null,
        differenceAmount: null,
        closingNote: null
      };
      store.nextCashShiftId += 1;
      store.cashShifts.push(shift);
      return toShiftDetail(store, shift);
    },

    async addMovement({ auth, shiftId, payload, now }) {
      const shift = findOpenShift(store, auth.companyId, shiftId);
      const movementType = normalizeMovementType(payload.movementType);
      const amount = normalizePositiveMoney(payload.amount, "amount");
      const reason = requiredText(payload.reason, "reason", 160);
      const direction = movementType === "cash_adjustment" ? normalizeAdjustmentDirection(payload.direction) : null;
      const signedAmount = calculateSignedMovementAmount({ movementType, amount, direction });

      const movement = {
        id: store.nextCashMovementId,
        companyId: auth.companyId,
        cashShiftId: shift.id,
        movementType,
        amount,
        signedAmount,
        direction,
        reason,
        reference: optionalText(payload.reference, 80),
        createdAt: now.toISOString(),
        createdByUserId: auth.userId
      };
      store.nextCashMovementId += 1;
      store.cashMovements.push(movement);
      return toMovementResponse(movement);
    },

    async close({ auth, shiftId, payload, now }) {
      const shift = findOpenShift(store, auth.companyId, shiftId);
      const openAccounts = store.openAccounts.filter((account) => {
        return account.companyId === auth.companyId && account.cashShiftId === shift.id && account.status === "open";
      });
      if (openAccounts.length > 0) {
        throw httpError("INVALID_STATE", "Cash shift has open accounts.", 409, [
          { field: "openAccounts", message: "Close, charge, or cancel open accounts before closing cash." }
        ]);
      }

      const countedCashAmount = normalizeNonNegativeMoney(payload.countedCashAmount, "countedCashAmount");
      const summary = calculateShiftSummary(store, shift);
      const differenceAmount = roundMoney(countedCashAmount - summary.expectedCashAmount);
      const note = optionalText(payload.notes, 240);

      if (differenceAmount !== 0 && !note) {
        throw httpError("VALIDATION_ERROR", "Closing note is required when cash difference exists.", 400, [
          { field: "notes", message: "Required when difference is not zero." }
        ]);
      }

      shift.status = "closed";
      shift.closedAt = now.toISOString();
      shift.closedByUserId = auth.userId;
      shift.countedCashAmount = countedCashAmount;
      shift.expectedCashAmount = summary.expectedCashAmount;
      shift.differenceAmount = differenceAmount;
      shift.closingNote = note;

      return toShiftDetail(store, shift);
    },

    findOpenShift({ companyId, cashShiftId, terminalId }) {
      return findOpenShiftByIds(store, companyId, cashShiftId, terminalId);
    },

    summarizeShift({ companyId, shiftId }) {
      return toShiftDetail(store, findShift(store, companyId, shiftId));
    }
  };
}

function toShiftDetail(store, shift) {
  const summary = calculateShiftSummary(store, shift);
  return {
    cashShiftId: shift.id,
    terminalId: shift.terminalId,
    status: shift.status,
    openingCashAmount: shift.openingCashAmount,
    openedAt: shift.openedAt ?? null,
    openedByUserId: shift.openedByUserId ?? null,
    openingNote: shift.openingNote ?? null,
    closedAt: shift.closedAt ?? null,
    closedByUserId: shift.closedByUserId ?? null,
    salesCount: summary.salesCount,
    totalAmount: summary.totalAmount,
    payments: summary.payments,
    manualMovements: summary.manualMovements,
    expectedCashAmount: shift.status === "closed" ? shift.expectedCashAmount : summary.expectedCashAmount,
    countedCashAmount: shift.countedCashAmount,
    differenceAmount: shift.differenceAmount,
    closingNote: shift.closingNote
  };
}

function calculateShiftSummary(store, shift) {
  const sales = store.sales.filter((sale) => {
    return sale.companyId === shift.companyId && sale.cashShiftId === shift.id && sale.status === "paid";
  });
  const payments = aggregatePayments(sales);
  const manualMovements = store.cashMovements
    .filter((movement) => movement.companyId === shift.companyId && movement.cashShiftId === shift.id)
    .map(toMovementResponse);
  const cashPayments = payments.find((payment) => payment.paymentMethod === "cash")?.amount || 0;
  const manualCashDelta = manualMovements.reduce((sum, movement) => roundMoney(sum + movement.signedAmount), 0);
  const totalAmount = sales.reduce((sum, sale) => roundMoney(sum + sale.totals.totalAmount), 0);

  return {
    salesCount: sales.length,
    totalAmount,
    payments,
    manualMovements,
    expectedCashAmount: roundMoney(shift.openingCashAmount + cashPayments + manualCashDelta)
  };
}

function aggregatePayments(sales) {
  const byMethod = new Map(VALID_PAYMENT_METHODS.map((paymentMethod) => [paymentMethod, { paymentMethod, count: 0, amount: 0 }]));
  for (const sale of sales) {
    for (const payment of sale.payments) {
      const current = byMethod.get(payment.paymentMethod) || { paymentMethod: payment.paymentMethod, count: 0, amount: 0 };
      current.count += 1;
      current.amount = roundMoney(current.amount + payment.amount);
      byMethod.set(payment.paymentMethod, current);
    }
  }
  return [...byMethod.values()];
}

function toMovementResponse(movement) {
  return {
    id: movement.id,
    movementType: movement.movementType,
    amount: movement.amount,
    signedAmount: movement.signedAmount,
    direction: movement.direction,
    reason: movement.reason,
    reference: movement.reference,
    createdAt: movement.createdAt,
    createdByUserId: movement.createdByUserId
  };
}

function findCurrentShift(store, companyId, terminalId) {
  return store.cashShifts.find((candidate) => {
    return candidate.companyId === companyId && candidate.terminalId === Number(terminalId) && candidate.status === "open";
  });
}

function findShift(store, companyId, shiftId) {
  const shift = store.cashShifts.find((candidate) => {
    return candidate.companyId === companyId && candidate.id === Number(shiftId);
  });
  if (!shift) throw httpError("NOT_FOUND", "Cash shift not found.", 404);
  return shift;
}

function findOpenShift(store, companyId, shiftId) {
  const shift = findShift(store, companyId, shiftId);
  if (shift.status !== "open") throw httpError("SHIFT_REQUIRED", "An open cash shift is required.", 409);
  return shift;
}

function findOpenShiftByIds(store, companyId, cashShiftId, terminalId) {
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

function findTerminal(store, companyId, terminalId) {
  const terminal = store.terminals.find((candidate) => {
    return candidate.companyId === companyId && candidate.id === Number(terminalId) && candidate.isActive;
  });
  if (!terminal) throw httpError("NOT_FOUND", "Terminal not found.", 404);
  return terminal;
}

function normalizeMovementType(value) {
  if (!VALID_MOVEMENT_TYPES.includes(value)) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field: "movementType", message: "Invalid movement type." }
    ]);
  }
  return value;
}

function normalizeAdjustmentDirection(value) {
  if (value === undefined || value === null || value === "") return "increase";
  if (!["increase", "decrease"].includes(value)) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field: "direction", message: "Invalid adjustment direction." }
    ]);
  }
  return value;
}

function calculateSignedMovementAmount({ movementType, amount, direction }) {
  if (movementType === "cash_out") return -amount;
  if (movementType === "cash_adjustment" && direction === "decrease") return -amount;
  return amount;
}

function normalizePositiveInt(value, field) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Must be a positive integer." }
    ]);
  }
  return number;
}

function normalizePositiveMoney(value, field) {
  const amount = roundMoney(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Must be greater than zero." }
    ]);
  }
  return amount;
}

function normalizeNonNegativeMoney(value, field) {
  const amount = roundMoney(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Must be zero or greater." }
    ]);
  }
  return amount;
}

function requiredText(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field, message: "Required field." }
    ]);
  }
  return value.trim().slice(0, maxLength);
}

function optionalText(value, maxLength) {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim().slice(0, maxLength);
}

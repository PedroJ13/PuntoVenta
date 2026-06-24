import { httpError } from "../auth/fakeAuth.js";
import {
  calculateLineAmounts,
  calculateTotals,
  findAccount,
  findSaleableItem,
  findTerminal,
  roundMoney
} from "./fakeOpenAccountRepository.js";

export function createFakeSalesRepository({ store, openAccounts, cashShifts }) {
  return {
    async checkout({ auth, payload, now }) {
      const terminal = findTerminal(store, auth.companyId, payload.terminalId);
      const shift = cashShifts.findOpenShift({
        companyId: auth.companyId,
        cashShiftId: payload.cashShiftId,
        terminalId: payload.terminalId
      });
      const source = resolveCheckoutSource({ store, companyId: auth.companyId, payload });
      const totals = calculateTotals(source.lines);

      validatePayments(payload.payments, totals.totalAmount);
      validateInventory(store, auth.companyId, source.lines);
      applyInventory(store, auth.companyId, source.lines);

      const saleId = store.nextSaleId;
      store.nextSaleId += 1;
      const paidAt = now.toISOString();
      const sale = {
        id: saleId,
        companyId: auth.companyId,
        terminalId: terminal.id,
        terminalName: terminal.name,
        cashShiftId: shift.id,
        customerId: payload.customerId ?? source.customerId ?? null,
        openAccountId: source.openAccountId,
        accountName: source.accountName,
        soldByUserId: auth.userId,
        cashierName: auth.displayName,
        ticketNumber: `PV-${String(saleId).padStart(7, "0")}`,
        status: "paid",
        paidAt,
        lines: source.lines.map((line) => ({ ...line, ...calculateLineAmounts(line) })),
        payments: payload.payments.map((payment) => ({
          paymentMethod: payment.paymentMethod,
          amount: roundMoney(payment.amount),
          reference: payment.reference ?? null
        })),
        totals
      };

      store.sales.push(sale);
      if (source.openAccountId) {
        await openAccounts.markPaid({ companyId: auth.companyId, accountId: source.openAccountId, saleId });
      }

      return {
        saleId: sale.id,
        ticketNumber: sale.ticketNumber,
        status: sale.status,
        subtotalAmount: totals.subtotalAmount,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        paidAt
      };
    },

    async getTicket({ companyId, saleId }) {
      const sale = store.sales.find((candidate) => candidate.companyId === companyId && candidate.id === Number(saleId));
      if (!sale) throw httpError("NOT_FOUND", "Sale ticket not found.", 404);

      return {
        ticketNumber: sale.ticketNumber,
        status: sale.status,
        businessName: store.businessName,
        paidAt: sale.paidAt,
        terminalName: sale.terminalName,
        cashierName: sale.cashierName,
        accountName: sale.accountName,
        lines: sale.lines.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          discountAmount: line.discountAmount,
          taxAmount: line.taxAmount,
          lineTotal: line.lineTotal
        })),
        subtotalAmount: sale.totals.subtotalAmount,
        discountAmount: sale.totals.discountAmount,
        taxAmount: sale.totals.taxAmount,
        totalAmount: sale.totals.totalAmount,
        payments: sale.payments,
        footerNote: "Comprobante interno - no es factura electronica"
      };
    }
  };
}

function resolveCheckoutSource({ store, companyId, payload }) {
  if (payload.openAccountId !== undefined && payload.openAccountId !== null) {
    const account = findAccount(store, companyId, payload.openAccountId);
    if (account.status !== "open") {
      throw httpError("INVALID_STATE", "Open account cannot be checked out.", 409);
    }
    if (!account.lines.length) {
      throw httpError("VALIDATION_ERROR", "Open account has no lines.", 400, [
        { field: "openAccountId", message: "Account must have at least one line." }
      ]);
    }
    return {
      openAccountId: account.id,
      accountName: account.name,
      customerId: account.customerId,
      lines: account.lines.map((line) => ({ ...line }))
    };
  }

  if (!Array.isArray(payload.lines) || !payload.lines.length) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field: "lines", message: "At least one line is required." }
    ]);
  }

  return {
    openAccountId: null,
    accountName: null,
    customerId: payload.customerId ?? null,
    lines: payload.lines.map((line) => normalizeCheckoutLine(store, companyId, line))
  };
}

function normalizeCheckoutLine(store, companyId, payload) {
  const item = findSaleableItem(store, companyId, payload.itemId);
  const quantity = positiveNumber(payload.quantity, "quantity");
  const unitPrice = payload.unitPrice === undefined ? item.salePrice : nonNegativeNumber(payload.unitPrice, "unitPrice");
  const discountAmount =
    payload.discountAmount === undefined ? 0 : nonNegativeNumber(payload.discountAmount, "discountAmount");

  return {
    id: null,
    itemId: item.id,
    name: item.name,
    quantity,
    unitPrice,
    discountAmount,
    taxRate: item.taxRate,
    notes: ""
  };
}

function validatePayments(payments, totalAmount) {
  if (!Array.isArray(payments) || !payments.length) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field: "payments", message: "At least one payment is required." }
    ]);
  }

  const paidAmount = payments.reduce((sum, payment, index) => {
    if (!["cash", "card", "transfer", "other"].includes(payment.paymentMethod)) {
      throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
        { field: `payments[${index}].paymentMethod`, message: "Invalid payment method." }
      ]);
    }
    return roundMoney(sum + positiveNumber(payment.amount, `payments[${index}].amount`));
  }, 0);

  if (roundMoney(paidAmount) !== roundMoney(totalAmount)) {
    throw httpError("VALIDATION_ERROR", "Payments must match sale total.", 400, [
      { field: "payments", message: `Expected ${totalAmount}, received ${paidAmount}.` }
    ]);
  }
}

function validateInventory(store, companyId, lines) {
  const required = calculateInventoryRequirements(store, companyId, lines);
  for (const requirement of required) {
    const item = findInventoryItem(store, companyId, requirement.itemId);
    if (item.currentStock < requirement.quantity) {
      throw httpError("INSUFFICIENT_STOCK", "Insufficient stock for checkout.", 409, [
        { field: "itemId", message: String(requirement.itemId) }
      ]);
    }
  }
}

function applyInventory(store, companyId, lines) {
  const required = calculateInventoryRequirements(store, companyId, lines);
  for (const requirement of required) {
    const item = findInventoryItem(store, companyId, requirement.itemId);
    item.currentStock = roundMoney(item.currentStock - requirement.quantity);
  }
}

function calculateInventoryRequirements(store, companyId, lines) {
  const requirements = new Map();
  for (const line of lines) {
    const item = findSaleableItem(store, companyId, line.itemId);
    if (item.itemType === "purchased_product" && item.currentStock !== null) {
      addRequirement(requirements, item.id, line.quantity);
    }
    if (item.itemType === "prepared_product") {
      const recipe = store.recipes.find((candidate) => {
        return candidate.companyId === companyId && candidate.outputItemId === item.id && candidate.isActive;
      });
      if (!recipe) throw httpError("CONFLICT", "Prepared item requires an active recipe.", 409);
      for (const ingredient of recipe.ingredients) {
        addRequirement(requirements, ingredient.ingredientItemId, line.quantity * ingredient.quantity);
      }
    }
  }
  return [...requirements.entries()].map(([itemId, quantity]) => ({ itemId, quantity: roundMoney(quantity) }));
}

function addRequirement(requirements, itemId, quantity) {
  requirements.set(itemId, roundMoney((requirements.get(itemId) || 0) + quantity));
}

function findInventoryItem(store, companyId, itemId) {
  const item = store.items.find((candidate) => candidate.companyId === companyId && candidate.id === Number(itemId));
  if (!item) throw httpError("NOT_FOUND", "Inventory item not found.", 404);
  return item;
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

import { httpError } from "../auth/fakeAuth.js";
import { roundMoney } from "./fakeOpenAccountRepository.js";

const VALID_MOVEMENT_TYPES = ["cash_in", "cash_out", "cash_adjustment"];
const VALID_PAYMENT_METHODS = ["cash", "card", "transfer", "other"];

export function createSqlCashShiftRepository({ sqlClient, companyTaxId }) {
  return {
    async current({ terminalId }) {
      const rows = await sqlClient.query(
        `
SELECT TOP (1) cs.id
FROM dbo.cash_shifts cs
INNER JOIN dbo.companies c ON c.id = cs.company_id
WHERE c.tax_id = @companyTaxId
  AND cs.terminal_id = @terminalId
  AND cs.status = 'open'
ORDER BY cs.opened_at DESC, cs.id DESC;
        `,
        [
          { name: "companyTaxId", value: companyTaxId },
          { name: "terminalId", value: Number(terminalId) }
        ]
      );
      return rows[0] ? this.get({ shiftId: rows[0].id }) : null;
    },

    async get({ shiftId }) {
      const shift = await findShift({ sqlClient, companyTaxId, shiftId });
      return toShiftDetail(await buildShiftDetail({ sqlClient, shift }));
    },

    async open({ auth, payload, now = new Date() }) {
      const terminalId = normalizePositiveInt(payload.terminalId, "terminalId");
      const openingCashAmount = normalizeNonNegativeMoney(payload.openingCashAmount, "openingCashAmount");
      const openingNote = optionalText(payload.note, 160);
      const terminal = await findTerminal({ sqlClient, companyTaxId, terminalId });
      const existing = await this.current({ terminalId: terminal.id });
      if (existing) {
        throw httpError("CONFLICT", "Terminal already has an open cash shift.", 409, [
          { field: "terminalId", message: "Terminal already has an open shift." }
        ]);
      }

      const userId = await findUserId({ sqlClient, companyTaxId, auth });
      const rows = await sqlClient.query(
        `
DECLARE @companyId INT = (SELECT id FROM dbo.companies WHERE tax_id = @companyTaxId);

INSERT INTO dbo.cash_shifts (
    company_id,
    terminal_id,
    opened_by_user_id,
    status,
    opening_cash_amount,
    opened_at,
    opening_note
)
VALUES (
    @companyId,
    @terminalId,
    @userId,
    'open',
    @openingCashAmount,
    @openedAt,
    @openingNote
);

SELECT CONVERT(INT, SCOPE_IDENTITY()) AS id;
        `,
        [
          { name: "companyTaxId", value: companyTaxId },
          { name: "terminalId", value: terminal.id },
          { name: "userId", value: userId },
          { name: "openingCashAmount", value: openingCashAmount },
          { name: "openedAt", value: toSqlDateTime(now) },
          { name: "openingNote", value: openingNote }
        ]
      );

      return this.get({ shiftId: rows[0].id });
    },

    async addMovement({ auth, shiftId, payload, now = new Date() }) {
      const shift = await findOpenShift({ sqlClient, companyTaxId, shiftId });
      const movementType = normalizeMovementType(payload.movementType);
      const amount = normalizePositiveMoney(payload.amount, "amount");
      const reason = requiredText(payload.reason, "reason", 160);
      const direction = movementType === "cash_adjustment" ? normalizeAdjustmentDirection(payload.direction) : null;
      const signedAmount = calculateSignedMovementAmount({ movementType, amount, direction });
      const userId = await findUserId({ sqlClient, companyTaxId, auth });
      const reference = optionalText(payload.reference, 120);

      const rows = await sqlClient.query(
        `
INSERT INTO dbo.cash_movements (
    company_id,
    cash_shift_id,
    movement_type,
    amount,
    signed_amount,
    adjustment_direction,
    reference,
    reason,
    created_by_user_id,
    created_at
)
VALUES (
    @companyId,
    @shiftId,
    @movementType,
    @amount,
    @signedAmount,
    @direction,
    @reference,
    @reason,
    @userId,
    @createdAt
);

SELECT CONVERT(INT, SCOPE_IDENTITY()) AS id;
        `,
        [
          { name: "companyId", value: shift.companyId },
          { name: "shiftId", value: shift.id },
          { name: "movementType", value: movementType },
          { name: "amount", value: amount },
          { name: "signedAmount", value: signedAmount },
          { name: "direction", value: direction },
          { name: "reference", value: reference },
          { name: "reason", value: reason },
          { name: "userId", value: userId },
          { name: "createdAt", value: toSqlDateTime(now) }
        ]
      );

      const movement = await findMovement({ sqlClient, shiftId: shift.id, movementId: rows[0].id });
      return toMovementResponse(movement);
    },

    async close({ auth, shiftId, payload, now = new Date() }) {
      const shift = await findOpenShift({ sqlClient, companyTaxId, shiftId });
      const openAccountsCount = await countOpenAccounts({ sqlClient, shift });
      if (openAccountsCount > 0) {
        throw httpError("INVALID_STATE", "Cash shift has open accounts.", 409, [
          { field: "openAccounts", message: "Close, charge, or cancel open accounts before closing cash." }
        ]);
      }

      const countedCashAmount = normalizeNonNegativeMoney(payload.countedCashAmount, "countedCashAmount");
      const detail = await buildShiftDetail({ sqlClient, shift });
      const expectedCashAmount = detail.summary.expectedCashAmount;
      const differenceAmount = roundMoney(countedCashAmount - expectedCashAmount);
      const note = optionalText(payload.notes, 240);

      if (differenceAmount !== 0 && !note) {
        throw httpError("VALIDATION_ERROR", "Closing note is required when cash difference exists.", 400, [
          { field: "notes", message: "Required when difference is not zero." }
        ]);
      }

      const userId = await findUserId({ sqlClient, companyTaxId, auth });
      await sqlClient.query(
        `
UPDATE dbo.cash_shifts
SET status = 'closed',
    closed_at = @closedAt,
    closed_by_user_id = @userId,
    counted_cash_amount = @countedCashAmount,
    expected_cash_amount = @expectedCashAmount,
    difference_amount = @differenceAmount,
    closing_note = @closingNote
WHERE id = @shiftId
  AND company_id = @companyId;
        `,
        [
          { name: "closedAt", value: toSqlDateTime(now) },
          { name: "userId", value: userId },
          { name: "countedCashAmount", value: countedCashAmount },
          { name: "expectedCashAmount", value: expectedCashAmount },
          { name: "differenceAmount", value: differenceAmount },
          { name: "closingNote", value: note },
          { name: "shiftId", value: shift.id },
          { name: "companyId", value: shift.companyId }
        ]
      );

      return this.get({ shiftId });
    },

    async findOpenShift({ cashShiftId, terminalId }) {
      return findOpenShiftByIds({ sqlClient, companyTaxId, cashShiftId, terminalId });
    },

    async summarizeShift({ shiftId }) {
      return this.get({ shiftId });
    }
  };
}

async function findShift({ sqlClient, companyTaxId, shiftId }) {
  const rows = await sqlClient.query(
    `
SELECT
    cs.id,
    cs.company_id AS companyId,
    cs.terminal_id AS terminalId,
    cs.status,
    cs.opening_cash_amount AS openingCashAmount,
    cs.opened_at AS openedAt,
    cs.opened_by_user_id AS openedByUserId,
    cs.opening_note AS openingNote,
    cs.closed_at AS closedAt,
    cs.closed_by_user_id AS closedByUserId,
    cs.counted_cash_amount AS countedCashAmount,
    cs.expected_cash_amount AS expectedCashAmount,
    cs.difference_amount AS differenceAmount,
    cs.closing_note AS closingNote
FROM dbo.cash_shifts cs
INNER JOIN dbo.companies c ON c.id = cs.company_id
WHERE c.tax_id = @companyTaxId
  AND cs.id = @shiftId;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "shiftId", value: Number(shiftId) }
    ]
  );

  if (rows.length === 0) throw httpError("NOT_FOUND", "Cash shift not found.", 404);
  return rows[0];
}

async function findOpenShift({ sqlClient, companyTaxId, shiftId }) {
  const shift = await findShift({ sqlClient, companyTaxId, shiftId });
  if (shift.status !== "open") throw httpError("SHIFT_REQUIRED", "An open cash shift is required.", 409);
  return shift;
}

async function findOpenShiftByIds({ sqlClient, companyTaxId, cashShiftId, terminalId }) {
  const rows = await sqlClient.query(
    `
SELECT cs.id
FROM dbo.cash_shifts cs
INNER JOIN dbo.companies c ON c.id = cs.company_id
WHERE c.tax_id = @companyTaxId
  AND cs.id = @cashShiftId
  AND cs.terminal_id = @terminalId
  AND cs.status = 'open';
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "cashShiftId", value: Number(cashShiftId) },
      { name: "terminalId", value: Number(terminalId) }
    ]
  );
  if (rows.length === 0) throw httpError("SHIFT_REQUIRED", "An open cash shift is required.", 409);
  return findShift({ sqlClient, companyTaxId, shiftId: rows[0].id });
}

async function findTerminal({ sqlClient, companyTaxId, terminalId }) {
  const rows = await sqlClient.query(
    `
SELECT t.id
FROM dbo.terminals t
INNER JOIN dbo.companies c ON c.id = t.company_id
WHERE c.tax_id = @companyTaxId
  AND t.id = @terminalId
  AND t.is_active = 1;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "terminalId", value: terminalId }
    ]
  );
  if (rows.length === 0) throw httpError("NOT_FOUND", "Terminal not found.", 404);
  return rows[0];
}

async function findUserId({ sqlClient, companyTaxId, auth }) {
  const email = auth?.roles?.includes("admin") ? "admin.demo@puntoventa.local" : "cajero.demo@puntoventa.local";
  const rows = await sqlClient.query(
    `
SELECT u.id
FROM dbo.users u
INNER JOIN dbo.companies c ON c.id = u.company_id
WHERE c.tax_id = @companyTaxId
  AND u.email = @email
  AND u.is_active = 1;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "email", value: email }
    ]
  );
  if (rows.length === 0) throw new Error("SQL local demo user was not found.");
  return rows[0].id;
}

async function findMovement({ sqlClient, shiftId, movementId }) {
  const rows = await sqlClient.query(
    `
SELECT
    id,
    movement_type AS movementType,
    amount,
    signed_amount AS signedAmount,
    adjustment_direction AS direction,
    reason,
    reference,
    created_at AS createdAt,
    created_by_user_id AS createdByUserId
FROM dbo.cash_movements
WHERE id = @movementId
  AND cash_shift_id = @shiftId;
    `,
    [
      { name: "movementId", value: Number(movementId) },
      { name: "shiftId", value: Number(shiftId) }
    ]
  );
  if (rows.length === 0) throw new Error("SQL local cash movement was not found.");
  return rows[0];
}

async function buildShiftDetail({ sqlClient, shift }) {
  const [salesSummary, paymentRows, movementRows] = await Promise.all([
    getSalesSummary({ sqlClient, shift }),
    getPaymentSummary({ sqlClient, shift }),
    getManualMovements({ sqlClient, shift })
  ]);
  const payments = VALID_PAYMENT_METHODS.map((paymentMethod) => {
    const current = paymentRows.find((row) => row.paymentMethod === paymentMethod);
    return {
      paymentMethod,
      count: current?.count || 0,
      amount: roundMoney(current?.amount || 0)
    };
  });
  const manualMovements = movementRows.map(toMovementResponse);
  const cashPayments = payments.find((payment) => payment.paymentMethod === "cash")?.amount || 0;
  const manualCashDelta = manualMovements.reduce((sum, movement) => roundMoney(sum + movement.signedAmount), 0);
  const expectedCashAmount = roundMoney(shift.openingCashAmount + cashPayments + manualCashDelta);

  return {
    shift,
    summary: {
      salesCount: salesSummary.salesCount || 0,
      totalAmount: roundMoney(salesSummary.totalAmount || 0),
      payments,
      manualMovements,
      expectedCashAmount
    }
  };
}

async function getSalesSummary({ sqlClient, shift }) {
  const rows = await sqlClient.query(
    `
SELECT
    COUNT(*) AS salesCount,
    COALESCE(SUM(total_amount), 0) AS totalAmount
FROM dbo.sales
WHERE company_id = @companyId
  AND cash_shift_id = @shiftId
  AND status = 'paid';
    `,
    [
      { name: "companyId", value: shift.companyId },
      { name: "shiftId", value: shift.id }
    ]
  );
  return rows[0] || { salesCount: 0, totalAmount: 0 };
}

async function getPaymentSummary({ sqlClient, shift }) {
  return sqlClient.query(
    `
SELECT
    p.payment_method AS paymentMethod,
    COUNT(*) AS count,
    COALESCE(SUM(p.amount), 0) AS amount
FROM dbo.payments p
INNER JOIN dbo.sales s ON s.id = p.sale_id
WHERE s.company_id = @companyId
  AND s.cash_shift_id = @shiftId
  AND s.status = 'paid'
GROUP BY p.payment_method;
    `,
    [
      { name: "companyId", value: shift.companyId },
      { name: "shiftId", value: shift.id }
    ]
  );
}

async function getManualMovements({ sqlClient, shift }) {
  return sqlClient.query(
    `
SELECT
    id,
    movement_type AS movementType,
    amount,
    signed_amount AS signedAmount,
    adjustment_direction AS direction,
    reason,
    reference,
    created_at AS createdAt,
    created_by_user_id AS createdByUserId
FROM dbo.cash_movements
WHERE company_id = @companyId
  AND cash_shift_id = @shiftId
  AND movement_type IN ('cash_in', 'cash_out', 'cash_adjustment')
ORDER BY created_at, id;
    `,
    [
      { name: "companyId", value: shift.companyId },
      { name: "shiftId", value: shift.id }
    ]
  );
}

async function countOpenAccounts({ sqlClient, shift }) {
  const rows = await sqlClient.query(
    `
SELECT COUNT(*) AS count
FROM dbo.open_accounts
WHERE company_id = @companyId
  AND cash_shift_id = @shiftId
  AND status = 'open';
    `,
    [
      { name: "companyId", value: shift.companyId },
      { name: "shiftId", value: shift.id }
    ]
  );
  return rows[0]?.count || 0;
}

function toShiftDetail({ shift, summary }) {
  return {
    cashShiftId: shift.id,
    terminalId: shift.terminalId,
    status: shift.status,
    openingCashAmount: roundMoney(shift.openingCashAmount),
    openedAt: shift.openedAt ?? null,
    openedByUserId: shift.openedByUserId ?? null,
    openingNote: shift.openingNote ?? null,
    closedAt: shift.closedAt ?? null,
    closedByUserId: shift.closedByUserId ?? null,
    salesCount: summary.salesCount,
    totalAmount: summary.totalAmount,
    payments: summary.payments,
    manualMovements: summary.manualMovements,
    expectedCashAmount: shift.status === "closed" ? roundMoney(shift.expectedCashAmount) : summary.expectedCashAmount,
    countedCashAmount: shift.countedCashAmount === null ? null : roundMoney(shift.countedCashAmount),
    differenceAmount: shift.differenceAmount === null ? null : roundMoney(shift.differenceAmount),
    closingNote: shift.closingNote ?? null
  };
}

function toMovementResponse(movement) {
  return {
    id: movement.id,
    movementType: movement.movementType,
    amount: roundMoney(movement.amount),
    signedAmount: roundMoney(movement.signedAmount),
    direction: movement.direction,
    reason: movement.reason,
    reference: movement.reference,
    createdAt: movement.createdAt,
    createdByUserId: movement.createdByUserId
  };
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

function toSqlDateTime(date) {
  return date.toISOString().slice(0, 19);
}

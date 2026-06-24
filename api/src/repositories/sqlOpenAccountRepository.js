import { httpError } from "../auth/fakeAuth.js";
import { calculateLineAmounts, roundMoney } from "./fakeOpenAccountRepository.js";

export function createSqlOpenAccountRepository({ sqlClient, companyTaxId }) {
  return {
    async list({ status = "open" } = {}) {
      return sqlClient.query(
        `
SELECT
    oa.id,
    oa.name,
    oa.status,
    oa.terminal_id AS terminalId,
    oa.cash_shift_id AS cashShiftId,
    COUNT(oal.id) AS lineCount,
    oa.total_amount AS totalAmount,
    oa.opened_at AS createdAt
FROM dbo.open_accounts oa
INNER JOIN dbo.companies c ON c.id = oa.company_id
LEFT JOIN dbo.open_account_lines oal ON oal.open_account_id = oa.id
WHERE c.tax_id = @companyTaxId
  AND (@status IS NULL OR oa.status = @status)
GROUP BY oa.id, oa.name, oa.status, oa.terminal_id, oa.cash_shift_id, oa.total_amount, oa.opened_at
ORDER BY oa.opened_at DESC, oa.id DESC;
        `,
        [
          { name: "companyTaxId", value: companyTaxId },
          { name: "status", value: status || null }
        ]
      );
    },

    async create({ auth, payload, now = new Date() }) {
      const name = requiredText(payload.name, "name", 120);
      const terminalId = await findTerminalId({ sqlClient, companyTaxId, terminalId: payload.terminalId });
      const userId = await findUserId({ sqlClient, companyTaxId, auth });
      const cashShiftId = await findOptionalOpenCashShiftId({
        sqlClient,
        companyTaxId,
        terminalId,
        cashShiftId: payload.cashShiftId
      });
      const customerId = await findOptionalCustomerId({ sqlClient, companyTaxId, customerId: payload.customerId });

      const rows = await sqlClient.query(
        `
DECLARE @companyId INT = (SELECT id FROM dbo.companies WHERE tax_id = @companyTaxId);

INSERT INTO dbo.open_accounts (
    company_id,
    terminal_id,
    cash_shift_id,
    customer_id,
    opened_by_user_id,
    name,
    status,
    opened_at
)
VALUES (
    @companyId,
    @terminalId,
    @cashShiftId,
    @customerId,
    @userId,
    @name,
    'open',
    @openedAt
);

SELECT CONVERT(INT, SCOPE_IDENTITY()) AS id;
        `,
        [
          { name: "companyTaxId", value: companyTaxId },
          { name: "terminalId", value: terminalId },
          { name: "cashShiftId", value: cashShiftId },
          { name: "customerId", value: customerId },
          { name: "userId", value: userId },
          { name: "name", value: name },
          { name: "openedAt", value: toSqlDateTime(now) }
        ]
      );

      return this.get({ accountId: rows[0].id });
    },

    async get({ accountId }) {
      const rows = await getAccountRows({ sqlClient, companyTaxId, accountId });
      if (rows.length === 0) throw httpError("NOT_FOUND", "Open account not found.", 404);
      return toAccountDetail(rows);
    },

    async update({ auth, accountId, payload }) {
      const account = await findOpenAccount({ sqlClient, companyTaxId, accountId });

      if (payload.name !== undefined) {
        const name = requiredText(payload.name, "name", 120);
        await sqlClient.query(
          `
UPDATE dbo.open_accounts
SET name = @name
WHERE id = @accountId
  AND company_id = @companyId;
          `,
          [
            { name: "name", value: name },
            { name: "accountId", value: account.id },
            { name: "companyId", value: account.companyId }
          ]
        );
      }

      if (payload.status === "cancelled") {
        const reason = requiredText(payload.reason, "reason", 300);
        const userId = await findUserId({ sqlClient, companyTaxId, auth });
        await sqlClient.query(
          `
UPDATE dbo.open_accounts
SET status = 'cancelled',
    cancel_reason = @reason,
    closed_at = SYSUTCDATETIME(),
    closed_by_user_id = @userId
WHERE id = @accountId
  AND company_id = @companyId;
          `,
          [
            { name: "reason", value: reason },
            { name: "userId", value: userId },
            { name: "accountId", value: account.id },
            { name: "companyId", value: account.companyId }
          ]
        );
      }

      return this.get({ accountId });
    },

    async addLine({ auth, accountId, payload }) {
      const account = await findOpenAccount({ sqlClient, companyTaxId, accountId });
      const item = await findSaleableItem({ sqlClient, companyTaxId, itemId: payload.itemId });
      const line = normalizeLinePayload({ auth, item, payload });
      const amounts = calculateLineAmounts(line);

      const rows = await sqlClient.query(
        `
INSERT INTO dbo.open_account_lines (
    open_account_id,
    item_id,
    quantity,
    unit_price,
    discount_amount,
    tax_amount,
    line_total,
    notes
)
VALUES (
    @accountId,
    @itemId,
    @quantity,
    @unitPrice,
    @discountAmount,
    @taxAmount,
    @lineTotal,
    @notes
);

SELECT CONVERT(INT, SCOPE_IDENTITY()) AS id;
        `,
        [
          { name: "accountId", value: account.id },
          { name: "itemId", value: item.id },
          { name: "quantity", value: line.quantity },
          { name: "unitPrice", value: line.unitPrice },
          { name: "discountAmount", value: amounts.discountAmount },
          { name: "taxAmount", value: amounts.taxAmount },
          { name: "lineTotal", value: amounts.lineTotal },
          { name: "notes", value: line.notes || null }
        ]
      );

      await refreshAccountTotals({ sqlClient, accountId: account.id });
      if (!rows[0]?.id) throw new Error("SQL local did not return open account line id.");
      return this.get({ accountId });
    },

    async updateLine({ auth, accountId, lineId, payload }) {
      const account = await findOpenAccount({ sqlClient, companyTaxId, accountId });
      const currentLine = await findLine({ sqlClient, accountId: account.id, lineId });
      const item = await findSaleableItem({ sqlClient, companyTaxId, itemId: currentLine.itemId });
      const merged = {
        itemId: currentLine.itemId,
        quantity: currentLine.quantity,
        unitPrice: currentLine.unitPrice,
        discountAmount: currentLine.discountAmount,
        notes: currentLine.notes || "",
        ...payload
      };
      const line = normalizeLinePayload({ auth, item, payload: merged });
      const amounts = calculateLineAmounts(line);

      await sqlClient.query(
        `
UPDATE dbo.open_account_lines
SET quantity = @quantity,
    unit_price = @unitPrice,
    discount_amount = @discountAmount,
    tax_amount = @taxAmount,
    line_total = @lineTotal,
    notes = @notes
WHERE id = @lineId
  AND open_account_id = @accountId;
        `,
        [
          { name: "quantity", value: line.quantity },
          { name: "unitPrice", value: line.unitPrice },
          { name: "discountAmount", value: amounts.discountAmount },
          { name: "taxAmount", value: amounts.taxAmount },
          { name: "lineTotal", value: amounts.lineTotal },
          { name: "notes", value: line.notes || null },
          { name: "lineId", value: currentLine.id },
          { name: "accountId", value: account.id }
        ]
      );

      await refreshAccountTotals({ sqlClient, accountId: account.id });
      return this.get({ accountId });
    },

    async removeLine({ accountId, lineId }) {
      const account = await findOpenAccount({ sqlClient, companyTaxId, accountId });
      await findLine({ sqlClient, accountId: account.id, lineId });

      await sqlClient.query(
        `
DELETE FROM dbo.open_account_lines
WHERE id = @lineId
  AND open_account_id = @accountId;
        `,
        [
          { name: "lineId", value: Number(lineId) },
          { name: "accountId", value: account.id }
        ]
      );

      await refreshAccountTotals({ sqlClient, accountId: account.id });
      return this.get({ accountId });
    },

    async markPaid({ accountId, saleId }) {
      const account = await findOpenAccount({ sqlClient, companyTaxId, accountId });
      await sqlClient.query(
        `
UPDATE dbo.open_accounts
SET status = 'paid',
    closed_at = SYSUTCDATETIME()
WHERE id = @accountId
  AND company_id = @companyId;
        `,
        [
          { name: "accountId", value: account.id },
          { name: "companyId", value: account.companyId },
          { name: "saleId", value: saleId ?? null }
        ]
      );
      return this.get({ accountId });
    }
  };
}

async function getAccountRows({ sqlClient, companyTaxId, accountId }) {
  return sqlClient.query(
    `
SELECT
    oa.id,
    oa.company_id AS companyId,
    oa.name,
    oa.status,
    oa.terminal_id AS terminalId,
    oa.cash_shift_id AS cashShiftId,
    oa.customer_id AS customerId,
    oa.cancel_reason AS cancelledReason,
    oa.subtotal_amount AS accountSubtotalAmount,
    oa.tax_amount AS accountTaxAmount,
    oa.total_amount AS accountTotalAmount,
    oa.opened_at AS createdAt,
    oal.id AS lineId,
    oal.item_id AS itemId,
    i.name AS itemName,
    oal.quantity,
    oal.unit_price AS unitPrice,
    oal.discount_amount AS discountAmount,
    i.tax_rate AS taxRate,
    oal.tax_amount AS taxAmount,
    oal.line_total AS lineTotal,
    oal.notes
FROM dbo.open_accounts oa
INNER JOIN dbo.companies c ON c.id = oa.company_id
LEFT JOIN dbo.open_account_lines oal ON oal.open_account_id = oa.id
LEFT JOIN dbo.items i ON i.id = oal.item_id
WHERE c.tax_id = @companyTaxId
  AND oa.id = @accountId
ORDER BY oal.id;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "accountId", value: Number(accountId) }
    ]
  );
}

async function findOpenAccount({ sqlClient, companyTaxId, accountId }) {
  const rows = await sqlClient.query(
    `
SELECT
    oa.id,
    oa.company_id AS companyId,
    oa.status
FROM dbo.open_accounts oa
INNER JOIN dbo.companies c ON c.id = oa.company_id
WHERE c.tax_id = @companyTaxId
  AND oa.id = @accountId;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "accountId", value: Number(accountId) }
    ]
  );

  if (rows.length === 0) throw httpError("NOT_FOUND", "Open account not found.", 404);
  if (rows[0].status !== "open") throw httpError("INVALID_STATE", "Open account is not editable.", 409);
  return rows[0];
}

async function findTerminalId({ sqlClient, companyTaxId, terminalId }) {
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
      { name: "terminalId", value: Number(terminalId) }
    ]
  );
  if (rows.length === 0) throw httpError("NOT_FOUND", "Terminal not found.", 404);
  return rows[0].id;
}

async function findOptionalOpenCashShiftId({ sqlClient, companyTaxId, terminalId, cashShiftId }) {
  if (cashShiftId === undefined || cashShiftId === null) return null;

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
      { name: "terminalId", value: terminalId }
    ]
  );

  return rows[0]?.id ?? null;
}

async function findOptionalCustomerId({ sqlClient, companyTaxId, customerId }) {
  if (customerId === undefined || customerId === null) return null;

  const rows = await sqlClient.query(
    `
SELECT cu.id
FROM dbo.customers cu
INNER JOIN dbo.companies c ON c.id = cu.company_id
WHERE c.tax_id = @companyTaxId
  AND cu.id = @customerId
  AND cu.is_active = 1;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "customerId", value: Number(customerId) }
    ]
  );
  return rows[0]?.id ?? null;
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

async function findSaleableItem({ sqlClient, companyTaxId, itemId }) {
  const rows = await sqlClient.query(
    `
SELECT
    i.id,
    i.name,
    i.item_type AS itemType,
    i.sale_price AS salePrice,
    i.tax_rate AS taxRate
FROM dbo.items i
INNER JOIN dbo.companies c ON c.id = i.company_id
WHERE c.tax_id = @companyTaxId
  AND i.id = @itemId
  AND i.is_active = 1;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "itemId", value: Number(itemId) }
    ]
  );

  const item = rows[0];
  if (!item || !["prepared_product", "purchased_product"].includes(item.itemType)) {
    throw httpError("NOT_FOUND", "Saleable item not found.", 404);
  }
  return item;
}

async function findLine({ sqlClient, accountId, lineId }) {
  const rows = await sqlClient.query(
    `
SELECT
    id,
    item_id AS itemId,
    quantity,
    unit_price AS unitPrice,
    discount_amount AS discountAmount,
    notes
FROM dbo.open_account_lines
WHERE id = @lineId
  AND open_account_id = @accountId;
    `,
    [
      { name: "lineId", value: Number(lineId) },
      { name: "accountId", value: Number(accountId) }
    ]
  );

  if (rows.length === 0) throw httpError("NOT_FOUND", "Open account line not found.", 404);
  return rows[0];
}

async function refreshAccountTotals({ sqlClient, accountId }) {
  await sqlClient.query(
    `
UPDATE oa
SET subtotal_amount = totals.subtotal_amount,
    tax_amount = totals.tax_amount,
    total_amount = totals.total_amount
FROM dbo.open_accounts oa
CROSS APPLY (
    SELECT
        COALESCE(SUM(oal.quantity * oal.unit_price), 0) AS subtotal_amount,
        COALESCE(SUM(oal.tax_amount), 0) AS tax_amount,
        COALESCE(SUM(oal.line_total + oal.tax_amount), 0) AS total_amount
    FROM dbo.open_account_lines oal
    WHERE oal.open_account_id = oa.id
) totals
WHERE oa.id = @accountId;
    `,
    [{ name: "accountId", value: Number(accountId) }]
  );
}

function normalizeLinePayload({ auth, item, payload }) {
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
    itemId: item.id,
    name: item.name,
    quantity,
    unitPrice,
    discountAmount,
    taxRate: item.taxRate,
    notes: typeof payload.notes === "string" ? payload.notes.trim().slice(0, 160) : ""
  };
}

function toAccountDetail(rows) {
  const account = rows[0];
  const lines = rows
    .filter((row) => row.lineId !== null && row.lineId !== undefined)
    .map((row) => ({
      id: row.lineId,
      itemId: row.itemId,
      name: row.itemName,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      discountAmount: row.discountAmount,
      taxRate: row.taxRate,
      notes: row.notes || "",
      subtotalAmount: roundMoney(row.quantity * row.unitPrice),
      taxAmount: roundMoney(row.taxAmount),
      lineTotal: roundMoney(row.lineTotal),
      totalAmount: roundMoney(row.lineTotal + row.taxAmount)
    }));
  const totals = {
    subtotalAmount: roundMoney(account.accountSubtotalAmount),
    discountAmount: roundMoney(lines.reduce((sum, line) => sum + line.discountAmount, 0)),
    taxAmount: roundMoney(account.accountTaxAmount),
    totalAmount: roundMoney(account.accountTotalAmount)
  };

  return {
    id: account.id,
    name: account.name,
    status: account.status,
    terminalId: account.terminalId,
    cashShiftId: account.cashShiftId,
    lineCount: lines.length,
    totalAmount: totals.totalAmount,
    createdAt: account.createdAt,
    customerId: account.customerId,
    cancelledReason: account.cancelledReason,
    lines,
    totals
  };
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

function toSqlDateTime(date) {
  return date.toISOString().slice(0, 19);
}

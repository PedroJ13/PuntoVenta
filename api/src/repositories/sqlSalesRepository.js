import { httpError } from "../auth/fakeAuth.js";
import { calculateLineAmounts, calculateTotals, roundMoney } from "./fakeOpenAccountRepository.js";

const VALID_PAYMENT_METHODS = ["cash", "card", "transfer", "other"];

export function createSqlSalesRepository({ sqlClient, companyTaxId }) {
  return {
    async checkout({ auth, payload, now = new Date() }) {
      const terminal = await findTerminal({ sqlClient, companyTaxId, terminalId: payload.terminalId });
      const shift = await findOpenShift({
        sqlClient,
        companyTaxId,
        terminalId: terminal.id,
        cashShiftId: payload.cashShiftId
      });
      const source = await resolveCheckoutSource({ sqlClient, companyTaxId, auth, payload, shift });
      const totals = calculateTotals(source.lines);
      const payments = normalizePayments(payload.payments, totals.totalAmount);
      const requirements = await calculateInventoryRequirements({ sqlClient, companyTaxId, lines: source.lines });
      await validateInventory({ sqlClient, requirements });
      const userId = await findUserId({ sqlClient, companyTaxId, auth });
      const paidAt = toSqlDateTime(now);

      const rows = await sqlClient.query(
        `
SET XACT_ABORT ON;
BEGIN TRY
  BEGIN TRANSACTION;

  DECLARE @saleIds TABLE (id INT NOT NULL);
  DECLARE @saleId INT;
  DECLARE @ticketNumber NVARCHAR(40);

  INSERT INTO dbo.sales (
      company_id,
      terminal_id,
      cash_shift_id,
      open_account_id,
      customer_id,
      sold_by_user_id,
      ticket_number,
      status,
      subtotal_amount,
      discount_amount,
      tax_amount,
      total_amount,
      paid_at
  )
  OUTPUT INSERTED.id INTO @saleIds
  VALUES (
      @companyId,
      @terminalId,
      @cashShiftId,
      @openAccountId,
      @customerId,
      @userId,
      CONCAT('P', CONVERT(NVARCHAR(36), NEWID())),
      'paid',
      @subtotalAmount,
      @discountAmount,
      @taxAmount,
      @totalAmount,
      @paidAt
  );

  SELECT @saleId = id FROM @saleIds;
  SET @ticketNumber = CONCAT('PV-', RIGHT(CONCAT('0000000', CONVERT(NVARCHAR(20), @saleId)), 7));

  UPDATE dbo.sales
  SET ticket_number = @ticketNumber
  WHERE id = @saleId;

  INSERT INTO dbo.sale_lines (
      sale_id,
      item_id,
      item_name_snapshot,
      quantity,
      unit_price,
      discount_amount,
      tax_amount,
      line_total
  )
  SELECT
      @saleId,
      itemId,
      name,
      quantity,
      unitPrice,
      discountAmount,
      taxAmount,
      lineTotal
  FROM OPENJSON(@linesJson)
  WITH (
      itemId INT '$.itemId',
      name NVARCHAR(180) '$.name',
      quantity DECIMAL(18,4) '$.quantity',
      unitPrice DECIMAL(18,2) '$.unitPrice',
      discountAmount DECIMAL(18,2) '$.discountAmount',
      taxAmount DECIMAL(18,2) '$.taxAmount',
      lineTotal DECIMAL(18,2) '$.lineTotal'
  );

  INSERT INTO dbo.payments (sale_id, payment_method, amount, reference, paid_at)
  SELECT
      @saleId,
      paymentMethod,
      amount,
      reference,
      @paidAt
  FROM OPENJSON(@paymentsJson)
  WITH (
      paymentMethod NVARCHAR(30) '$.paymentMethod',
      amount DECIMAL(18,2) '$.amount',
      reference NVARCHAR(120) '$.reference'
  );

  UPDATE i
  SET current_stock = i.current_stock - r.quantity
  FROM dbo.items i
  INNER JOIN OPENJSON(@requirementsJson)
  WITH (
      itemId INT '$.itemId',
      quantity DECIMAL(18,4) '$.quantity'
  ) r ON r.itemId = i.id
  WHERE i.company_id = @companyId
    AND i.tracks_inventory = 1
    AND i.current_stock IS NOT NULL;

  INSERT INTO dbo.inventory_movements (
      company_id,
      item_id,
      movement_type,
      quantity_delta,
      unit,
      unit_cost,
      source_type,
      source_id,
      reason,
      created_by_user_id,
      created_at
  )
  SELECT
      @companyId,
      itemId,
      movementType,
      -quantity,
      unit,
      NULL,
      sourceType,
      @saleId,
      reason,
      @userId,
      @paidAt
  FROM OPENJSON(@requirementsJson)
  WITH (
      itemId INT '$.itemId',
      quantity DECIMAL(18,4) '$.quantity',
      unit NVARCHAR(20) '$.unit',
      movementType NVARCHAR(30) '$.movementType',
      sourceType NVARCHAR(30) '$.sourceType',
      reason NVARCHAR(300) '$.reason'
  );

  IF @openAccountId IS NOT NULL
  BEGIN
      UPDATE dbo.open_accounts
      SET status = 'paid',
          closed_at = @paidAt,
          closed_by_user_id = @userId
      WHERE id = @openAccountId
        AND company_id = @companyId;
  END;

  COMMIT TRANSACTION;

  SELECT
      @saleId AS saleId,
      @ticketNumber AS ticketNumber,
      'paid' AS status,
      @subtotalAmount AS subtotalAmount,
      @discountAmount AS discountAmount,
      @taxAmount AS taxAmount,
      @totalAmount AS totalAmount,
      @paidAt AS paidAt;
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
  THROW;
END CATCH;
        `,
        [
          { name: "companyId", value: source.companyId },
          { name: "terminalId", value: terminal.id },
          { name: "cashShiftId", value: shift.id },
          { name: "openAccountId", value: source.openAccountId },
          { name: "customerId", value: payload.customerId ?? source.customerId ?? null },
          { name: "userId", value: userId },
          { name: "subtotalAmount", value: totals.subtotalAmount },
          { name: "discountAmount", value: totals.discountAmount },
          { name: "taxAmount", value: totals.taxAmount },
          { name: "totalAmount", value: totals.totalAmount },
          { name: "paidAt", value: paidAt },
          { name: "linesJson", value: JSON.stringify(source.lines.map(toPersistedLine)) },
          { name: "paymentsJson", value: JSON.stringify(payments) },
          { name: "requirementsJson", value: JSON.stringify(requirements) }
        ]
      );

      return rows[0];
    },

    async getTicket({ saleId }) {
      const rows = await getTicketRows({ sqlClient, companyTaxId, saleId });
      if (rows.length === 0) throw httpError("NOT_FOUND", "Sale ticket not found.", 404);
      const payments = await getTicketPayments({ sqlClient, saleId });
      return toTicket(rows, payments);
    }
  };
}

async function findTerminal({ sqlClient, companyTaxId, terminalId }) {
  const rows = await sqlClient.query(
    `
SELECT
    t.id,
    t.company_id AS companyId,
    t.name
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
  return rows[0];
}

async function findOpenShift({ sqlClient, companyTaxId, terminalId, cashShiftId }) {
  const rows = await sqlClient.query(
    `
SELECT
    cs.id,
    cs.company_id AS companyId,
    cs.terminal_id AS terminalId
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
  return rows[0];
}

async function resolveCheckoutSource({ sqlClient, companyTaxId, auth, payload, shift }) {
  if (payload.openAccountId !== undefined && payload.openAccountId !== null) {
    const accountRows = await getOpenAccountRows({ sqlClient, companyTaxId, openAccountId: payload.openAccountId });
    if (accountRows.length === 0) throw httpError("NOT_FOUND", "Open account not found.", 404);
    const account = accountRows[0];
    if (account.status !== "open") throw httpError("INVALID_STATE", "Open account cannot be checked out.", 409);
    if (account.cashShiftId !== null && Number(account.cashShiftId) !== Number(shift.id)) {
      throw httpError("INVALID_STATE", "Open account belongs to a different cash shift.", 409);
    }
    const lines = accountRows
      .filter((row) => row.lineId !== null && row.lineId !== undefined)
      .map((row) => ({
        itemId: row.itemId,
        name: row.itemName,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        discountAmount: row.discountAmount,
        taxRate: row.taxRate,
        notes: row.notes || ""
      }));
    if (!lines.length) {
      throw httpError("VALIDATION_ERROR", "Open account has no lines.", 400, [
        { field: "openAccountId", message: "Account must have at least one line." }
      ]);
    }
    return {
      companyId: account.companyId,
      openAccountId: account.id,
      accountName: account.name,
      customerId: account.customerId,
      lines
    };
  }

  if (!Array.isArray(payload.lines) || !payload.lines.length) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field: "lines", message: "At least one line is required." }
    ]);
  }

  return {
    companyId: shift.companyId,
    openAccountId: null,
    accountName: null,
    customerId: payload.customerId ?? null,
    lines: await Promise.all(payload.lines.map((line) => normalizeCheckoutLine({ sqlClient, companyTaxId, auth, payload: line })))
  };
}

async function getOpenAccountRows({ sqlClient, companyTaxId, openAccountId }) {
  return sqlClient.query(
    `
SELECT
    oa.id,
    oa.company_id AS companyId,
    oa.name,
    oa.status,
    oa.cash_shift_id AS cashShiftId,
    oa.customer_id AS customerId,
    oal.id AS lineId,
    oal.item_id AS itemId,
    i.name AS itemName,
    oal.quantity,
    oal.unit_price AS unitPrice,
    oal.discount_amount AS discountAmount,
    i.tax_rate AS taxRate,
    oal.notes
FROM dbo.open_accounts oa
INNER JOIN dbo.companies c ON c.id = oa.company_id
LEFT JOIN dbo.open_account_lines oal ON oal.open_account_id = oa.id
LEFT JOIN dbo.items i ON i.id = oal.item_id
WHERE c.tax_id = @companyTaxId
  AND oa.id = @openAccountId
ORDER BY oal.id;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "openAccountId", value: Number(openAccountId) }
    ]
  );
}

async function normalizeCheckoutLine({ sqlClient, companyTaxId, auth, payload }) {
  const item = await findSaleableItem({ sqlClient, companyTaxId, itemId: payload.itemId });
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
    notes: ""
  };
}

async function findSaleableItem({ sqlClient, companyTaxId, itemId }) {
  const rows = await sqlClient.query(
    `
SELECT
    i.id,
    i.name,
    i.item_type AS itemType,
    i.sale_price AS salePrice,
    i.tax_rate AS taxRate,
    CAST(i.tracks_inventory AS bit) AS tracksInventory,
    i.current_stock AS currentStock,
    i.base_unit AS baseUnit
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

function normalizePayments(payments, totalAmount) {
  if (!Array.isArray(payments) || !payments.length) {
    throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
      { field: "payments", message: "At least one payment is required." }
    ]);
  }

  const normalized = payments.map((payment, index) => {
    if (!VALID_PAYMENT_METHODS.includes(payment.paymentMethod)) {
      throw httpError("VALIDATION_ERROR", "One or more fields are invalid.", 400, [
        { field: `payments[${index}].paymentMethod`, message: "Invalid payment method." }
      ]);
    }
    return {
      paymentMethod: payment.paymentMethod,
      amount: positiveNumber(payment.amount, `payments[${index}].amount`),
      reference: payment.reference ?? null
    };
  });
  const paidAmount = normalized.reduce((sum, payment) => roundMoney(sum + payment.amount), 0);

  if (roundMoney(paidAmount) !== roundMoney(totalAmount)) {
    throw httpError("VALIDATION_ERROR", "Payments must match sale total.", 400, [
      { field: "payments", message: `Expected ${totalAmount}, received ${paidAmount}.` }
    ]);
  }

  return normalized;
}

async function calculateInventoryRequirements({ sqlClient, companyTaxId, lines }) {
  const requirements = new Map();
  for (const line of lines) {
    const item = await findSaleableItem({ sqlClient, companyTaxId, itemId: line.itemId });
    if (item.itemType === "purchased_product" && item.tracksInventory && item.currentStock !== null) {
      addRequirement(requirements, {
        itemId: item.id,
        quantity: line.quantity,
        unit: item.baseUnit,
        movementType: "sale",
        sourceType: "sale",
        reason: "Venta"
      });
    }
    if (item.itemType === "prepared_product") {
      const ingredients = await getRecipeIngredients({ sqlClient, companyTaxId, outputItemId: item.id });
      if (!ingredients.length) throw httpError("CONFLICT", "Prepared item requires an active recipe.", 409);
      for (const ingredient of ingredients) {
        addRequirement(requirements, {
          itemId: ingredient.itemId,
          quantity: line.quantity * ingredient.quantity,
          unit: ingredient.unit,
          movementType: "recipe_consumption",
          sourceType: "sale",
          reason: `Consumo receta ${item.name}`
        });
      }
    }
  }
  return [...requirements.values()].map((requirement) => ({
    ...requirement,
    quantity: roundMoney(requirement.quantity)
  }));
}

async function getRecipeIngredients({ sqlClient, companyTaxId, outputItemId }) {
  return sqlClient.query(
    `
SELECT
    ri.ingredient_item_id AS itemId,
    ri.quantity,
    ri.unit
FROM dbo.recipes r
INNER JOIN dbo.companies c ON c.id = r.company_id
INNER JOIN dbo.recipe_ingredients ri ON ri.recipe_id = r.id
WHERE c.tax_id = @companyTaxId
  AND r.output_item_id = @outputItemId
  AND r.is_active = 1;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "outputItemId", value: Number(outputItemId) }
    ]
  );
}

function addRequirement(requirements, requirement) {
  const existing = requirements.get(requirement.itemId);
  if (existing) {
    existing.quantity = roundMoney(existing.quantity + requirement.quantity);
    return;
  }
  requirements.set(requirement.itemId, requirement);
}

async function validateInventory({ sqlClient, requirements }) {
  for (const requirement of requirements) {
    const rows = await sqlClient.query(
      `
SELECT
    id,
    current_stock AS currentStock,
    CAST(tracks_inventory AS bit) AS tracksInventory
FROM dbo.items
WHERE id = @itemId;
      `,
      [{ name: "itemId", value: requirement.itemId }]
    );
    const item = rows[0];
    if (!item) throw httpError("NOT_FOUND", "Inventory item not found.", 404);
    if (item.tracksInventory && item.currentStock !== null && item.currentStock < requirement.quantity) {
      throw httpError("INSUFFICIENT_STOCK", "Insufficient stock for checkout.", 409, [
        { field: "itemId", message: String(requirement.itemId) }
      ]);
    }
  }
}

function toPersistedLine(line) {
  const amounts = calculateLineAmounts(line);
  return {
    itemId: line.itemId,
    name: line.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    discountAmount: amounts.discountAmount,
    taxAmount: amounts.taxAmount,
    lineTotal: amounts.lineTotal
  };
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

async function getTicketRows({ sqlClient, companyTaxId, saleId }) {
  return sqlClient.query(
    `
SELECT
    s.id AS saleId,
    s.ticket_number AS ticketNumber,
    s.status,
    c.name AS businessName,
    s.paid_at AS paidAt,
    t.name AS terminalName,
    u.display_name AS cashierName,
    oa.name AS accountName,
    s.subtotal_amount AS saleSubtotalAmount,
    s.discount_amount AS saleDiscountAmount,
    s.tax_amount AS saleTaxAmount,
    s.total_amount AS saleTotalAmount,
    sl.id AS lineId,
    sl.item_name_snapshot AS lineName,
    sl.quantity,
    sl.unit_price AS unitPrice,
    sl.discount_amount AS lineDiscountAmount,
    sl.tax_amount AS lineTaxAmount,
    sl.line_total AS lineTotal
FROM dbo.sales s
INNER JOIN dbo.companies c ON c.id = s.company_id
INNER JOIN dbo.terminals t ON t.id = s.terminal_id
INNER JOIN dbo.users u ON u.id = s.sold_by_user_id
LEFT JOIN dbo.open_accounts oa ON oa.id = s.open_account_id
INNER JOIN dbo.sale_lines sl ON sl.sale_id = s.id
WHERE c.tax_id = @companyTaxId
  AND s.id = @saleId
ORDER BY sl.id;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "saleId", value: Number(saleId) }
    ]
  );
}

async function getTicketPayments({ sqlClient, saleId }) {
  return sqlClient.query(
    `
SELECT
    payment_method AS paymentMethod,
    amount,
    reference
FROM dbo.payments
WHERE sale_id = @saleId
ORDER BY id;
    `,
    [{ name: "saleId", value: Number(saleId) }]
  );
}

function toTicket(rows, payments) {
  const sale = rows[0];
  return {
    ticketNumber: sale.ticketNumber,
    status: sale.status,
    businessName: sale.businessName,
    paidAt: sale.paidAt,
    terminalName: sale.terminalName,
    cashierName: sale.cashierName,
    accountName: sale.accountName,
    lines: rows.map((row) => ({
      name: row.lineName,
      quantity: row.quantity,
      unitPrice: roundMoney(row.unitPrice),
      discountAmount: roundMoney(row.lineDiscountAmount),
      taxAmount: roundMoney(row.lineTaxAmount),
      lineTotal: roundMoney(row.lineTotal)
    })),
    subtotalAmount: roundMoney(sale.saleSubtotalAmount),
    discountAmount: roundMoney(sale.saleDiscountAmount),
    taxAmount: roundMoney(sale.saleTaxAmount),
    totalAmount: roundMoney(sale.saleTotalAmount),
    payments: payments.map((payment) => ({
      paymentMethod: payment.paymentMethod,
      amount: roundMoney(payment.amount),
      reference: payment.reference
    })),
    footerNote: "Comprobante interno - no es factura electronica"
  };
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

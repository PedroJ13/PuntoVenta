import { httpError } from "../auth/fakeAuth.js";
import { roundMoney } from "./fakeOpenAccountRepository.js";

export function createSqlReportRepository({ sqlClient, companyTaxId }) {
  return {
    async salesSummary({ from = null, to = null, terminalId = null } = {}) {
      const rows = await querySalesSummary({ sqlClient, companyTaxId, from, to, terminalId });
      const summary = rows[0] || {};
      return {
        from,
        to,
        terminalId,
        salesCount: Number(summary.salesCount || 0),
        subtotalAmount: roundMoney(summary.subtotalAmount || 0),
        discountAmount: roundMoney(summary.discountAmount || 0),
        taxAmount: roundMoney(summary.taxAmount || 0),
        totalAmount: roundMoney(summary.totalAmount || 0)
      };
    },

    async salesByItem({ from = null, to = null, terminalId = null, limit = 50 } = {}) {
      return querySalesByItem({ sqlClient, companyTaxId, from, to, terminalId, limit, topOrder: false });
    },

    async topItems({ from = null, to = null, terminalId = null, limit = 10 } = {}) {
      return querySalesByItem({ sqlClient, companyTaxId, from, to, terminalId, limit, topOrder: true });
    },

    async lowStock({ limit = 50 } = {}) {
      const rows = await sqlClient.query(
        `
SELECT TOP (@limit)
    i.id AS itemId,
    i.sku,
    i.name,
    i.item_type AS itemType,
    i.current_stock AS currentStock,
    i.stock_minimum AS stockMinimum,
    i.base_unit AS baseUnit,
    i.stock_minimum - i.current_stock AS shortage
FROM dbo.items i
INNER JOIN dbo.companies c ON c.id = i.company_id
WHERE c.tax_id = @companyTaxId
  AND i.is_active = 1
  AND i.stock_minimum > 0
  AND i.current_stock < i.stock_minimum
ORDER BY shortage DESC, i.name;
        `,
        [
          { name: "companyTaxId", value: companyTaxId },
          { name: "limit", value: normalizeLimit(limit) }
        ]
      );
      return rows.map((row) => ({
        itemId: Number(row.itemId),
        sku: row.sku,
        name: row.name,
        itemType: row.itemType,
        currentStock: Number(row.currentStock),
        stockMinimum: Number(row.stockMinimum),
        baseUnit: row.baseUnit,
        shortage: Number(row.shortage)
      }));
    },

    async cashShift({ shiftId }) {
      const shiftRows = await sqlClient.query(
        `
SELECT
    cs.id AS cashShiftId,
    cs.company_id AS companyId,
    cs.terminal_id AS terminalId,
    cs.status,
    cs.opening_cash_amount AS openingCashAmount,
    cs.expected_cash_amount AS storedExpectedCashAmount,
    cs.counted_cash_amount AS countedCashAmount,
    cs.difference_amount AS differenceAmount
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

      if (shiftRows.length === 0) throw httpError("NOT_FOUND", "Cash shift not found.", 404);

      const shift = shiftRows[0];
      const [salesSummary] = await querySalesSummary({
        sqlClient,
        companyTaxId,
        cashShiftId: Number(shift.cashShiftId)
      });
      const payments = await queryPaymentsByMethod({ sqlClient, companyTaxId, cashShiftId: Number(shift.cashShiftId) });
      const manualMovements = await queryManualCashMovements({
        sqlClient,
        companyId: Number(shift.companyId),
        shiftId: Number(shift.cashShiftId)
      });

      const cashPayments = payments.find((payment) => payment.paymentMethod === "cash")?.amount || 0;
      const manualCashDelta = manualMovements.reduce((sum, movement) => roundMoney(sum + movement.signedAmount), 0);
      const expectedCashAmount =
        shift.status === "closed" && shift.storedExpectedCashAmount !== null
          ? roundMoney(shift.storedExpectedCashAmount)
          : roundMoney(shift.openingCashAmount + cashPayments + manualCashDelta);

      return {
        cashShiftId: Number(shift.cashShiftId),
        terminalId: Number(shift.terminalId),
        status: shift.status,
        openingCashAmount: roundMoney(shift.openingCashAmount),
        salesCount: Number(salesSummary?.salesCount || 0),
        totalAmount: roundMoney(salesSummary?.totalAmount || 0),
        payments,
        manualMovements,
        expectedCashAmount,
        countedCashAmount: shift.countedCashAmount === null ? null : roundMoney(shift.countedCashAmount),
        differenceAmount: shift.differenceAmount === null ? null : roundMoney(shift.differenceAmount)
      };
    }
  };
}

async function querySalesSummary({ sqlClient, companyTaxId, from = null, to = null, terminalId = null, cashShiftId = null }) {
  return sqlClient.query(
    `
SELECT
    COUNT_BIG(*) AS salesCount,
    COALESCE(SUM(s.subtotal_amount), 0) AS subtotalAmount,
    COALESCE(SUM(s.discount_amount), 0) AS discountAmount,
    COALESCE(SUM(s.tax_amount), 0) AS taxAmount,
    COALESCE(SUM(s.total_amount), 0) AS totalAmount
FROM dbo.sales s
INNER JOIN dbo.companies c ON c.id = s.company_id
WHERE c.tax_id = @companyTaxId
  AND s.status = 'paid'
  AND (@fromDate IS NULL OR s.paid_at >= @fromDate)
  AND (@toDate IS NULL OR s.paid_at < @toDate)
  AND (@terminalId IS NULL OR s.terminal_id = @terminalId)
  AND (@cashShiftId IS NULL OR s.cash_shift_id = @cashShiftId);
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "fromDate", value: from },
      { name: "toDate", value: to },
      { name: "terminalId", value: terminalId === null ? null : Number(terminalId) },
      { name: "cashShiftId", value: cashShiftId === null ? null : Number(cashShiftId) }
    ]
  );
}

async function querySalesByItem({ sqlClient, companyTaxId, from = null, to = null, terminalId = null, limit = 50, topOrder }) {
  const orderBy = topOrder ? "quantity DESC, totalAmount DESC, name" : "name";
  const rows = await sqlClient.query(
    `
SELECT TOP (@limit)
    sl.item_id AS itemId,
    sl.item_name_snapshot AS name,
    COALESCE(SUM(sl.quantity), 0) AS quantity,
    COALESCE(SUM(sl.quantity * sl.unit_price), 0) AS subtotalAmount,
    COALESCE(SUM(sl.discount_amount), 0) AS discountAmount,
    COALESCE(SUM(sl.tax_amount), 0) AS taxAmount,
    COALESCE(SUM(sl.line_total), 0) AS totalAmount
FROM dbo.sales s
INNER JOIN dbo.companies c ON c.id = s.company_id
INNER JOIN dbo.sale_lines sl ON sl.sale_id = s.id
WHERE c.tax_id = @companyTaxId
  AND s.status = 'paid'
  AND (@fromDate IS NULL OR s.paid_at >= @fromDate)
  AND (@toDate IS NULL OR s.paid_at < @toDate)
  AND (@terminalId IS NULL OR s.terminal_id = @terminalId)
GROUP BY sl.item_id, sl.item_name_snapshot
ORDER BY ${orderBy};
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "fromDate", value: from },
      { name: "toDate", value: to },
      { name: "terminalId", value: terminalId === null ? null : Number(terminalId) },
      { name: "limit", value: normalizeLimit(limit) }
    ]
  );

  return rows.map((row) => ({
    itemId: Number(row.itemId),
    name: row.name,
    quantity: Number(row.quantity),
    subtotalAmount: roundMoney(row.subtotalAmount || 0),
    discountAmount: roundMoney(row.discountAmount || 0),
    taxAmount: roundMoney(row.taxAmount || 0),
    totalAmount: roundMoney(row.totalAmount || 0)
  }));
}

async function queryPaymentsByMethod({ sqlClient, companyTaxId, cashShiftId }) {
  const rows = await sqlClient.query(
    `
SELECT
    p.payment_method AS paymentMethod,
    COALESCE(SUM(p.amount), 0) AS amount
FROM dbo.payments p
INNER JOIN dbo.sales s ON s.id = p.sale_id
INNER JOIN dbo.companies c ON c.id = s.company_id
WHERE c.tax_id = @companyTaxId
  AND s.status = 'paid'
  AND s.cash_shift_id = @cashShiftId
GROUP BY p.payment_method
ORDER BY p.payment_method;
    `,
    [
      { name: "companyTaxId", value: companyTaxId },
      { name: "cashShiftId", value: Number(cashShiftId) }
    ]
  );

  return rows.map((row) => ({ paymentMethod: row.paymentMethod, amount: roundMoney(row.amount || 0) }));
}

async function queryManualCashMovements({ sqlClient, companyId, shiftId }) {
  const rows = await sqlClient.query(
    `
SELECT
    id,
    movement_type AS movementType,
    amount,
    signed_amount AS signedAmount,
    reason,
    created_at AS createdAt,
    created_by_user_id AS createdByUserId
FROM dbo.cash_movements
WHERE company_id = @companyId
  AND cash_shift_id = @shiftId
  AND movement_type IN ('cash_in', 'cash_out', 'cash_adjustment')
ORDER BY created_at, id;
    `,
    [
      { name: "companyId", value: Number(companyId) },
      { name: "shiftId", value: Number(shiftId) }
    ]
  );

  return rows.map((row) => ({
    id: Number(row.id),
    movementType: row.movementType,
    amount: roundMoney(row.amount),
    signedAmount: roundMoney(row.signedAmount),
    reason: row.reason,
    createdAt: row.createdAt,
    createdByUserId: Number(row.createdByUserId)
  }));
}

function normalizeLimit(limit) {
  const number = Number(limit);
  if (!Number.isInteger(number) || number <= 0) return 50;
  return Math.min(number, 100);
}

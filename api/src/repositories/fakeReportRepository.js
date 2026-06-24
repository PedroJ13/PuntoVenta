import { httpError } from "../auth/fakeAuth.js";

export function createFakeReportRepository({ store }) {
  return {
    async salesSummary({ companyId, from = null, to = null, terminalId = null } = {}) {
      const sales = filterSales(store.sales, { companyId, from, to, terminalId });
      return sales.reduce(
        (summary, sale) => {
          summary.salesCount += 1;
          summary.subtotalAmount += sale.totals.subtotalAmount;
          summary.discountAmount += sale.totals.discountAmount;
          summary.taxAmount += sale.totals.taxAmount;
          summary.totalAmount += sale.totals.totalAmount;
          return summary;
        },
        {
          from,
          to,
          terminalId,
          salesCount: 0,
          subtotalAmount: 0,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: 0
        }
      );
    },

    async salesByItem({ companyId, from = null, to = null, terminalId = null, limit = 50 } = {}) {
      const rows = aggregateSalesByItem(filterSales(store.sales, { companyId, from, to, terminalId }));
      return rows.slice(0, limit);
    },

    async topItems({ companyId, from = null, to = null, terminalId = null, limit = 10 } = {}) {
      const rows = aggregateSalesByItem(filterSales(store.sales, { companyId, from, to, terminalId }));
      return rows.sort((left, right) => right.quantity - left.quantity || right.totalAmount - left.totalAmount).slice(0, limit);
    },

    async lowStock({ companyId, limit = 50 } = {}) {
      return store.items
        .filter((item) => {
          return (
            item.companyId === companyId &&
            item.isActive &&
            item.stockMinimum > 0 &&
            item.currentStock !== null &&
            item.currentStock < item.stockMinimum
          );
        })
        .map((item) => ({
          itemId: item.id,
          sku: item.sku,
          name: item.name,
          itemType: item.itemType,
          currentStock: item.currentStock,
          stockMinimum: item.stockMinimum,
          baseUnit: item.baseUnit,
          shortage: item.stockMinimum - item.currentStock
        }))
        .slice(0, limit);
    },

    async cashShift({ companyId, shiftId }) {
      const shift = store.cashShifts.find((candidate) => {
        return candidate.companyId === companyId && candidate.id === Number(shiftId);
      });
      if (!shift) throw httpError("NOT_FOUND", "Cash shift not found.", 404);

      const sales = filterSales(store.sales, { companyId, terminalId: shift.terminalId }).filter((sale) => {
        return sale.cashShiftId === shift.id;
      });
      const payments = aggregatePayments(sales);
      const cashPayments = payments.find((payment) => payment.paymentMethod === "cash")?.amount || 0;
      const totalAmount = sales.reduce((sum, sale) => sum + sale.totals.totalAmount, 0);
      const manualMovements = store.cashMovements.filter((movement) => {
        return movement.companyId === companyId && movement.cashShiftId === shift.id;
      });
      const manualCashDelta = manualMovements.reduce((sum, movement) => sum + movement.signedAmount, 0);

      return {
        cashShiftId: shift.id,
        terminalId: shift.terminalId,
        status: shift.status,
        openingCashAmount: shift.openingCashAmount,
        salesCount: sales.length,
        totalAmount,
        payments,
        manualMovements,
        expectedCashAmount: shift.status === "closed" ? shift.expectedCashAmount : shift.openingCashAmount + cashPayments + manualCashDelta,
        countedCashAmount: shift.countedCashAmount,
        differenceAmount: shift.differenceAmount
      };
    }
  };
}

function filterSales(sales, { companyId, from = null, to = null, terminalId = null }) {
  return sales.filter((sale) => {
    const paidAt = Date.parse(sale.paidAt);
    const afterFrom = !from || paidAt >= Date.parse(from);
    const beforeTo = !to || paidAt < Date.parse(to);
    const matchesTerminal = !terminalId || sale.terminalId === Number(terminalId);
    return sale.companyId === companyId && afterFrom && beforeTo && matchesTerminal && sale.status === "paid";
  });
}

function aggregateSalesByItem(sales) {
  const byItem = new Map();
  for (const sale of sales) {
    for (const line of sale.lines) {
      const current = byItem.get(line.itemId) || {
        itemId: line.itemId,
        name: line.name,
        quantity: 0,
        subtotalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0
      };
      current.quantity += line.quantity;
      current.subtotalAmount += line.subtotalAmount;
      current.discountAmount += line.discountAmount;
      current.taxAmount += line.taxAmount;
      current.totalAmount += line.totalAmount;
      byItem.set(line.itemId, current);
    }
  }
  return [...byItem.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function aggregatePayments(sales) {
  const byMethod = new Map();
  for (const sale of sales) {
    for (const payment of sale.payments) {
      byMethod.set(payment.paymentMethod, (byMethod.get(payment.paymentMethod) || 0) + payment.amount);
    }
  }
  return [...byMethod.entries()].map(([paymentMethod, amount]) => ({ paymentMethod, amount }));
}

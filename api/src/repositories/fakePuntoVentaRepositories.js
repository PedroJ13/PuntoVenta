import { createFakeCatalogRepository } from "./fakeCatalogRepository.js";
import { createFakeCashShiftRepository } from "./fakeCashShiftRepository.js";
import { createFakeOpenAccountRepository } from "./fakeOpenAccountRepository.js";
import { createFakeReportRepository } from "./fakeReportRepository.js";
import { createFakeSalesRepository } from "./fakeSalesRepository.js";
import { fakeCategories, fakeItems, fakeRecipes } from "../testDoubles/fakeCatalogData.js";

export function createFakePuntoVentaRepositories({
  categories = fakeCategories,
  items = fakeItems,
  recipes = fakeRecipes,
  cashShifts,
  initialOpenAccounts
} = {}) {
  const store = {
    categories: structuredClone(categories),
    items: structuredClone(items),
    recipes: structuredClone(recipes),
    openAccounts: initialOpenAccounts ?? [
      {
        id: 501,
        companyId: 1,
        terminalId: 1,
        cashShiftId: 5,
        customerId: null,
        name: "Mostrador 1",
        status: "open",
        createdAt: "2026-06-21T14:00:00.000Z",
        createdByUserId: 10,
        cancelledReason: null,
        lines: [
          {
            id: 9001,
            itemId: 10,
            name: "Capuchino",
            quantity: 1,
            unitPrice: 1850,
            discountAmount: 0,
            taxRate: 0.13,
            notes: ""
          }
        ]
      }
    ],
    sales: [],
    nextAccountId: 502,
    nextLineId: 9002,
    nextSaleId: 1001,
    nextCashShiftId: 6,
    nextCashMovementId: 1,
    businessName: "Cafeteria Central",
    terminals: [{ id: 1, companyId: 1, name: "Caja 1", isActive: true }],
    cashShifts: cashShifts ?? [
      {
        id: 5,
        companyId: 1,
        terminalId: 1,
        status: "open",
        openingCashAmount: 25000,
        openedAt: "2026-06-21T13:55:00.000Z",
        openedByUserId: 10,
        openingNote: null,
        closedAt: null,
        closedByUserId: null,
        countedCashAmount: null,
        expectedCashAmount: null,
        differenceAmount: null,
        closingNote: null
      }
    ],
    cashMovements: []
  };

  const catalog = createFakeCatalogRepository({ categories: store.categories, items: store.items });
  const cashShiftsRepository = createFakeCashShiftRepository({ store });
  const openAccounts = createFakeOpenAccountRepository({ store });
  const sales = createFakeSalesRepository({ store, openAccounts, cashShifts: cashShiftsRepository });
  const reports = createFakeReportRepository({ store, cashShifts: cashShiftsRepository });

  return { catalog, cashShifts: cashShiftsRepository, openAccounts, sales, reports };
}

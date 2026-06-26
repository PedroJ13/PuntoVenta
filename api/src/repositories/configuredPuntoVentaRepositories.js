import { getSqlServerConfig } from "../config/sqlServerConfig.js";
import { createSqlServerNodeClient } from "../sql/sqlServerNodeClient.js";
import { createSqlServerPowerShellClient } from "../sql/sqlServerPowerShellClient.js";
import { createFallbackCashShiftRepository } from "./fallbackCashShiftRepository.js";
import { createFallbackCatalogRepository } from "./fallbackCatalogRepository.js";
import { createFallbackOpenAccountRepository } from "./fallbackOpenAccountRepository.js";
import { createFallbackReportRepository } from "./fallbackReportRepository.js";
import { createFallbackSalesRepository } from "./fallbackSalesRepository.js";
import { createFakePuntoVentaRepositories } from "./fakePuntoVentaRepositories.js";
import { createSqlCashShiftRepository } from "./sqlCashShiftRepository.js";
import { createSqlCatalogRepository } from "./sqlCatalogRepository.js";
import { createSqlOpenAccountRepository } from "./sqlOpenAccountRepository.js";
import { createSqlReportRepository } from "./sqlReportRepository.js";
import { createSqlSalesRepository } from "./sqlSalesRepository.js";

export function createConfiguredPuntoVentaRepositories({ env = process.env } = {}) {
  const fakeRepositories = createFakePuntoVentaRepositories();
  const sqlConfig = getSqlServerConfig(env);

  const storageState = {
    mode: "fake",
    catalog: "fake",
    openAccounts: "fake",
    cashShifts: "fake",
    sales: "fake",
    reports: "fake",
    sqlConfigured: sqlConfig.enabled,
    sqlAvailable: false
  };

  if (!sqlConfig.enabled) {
    return {
      repositories: fakeRepositories,
      storageStatus: () => ({ ...storageState })
    };
  }

  const sqlClient = createSqlClient({ config: sqlConfig, env });
  const sqlCatalog = createSqlCatalogRepository({
    sqlClient,
    companyTaxId: sqlConfig.companyTaxId
  });
  const sqlOpenAccounts = createSqlOpenAccountRepository({
    sqlClient,
    companyTaxId: sqlConfig.companyTaxId
  });
  const sqlCashShifts = createSqlCashShiftRepository({
    sqlClient,
    companyTaxId: sqlConfig.companyTaxId
  });
  const sqlSales = createSqlSalesRepository({
    sqlClient,
    companyTaxId: sqlConfig.companyTaxId
  });
  const sqlReports = createSqlReportRepository({
    sqlClient,
    companyTaxId: sqlConfig.companyTaxId
  });

  return {
    repositories: {
      ...fakeRepositories,
      cashShifts: createFallbackCashShiftRepository({
        primary: sqlCashShifts,
        fallback: fakeRepositories.cashShifts,
        storageState
      }),
      catalog: createFallbackCatalogRepository({
        primary: sqlCatalog,
        fallback: fakeRepositories.catalog,
        storageState
      }),
      openAccounts: createFallbackOpenAccountRepository({
        primary: sqlOpenAccounts,
        fallback: fakeRepositories.openAccounts,
        storageState
      }),
      sales: createFallbackSalesRepository({
        primary: sqlSales,
        fallback: fakeRepositories.sales,
        storageState
      }),
      reports: createFallbackReportRepository({
        primary: sqlReports,
        fallback: fakeRepositories.reports,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  };
}

function createSqlClient({ config, env }) {
  if (config.hasConnectionString || config.authMode === "sql") {
    return createSqlServerNodeClient({ config, env });
  }

  return createSqlServerPowerShellClient({ config, env });
}

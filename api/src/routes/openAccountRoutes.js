import { requirePermission } from "../auth/fakeAuth.js";
import { dataResponse, listResponse } from "../http/responses.js";
import { readJsonBody } from "../http/requestBody.js";

export function createOpenAccountRoutes({ openAccountRepository }) {
  return [
    {
      method: "GET",
      path: "/api/open-accounts",
      handler: async ({ auth, url }) => {
        requirePermission(auth, "open_accounts.manage");
        const status = url.searchParams.get("status") || "open";
        const accounts = await openAccountRepository.list({ companyId: auth.companyId, status });
        return listResponse(accounts, { limit: accounts.length, offset: 0, total: accounts.length });
      }
    },
    {
      method: "POST",
      path: "/api/open-accounts",
      handler: async ({ auth, request }) => {
        requirePermission(auth, "open_accounts.manage");
        const account = await openAccountRepository.create({
          auth,
          payload: await readJsonBody(request),
          now: new Date()
        });
        return dataResponse(account, { status: 201 });
      }
    },
    {
      method: "GET",
      path: "/api/open-accounts/{accountId}",
      handler: async ({ auth, params }) => {
        requirePermission(auth, "open_accounts.manage");
        return dataResponse(await openAccountRepository.get({ companyId: auth.companyId, accountId: params.accountId }));
      }
    },
    {
      method: "PATCH",
      path: "/api/open-accounts/{accountId}",
      handler: async ({ auth, params, request }) => {
        requirePermission(auth, "open_accounts.manage");
        const account = await openAccountRepository.update({
          auth,
          companyId: auth.companyId,
          accountId: params.accountId,
          payload: await readJsonBody(request)
        });
        return dataResponse(account);
      }
    },
    {
      method: "POST",
      path: "/api/open-accounts/{accountId}/lines",
      handler: async ({ auth, params, request }) => {
        requirePermission(auth, "open_accounts.manage");
        const account = await openAccountRepository.addLine({
          auth,
          accountId: params.accountId,
          payload: await readJsonBody(request)
        });
        return dataResponse(account, { status: 201 });
      }
    },
    {
      method: "PATCH",
      path: "/api/open-accounts/{accountId}/lines/{lineId}",
      handler: async ({ auth, params, request }) => {
        requirePermission(auth, "open_accounts.manage");
        const account = await openAccountRepository.updateLine({
          auth,
          accountId: params.accountId,
          lineId: params.lineId,
          payload: await readJsonBody(request)
        });
        return dataResponse(account);
      }
    },
    {
      method: "DELETE",
      path: "/api/open-accounts/{accountId}/lines/{lineId}",
      handler: async ({ auth, params }) => {
        requirePermission(auth, "open_accounts.manage");
        const account = await openAccountRepository.removeLine({
          companyId: auth.companyId,
          accountId: params.accountId,
          lineId: params.lineId
        });
        return dataResponse(account);
      }
    }
  ];
}

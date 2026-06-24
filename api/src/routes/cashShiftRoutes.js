import { requirePermission } from "../auth/fakeAuth.js";
import { dataResponse } from "../http/responses.js";
import { readJsonBody } from "../http/requestBody.js";

export function createCashShiftRoutes({ cashShiftRepository }) {
  return [
    {
      method: "GET",
      path: "/api/cash-shifts/current",
      handler: async ({ auth, url }) => {
        requirePermission(auth, "cash.read");
        const terminalId = Number(url.searchParams.get("terminalId") || 1);
        return dataResponse(await cashShiftRepository.current({ companyId: auth.companyId, terminalId }));
      }
    },
    {
      method: "GET",
      path: "/api/cash-shifts/{shiftId}",
      handler: async ({ auth, params }) => {
        requirePermission(auth, "cash.read");
        return dataResponse(await cashShiftRepository.get({ companyId: auth.companyId, shiftId: params.shiftId }));
      }
    },
    {
      method: "POST",
      path: "/api/cash-shifts/open",
      handler: async ({ auth, request }) => {
        requirePermission(auth, "cash.open");
        return dataResponse(
          await cashShiftRepository.open({
            auth,
            payload: await readJsonBody(request),
            now: new Date()
          }),
          { status: 201 }
        );
      }
    },
    {
      method: "POST",
      path: "/api/cash-shifts/{shiftId}/movements",
      handler: async ({ auth, request, params }) => {
        requirePermission(auth, "cash.move");
        return dataResponse(
          await cashShiftRepository.addMovement({
            auth,
            shiftId: params.shiftId,
            payload: await readJsonBody(request),
            now: new Date()
          }),
          { status: 201 }
        );
      }
    },
    {
      method: "POST",
      path: "/api/cash-shifts/{shiftId}/close",
      handler: async ({ auth, request, params }) => {
        requirePermission(auth, "cash.close_own");
        return dataResponse(
          await cashShiftRepository.close({
            auth,
            shiftId: params.shiftId,
            payload: await readJsonBody(request),
            now: new Date()
          })
        );
      }
    }
  ];
}

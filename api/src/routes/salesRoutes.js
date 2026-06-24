import { requirePermission } from "../auth/fakeAuth.js";
import { dataResponse } from "../http/responses.js";
import { readJsonBody } from "../http/requestBody.js";

export function createSalesRoutes({ salesRepository }) {
  return [
    {
      method: "POST",
      path: "/api/sales/checkout",
      handler: async ({ auth, request }) => {
        requirePermission(auth, "sales.checkout");
        return dataResponse(
          await salesRepository.checkout({
            auth,
            payload: await readJsonBody(request),
            now: new Date()
          }),
          { status: 201 }
        );
      }
    },
    {
      method: "GET",
      path: "/api/sales/{saleId}/ticket",
      handler: async ({ auth, params }) => {
        requirePermission(auth, "tickets.read");
        return dataResponse(await salesRepository.getTicket({ companyId: auth.companyId, saleId: params.saleId }));
      }
    }
  ];
}

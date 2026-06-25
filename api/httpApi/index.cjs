let configuredAppPromise;

async function getConfiguredApp() {
  configuredAppPromise ??= Promise.all([
    import("../src/app.js"),
    import("../src/repositories/configuredPuntoVentaRepositories.js"),
    import("../src/http/azureFunctionsAdapter.js"),
  ]).then(([appModule, repositoriesModule, adapterModule]) => ({
    app: appModule.createApp({
      ...repositoriesModule.createConfiguredPuntoVentaRepositories(),
    }),
    adapter: adapterModule,
  }));

  return configuredAppPromise;
}

module.exports = async function api(context, req) {
  const { app, adapter } = await getConfiguredApp();

  if (req.method === "OPTIONS") {
    context.res = adapter.corsPreflightAzureResponse();
    return;
  }

  const response = await app.handle(adapter.toWebRequestFromAzureFunction(req));
  context.res = await adapter.toAzureFunctionResponse(response);
};

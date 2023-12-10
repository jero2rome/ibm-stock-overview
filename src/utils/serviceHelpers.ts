export const buildQueryParams = (functionName:string, symbol: string, apiKey: string) => ({
  function: functionName,
  symbol,
  apikey: apiKey,
});

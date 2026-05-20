export async function sendSMS({ to, message }) {
  if (!process.env.SSLWIRELESS_API_TOKEN) {
    console.log("[SMS MOCK]", to, message);
    return { ok: false, provider: "mock" };
  }
  // TODO: Add SSL Wireless API call with merchant credentials.
  return { ok: true, provider: "sslwireless" };
}
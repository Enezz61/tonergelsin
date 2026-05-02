export function isAdminAuthorized(req: Request) {
  const expectedToken = process.env.ADMIN_TOKEN ?? "admin-token-123";
  return req.headers.get("authorization") === `Bearer ${expectedToken}`;
}

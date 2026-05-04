import jwt from "jsonwebtoken";

export function isAdminAuthorized(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/admin_token=([^;]+)/)?.[1];
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return false;
  }

  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

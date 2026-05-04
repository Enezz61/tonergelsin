// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_BASE_PATH = "/admin";

const redirectToLogin = (req: NextRequest) =>
  NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, req.url));

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (value.length % 4)) % 4);
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function verifyJwt(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const validSignature = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signature),
    new TextEncoder().encode(data)
  );

  if (!validSignature) return false;

  try {
    const payloadJson = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload))
    );

    if (typeof payloadJson === "object" && payloadJson !== null) {
      if (typeof payloadJson.exp === "number") {
        const now = Math.floor(Date.now() / 1000);
        if (payloadJson.exp < now) return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const url = req.nextUrl;

  if (url.pathname.startsWith(ADMIN_LOGIN_PATH)) {
    return NextResponse.next();
  }

  if (url.pathname.startsWith(ADMIN_BASE_PATH)) {
    if (!token) {
      return redirectToLogin(req);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return redirectToLogin(req);
    }

    const valid = await verifyJwt(token, secret);
    if (!valid) {
      return redirectToLogin(req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
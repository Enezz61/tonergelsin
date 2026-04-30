import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS ?? "1234";
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "admin-token-123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({
        token: ADMIN_TOKEN,
      });
    }

    return NextResponse.json({ message: "Hatalı giriş" }, { status: 401 });
  } catch {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

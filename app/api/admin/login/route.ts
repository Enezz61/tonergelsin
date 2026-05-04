import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_USER || !ADMIN_PASSWORD || !JWT_SECRET) {
      return NextResponse.json(
        { message: "ENV eksik" },
        { status: 500 }
      );
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Hatalı giriş" },
        { status: 401 }
      );
    }

    // 🔐 JWT oluştur
    const token = jwt.sign(
      { role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ success: true });

    // 🍪 COOKIE set
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60, // 1 saat
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
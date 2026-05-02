import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();


    // ENV değerleri
    const ADMIN_USER = process.env.ADMIN_USER!;
    const ADMIN_HASH = process.env.ADMIN_HASH!;
    const JWT_SECRET = process.env.JWT_SECRET!;

    // Kullanıcı kontrolü
    if (username !== ADMIN_USER) {
      return NextResponse.json({ message: "Hatalı giriş" }, { status: 401 });

 
    }

    // Şifre hash karşılaştırma
    const isValid = await bcrypt.compare(password, ADMIN_HASH);

    if (!isValid) {
      return NextResponse.json({ message: "Hatalı giriş" }, { status: 401 });
    }

    // JWT üret
    const token = jwt.sign(
      { role: "admin", username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Cookie set (EN ÖNEMLİ)
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: true, // productionda true olmalı
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 saat
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

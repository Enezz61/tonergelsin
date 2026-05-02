import { connectDB } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { createProduct } from "@/lib/productMutations";
import { parseProductImportFile, productImportColumns } from "@/lib/productImport";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const csv = [
    productImportColumns.join(","),
    [
      "HP 305A Siyah Toner",
      "1250",
      "/images/yazıcıhp.png",
      "Uyumlu muadil toner",
      "Toner",
      "HP",
      "LaserJet Pro M351, M451",
      "10",
    ]
      .map((value) => `"${value.replaceAll('"', '""')}"`)
      .join(","),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="urun-import-sablonu.csv"',
    },
  });
}

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Excel veya CSV dosyası bulunamadı" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Dosya 2 MB'den küçük olmalıdır" },
        { status: 400 }
      );
    }

    const rows = await parseProductImportFile(file);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Dosyada içe aktarılacak ürün bulunamadı" },
        { status: 400 }
      );
    }

    await connectDB();

    const createdProducts = [];
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const product = await createProduct(row);
        createdProducts.push(product);
      } catch (error) {
        errors.push(
          `${row.rowNumber}. satır: ${
            error instanceof Error ? error.message : "Ürün eklenemedi"
          }`
        );
      }
    }

    const status = createdProducts.length > 0 ? 201 : 400;

    return NextResponse.json(
      {
        message:
          errors.length > 0
            ? `${createdProducts.length} ürün eklendi, ${errors.length} satır atlandı.`
            : `${createdProducts.length} ürün başarıyla eklendi.`,
        createdCount: createdProducts.length,
        errorCount: errors.length,
        errors,
      },
      { status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Toplu ürün ekleme başarısız",
      },
      { status: 500 }
    );
  }
}

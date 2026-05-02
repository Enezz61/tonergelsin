import ExcelJS from "exceljs";
import { Readable } from "stream";
import type { ProductInput } from "@/lib/productMutations";

export type ProductImportRow = ProductInput & {
  rowNumber: number;
};

const columnAliases: Record<keyof ProductInput, string[]> = {
  name: ["name", "ürün adı", "urun adi", "ürün", "urun", "product name"],
  price: ["price", "fiyat", "tl", "price tl"],
  image: ["image", "görsel", "gorsel", "resim", "image url"],
  description: ["description", "açıklama", "aciklama", "detay"],
  category: ["category", "kategori"],
  brand: ["brand", "marka"],
  printerModels: [
    "printermodels",
    "printer models",
    "uyumlu modeller",
    "yazıcı modelleri",
    "yazici modelleri",
  ],
  stock: ["stock", "stok"],
};

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && quoted && nextChar === '"') {
      cell += '"';
      index++;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell.trim());
  return cells;
}

function mapRows(rawRows: Record<string, unknown>[]) {
  return rawRows
    .map((row, index) => {
      const normalizedRow = new Map<string, unknown>();

      Object.entries(row).forEach(([key, value]) => {
        normalizedRow.set(normalizeHeader(key), value);
      });

      const product: ProductImportRow = { rowNumber: index + 2 };

      Object.entries(columnAliases).forEach(([field, aliases]) => {
        const value = aliases
          .map((alias) => normalizedRow.get(normalizeHeader(alias)))
          .find((entry) => entry !== undefined && entry !== null && String(entry).trim());

        if (value !== undefined) {
          product[field as keyof ProductInput] = value;
        }
      });

      return product;
    })
    .filter((row) =>
      Object.keys(columnAliases).some((field) => {
        const value = row[field as keyof ProductInput];
        return value !== undefined && value !== null && String(value).trim();
      })
    );
}

function parseCsv(text: string) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  const [headerLine, ...bodyLines] = lines;

  if (!headerLine) return [];

  const headers = parseCsvLine(headerLine);

  return bodyLines.map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

export async function parseProductImportFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return mapRows(parseCsv(await file.text()));
  }

  if (extension === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const buffer = Buffer.from(await file.arrayBuffer());
    await workbook.xlsx.read(Readable.from([buffer]));
    const worksheet = workbook.worksheets[0];

    if (!worksheet) return [];

    const headerRow = worksheet.getRow(1);
    const headers = Array.isArray(headerRow.values)
      ? headerRow.values.slice(1).map((value) => String(value ?? ""))
      : [];
    const rows: Record<string, unknown>[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const values = Array.isArray(row.values) ? row.values.slice(1) : [];
      rows.push(
        Object.fromEntries(
          headers.map((header, index) => [header, values[index] ?? ""])
        )
      );
    });

    return mapRows(rows);
  }

  throw new Error("Sadece .xlsx veya .csv dosyası yükleyebilirsiniz.");
}

export const productImportColumns = [
  "name",
  "price",
  "image",
  "description",
  "category",
  "brand",
  "printerModels",
  "stock",
];

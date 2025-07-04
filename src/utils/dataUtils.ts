// src/utils/dataUtils.ts
import fs from "fs";
import path from "path";

export function readJsonData<T = any>(relativePath: string): T {
  const filePath = path.resolve(__dirname, relativePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

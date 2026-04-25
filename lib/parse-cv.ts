import { createRequire } from "module"
import mammoth from "mammoth"

const require = createRequire(import.meta.url)
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>

export async function parseCv(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === "application/pdf") {
    const result = await pdfParse(buffer)
    return result.text.trim()
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
  }

  throw new Error("Formato no soportado. Sube un PDF o archivo Word (.docx)")
}

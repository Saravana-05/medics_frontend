import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "G:/medics_project_files/OP Appointments Screen.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
const overview = await workbook.inspect({
  kind: "workbook,sheet,table,region,drawing",
  maxChars: 12000,
  tableMaxRows: 40,
  tableMaxCols: 20,
  tableMaxCellChars: 120,
});
console.log(overview.ndjson);
await fs.mkdir(".codex-tmp/workbook-renders", { recursive: true });
const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 4000 });
console.log("SHEETS\n" + sheets.ndjson);
for (const line of sheets.ndjson.split("\n")) {
  if (!line.trim()) continue;
  const item = JSON.parse(line);
  const name = item.name;
  if (!name) continue;
  const rendered = await workbook.render({ sheetName: name, autoCrop: "all", scale: 1.5, format: "png" });
  const safe = name.replace(/[^a-z0-9_-]+/gi, "_");
  await fs.writeFile(`.codex-tmp/workbook-renders/${safe}.png`, new Uint8Array(await rendered.arrayBuffer()));
}

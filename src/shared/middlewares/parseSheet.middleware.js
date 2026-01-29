import XLSX from "xlsx";
import csv from "csv-parser";
import { Readable } from "stream";

export const parseSheet = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { originalname, buffer } = req.file;
  const ext = originalname.split(".").pop().toLowerCase();

  try {
    if (ext === "xlsx") {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(sheet);
      req.parsedRows = data;
      return next();
    }

    if (ext === "csv") {
      const results = [];

      const stream = Readable.from(buffer.toString());

      stream
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => {
          req.parsedRows = results;
          next();
        });

      return;
    }

    return res.status(400).json({ message: "Unsupported file type" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "File parsing failed" });
  }
};

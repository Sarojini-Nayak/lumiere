// One-time script to shrink product images in place.
// Run from the server/ folder: node optimizeImages.js
//
// Safe to run: it backs up originals to uploads_backup/ first,
// then overwrites uploads/*.png with recompressed versions
// using the SAME filenames — no DB or code changes needed.

import sharp from "sharp";
import fs from "fs";
import path from "path";

const srcDir = "./uploads";
const backupDir = "./uploads_backup";

if (!fs.existsSync(srcDir)) {
  console.error("Run this from the server/ folder (uploads/ not found here).");
  process.exit(1);
}

fs.mkdirSync(backupDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => /\.png$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = path.join(srcDir, file);
  const backupPath = path.join(backupDir, file);

  // Back up the original the first time this runs
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  const before = fs.statSync(backupPath).size;

  // Lossless: re-encodes more efficiently without touching a single pixel.
  await sharp(backupPath)
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(filePath);

  const after = fs.statSync(filePath).size;
  totalBefore += before;
  totalAfter += after;

  console.log(
    `${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
  );
}

console.log(
  `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(
    1
  )}MB (${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}% smaller)`
);
console.log(`Originals backed up in ${backupDir}/ — delete that folder once you're happy with the result.`);

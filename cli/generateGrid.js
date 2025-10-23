import fs from "fs"

function generateGrid(rows, cols) {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0))
  )

  const data = {
    rows,
    cols,
    grid
  }

  fs.writeFileSync("grid.json", JSON.stringify(data, null, 2))
  console.log(`✅ Fichier grid.json généré (${rows}x${cols})`)
}

// Exemple : node generateGrid.js 20 20
const [rows, cols] = process.argv.slice(2).map(Number)
if (!rows || !cols) {
  console.log("Usage : node generateGrid.js <rows> <cols>")
  process.exit(1)
}
generateGrid(rows, cols)

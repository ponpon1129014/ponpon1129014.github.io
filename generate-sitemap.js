const fs = require("fs");

const mealsText = fs.readFileSync("meals.js", "utf8");
const ids = [...mealsText.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);

const base = "https://ponpon1129014.github.io";

const urls = [
  `${base}/`,
  `${base}/privacy.html`,
  `${base}/tag.html`,
  `${base}/category.html`,
  ...ids.map(id => `${base}/menu/${id}.html`)
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync("sitemap.xml", xml, "utf8");
console.log(`完了！${urls.length}件のURLを出力しました`);
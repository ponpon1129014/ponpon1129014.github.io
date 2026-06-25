const fs = require("fs");
const path = require("path");

// meals.jsからIDを抽出（簡易パース）
const mealsText = fs.readFileSync("meals.js", "utf8");
const ids = [...mealsText.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);

const template = (id, name, emoji, description) => `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emoji} ${name} | 今日なに食べよーかな</title>
  <meta name="description" content="${name}の特徴やおすすめポイントを紹介します。${description}">

  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../menu.css">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1200404237991317" crossorigin="anonymous"></script>
</head>
<body>
  <div class="container"></div>
  <script>const currentId = "${id}";</script>
  <script src="../meals.js"></script>
  <script src="../menu-detail.js"></script>
</body>
</html>`;

const mealMap = {};
eval(mealsText.replace("const meals =", "mealMap.meals ="));

ids.forEach(id => {
  const meal = mealMap.meals.find(m => m.id === id);
  const name = meal ? meal.name : id;
  const emoji = meal ? meal.emoji : "";
  const description = meal ? meal.description.slice(0, 60) : "";
  const filePath = path.join("menu", `${id}.html`);
  fs.writeFileSync(filePath, template(id, name, emoji, description), "utf8");
  console.log(`生成: ${filePath}`);
});

console.log(`\n完了！合計${ids.length}ファイル`);
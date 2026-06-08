document.addEventListener("DOMContentLoaded", () => {

  const meal = meals.find(m => m.id === currentId);
  if (!meal) return;

  // タイトル・メタ
  document.title = meal.name + " | 今日なに食べよーかな";
document.querySelector('meta[name="description"]')
  .setAttribute("content", meal.name + "の特徴やおすすめポイントを紹介します。" + meal.description);

// OGP
const pageUrl = "https://ponpon1129014.github.io/meal-app/menu/" + meal.id + ".html";
const ogImage = "https://ponpon1129014.github.io/meal-app/" + meal.image;

// og:titleがなければ作る
let ogTitle = document.querySelector('meta[property="og:title"]');
if (!ogTitle) {
  ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property", "og:title");
  document.head.appendChild(ogTitle);
}
ogTitle.setAttribute("content", meal.name + " | 今日なに食べよーかな");

let ogDesc = document.querySelector('meta[property="og:description"]');
if (!ogDesc) {
  ogDesc = document.createElement("meta");
  ogDesc.setAttribute("property", "og:description");
  document.head.appendChild(ogDesc);
}
ogDesc.setAttribute("content", meal.description);

let ogImg = document.querySelector('meta[property="og:image"]');
if (!ogImg) {
  ogImg = document.createElement("meta");
  ogImg.setAttribute("property", "og:image");
  document.head.appendChild(ogImg);
}
ogImg.setAttribute("content", ogImage);

let ogUrl = document.querySelector('meta[property="og:url"]');
if (!ogUrl) {
  ogUrl = document.createElement("meta");
  ogUrl.setAttribute("property", "og:url");
  document.head.appendChild(ogUrl);
}
ogUrl.setAttribute("content", pageUrl);

  // 星表示
  function renderStars(value) {
    return "★".repeat(value) + "☆".repeat(5 - value);
  }

  // HTML生成
  document.querySelector(".container").innerHTML = `
    <div class="menu-detail">
      <h1>${meal.emoji} ${meal.name}</h1>
      <div class="menu-columns">
        <div class="menu-left">
          <img id="mealImage" src="../${meal.image}" alt="${meal.name}" onerror="this.src='../images/default.png'">
           </div>
        <div class="menu-right">
          <p id="description">${meal.description}</p>
          <div id="tags"></div>
          <div class="info-cards">
            <div class="info-card">
              <span class="info-label">自炊難易度</span>
              <span class="info-value">${renderStars(meal.difficulty)}</span>
            </div>
            <div class="info-card">
              <span class="info-label">手に入りやすさ</span>
              <span class="info-value">${renderStars(meal.availability)}</span>
            </div>
          </div>
          <div class="recipe-links">
            <h2>レシピを探す</h2>
            <a id="cookpadLink" href="" target="_blank">🍳 クックパッドで見る</a>
            <a id="delishLink" href="" target="_blank">🎥 デリッシュキッチンで見る</a>
          </div>
        </div>
      </div>
      <div class="menu-bottom">
        <div class="same-type-list">
          <h2>同じジャンルのメニュー</h2>
          <ul id="sameTypeList"></ul>
        </div>
        <div class="redraw-buttons">
          <button id="sameTypeBtn">同じジャンルで引き直す</button>
          <button id="changeTypeBtn">ジャンルを変えて引き直す</button>
        </div>

<div class="share-row">
            <div class="share-buttons">
              <a id="shareX" href="" target="_blank">𝕏</a>
              <a id="shareLine" href="" target="_blank">🟢 LINE</a>
              <a id="shareFacebook" href="" target="_blank">📘 Facebook</a>
            </div>
            <span class="share-label">← シェア</span>
          </div>
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-1200404237991317"
               data-ad-slot="8160901516"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
      </div>
    </div>
  `;

  (adsbygoogle = window.adsbygoogle || []).push({});

  // タグ
  const tagContainer = document.getElementById("tags");
   const catLabels = {
  rice:   "ご飯もの",
  noodle: "麺類",
  meat:   "肉料理",
  fish:   "魚料理",
  flour:  "粉もの・チーズ系",
  nabe:   "鍋・汁物",
  side:   "軽食・サイド"
};

meal.category.forEach(cat => {
  const a = document.createElement("a");
  a.textContent = catLabels[cat] || cat;
  a.className = "tag";
  a.href = "../category.html?name=" + cat;
  tagContainer.appendChild(a);
});
 
  meal.tags.forEach(tag => {
    const a = document.createElement("a");
    a.textContent = tag;
    a.className = "tag";
    a.href = "../tag.html?name=" + encodeURIComponent(tag);
    tagContainer.appendChild(a);
  });

  // 同じジャンルのメニュー
  const sameType = meals.filter(m => m.type === meal.type && m.id !== currentId);
  const count = 5;
  const shuffled = sameType.sort(() => Math.random() - 0.5).slice(0, count);
  const list = document.getElementById("sameTypeList");
  shuffled.forEach(m => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = m.id + ".html";
    a.textContent = m.emoji + " " + m.name;
    li.appendChild(a);
    list.appendChild(li);
  });

  // レシピリンク
  const encoded = encodeURIComponent(meal.name);
  document.getElementById("cookpadLink").href =
    "https://cookpad.com/search/" + encoded;
  document.getElementById("delishLink").href =
    "https://delishkitchen.tv/search?q=" + encoded;

  // シェアリンク
  const shareUrl = encodeURIComponent("https://ponpon1129014.github.io/meal-app/menu/" + meal.id + ".html");
  const shareText = encodeURIComponent(meal.emoji + " 今日は「" + meal.name + "」にしました！ #ごはんガチャ");
  document.getElementById("shareX").href =
    "https://twitter.com/intent/tweet?text=" + shareText + "&url=" + shareUrl;
  document.getElementById("shareLine").href =
    "https://social-plugins.line.me/lineit/share?url=" + shareUrl;
  document.getElementById("shareFacebook").href =
    "https://www.facebook.com/sharer/sharer.php?u=" + shareUrl;

  // 引き直しボタン
  const lastTypes = localStorage.getItem("selectedTypes");
  document.getElementById("sameTypeBtn").addEventListener("click", () => {
    window.location.href = "../index.html?types=" +
      (lastTypes || JSON.stringify([meal.type]));
  });
  document.getElementById("changeTypeBtn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });

});
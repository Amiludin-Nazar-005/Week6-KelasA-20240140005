const API_URL = "https://dummyjson.com/products?limit=30";

const listEl = document.getElementById("product-list");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category");
const countEl = document.getElementById("count");

let products = [];

const priceFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// ---------- Tampilan status ----------
function showLoading() {
  listEl.replaceChildren();
  countEl.textContent = "Memuat produk…";
  for (let i = 0; i < 8; i++) {
    const li = document.createElement("li");
    li.className = "skeleton";
    listEl.appendChild(li);
  }
}

function showState(type, title, message, withRetry) {
  listEl.replaceChildren();
  const li = document.createElement("li");
  li.className = `state ${type}`;
  const h = document.createElement("h2");
  h.textContent = title;
  const p = document.createElement("p");
  p.textContent = message;
  li.append(h, p);
  if (withRetry) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "Coba lagi";
    btn.addEventListener("click", loadProducts);
    li.appendChild(btn);
  }
  listEl.appendChild(li);
}

// ---------- Render produk ----------
function createCard(product) {
  const li = document.createElement("li");
  li.className = "card";

  const img = document.createElement("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card-body";

  const cat = document.createElement("span");
  cat.className = "card-cat";
  cat.textContent = product.category;

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = product.title;

  const price = document.createElement("span");
  price.className = "card-price";
  price.textContent = priceFormat.format(product.price);

  body.append(cat, title, price);
  li.append(img, body);
  return li;
}

function render() {
  const keyword = searchEl.value.trim().toLowerCase();
  const category = categoryEl.value;

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(keyword) && (!category || p.category === category)
  );

  countEl.textContent = `${filtered.length} produk`;
  if (filtered.length === 0) {
    showState("empty", "Produk tidak ditemukan", "Ubah kata kunci atau pilih kategori lain.", false);
    return;
  }
  listEl.replaceChildren(...filtered.map(createCard));
}

function fillCategories() {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  categoryEl.replaceChildren(new Option("Semua kategori", ""));
  categories.forEach((c) => categoryEl.appendChild(new Option(c, c)));
}

// ---------- Fetch API ----------
async function loadProducts() {
  showLoading();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Server menjawab ${response.status}`);
    const data = await response.json();
    products = data.products;
    fillCategories();
    render();
  } catch (error) {
    countEl.textContent = "";
    showState("error", "Data gagal dimuat", `${error.message}. Periksa koneksi internet lalu coba lagi.`, true);
  }
}

// ---------- Event handling ----------
searchEl.addEventListener("input", render);
categoryEl.addEventListener("change", render);

loadProducts();

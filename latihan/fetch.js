// Uji coba Fetch API di terminal: node latihan/fetch.js
fetch("https://dummyjson.com/products?limit=3")
  .then((res) => res.json())
  .then((data) => data.products.forEach((p) => console.log(p.title, "-", p.price)))
  .catch((err) => console.error("Gagal:", err.message));

const form = document.getElementById("caption-form");
const outputEl = document.getElementById("output");
const feedbackEl = document.getElementById("feedback");
const copyBtn = document.getElementById("copy-btn");
const descCount = document.getElementById("desc-count");
const MAX_DESC = 120;
const FIELDS = ["name", "price", "style", "desc"];

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

// ---------- Template caption ----------
const templates = {
  santai: (d) => `Lagi cari ${d.name}? Yang ini cocok banget! ${d.desc}\n\nCuma ${d.price}. Yuk, langsung cek sebelum kehabisan.`,
  profesional: (d) => `${d.name}\n${d.desc}\n\nHarga ${d.price}. Kualitas terjamin untuk kebutuhan Anda.`,
  promo: (d) => `PROMO! ${d.name} hanya ${d.price}!\n${d.desc}\n\nStok terbatas, pesan sekarang.`,
};

function makeHashtags(name) {
  return name
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .map((w) => `#${w}`)
    .join(" ");
}

// ---------- Validasi ----------
function validate(values) {
  const errors = {};
  if (values.name.length < 3) errors.name = "Nama produk minimal 3 karakter.";
  if (!values.price || Number(values.price) <= 0) errors.price = "Masukkan harga lebih dari 0.";
  if (!values.style) errors.style = "Pilih salah satu gaya bahasa.";
  if (values.desc.length < 10) errors.desc = "Keunggulan minimal 10 karakter.";
  return errors;
}

function getValues() {
  const data = new FormData(form);
  return {
    name: data.get("name").trim(),
    price: data.get("price"),
    style: data.get("style"),
    desc: data.get("desc").trim(),
  };
}

function setError(fieldName, message) {
  const field = form.querySelector(`[data-field="${fieldName}"]`);
  field.classList.toggle("invalid", Boolean(message));
  field.querySelector(".error-msg").textContent = message || "";
}

function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type || ""}`;
}

// ---------- Event handling ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = getValues();
  const errors = validate(values);

  FIELDS.forEach((key) => setError(key, errors[key]));

  if (Object.keys(errors).length > 0) {
    showFeedback("Periksa kembali isian yang bertanda merah.", "fail");
    form.querySelector(".invalid input, .invalid select, .invalid textarea")?.focus();
    return;
  }

  const caption = templates[values.style]({
    name: values.name,
    price: rupiah.format(values.price),
    desc: values.desc,
  }) + `\n\n${makeHashtags(values.name)}`;

  outputEl.textContent = caption;
  outputEl.classList.remove("empty");
  copyBtn.hidden = false;
  showFeedback("Caption berhasil dibuat.", "ok");
});

// Hapus pesan error saat pengguna mengetik ulang
form.addEventListener("input", (event) => {
  const field = event.target.closest("[data-field]");
  if (field) setError(field.dataset.field, "");
});

document.getElementById("desc").addEventListener("input", (event) => {
  if (event.target.value.length > MAX_DESC) {
    event.target.value = event.target.value.slice(0, MAX_DESC);
  }
  descCount.textContent = `${event.target.value.length}/${MAX_DESC}`;
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outputEl.textContent);
    showFeedback("Caption disalin ke clipboard.", "ok");
  } catch {
    showFeedback("Gagal menyalin. Salin manual dari kotak hasil.", "fail");
  }
});

form.addEventListener("reset", () => {
  FIELDS.forEach((key) => setError(key, ""));
  descCount.textContent = `0/${MAX_DESC}`;
  outputEl.textContent = "Caption akan muncul di sini.";
  outputEl.classList.add("empty");
  copyBtn.hidden = true;
  showFeedback("");
});

/* ================= INIT GOOGLE ================= */

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'id,zh-CN',
        autoDisplay: false
    }, 'google_translate_element');
}

/* ================= TOGGLE ================= */

let currentLang = localStorage.getItem("lang") || "id";

function setLanguage(lang) {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));

    localStorage.setItem("lang", lang);
}

/* ================= BUTTON ================= */

document.addEventListener("click", function(e) {

    const btn = e.target.closest("#btnLang");
    if (!btn) return;

    currentLang = currentLang === "id" ? "zh-CN" : "id";

    setLanguage(currentLang);
    updateButton();
});

/* ================= BUTTON TEXT ================= */

function updateButton() {
    const btn = document.getElementById("btnLang");
    if (!btn) return;

    btn.innerText = currentLang === "id"
        ? "🇮🇩 Indonesia"
        : "🇨🇳 中文";
}

/* ================= AUTO LOAD ================= */

window.addEventListener("load", () => {

    updateButton();

    setTimeout(() => {
        setLanguage(currentLang);
    }, 1000);
});

/* ================= FORCE HIDE GOOGLE BAR ================= */

setInterval(() => {
    const frame = document.querySelector('.goog-te-banner-frame');
    if (frame) {
        frame.style.display = 'none';
    }

    document.body.style.top = '0px';
}, 500);
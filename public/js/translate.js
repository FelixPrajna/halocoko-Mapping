/* ================= CONFIG ================= */

const PAGE_LANG = "id";
const TARGET_LANG = "zh-CN";

let currentLang = localStorage.getItem("lang") || PAGE_LANG;

/* ================= COOKIE ================= */

function setGoogTransCookie(lang) {
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";

    document.cookie = `googtrans=; ${expire}; path=/;`;
    document.cookie = `googtrans=; ${expire}; path=/; domain=${location.hostname};`;

    if (lang && lang !== PAGE_LANG) {
        document.cookie = `googtrans=/${PAGE_LANG}/${lang}; path=/;`;
    }
}

/* Set cookie sebelum widget Google load (supaya auto-translate saat reload) */
setGoogTransCookie(currentLang);

/* ================= INIT GOOGLE ================= */

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: PAGE_LANG,
        includedLanguages: `${PAGE_LANG},${TARGET_LANG}`,
        autoDisplay: false
    }, "google_translate_element");
}

/* ================= SELECT (fallback tanpa reload) ================= */

function getTranslateSelect() {
    return document.querySelector("#google_translate_element select.goog-te-combo")
        || document.querySelector("select.goog-te-combo");
}

function triggerTranslateSelect(lang) {
    const select = getTranslateSelect();
    if (!select) return false;

    const value = lang === PAGE_LANG ? "" : lang;
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));

    if (lang === PAGE_LANG) {
        select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    return true;
}

function waitForTranslateSelect(callback, attempts = 40) {
    const select = getTranslateSelect();
    if (select) {
        callback(select);
        return;
    }

    if (attempts <= 0) {
        callback(null);
        return;
    }

    setTimeout(() => waitForTranslateSelect(callback, attempts - 1), 250);
}

/* ================= BUTTON ================= */

document.addEventListener("click", function (e) {
    const btn = e.target.closest("#btnLang");
    if (!btn) return;

    e.preventDefault();

    const nextLang = currentLang === PAGE_LANG ? TARGET_LANG : PAGE_LANG;

    localStorage.setItem("lang", nextLang);
    setGoogTransCookie(nextLang);
    window.location.reload();
});

/* ================= BUTTON TEXT ================= */

function updateButton() {
    const btn = document.getElementById("btnLang");
    if (!btn) return;

    btn.textContent = currentLang === PAGE_LANG
        ? "🇮🇩 Indonesia"
        : "🇨🇳 中文";
}

/* ================= AUTO LOAD ================= */

window.addEventListener("load", () => {
    currentLang = localStorage.getItem("lang") || PAGE_LANG;
    updateButton();

    if (currentLang !== PAGE_LANG) {
        waitForTranslateSelect((select) => {
            if (select) triggerTranslateSelect(currentLang);
        });
    }
});

/* ================= FORCE HIDE GOOGLE BAR ================= */

setInterval(() => {
    const frame = document.querySelector(".goog-te-banner-frame");
    if (frame) frame.style.display = "none";
    document.body.style.top = "0px";
}, 500);

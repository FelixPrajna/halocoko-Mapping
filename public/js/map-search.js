// =====================================================
// SEARCH ENGINE (MAP + TABLE) - COMPLETE & STABLE
// =====================================================
(function () {

    let isReady = false;
    let typingTimer = null;
    const TYPING_DELAY = 250;
    let dropdown = null;

    /* =====================================================
       WAIT UNTIL ALL READY
    ===================================================== */
    function waitUntilReady(callback) {
        const timer = setInterval(() => {
            if (
                window.warehouseMap &&
                window.allRouteMarkers &&
                Array.isArray(window.allRouteMarkers) &&
                document.getElementById("mapSearchInput") &&
                document.getElementById("mapSearchBtn") &&
                document.getElementById("tableSearchInput")
            ) {
                clearInterval(timer);
                callback();
            }
        }, 150);
    }

    /* =====================================================
       INIT
    ===================================================== */
    function initSearch() {
        if (isReady) return;
        isReady = true;

        initMapSearch();
        initTableSearch();

        console.log("✅ Search engine MAP + TABLE siap");
    }

    /* =====================================================
       MAP SEARCH
    ===================================================== */
    function initMapSearch() {

        const input = document.getElementById("mapSearchInput");
        const btn = document.getElementById("mapSearchBtn");

        btn.type = "button";
        btn.style.pointerEvents = "auto";
        btn.style.cursor = "pointer";

        // AUTOCOMPLETE SAAT NGETIK
        input.addEventListener("input", function () {

            clearTimeout(typingTimer);

            typingTimer = setTimeout(() => {

                const keyword = input.value.trim().toLowerCase();
                removeDropdown();

                if (keyword.length < 2) return;
                if (!window.allRouteMarkers.length) return;

                const matches = window.allRouteMarkers.filter(item =>
                    item.name.includes(keyword)
                );

                if (!matches.length) return;

                showDropdown(matches);

            }, TYPING_DELAY);
        });

        // SEARCH VIA BUTTON
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const keyword = input.value.trim().toLowerCase();
            removeDropdown();

            if (!keyword) return;

            const matches = window.allRouteMarkers.filter(item =>
                item.name.includes(keyword)
            );

            if (!matches.length) {
                alert("Toko tidak ditemukan di hari aktif");
                return;
            }

            if (matches.length === 1) {
                focusMarker(matches[0]);
            } else {
                showDropdown(matches);
            }
        });
    }

    function focusMarker(item) {
        const latLng = item.marker.getLatLng();

        window.warehouseMap.flyTo(latLng, 18, {
            animate: true,
            duration: 1.2
        });

        setTimeout(() => {
            item.marker.openPopup();
        }, 900);
    }

    function showDropdown(results) {

    removeDropdown();

    const input = document.getElementById("mapSearchInput");
    const rect = input.getBoundingClientRect();

    dropdown = document.createElement("div");
    dropdown.id = "map-search-dropdown";

    Object.assign(dropdown.style, {
        position: "absolute",
        left: (rect.left + window.scrollX) + "px",
        top: (rect.bottom + window.scrollY) + "px",
        width: rect.width + "px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
        zIndex: 9999,
        maxHeight: "240px",
        overflowY: "auto",
        color: "#000"
    });

    results.forEach(item => {

        const option = document.createElement("div");
        option.innerHTML = `📍 <span style="color:#000;font-weight:500">${item.name}</span>`;

        Object.assign(option.style, {
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
            color: "#000"
        });

        option.onmouseenter = () => option.style.background = "#f2f2f2";
        option.onmouseleave = () => option.style.background = "#fff";

        option.onclick = () => {
            focusMarker(item);
            removeDropdown();
        };

        dropdown.appendChild(option);
    });

    document.body.appendChild(dropdown);
}


    function removeDropdown() {
        if (dropdown) {
            dropdown.remove();
            dropdown = null;
        }
    }

    document.addEventListener("click", (e) => {
        if (
            !e.target.closest("#map-search-dropdown") &&
            e.target.id !== "mapSearchInput"
        ) {
            removeDropdown();
        }
    });

    /* =====================================================
       TABLE SEARCH (FILTER DATA RESULT)
    ===================================================== */
    function initTableSearch() {

        const input = document.getElementById("tableSearchInput");

        input.addEventListener("input", function () {

            const keyword = input.value.trim().toLowerCase();
            const tables = document.querySelectorAll(".data-table tbody");

            tables.forEach(tbody => {
                const rows = tbody.querySelectorAll("tr");

                rows.forEach(row => {
                    const outletName = row.children[1]?.innerText.toLowerCase() || "";

                    if (!keyword || outletName.includes(keyword)) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                });
            });
        });
    }

    /* =====================================================
       BOOT
    ===================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        waitUntilReady(initSearch);
    });

})();

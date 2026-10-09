/* =========================================================
   DIAMOND TOURS — FRONTEND JS
   Demo only: no real payment / database yet.
   Needs content.js to be loaded first.
   ========================================================= */

(function () {

    var C = DTStore.get();
    var BODY = document.body;
    var PAGE = BODY.dataset.page || "";

    var DIAMOND_SVG =
        '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true">' +
        '<polygon points="6,14 13,5 27,5 34,14 20,35"/><path d="M6 14h28M13 5l7 9 7-9M20 14v21"/></svg>';


    /* =========================
       SMALL HELPERS
       ========================= */

    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $$(selector, root) {
        return Array.prototype.slice.call(
            (root || document).querySelectorAll(selector)
        );
    }

    function money(n) {
        return "৳" + Number(n).toLocaleString("en-US");
    }

    function getPath(obj, path) {
        return path.split(".").reduce(function (o, k) {
            return o == null ? undefined : o[k];
        }, obj);
    }

    /* {seats} {dates} {price} {destination} {trip} {duration} */
    function tpl(text) {
        return String(text == null ? "" : text).replace(/\{(\w+)\}/g, function (m, key) {
            var t = C.trip;
            if (key === "seats") return t.seats;
            if (key === "dates") return t.dates;
            if (key === "price") return money(t.price);
            if (key === "destination") return t.destination;
            if (key === "trip") return t.name;
            if (key === "duration") return t.duration;
            return m;
        });
    }

    /* text with line breaks (\n -> <br>), never uses innerHTML */
    function setText(el, value, accent) {
        var lines = tpl(value).split("\n");
        el.textContent = "";
        lines.forEach(function (line, i) {
            if (i > 0) {
                el.appendChild(document.createElement("br"));
            }
            if (accent && i > 0) {
                var span = document.createElement("span");
                span.className = "accent-line";
                span.textContent = line;
                el.appendChild(span);
            } else {
                el.appendChild(document.createTextNode(line));
            }
        });
    }

    function setBg(el, url) {
        el.style.backgroundImage = 'url("' + String(url).replace(/"/g, "%22") + '")';
    }

    function make(tag, className, text) {
        var el = document.createElement(tag);
        if (className) el.className = className;
        if (text != null) el.textContent = text;
        return el;
    }

    /* if a photo link breaks, show a local photo instead of an empty box */
    function safeImg(img) {
        img.addEventListener("error", function () {
            if (img.dataset.fallback) return;
            img.dataset.fallback = "1";
            img.src = "images/sunset.jpg";
        });
        return img;
    }

    function pageName() {
        return BODY.dataset.title || "";
    }


    /* =========================
       STORAGE HELPERS (booking flow)
       ========================= */

    function getRegistrationData() {
        try {
            return JSON.parse(sessionStorage.getItem("diamondDemo") || "{}");
        } catch (error) {
            return {};
        }
    }

    function getPaymentData() {
        try {
            return JSON.parse(sessionStorage.getItem("diamondPayment") || "{}");
        } catch (error) {
            return {};
        }
    }

    function generateReference() {
        return (C.site.refPrefix || "DT") + "-" + Math.floor(1000 + Math.random() * 9000);
    }


    /* =========================
       NAV + FOOTER
       ========================= */

    function buildNav() {

        var slot = $("#siteNav");
        if (!slot) return;

        var isHome = PAGE === "home";
        var showCta = PAGE !== "registration" && PAGE !== "payment";

        var links = isHome
            ? [["About", "#about"], ["Experience", "#experience"], ["Itinerary", "tour.html"]]
            : [["Home", "index.html"], ["Itinerary", "tour.html"], ["Register", "registration.html"]];

        var brand = make("a", "brand");
        brand.href = "index.html";
        brand.innerHTML = DIAMOND_SVG;
        brand.appendChild(make("span", "", C.site.name));

        var nav = make("div", "navlinks");
        nav.id = "navLinks";
        links.forEach(function (l) {
            var a = make("a", "", l[0]);
            a.href = l[1];
            nav.appendChild(a);
        });

        var right = make("div", "nav-right");
        if (showCta) {
            var cta = make("a", "pill pill-ghost", C.nav.cta);
            cta.href = "registration.html";
            if (!isHome) cta.className = "pill pill-accent";
            right.appendChild(cta);
        }
        var burger = make("button", "burger", "☰");
        burger.type = "button";
        burger.setAttribute("aria-label", "Menu");
        burger.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
        right.appendChild(burger);

        var row = make("div", "nav");
        row.appendChild(brand);
        row.appendChild(nav);
        row.appendChild(right);

        if (isHome) {
            /* nav lives inside the glass hero frame */
            slot.textContent = "";
            slot.appendChild(brand);
            slot.appendChild(nav);
            slot.appendChild(right);
        } else {
            slot.className = "nav-wrap";
            row.className = "nav nav-solid";
            slot.textContent = "";
            slot.appendChild(row);
        }
    }

    function buildFooter() {

        var slot = $("#siteFooter");
        if (!slot) return;

        var footer = make("footer");
        var left = make("span", "", "© " + new Date().getFullYear() + " " + C.site.name.toUpperCase());
        footer.appendChild(left);

        var key = BODY.dataset.footer;

        if (key === "__home") {
            var back = make("a", "", "BACK HOME ↑");
            back.href = "index.html";
            footer.appendChild(back);
        } else if (key) {
            footer.appendChild(make("span", "", getPath(C, key) || ""));
        }

        slot.appendChild(footer);

        /* secret for phones: tap the © text 5 times to open admin */
        var taps = 0, timer = null;
        left.addEventListener("click", function () {
            taps++;
            clearTimeout(timer);
            timer = setTimeout(function () { taps = 0; }, 900);
            if (taps >= 5) {
                window.location.assign("admin.html");
            }
        });
    }


    /* =========================
       APPLY CONTENT (data-t / data-bg / data-brand)
       ========================= */

    function applyBindings() {

        $$("[data-t]").forEach(function (el) {
            var value = getPath(C, el.dataset.t);
            if (value !== undefined) {
                setText(el, value, el.hasAttribute("data-accent"));
            }
        });

        $$("[data-bg]").forEach(function (el) {
            var url = getPath(C, el.dataset.bg);
            if (url) setBg(el, url);
        });

        $$("[data-brand]").forEach(function (el) {
            el.innerHTML = DIAMOND_SVG;
            el.appendChild(make("span", "", C.site.name));
            var svg = el.querySelector("svg");
            if (svg) svg.style.color = "var(--accent)";
        });

        var title = C.site.name + (pageName() ? " — " + pageName() : "");
        document.title = title;
    }


    /* =========================
       HOME PAGE
       ========================= */

    function renderHome() {

        if (PAGE !== "home") return;

        /* ----- seat card ----- */
        var pills = $("#seatPills");
        var totalEl = $("#seatTotal");
        var bookBtn = $("#seatBook");
        var noteEl = $("#seatNote");
        var seats = 1;

        function updateSeats() {
            totalEl.textContent = money(C.trip.price * seats);
            bookBtn.href = "registration.html?seats=" + seats;
            $$("button", pills).forEach(function (b) {
                b.classList.toggle("on", Number(b.dataset.n) === seats);
                b.setAttribute("aria-pressed", Number(b.dataset.n) === seats);
            });
        }

        pills.textContent = "";
        for (var n = 1; n <= C.trip.maxPerBooking; n++) {
            var b = make("button", "", String(n));
            b.type = "button";
            b.dataset.n = n;
            b.addEventListener("click", function () {
                seats = Number(this.dataset.n);
                updateSeats();
            });
            pills.appendChild(b);
        }
        noteEl.textContent = tpl(C.home.card.note);
        updateSeats();

        /* ----- showcase ----- */
        $("#scPrice").textContent = money(C.trip.price);

        var tags = $("#scTags");
        tags.textContent = "";
        C.home.showcase.tags.forEach(function (t) {
            tags.appendChild(make("span", "", tpl(t)));
        });

        var bento = $("#bento");
        bento.textContent = "";
        var positions = ["50% 55%", "72% 78%", "50% 52%", "50% 50%", "50% 50%"];
        C.images.bento.slice(0, 5).forEach(function (url, i) {
            var fig = make("figure");
            var img = document.createElement("img");
            img.src = url;
            img.alt = C.trip.destination + " photo " + (i + 1);
            img.loading = i === 0 ? "eager" : "lazy";
            safeImg(img);
            img.style.objectPosition = positions[i] || "50% 50%";
            fig.appendChild(img);
            bento.appendChild(fig);
        });

        var heart = $("#heartBtn");
        heart.addEventListener("click", function () {
            var on = heart.classList.toggle("on");
            heart.textContent = on ? "♥" : "♡";
        });

        /* ----- stats ----- */
        var stats = $("#stats");
        stats.textContent = "";
        [
            ["WHEN", C.trip.datesLong, ""],
            ["WHERE", C.trip.destination, C.trip.country],
            ["FROM", money(C.trip.price), "per person"],
            ["GROUP", String(C.trip.seats), "seats"]
        ].forEach(function (s) {
            var box = make("div", "stat");
            box.appendChild(make("span", "", s[0]));
            box.appendChild(make("strong", "", s[1]));
            if (s[2]) box.appendChild(make("small", "", s[2]));
            stats.appendChild(box);
        });

        /* ----- highlights ----- */
        var grid = $("#hlGrid");
        grid.textContent = "";
        C.home.highlights.items.forEach(function (item) {
            var card = make("article", "hl-card");
            var img = document.createElement("img");
            img.src = item.img;
            img.alt = item.title;
            img.loading = "lazy";
            safeImg(img);
            card.appendChild(img);
            var body = make("div", "hl-body");
            body.appendChild(make("h4", "", item.title));
            body.appendChild(make("p", "", item.text));
            card.appendChild(body);
            grid.appendChild(card);
        });

        /* ----- moments: tall pills, move sideways while scrolling ----- */
        var track = $("#mTrack");
        track.textContent = "";
        var items = C.home.moments.items;
        var pillCount = Math.max(items.length * 2, 8);
        var pillEls = [];

        for (var i = 0; i < pillCount; i++) {
            var item = items[i % items.length];
            var pill = make("div", "m-pill");
            var img = document.createElement("img");
            img.src = item.img;
            img.alt = item.title;
            img.loading = "lazy";
            safeImg(img);
            img.style.objectPosition = i % 2 ? "70% 50%" : "35% 50%";
            pill.appendChild(img);

            var cap = make("div", "m-cap");
            cap.appendChild(make("b", "", item.title));
            cap.appendChild(make("span", "", item.text));
            pill.appendChild(cap);

            pill.addEventListener("mouseenter", activate);
            pill.addEventListener("click", activate);
            track.appendChild(pill);
            pillEls.push(pill);
        }

        function activate() {
            pillEls.forEach(function (p) { p.classList.remove("on"); });
            this.classList.add("on");
        }

        pillEls[1].classList.add("on");

        var section = $("#moments");
        var ticking = false;

        function moveMoments() {
            var rect = section.getBoundingClientRect();
            var vh = window.innerHeight;
            var progress = (vh - rect.top) / (vh + rect.height);
            progress = Math.min(1, Math.max(0, progress));
            var maxShift = Math.max(0, track.offsetWidth - section.clientWidth);
            track.style.transform = "translate3d(" + (-progress * maxShift) + "px,0,0)";
            ticking = false;
        }

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.addEventListener("scroll", function () {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(moveMoments);
                }
            }, { passive: true });
            window.addEventListener("resize", moveMoments);
            track.addEventListener("transitionend", moveMoments);
            moveMoments();
        }
    }


    /* =========================
       ITINERARY PAGE
       ========================= */

    function renderTour() {

        if (PAGE !== "tour") return;

        var days = $("#days");
        days.textContent = "";

        C.tour.days.forEach(function (d) {
            var art = make("article", "day");
            art.appendChild(make("div", "day-no", d.no));

            var main = make("div", "day-main");
            main.appendChild(make("span", "", d.date));
            main.appendChild(make("h2", "", d.title));
            main.appendChild(make("p", "", d.text));

            var sched = make("div", "schedule");
            (d.schedule || []).forEach(function (s) {
                var row = make("div");
                row.appendChild(make("b", "", s.time));
                row.appendChild(document.createTextNode(s.text));
                sched.appendChild(row);
            });
            main.appendChild(sched);

            art.appendChild(main);
            days.appendChild(art);
        });

        var grid = $("#includeGrid");
        grid.textContent = "";
        C.tour.included.items.forEach(function (text) {
            grid.appendChild(make("div", "", text));
        });
    }


    /* =========================
       REGISTRATION PAGE
       ========================= */

    function initRegistration() {

        var form = $("#registerForm");
        if (!form) return;

        $("#miniTripInfo").textContent =
            C.trip.dates + " · " + money(C.trip.price) + " / PERSON";

        var select = $("#seatSelect");
        select.textContent = "";

        for (var n = 1; n <= C.trip.maxPerBooking; n++) {
            var opt = make(
                "option", "",
                n + (n === 1 ? " seat" : " seats") + " — " + money(C.trip.price * n)
            );
            opt.value = String(n);
            select.appendChild(opt);
        }

        var wanted = parseInt(new URLSearchParams(window.location.search).get("seats"), 10);
        if (wanted >= 1 && wanted <= C.trip.maxPerBooking) {
            select.value = String(wanted);
        }

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            var data = Object.fromEntries(new FormData(form).entries());

            if (!data.name || !data.name.trim()) {
                alert("Please enter your full name.");
                return;
            }

            if (!data.phone || !data.phone.trim()) {
                alert("Please enter your phone number.");
                return;
            }

            sessionStorage.setItem("diamondDemo", JSON.stringify(data));
            window.location.assign("./payment.html");
        });
    }


    /* =========================
       PAYMENT PAGE
       ========================= */

    function initPayment() {

        var payButton = $("#payBtn");
        if (!payButton) return;

        var registration = getRegistrationData();

        /* opened directly without registering: send back */
        if (!registration.name) {
            window.location.replace("./registration.html");
            return;
        }

        var seats = parseInt(registration.seats, 10) || 1;
        var total = C.trip.price * seats;

        $("#amount").textContent = "৳ " + total.toLocaleString("en-US");
        payButton.innerHTML = "Pay " + money(total) + " <span>↗</span>";

        var selectedMethod = "card";
        var methods = $$(".method");
        var cardBox = $("#cardBox");
        var mobileBox = $("#mobileBox");
        var mobileTitle = $("#mobileTitle");

        methods.forEach(function (button) {
            button.addEventListener("click", function () {

                methods.forEach(function (item) { item.classList.remove("active"); });
                button.classList.add("active");
                selectedMethod = button.dataset.method;

                if (selectedMethod === "card") {
                    cardBox.classList.remove("hidden");
                    mobileBox.classList.add("hidden");
                } else {
                    cardBox.classList.add("hidden");
                    mobileBox.classList.remove("hidden");
                    mobileTitle.textContent =
                        selectedMethod === "bkash" ? "bKash payment" : "Nagad payment";
                }
            });
        });

        payButton.addEventListener("click", function () {

            if (selectedMethod === "card") {
                var inputs = $$("input", cardBox);
                for (var i = 0; i < inputs.length; i++) {
                    if (!inputs[i].value.trim()) {
                        alert("Please complete your card details.");
                        inputs[i].focus();
                        return;
                    }
                }
            } else {
                var mobileInput = $("input", mobileBox);
                if (mobileInput && !mobileInput.value.trim()) {
                    alert("Please enter your mobile number.");
                    mobileInput.focus();
                    return;
                }
            }

            sessionStorage.setItem("diamondPayment", JSON.stringify({
                method: selectedMethod,
                amount: total,
                currency: "BDT",
                status: "paid",
                reference: generateReference(),
                time: new Date().toISOString()
            }));

            window.location.assign("./success.html");
        });
    }


    /* =========================
       SUCCESS PAGE
       ========================= */

    function initSuccess() {

        var guestName = $("#guestName");
        var reference = $("#ref");

        if (!guestName && !reference) return;

        var registration = getRegistrationData();
        var payment = getPaymentData();

        if (guestName) {
            guestName.textContent = registration.name || "Traveller";
        }

        if (reference) {
            reference.textContent = payment.reference || generateReference();
        }
    }


    /* =========================
       SMOOTH ANCHOR LINKS
       ========================= */

    function initAnchors() {
        $$('a[href^="#"]').forEach(function (link) {
            link.addEventListener("click", function (event) {

                var id = link.getAttribute("href");
                if (!id || id === "#") return;

                var target = $(id);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    var menu = $("#navLinks");
                    if (menu) menu.classList.remove("open");
                }
            });
        });
    }


    /* =========================
       SECRET ADMIN SHORTCUT: press F2 twice
       ========================= */

    var lastF2 = 0;

    document.addEventListener("keydown", function (event) {
        if (event.key !== "F2") return;
        event.preventDefault();
        var now = Date.now();
        if (now - lastF2 < 600) {
            window.location.assign("admin.html");
        }
        lastF2 = now;
    });


    /* =========================
       START
       ========================= */

    function start() {
        DTStore.applyTheme(C.theme);
        buildNav();
        buildFooter();
        applyBindings();
        renderHome();
        renderTour();
        initRegistration();
        initPayment();
        initSuccess();
        initAnchors();
    }

    start();

    /* When Supabase is connected (DTStore.remote), fetch the newest
       content once per visit and reload so everything shows it. */
    DTStore.refreshRemote(function () {
        if (!sessionStorage.getItem("dt_synced")) {
            sessionStorage.setItem("dt_synced", "1");
            window.location.reload();
        }
    });

})();

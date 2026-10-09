/* =========================================================
   DIAMOND TOURS — CONTENT + STORE
   ---------------------------------------------------------
   1. DEFAULTS  = every editable text, price, colour and image
   2. DTStore   = loads / saves the content

   TODAY   : edits made in the admin panel are saved in this
             browser (localStorage) only.
   LATER   : plug Supabase in with ONE object, see the
             "SUPABASE HOOK" block at the bottom.
   ========================================================= */

(function () {

    var STORAGE_KEY = "dt_content_v1";
    var HASH_KEY = "dt_admin_hash";

    /* Default admin passcode is  diamond2026  (change it in admin > General) */
    var DEFAULT_ADMIN_HASH = "6c2ff9a1";

    var UNSPLASH_1 = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80";
    var UNSPLASH_2 = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80";


    var DEFAULTS = {

        /* ---------- THEME (admin > Theme) ---------- */
        theme: {
            accent:  "#f2542d",   /* buttons, highlights      */
            accent2: "#f5b83d",   /* gold details             */
            dark:    "#07161b",   /* dark cards, nav, footer  */
            paper:   "#fff3e4",   /* page background          */
            ink:     "#16120f"    /* main text                */
        },

        /* ---------- GENERAL ---------- */
        site: {
            name: "Diamond Tours",
            email: "info@diamondtours.com",
            phone: "+880 1XXX XXXXXX",
            facebook: "#",
            instagram: "#",
            youtube: "#",
            refPrefix: "DT"
        },

        nav: {
            cta: "Book Now"
        },

        /* ---------- TRIP (one place for price / seats / dates) ---------- */
        trip: {
            name: "Cox's Bazar Escape",
            destination: "Cox's Bazar",
            country: "Bangladesh",
            departFrom: "Chittagong",
            dates: "18–20 DEC 2026",
            datesLong: "18 — 20 DEC 2026",
            duration: "03 DAYS · 02 NIGHTS",
            price: 3990,
            seats: 30,
            maxPerBooking: 4
        },

        /* ---------- IMAGES ---------- */
        images: {
            hero: "images/horse.jpg",
            bento: [
                "images/horse.jpg",
                "images/boat.jpg",
                "images/sunset.jpg",
                UNSPLASH_1,
                UNSPLASH_2
            ]
        },

        /* ---------- HOME ---------- */
        home: {
            hero: {
                title: "Leave the ordinary.\nMeet the sea.",
                text: "A carefully planned coastal escape for good people, open roads, golden sunsets and unforgettable memories."
            },
            card: {
                title: "Reserve your seats",
                seatsLabel: "SEATS",
                totalLabel: "TOTAL",
                button: "Book now",
                note: "Only {seats} seats · {dates}"
            },
            showcase: {
                title: "Cox's Bazar\nSunset Escape",
                tags: ["{duration}", "{seats} seats only", "Sunset + bonfire"],
                button: "Book Now"
            },
            idea: {
                tag: "01 — THE IDEA",
                title: "More than a tour.\nA memory in the making.",
                text: "Cox's Bazar is where the road meets the sea. We're bringing together a small group for three days of ocean air, long beaches, local food, sunset walks and absolutely no boring schedules."
            },
            highlights: {
                tag: "02 — THE EXPERIENCE",
                title: "Wake up\nby the sea.",
                items: [
                    { img: "images/sunset.jpg", title: "Ocean mornings", text: "Sea air, a slow local breakfast and a day that starts without an alarm rush." },
                    { img: "images/horse.jpg",  title: "Long beach, local food", text: "Fresh seafood, long conversations on the road and a little adventure." },
                    { img: "images/boat.jpg",   title: "Sunset walks", text: "End every day beside the world's longest natural sandy beach." }
                ],
                link: "See full itinerary"
            },
            moments: {
                title: "See the\ncoast",
                text: "Golden hours, long beaches and the moments you'll keep coming back to.",
                items: [
                    { img: "images/horse.jpg",  title: "Golden hour",  text: "Sunset rides on the sand" },
                    { img: "images/boat.jpg",   title: "Moon boats",   text: "Local boats, long shadows" },
                    { img: "images/sunset.jpg", title: "Ocean light",  text: "Where the sky meets the sea" },
                    { img: UNSPLASH_1,          title: "The journey",  text: "Open roads, good company" },
                    { img: UNSPLASH_2,          title: "The memories", text: "Photos you'll keep" }
                ]
            },
            final: {
                tag: "03 — YOUR SEAT",
                title: "Ready to\nget away?",
                text: "Only {seats} spots. Once they're gone, they're gone.",
                button: "Start registration"
            },
            footer: "MADE FOR THE ROAD."
        },

        /* ---------- ITINERARY ---------- */
        tour: {
            head: {
                tag: "THE JOURNEY",
                title: "Three days.\nOne story.",
                text: "Here's what your escape looks like from the moment we leave the city."
            },
            days: [
                {
                    no: "01", date: "18 DEC · FRIDAY", title: "The road begins.",
                    text: "Meet the group, leave Chittagong behind and follow the coast road. The sea gets closer with every kilometre.",
                    schedule: [
                        { time: "06:30 AM", text: "Meet & depart" },
                        { time: "09:30 AM", text: "Breakfast stop" },
                        { time: "01:00 PM", text: "Check-in & lunch" },
                        { time: "05:00 PM", text: "Sunset at the beach" },
                        { time: "08:00 PM", text: "Dinner + bonfire" }
                    ]
                },
                {
                    no: "02", date: "19 DEC · SATURDAY", title: "Salt air, slow mornings.",
                    text: "The day for long beach walks, local seafood and the kind of photos you'll keep coming back to.",
                    schedule: [
                        { time: "06:00 AM", text: "Sunrise walk" },
                        { time: "08:00 AM", text: "Breakfast" },
                        { time: "10:00 AM", text: "Inani Beach & Marine Drive" },
                        { time: "01:00 PM", text: "Seafood lunch" },
                        { time: "04:30 PM", text: "Sunset & free time" }
                    ]
                },
                {
                    no: "03", date: "20 DEC · SUNDAY", title: "Take the memories home.",
                    text: "One last breakfast, a final walk by the water, and then the road back home.",
                    schedule: [
                        { time: "08:00 AM", text: "Breakfast" },
                        { time: "10:00 AM", text: "Check-out" },
                        { time: "01:00 PM", text: "Lunch on route" },
                        { time: "07:00 PM", text: "Arrival in Chittagong" }
                    ]
                }
            ],
            included: {
                tag: "WHAT'S INCLUDED",
                title: "We've got\nthe basics covered.",
                items: ["Transport", "Accommodation", "Daily breakfast", "Tour coordinator", "Entry fees", "Bonfire night"]
            },
            cta: {
                title: "Your seat is\none click away.",
                button: "Register now"
            }
        },

        /* ---------- REGISTRATION ---------- */
        registration: {
            tag: "04 — REGISTRATION",
            title: "Save your\nseat.",
            text: "Tell us a little about yourself. This is a demo registration, so no real information is submitted anywhere.",
            submit: "Continue to secure payment",
            note: "DEMO MODE · No payment or data storage is connected.",
            footer: "SAFE TRAVELS."
        },

        /* ---------- PAYMENT ---------- */
        payment: {
            tag: "05 — PAYMENT",
            title: "Secure your\nspot.",
            text: "Choose your preferred payment method. This is a frontend demo, so no real payment will be charged.",
            note: "DEMO MODE · NO REAL PAYMENT IS PROCESSED",
            footer: "SECURE CHECKOUT · DEMO"
        },

        /* ---------- SUCCESS ---------- */
        success: {
            tag: "PAYMENT SUCCESSFUL",
            title: "You're on\nthe list.",
            text: "Your demo registration and payment have been completed.",
            small: "For the real version, this screen can connect to a database, payment gateway and confirmation email.",
            button: "Back to home"
        }
    };


    /* ---------- helpers ---------- */

    function clone(x) {
        return JSON.parse(JSON.stringify(x));
    }

    function isObject(x) {
        return x && typeof x === "object" && !Array.isArray(x);
    }

    /* saved values win; arrays are replaced as a whole */
    function merge(base, over) {
        if (!isObject(over)) {
            return base;
        }
        Object.keys(over).forEach(function (key) {
            if (isObject(base[key]) && isObject(over[key])) {
                merge(base[key], over[key]);
            } else {
                base[key] = over[key];
            }
        });
        return base;
    }

    /* simple hash, only to avoid keeping the passcode as plain text.
       Real protection comes later with Supabase Auth. */
    function hash(text) {
        var h = 0x811c9dc5;
        for (var i = 0; i < text.length; i++) {
            h ^= text.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        return h.toString(16);
    }


    /* ---------- STORE ---------- */

    var DTStore = {

        defaults: DEFAULTS,
        _cache: null,

        /* remote = null now. Set it later for Supabase (see bottom) */
        remote: null,

        get: function () {
            if (!this._cache) {
                var saved = {};
                try {
                    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
                } catch (e) {
                    saved = {};
                }
                this._cache = merge(clone(DEFAULTS), saved);
            }
            return this._cache;
        },

        /* fresh copy for the admin panel to edit */
        getForEdit: function () {
            return clone(this.get());
        },

        save: function (data) {
            this._cache = clone(data);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                return Promise.reject(e);
            }
            if (this.remote && this.remote.save) {
                return this.remote.save(clone(data));
            }
            return Promise.resolve(true);
        },

        reset: function () {
            this._cache = null;
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {}
            if (this.remote && this.remote.save) {
                return this.remote.save(clone(DEFAULTS));
            }
            return Promise.resolve(true);
        },

        /* pull the newest content from the remote DB, then call back */
        refreshRemote: function (done) {
            var self = this;
            if (!this.remote || !this.remote.load) {
                return;
            }
            this.remote.load().then(function (data) {
                if (data) {
                    self._cache = merge(clone(DEFAULTS), data);
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    } catch (e) {}
                    if (done) {
                        done(self._cache);
                    }
                }
            }).catch(function (error) {
                console.warn("Remote content not loaded:", error);
            });
        },

        /* ---- admin passcode ---- */
        hash: hash,

        adminHash: function () {
            try {
                return localStorage.getItem(HASH_KEY) || DEFAULT_ADMIN_HASH;
            } catch (e) {
                return DEFAULT_ADMIN_HASH;
            }
        },

        setAdminPass: function (pass) {
            localStorage.setItem(HASH_KEY, hash(pass));
        },

        /* ---- theme ---- */
        applyTheme: function (theme) {
            var root = document.documentElement.style;
            root.setProperty("--accent", theme.accent);
            root.setProperty("--accent2", theme.accent2);
            root.setProperty("--dark", theme.dark);
            root.setProperty("--paper", theme.paper);
            root.setProperty("--ink", theme.ink);
        }
    };

    window.DTStore = DTStore;


    /* =========================================================
       SUPABASE HOOK  (not active yet)
       ---------------------------------------------------------
       When the database is ready, create a table, for example:
           site_content (id int primary key, data jsonb)
       with ONE row (id = 1). Then add this after the Supabase
       client is created, before Script.js runs:

       DTStore.remote = {
           load: async function () {
               const { data } = await sb.from("site_content")
                   .select("data").eq("id", 1).single();
               return data ? data.data : null;
           },
           save: async function (content) {
               const { error } = await sb.from("site_content")
                   .upsert({ id: 1, data: content });
               if (error) throw error;
           }
       };

       Nothing else in the site needs to change.
       ========================================================= */

})();

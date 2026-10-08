/* =========================================================
   WANDER TOUR — COMPLETE FRONTEND JS
   Demo only — no real database/payment
   ========================================================= */


/* =========================
   STORAGE HELPERS
   ========================= */

function getRegistrationData() {
    try {
        return JSON.parse(
            sessionStorage.getItem("wanderDemo") || "{}"
        );
    } catch (error) {
        return {};
    }
}


function getPaymentData() {
    try {
        return JSON.parse(
            sessionStorage.getItem("wanderPayment") || "{}"
        );
    } catch (error) {
        return {};
    }
}


function generateReference() {
    return "WND-" + Math.floor(1000 + Math.random() * 9000);
}


/* =========================
   REGISTRATION PAGE
   ========================= */

const registrationForm =
    document.getElementById("registerForm");

if (registrationForm) {

    registrationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData =
            new FormData(registrationForm);

        const data =
            Object.fromEntries(formData.entries());


        /* Basic validation */

        if (!data.name || !data.name.trim()) {
            alert("Please enter your full name.");
            return;
        }


        if (!data.phone || !data.phone.trim()) {
            alert("Please enter your phone number.");
            return;
        }


        /* Save registration */

        sessionStorage.setItem(
            "wanderDemo",
            JSON.stringify(data)
        );


        /* Go to payment */

        window.location.assign("./payment.html");
    });
}


/* =========================
   PAYMENT PAGE
   ========================= */

const payButton =
    document.getElementById("payBtn");


if (payButton) {

    const registration =
        getRegistrationData();


    /*
       If payment page is opened directly
       without registration, go back.
    */

    if (!registration.name) {

        window.location.replace(
            "./registration.html"
        );

    } else {

        /* =========================
           CALCULATE TOTAL
           ========================= */

        const seatsText =
            registration.seats || "1 seat";

        const seats =
            parseInt(
                seatsText.charAt(0),
                10
            ) || 1;


        const pricePerPerson = 3990;

        const total =
            pricePerPerson * seats;


        const amountElement =
            document.getElementById("amount");


        if (amountElement) {

            amountElement.textContent =
                "৳ " + total.toLocaleString();
        }


        /* Update payment button */

        payButton.innerHTML =
            "Pay ৳" +
            total.toLocaleString() +
            ' <span>↗</span>';


        /* =========================
           PAYMENT METHODS
           ========================= */

        let selectedMethod = "card";


        const methods =
            document.querySelectorAll(".method");


        const cardBox =
            document.getElementById("cardBox");


        const mobileBox =
            document.getElementById("mobileBox");


        const mobileTitle =
            document.getElementById("mobileTitle");


        methods.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    /* Remove active */

                    methods.forEach(function (item) {

                        item.classList.remove(
                            "active"
                        );

                    });


                    /* Activate selected */

                    button.classList.add("active");


                    selectedMethod =
                        button.dataset.method;


                    /* Card */

                    if (selectedMethod === "card") {

                        if (cardBox) {
                            cardBox.classList.remove(
                                "hidden"
                            );
                        }


                        if (mobileBox) {
                            mobileBox.classList.add(
                                "hidden"
                            );
                        }

                    }

                    /* bKash / Nagad */

                    else {

                        if (cardBox) {
                            cardBox.classList.add(
                                "hidden"
                            );
                        }


                        if (mobileBox) {
                            mobileBox.classList.remove(
                                "hidden"
                            );
                        }


                        if (mobileTitle) {

                            mobileTitle.textContent =
                                selectedMethod === "bkash"
                                    ? "bKash payment"
                                    : "Nagad payment";
                        }
                    }

                }
            );

        });


        /* =========================
           PAY BUTTON
           ========================= */

        payButton.addEventListener(
            "click",
            function () {


                /* =========================
                   CARD VALIDATION
                   ========================= */

                if (selectedMethod === "card") {

                    const inputs =
                        cardBox?.querySelectorAll(
                            "input"
                        );


                    if (inputs) {

                        for (
                            const input of inputs
                        ) {

                            if (
                                !input.value.trim()
                            ) {

                                alert(
                                    "Please complete your card details."
                                );

                                input.focus();

                                return;
                            }
                        }
                    }
                }


                /* =========================
                   BKASH / NAGAD VALIDATION
                   ========================= */

                if (
                    selectedMethod === "bkash" ||
                    selectedMethod === "nagad"
                ) {

                    const mobileInput =
                        mobileBox?.querySelector(
                            "input"
                        );


                    if (
                        mobileInput &&
                        !mobileInput.value.trim()
                    ) {

                        alert(
                            "Please enter your mobile number."
                        );

                        mobileInput.focus();

                        return;
                    }
                }


                /* =========================
                   SAVE PAYMENT
                   ========================= */

                const paymentData = {

                    method: selectedMethod,

                    amount: total,

                    currency: "BDT",

                    status: "paid",

                    reference:
                        generateReference(),

                    time:
                        new Date().toISOString()
                };


                sessionStorage.setItem(
                    "wanderPayment",
                    JSON.stringify(paymentData)
                );


                /* =========================
                   PAYMENT SUCCESS
                   ========================= */

                window.location.assign(
                    "./success.html"
                );

            }
        );

    }
}


/* =========================
   SUCCESS PAGE
   ========================= */

const guestName =
    document.getElementById("guestName");


const reference =
    document.getElementById("ref");


if (guestName || reference) {

    const registration =
        getRegistrationData();


    const payment =
        getPaymentData();


    /* Guest name */

    if (guestName) {

        guestName.textContent =
            registration.name ||
            "Traveller";
    }


    /* Payment reference */

    if (reference) {

        reference.textContent =
            payment.reference ||
            generateReference();
    }
}


/* =========================
   SMOOTH ANCHOR LINKS
   ========================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (target) {

                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


/* =========================
   DEBUG
   ========================= */

console.log(
    "Wander Tour frontend loaded successfully."
);

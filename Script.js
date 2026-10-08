/* =========================================================
   WANDER TOUR — COMPLETE FRONTEND JAVASCRIPT
   Demo only — No real database or payment processing
   ========================================================= */


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

function getRegistrationData() {
    try {
        return JSON.parse(
            sessionStorage.getItem("wanderDemo") || "{}"
        );
    } catch (error) {
        console.error("Could not read registration data:", error);
        return {};
    }
}


function savePaymentData(data) {
    sessionStorage.setItem(
        "wanderPayment",
        JSON.stringify(data)
    );
}


function getPaymentData() {
    try {
        return JSON.parse(
            sessionStorage.getItem("wanderPayment") || "{}"
        );
    } catch (error) {
        console.error("Could not read payment data:", error);
        return {};
    }
}


function generateReference() {
    const number = Math.floor(
        1000 + Math.random() * 9000
    );

    return "WND-" + number;
}


/* =========================================================
   REGISTRATION PAGE
   registration.html
   ========================================================= */

const registrationForm =
    document.getElementById("registerForm");


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const formData =
                new FormData(registrationForm);

            const data =
                Object.fromEntries(formData.entries());


            /* -----------------------------------------
               Basic validation
               ----------------------------------------- */

            const name =
                data.name?.trim();

            const phone =
                data.phone?.trim();


            if (!name) {
                alert("Please enter your full name.");
                return;
            }


            if (!phone) {
                alert("Please enter your phone number.");
                return;
            }


            /* -----------------------------------------
               Save registration temporarily
               ----------------------------------------- */

            sessionStorage.setItem(
                "wanderDemo",
                JSON.stringify(data)
            );


            /* -----------------------------------------
               Redirect to payment
               ----------------------------------------- */

            window.location.href =
                "payment.html";
        }
    );
}


/* =========================================================
   PAYMENT PAGE
   payment.html
   ========================================================= */

const paymentButton =
    document.getElementById("payBtn");

const paymentMethods =
    document.querySelectorAll(".method");

const cardBox =
    document.getElementById("cardBox");

const mobileBox =
    document.getElementById("mobileBox");

const mobileTitle =
    document.getElementById("mobileTitle");

const amountElement =
    document.getElementById("amount");


if (paymentButton) {

    const registration =
        getRegistrationData();


    /* -----------------------------------------
       Calculate number of seats
       ----------------------------------------- */

    let seats = 1;

    if (registration.seats) {

        const parsedSeats =
            parseInt(
                String(registration.seats).charAt(0),
                10
            );

        if (!isNaN(parsedSeats)) {
            seats = parsedSeats;
        }
    }


    /* -----------------------------------------
       Tour price
       ----------------------------------------- */

    const pricePerPerson = 3990;

    const totalAmount =
        pricePerPerson * seats;


    /* -----------------------------------------
       Display amount
       ----------------------------------------- */

    if (amountElement) {

        amountElement.textContent =
            "৳ " + totalAmount.toLocaleString();
    }


    /* -----------------------------------------
       Update payment button
       ----------------------------------------- */

    paymentButton.innerHTML =
        "Pay ৳" +
        totalAmount.toLocaleString() +
        ' <span>↗</span>';


    /* -----------------------------------------
       Current payment method
       ----------------------------------------- */

    let selectedMethod = "card";


    /* -----------------------------------------
       Payment method selection
       ----------------------------------------- */

    paymentMethods.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                /* Remove active state */
                paymentMethods.forEach(function (item) {
                    item.classList.remove("active");
                });


                /* Activate clicked method */
                button.classList.add("active");


                /* Save selected method */
                selectedMethod =
                    button.dataset.method;


                /* ---------------------------------
                   Card
                   --------------------------------- */

                if (selectedMethod === "card") {

                    if (cardBox) {
                        cardBox.classList.remove("hidden");
                    }

                    if (mobileBox) {
                        mobileBox.classList.add("hidden");
                    }
                }


                /* ---------------------------------
                   bKash
                   --------------------------------- */

                else if (selectedMethod === "bkash") {

                    if (cardBox) {
                        cardBox.classList.add("hidden");
                    }

                    if (mobileBox) {
                        mobileBox.classList.remove("hidden");
                    }

                    if (mobileTitle) {
                        mobileTitle.textContent =
                            "bKash payment";
                    }
                }


                /* ---------------------------------
                   Nagad
                   --------------------------------- */

                else if (selectedMethod === "nagad") {

                    if (cardBox) {
                        cardBox.classList.add("hidden");
                    }

                    if (mobileBox) {
                        mobileBox.classList.remove("hidden");
                    }

                    if (mobileTitle) {
                        mobileTitle.textContent =
                            "Nagad payment";
                    }
                }
            }
        );
    });


    /* -----------------------------------------
       Payment button
       ----------------------------------------- */

    paymentButton.addEventListener(
        "click",
        function () {

            /* -------------------------------
               Card validation
               ------------------------------- */

            if (selectedMethod === "card") {

                const cardInputs =
                    cardBox?.querySelectorAll("input");


                if (cardInputs) {

                    let emptyField = false;

                    cardInputs.forEach(function (input) {

                        if (!input.value.trim()) {
                            emptyField = true;
                        }
                    });


                    if (emptyField) {

                        alert(
                            "Please complete your card details."
                        );

                        return;
                    }
                }
            }


            /* -------------------------------
               Mobile payment validation
               ------------------------------- */

            if (
                selectedMethod === "bkash" ||
                selectedMethod === "nagad"
            ) {

                const mobileInput =
                    mobileBox?.querySelector("input");


                if (
                    mobileInput &&
                    !mobileInput.value.trim()
                ) {

                    alert(
                        "Please enter your mobile number."
                    );

                    return;
                }
            }


            /* --------------------------------
               Save demo payment information
               -------------------------------- */

            const paymentData = {

                method: selectedMethod,

                amount: totalAmount,

                currency: "BDT",

                status: "paid",

                reference: generateReference(),

                timestamp:
                    new Date().toISOString()
            };


            savePaymentData(paymentData);


            /* --------------------------------
               Redirect to success page
               -------------------------------- */

            window.location.href =
                "success.html";
        }
    );
}


/* =========================================================
   SUCCESS PAGE
   success.html
   ========================================================= */

const guestNameElement =
    document.getElementById("guestName");

const referenceElement =
    document.getElementById("ref");


if (guestNameElement || referenceElement) {

    const registration =
        getRegistrationData();

    const payment =
        getPaymentData();


    /* -----------------------------------------
       Guest name
       ----------------------------------------- */

    if (guestNameElement) {

        const name =
            registration.name?.trim();

        guestNameElement.textContent =
            name || "traveller";
    }


    /* -----------------------------------------
       Payment reference
       ----------------------------------------- */

    if (referenceElement) {

        const reference =
            payment.reference ||
            generateReference();

        referenceElement.textContent =
            reference;
    }
}


/* =========================================================
   OPTIONAL: SMOOTH ANCHOR NAVIGATION
   ========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(function (link) {

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
                document.querySelector(targetId);


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


/* =========================================================
   DEMO CONSOLE MESSAGE
   ========================================================= */

console.log(
    "%cWANDER TOUR DEMO",
    "font-size:18px;font-weight:bold;"
);

console.log(
    "Frontend demo loaded successfully."
);

console.log(
    "No real payment or database is connected."
);

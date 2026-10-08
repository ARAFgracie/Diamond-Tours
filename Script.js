// ==========================================
// TOUR REGISTRATION WEBSITE - script.js
// Frontend Demo Only - No Backend Required
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------
    // Mobile Navigation
    // -------------------------------
    const menuBtn = document.querySelector(".menu-btn");
    const nav = document.querySelector(".nav-links");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    // -------------------------------
    // Smooth Scroll
    // -------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");

            if (targetId && targetId !== "#") {
                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }

            // Close mobile menu
            if (nav) {
                nav.classList.remove("active");
            }
        });
    });

    // -------------------------------
    // Registration Form
    // -------------------------------
    const registrationForm = document.querySelector("#registrationForm");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.querySelector("#name")?.value.trim();
            const phone = document.querySelector("#phone")?.value.trim();
            const email = document.querySelector("#email")?.value.trim();
            const participants =
                document.querySelector("#participants")?.value;
            const packageType =
                document.querySelector("#package")?.value;

            // Basic validation
            if (!name || !phone || !email || !participants || !packageType) {
                showMessage(
                    "Please fill in all required fields.",
                    "error"
                );
                return;
            }

            // Bangladesh phone validation
            const phonePattern = /^(?:\+8801|01)[3-9]\d{8}$/;

            if (!phonePattern.test(phone)) {
                showMessage(
                    "Please enter a valid Bangladesh mobile number.",
                    "error"
                );
                return;
            }

            // Generate demo registration ID
            const registrationId =
                "TR-" +
                Math.floor(100000 + Math.random() * 900000);

            // Show success message
            showMessage(
                `Registration successful! Your Registration ID is ${registrationId}.`,
                "success"
            );

            // Optional demo data display
            console.log("Registration Details:", {
                registrationId: registrationId,
                name: name,
                phone: phone,
                email: email,
                participants: participants,
                package: packageType
            });

            // Reset form
            registrationForm.reset();
        });
    }

    // -------------------------------
    // Demo Registration Button
    // -------------------------------
    const registerButtons =
        document.querySelectorAll(".register-btn");

    registerButtons.forEach(button => {
        button.addEventListener("click", () => {

            const formSection =
                document.querySelector("#registration");

            if (formSection) {
                formSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // -------------------------------
    // Copy Registration Details
    // -------------------------------
    const copyButtons =
        document.querySelectorAll("[data-copy]");

    copyButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const text = button.getAttribute("data-copy");

            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);

                const originalText = button.innerText;

                button.innerText = "Copied!";

                setTimeout(() => {
                    button.innerText = originalText;
                }, 1500);

            } catch (error) {
                console.error("Copy failed:", error);
            }
        });

    });

    // -------------------------------
    // Tour Package Selection
    // -------------------------------
    const packageCards =
        document.querySelectorAll(".package-card");

    packageCards.forEach(card => {

        card.addEventListener("click", () => {

            const packageName =
                card.dataset.package;

            const packageInput =
                document.querySelector("#package");

            if (packageInput && packageName) {
                packageInput.value = packageName;
            }

            // Remove previous selection
            packageCards.forEach(item => {
                item.classList.remove("selected");
            });

            // Select current card
            card.classList.add("selected");

            // Scroll to registration
            const registration =
                document.querySelector("#registration");

            if (registration) {
                registration.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });

    });

    // -------------------------------
    // FAQ Accordion
    // -------------------------------
    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        if (!question) return;

        question.addEventListener("click", () => {

            const isActive =
                item.classList.contains("active");

            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove("active");
            });

            // Open clicked one
            if (!isActive) {
                item.classList.add("active");
            }
        });

    });

    // -------------------------------
    // Date Display
    // -------------------------------
    const dateElements =
        document.querySelectorAll("[data-current-date]");

    dateElements.forEach(element => {

        const today = new Date();

        element.textContent =
            today.toLocaleDateString("en-BD", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

    });

    // -------------------------------
    // Scroll Header Effect
    // -------------------------------
    const header =
        document.querySelector("header");

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        });

    }

    // -------------------------------
    // Reveal Animation
    // -------------------------------
    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        // Fallback
        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }

});


// ==========================================
// MESSAGE FUNCTION
// ==========================================

function showMessage(message, type = "success") {

    // Remove existing message
    const oldMessage =
        document.querySelector(".form-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageBox =
        document.createElement("div");

    messageBox.className =
        `form-message ${type}`;

    messageBox.textContent = message;

    const form =
        document.querySelector("#registrationForm");

    if (form) {
        form.prepend(messageBox);
    }

    // Automatically remove
    setTimeout(() => {

        if (messageBox) {
            messageBox.remove();
        }

    }, 5000);
}


// ==========================================
// DEMO REGISTRATION DATA
// ==========================================

function generateRegistrationID() {

    return (
        "TR-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );

}


// ==========================================
// PRINT REGISTRATION COPY
// ==========================================

function printRegistrationCopy() {

    window.print();

}


// ==========================================
// DOWNLOAD / SAVE DEMO COPY
// ==========================================

function downloadRegistrationCopy() {

    const copy =
        document.querySelector(".registration-copy");

    if (!copy) {
        alert("Registration copy not found.");
        return;
    }

    const text =
        copy.innerText;

    const blob =
        new Blob([text], {
            type: "text/plain"
        });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "tour-registration-copy.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

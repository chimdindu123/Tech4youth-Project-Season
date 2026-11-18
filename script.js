document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // CURRENT YEAR
    // =====================================

    document.querySelectorAll("#currentYear").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            mainNav.classList.toggle("active");
            menuToggle.classList.toggle("active");

            const isOpen = mainNav.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

        });

        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

    }


    // =====================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    // =====================================
    // PASSWORD VISIBILITY
    // =====================================

    document.querySelectorAll(".password-toggle").forEach(function (button) {

        button.addEventListener("click", function () {

            const input = document.getElementById(button.dataset.target);

            if (!input) return;

            const showing = input.type === "password";

            input.type = showing ? "text" : "password";
            button.textContent = showing ? "Hide" : "Show";

        });

    });


    // =====================================
    // FEEDBACK MESSAGE
    // =====================================

    function showFeedback(element, message, type) {

        if (!element) return;

        element.textContent = message;
        element.className = "form-feedback " + type;

    }


    // =====================================
    // PASSWORD STRENGTH
    // =====================================

    const signupPassword = document.getElementById("signupPassword");
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    if (signupPassword && strengthBar && strengthText) {

        signupPassword.addEventListener("input", function () {

            const password = signupPassword.value;

            let score = 0;

            if (password.length >= 8) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;

            const levels = [
                ["Password strength", "0%", "#303036"],
                ["Very weak", "20%", "#FF7189"],
                ["Weak", "40%", "#FF9D42"],
                ["Fair", "60%", "#FFD166"],
                ["Strong", "80%", "#49DBA1"],
                ["Very strong", "100%", "#FF6A00"]
            ];

            const result = password.length === 0
                ? levels[0]
                : levels[score];

            strengthText.textContent = result[0];
            strengthBar.style.width = result[1];
            strengthBar.style.background = result[2];

        });

    }


    // =====================================
    // SIGN UP
    // =====================================

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const terms = document.getElementById("terms").checked;

            const feedback = document.getElementById("signupFeedback");
            const button = signupForm.querySelector("button[type='submit']");

            if (password.length < 8) {
                showFeedback(feedback, "Password must contain at least 8 characters.", "error");
                return;
            }

            if (password !== confirmPassword) {
                showFeedback(feedback, "Passwords do not match.", "error");
                return;
            }

            if (!terms) {
                showFeedback(feedback, "Please accept the terms and conditions.", "error");
                return;
            }

            button.disabled = true;
            button.textContent = "Creating Account...";

            try {

                const response = await fetch("/api/auth/register", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })

                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Registration failed.");
                }

                signupForm.reset();

                if (strengthBar) {
                    strengthBar.style.width = "0%";
                }

                if (strengthText) {
                    strengthText.textContent = "Password strength";
                }

                showFeedback(
                    feedback,
                    "Account created successfully! You can now sign in.",
                    "success"
                );

            } catch (error) {

                showFeedback(
                    feedback,
                    error.message.includes("Failed to fetch")
                        ? "Unable to connect to the server. Please try again."
                        : error.message,
                    "error"
                );

            } finally {

                button.disabled = false;
                button.textContent = "Create Account →";

            }

        });

    }


    // =====================================
    // SIGN IN
    // =====================================

    const signinForm = document.getElementById("signinForm");

    if (signinForm) {

        signinForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const email = document.getElementById("signinEmail").value.trim();
            const password = document.getElementById("signinPassword").value;

            const feedback = document.getElementById("signinFeedback");
            const button = signinForm.querySelector("button[type='submit']");

            button.disabled = true;
            button.textContent = "Signing In...";

            try {

                const response = await fetch("/api/auth/login", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })

                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Invalid login details.");
                }

                showFeedback(
                    feedback,
                    "Welcome back! Redirecting...",
                    "success"
                );

                // Connect this to your future store dashboard.
                // Example: window.location.href = "store.html";

            } catch (error) {

                showFeedback(
                    feedback,
                    error.message.includes("Failed to fetch")
                        ? "Unable to connect to the server. Please try again."
                        : error.message,
                    "error"
                );

            } finally {

                button.disabled = false;
                button.textContent = "Sign In →";

            }

        });

    }


    // =====================================
    // FORGOT PASSWORD
    // =====================================

    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener("click", async function (event) {

            event.preventDefault();

            const email = document.getElementById("signinEmail").value.trim();
            const feedback = document.getElementById("signinFeedback");

            if (!email) {

                showFeedback(
                    feedback,
                    "Enter your email address first.",
                    "error"
                );

                document.getElementById("signinEmail").focus();
                return;

            }

            try {

                const response = await fetch("/api/auth/forgot-password", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify({
                        email: email
                    })

                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Unable to process request.");
                }

                showFeedback(
                    feedback,
                    "If an account exists, reset instructions will be sent.",
                    "success"
                );

            } catch (error) {

                showFeedback(
                    feedback,
                    "Password recovery is not available yet.",
                    "error"
                );

            }

        });

    }


    // =====================================
    // CONTACT FORM
    // =====================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const feedback = document.getElementById("contactFeedback");
            const button = contactForm.querySelector("button[type='submit']");

            const name = contactForm.elements["name"].value.trim();
            const email = contactForm.elements["email"].value.trim();
            const message = contactForm.elements["message"].value.trim();

            if (!name || !email || !message) {

                showFeedback(
                    feedback,
                    "Please complete all fields.",
                    "error"
                );

                return;

            }

            button.disabled = true;
            button.textContent = "Sending...";

            try {

                const response = await fetch(
                    "https://formsubmit.co/ajax/chimdinduakpom1@gmail.com",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },

                        body: JSON.stringify({

                            name: name,
                            email: email,
                            message: message,

                            _subject: "New KARTZUKI Website Message",
                            _captcha: "false"

                        })

                    }
                );

                const result = await response.json();

                if (!response.ok || result.success !== true &&
                    result.success !== "true") {
                    throw new Error("Message could not be sent.");
                }

                showFeedback(
                    feedback,
                    "Your message has been sent successfully!",
                    "success"
                );

                contactForm.reset();

            } catch (error) {

                showFeedback(
                    feedback,
                    "Unable to send your message. Please try again.",
                    "error"
                );

            } finally {

                button.disabled = false;
                button.textContent = "Send Message →";

            }

        });

    }

});

// =====================================
    // KARTZUKI BRAND LOADER
    // =====================================

    const brandLoader = document.getElementById("brandLoader");

    if (brandLoader) {

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const loaderDuration = reducedMotion ? 300 : 2700;

        setTimeout(function () {

            brandLoader.classList.add("hide-loader");

            setTimeout(function () {
                brandLoader.remove();
            }, 750);

        }, loaderDuration);

    }
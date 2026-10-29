/* ==========================================
   SKYTRIP LOGIN & REGISTER PAGE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // COPYRIGHT YEAR
    // ==========================================

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // ==========================================
    // LOGIN ELEMENTS
    // ==========================================

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const roleOptions = document.querySelectorAll(".role-option");
    const roleSelection = document.getElementById("roleSelection");
    const roleLabel = document.getElementById("roleLabel");

    const selectedRoleInput = document.getElementById("selectedRole");
    const roleIndicator = document.getElementById("roleIndicator");

    const loginButton = document.getElementById("loginButton");
    const loginMessage = document.getElementById("loginMessage");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const togglePassword = document.getElementById("togglePassword");


    // ==========================================
    // REGISTER ELEMENTS
    // ==========================================

    const registerName = document.getElementById("registerName");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const registerNameError = document.getElementById("registerNameError");
    const registerEmailError = document.getElementById("registerEmailError");
    const registerPasswordError = document.getElementById("registerPasswordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    const acceptTerms = document.getElementById("acceptTerms");
    const termsError = document.getElementById("termsError");

    const registerButton = document.getElementById("registerButton");
    const registerMessage = document.getElementById("registerMessage");

    const toggleRegisterPassword = document.getElementById(
        "toggleRegisterPassword"
    );


    // ==========================================
    // FORM SWITCH ELEMENTS
    // ==========================================

    const switchFormButton = document.getElementById("switchFormButton");
    const switchPrompt = document.getElementById("switchPrompt");
    const switchDividerText = document.getElementById("switchDividerText");

    const formKicker = document.getElementById("formKicker");
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");


    // ==========================================
    // DASHBOARD ROUTES
    // ==========================================

    const dashboardRoutes = {
        admin: "admin-dashboard.html",
        user: "user-dashboard.html"
    };


    // ==========================================
    // CURRENT STATE
    // ==========================================

    let selectedRole = "admin";
    let currentFormMode = "login";


    // ==========================================
    // EMAIL VALIDATION PATTERN
    // ==========================================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // ==========================================
    // HELPER: CLEAR LOGIN ERRORS
    // ==========================================

    function clearLoginErrors() {

        if (emailError) {
            emailError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        emailInput?.classList.remove("input-invalid");
        passwordInput?.classList.remove("input-invalid");

        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.classList.remove("success", "error");
        }
    }


    // ==========================================
    // HELPER: CLEAR REGISTER ERRORS
    // ==========================================

    function clearRegisterErrors() {

        const errorElements = [
            registerNameError,
            registerEmailError,
            registerPasswordError,
            confirmPasswordError,
            termsError
        ];

        errorElements.forEach((element) => {
            if (element) {
                element.textContent = "";
            }
        });

        const inputElements = [
            registerName,
            registerEmail,
            registerPassword,
            confirmPassword
        ];

        inputElements.forEach((element) => {
            element?.classList.remove("input-invalid");
        });

        if (acceptTerms) {
            acceptTerms.classList.remove("input-invalid");
        }

        if (registerMessage) {
            registerMessage.textContent = "";
            registerMessage.classList.remove("success", "error");
        }
    }


    // ==========================================
    // ROLE SELECTION
    // ==========================================

    function updateSelectedRole(role) {

        if (role !== "admin" && role !== "user") {
            return;
        }

        selectedRole = role;

        if (selectedRoleInput) {
            selectedRoleInput.value = selectedRole;
        }

        roleOptions.forEach((option) => {

            const isActive = option.dataset.role === selectedRole;

            option.classList.toggle("active", isActive);
            option.setAttribute("aria-pressed", String(isActive));

        });

        // Update login button text
        const buttonText = loginButton?.querySelector(".button-text");

        if (buttonText) {
            buttonText.textContent =
                selectedRole === "admin"
                    ? "Sign In as Admin"
                    : "Sign In as User";
        }

        // Update role indicator
        if (roleIndicator) {

            roleIndicator.innerHTML =
                selectedRole === "admin"
                    ? '<i class="fa-solid fa-user-shield"></i> Admin Login'
                    : '<i class="fa-solid fa-user"></i> User Login';

        }

        clearLoginErrors();
    }


    roleOptions.forEach((option) => {

        option.addEventListener("click", () => {

            if (currentFormMode !== "login") {
                return;
            }

            updateSelectedRole(option.dataset.role);

        });

    });


    // ==========================================
    // SHOW / HIDE PASSWORD HELPER
    // ==========================================

    function setupPasswordToggle(button, input) {

        if (!button || !input) {
            return;
        }

        button.addEventListener("click", () => {

            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";

            button.innerHTML = isPassword
                ? '<i class="fa-regular fa-eye-slash"></i>'
                : '<i class="fa-regular fa-eye"></i>';

            button.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

        });

    }


    setupPasswordToggle(togglePassword, passwordInput);

    setupPasswordToggle(toggleRegisterPassword, registerPassword);


    // ==========================================
    // LOGIN INPUT ERROR CLEARING
    // ==========================================

    emailInput?.addEventListener("input", () => {

        if (emailError) {
            emailError.textContent = "";
        }

        emailInput.classList.remove("input-invalid");

        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.classList.remove("error", "success");
        }

    });


    passwordInput?.addEventListener("input", () => {

        if (passwordError) {
            passwordError.textContent = "";
        }

        passwordInput.classList.remove("input-invalid");

        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.classList.remove("error", "success");
        }

    });


    // ==========================================
    // REGISTER INPUT ERROR CLEARING
    // ==========================================

    [
        registerName,
        registerEmail,
        registerPassword,
        confirmPassword
    ].forEach((input) => {

        input?.addEventListener("input", () => {

            input.classList.remove("input-invalid");

            clearRegisterErrors();

        });

    });


    acceptTerms?.addEventListener("change", () => {

        if (termsError) {
            termsError.textContent = "";
        }

        acceptTerms.classList.remove("input-invalid");

    });


    // ==========================================
    // SWITCH BETWEEN LOGIN & REGISTER
    // ==========================================

    function switchAccountForm(mode) {

        if (!loginForm || !registerForm) {
            return;
        }

        currentFormMode = mode;

        const isRegister = mode === "register";

        // Show one form at a time
        loginForm.classList.toggle("hidden-form", isRegister);
        registerForm.classList.toggle("active-form", isRegister);

        // Update heading
        if (formKicker) {

            formKicker.textContent = isRegister
                ? "JOIN THE JOURNEY"
                : "WELCOME ABOARD";

        }

        if (formTitle) {

            formTitle.innerHTML = isRegister
                ? 'Create your <span>SkyTrip</span> account'
                : 'Sign in to <span>SkyTrip</span>';

        }

        if (formSubtitle) {

            formSubtitle.textContent = isRegister
                ? "Create your account and get ready to explore."
                : "Choose your account type to get started.";

        }

        // Update role selection text
        if (roleLabel) {

            roleLabel.textContent = isRegister
                ? "CREATE ACCOUNT AS"
                : "I WANT TO SIGN IN AS";

        }

        // Keep role options visible for both modes.
        // Registration currently creates a general account form;
        // role-specific account creation needs backend authorization.
        if (roleSelection) {
            roleSelection.hidden = false;
        }

        // Hide the login-only indicator in registration mode
        if (roleIndicator) {
            roleIndicator.hidden = isRegister;
        }

        // Update switch section
        if (switchDividerText) {

            switchDividerText.textContent = isRegister
                ? "ALREADY A MEMBER?"
                : "NEW TO SKYTRIP?";

        }

        if (switchPrompt) {

            switchPrompt.textContent = isRegister
                ? "Already have an account?"
                : "Don't have an account?";

        }

        if (switchFormButton) {

            switchFormButton.innerHTML = isRegister
                ? 'Sign In <i class="fa-solid fa-arrow-right"></i>'
                : 'Create an Account <i class="fa-solid fa-arrow-right"></i>';

            switchFormButton.setAttribute(
                "aria-label",
                isRegister
                    ? "Switch to sign in form"
                    : "Switch to create account form"
            );

        }

        // Update card security label
        const secureLabel = document.querySelector(".secure-label");

        if (secureLabel) {

            secureLabel.innerHTML = isRegister
                ? '<i class="fa-solid fa-shield-halved"></i> CREATE YOUR ACCOUNT'
                : '<i class="fa-solid fa-lock"></i> SECURE ACCOUNT ACCESS';

        }

        // Clear messages and errors
        clearLoginErrors();
        clearRegisterErrors();

        // Reset register fields when returning to login
        if (!isRegister) {
            registerForm.reset();
        }

        // Reset register password visibility
        if (registerPassword) {
            registerPassword.type = "password";
        }

        if (toggleRegisterPassword) {

            toggleRegisterPassword.innerHTML =
                '<i class="fa-regular fa-eye"></i>';

            toggleRegisterPassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

        // Reset login password visibility
        if (passwordInput) {
            passwordInput.type = "password";
        }

        if (togglePassword) {

            togglePassword.innerHTML =
                '<i class="fa-regular fa-eye"></i>';

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

        // Animate card
        const loginCard = document.getElementById("loginCard");

        if (loginCard) {

            loginCard.classList.remove("form-transition");

            // Restart the CSS animation
            void loginCard.offsetWidth;

            loginCard.classList.add("form-transition");

        }

        // Focus the first field in the active form
        const firstField = isRegister
            ? registerName
            : emailInput;

        firstField?.focus({ preventScroll: true });

    }


    if (switchFormButton) {

        switchFormButton.addEventListener("click", () => {

            const nextMode = currentFormMode === "login"
                ? "register"
                : "login";

            switchAccountForm(nextMode);

        });

    }


    // ==========================================
    // LOGIN FORM SUBMISSION
    // ==========================================

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            clearLoginErrors();

            if (!emailInput || !passwordInput || !loginButton) {
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            let isValid = true;


            // Validate email
            if (!email) {

                emailError.textContent =
                    "Please enter your email address.";

                emailInput.classList.add("input-invalid");

                isValid = false;

            } else if (!emailPattern.test(email)) {

                emailError.textContent =
                    "Please enter a valid email address.";

                emailInput.classList.add("input-invalid");

                isValid = false;

            }


            // Validate password
            if (!password.trim()) {

                passwordError.textContent =
                    "Please enter your password.";

                passwordInput.classList.add("input-invalid");

                isValid = false;

            }


            if (!isValid) {

                loginMessage.textContent =
                    "Please check the details above.";

                loginMessage.classList.add("error");

                const firstInvalid = loginForm.querySelector(
                    ".input-invalid"
                );

                firstInvalid?.focus();

                return;

            }


            // Validate selected role
            const dashboard = dashboardRoutes[selectedRole];

            if (!dashboard) {

                loginMessage.textContent =
                    "Invalid account type.";

                loginMessage.classList.add("error");

                return;

            }


            /*
             * DEMO NAVIGATION ONLY
             *
             * This checks form fields, not real credentials.
             * Connect a backend/authentication service before
             * using this flow for real user accounts.
             */

            loginButton.disabled = true;

            loginButton.classList.add("is-loading");

            loginMessage.textContent =
                "Preparing your SkyTrip account...";

            loginMessage.classList.remove("success", "error");

            const buttonText = loginButton.querySelector(".button-text");

            if (buttonText) {
                buttonText.textContent = "Please wait...";
            }


            window.setTimeout(() => {

                window.location.href = dashboard;

            }, 650);

        });

    }


    // ==========================================
    // REGISTER FORM SUBMISSION
    // ==========================================

    if (registerForm) {

        registerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            clearRegisterErrors();

            if (
                !registerName ||
                !registerEmail ||
                !registerPassword ||
                !confirmPassword ||
                !acceptTerms ||
                !registerButton
            ) {
                return;
            }

            const name = registerName.value.trim();
            const email = registerEmail.value.trim();
            const password = registerPassword.value;
            const confirm = confirmPassword.value;

            let isValid = true;


            // Validate full name
            if (!name) {

                registerNameError.textContent =
                    "Please enter your full name.";

                registerName.classList.add("input-invalid");

                isValid = false;

            } else if (name.length < 2) {

                registerNameError.textContent =
                    "Name must contain at least 2 characters.";

                registerName.classList.add("input-invalid");

                isValid = false;

            }


            // Validate email
            if (!email) {

                registerEmailError.textContent =
                    "Please enter your email address.";

                registerEmail.classList.add("input-invalid");

                isValid = false;

            } else if (!emailPattern.test(email)) {

                registerEmailError.textContent =
                    "Please enter a valid email address.";

                registerEmail.classList.add("input-invalid");

                isValid = false;

            }


            // Validate password
            if (!password) {

                registerPasswordError.textContent =
                    "Please create a password.";

                registerPassword.classList.add("input-invalid");

                isValid = false;

            } else if (password.length < 8) {

                registerPasswordError.textContent =
                    "Password must contain at least 8 characters.";

                registerPassword.classList.add("input-invalid");

                isValid = false;

            }


            // Validate confirm password
            if (!confirm) {

                confirmPasswordError.textContent =
                    "Please confirm your password.";

                confirmPassword.classList.add("input-invalid");

                isValid = false;

            } else if (password !== confirm) {

                confirmPasswordError.textContent =
                    "Passwords do not match.";

                confirmPassword.classList.add("input-invalid");

                isValid = false;

            }


            // Validate terms
            if (!acceptTerms.checked) {

                termsError.textContent =
                    "Please accept the terms and privacy policy.";

                acceptTerms.classList.add("input-invalid");

                isValid = false;

            }


            // Stop if any field is invalid
            if (!isValid) {

                registerMessage.textContent =
                    "Please check the details above.";

                registerMessage.classList.add("error");

                const firstInvalid = registerForm.querySelector(
                    ".input-invalid"
                );

                firstInvalid?.focus();

                return;

            }


            /*
             * FRONTEND DEMO ONLY
             *
             * No account is saved or created here.
             * A backend/authentication service is required
             * to securely register and store real accounts.
             */

            registerMessage.textContent =
                "Your details are valid. Connect an authentication service to create your account.";

            registerMessage.classList.add("success");

        });

    }


    // ==========================================
    // INITIAL PAGE STATE
    // ==========================================

    if (registerForm) {
        registerForm.classList.remove("active-form");
    }

    if (loginForm) {
        loginForm.classList.remove("hidden-form");
    }

    updateSelectedRole("admin");

});

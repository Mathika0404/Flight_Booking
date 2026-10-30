
document.addEventListener("DOMContentLoaded", () => {

    const preloader = document.getElementById("preloader");
    const loaderProgress = document.getElementById("loaderProgress");
    const loaderPercent = document.getElementById("loaderPercent");
    const loaderText = document.getElementById("loaderText");

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    const flightForm = document.getElementById("flightForm");
    const swapCities = document.getElementById("swapCities");

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==============================
    // PRELOADER ANIMATION
    // ==============================

    if (preloader) {
        document.body.classList.add("loading");

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const loadingDuration = reducedMotion ? 500 : 2200;
        const startTime = performance.now();

        const loadingMessages = [
            "Preparing your journey...",
            "Exploring destinations...",
            "Getting everything ready...",
            "Welcome aboard!"
        ];

        let preloaderFinished = false;

        function finishPreloader() {
            if (preloaderFinished) return;

            preloaderFinished = true;

            if (loaderProgress) {
                loaderProgress.style.width = "100%";
            }

            if (loaderPercent) {
                loaderPercent.textContent = "100%";
            }

            if (loaderText) {
                loaderText.textContent = "Welcome aboard!";
            }

            setTimeout(() => {
                preloader.classList.add("hide");
                document.body.classList.remove("loading");

                document.querySelectorAll(".hero .reveal")
                    .forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add("visible");
                        }, index * 140);
                    });

            }, reducedMotion ? 0 : 250);
        }

        function animateLoader(now) {
            if (preloaderFinished) return;

            const elapsed = now - startTime;
            const progress = Math.min(
                elapsed / loadingDuration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 3);
            const percent = Math.round(eased * 100);

            if (loaderProgress) {
                loaderProgress.style.width = percent + "%";
            }

            if (loaderPercent) {
                loaderPercent.textContent = percent + "%";
            }

            const messageIndex = Math.min(
                Math.floor(progress * loadingMessages.length),
                loadingMessages.length - 1
            );

            if (loaderText) {
                loaderText.textContent =
                    loadingMessages[messageIndex];
            }

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                finishPreloader();
            }
        }

        requestAnimationFrame(animateLoader);
    }

    // ==============================
    // NAVBAR SCROLL EFFECT
    // ==============================

    function updateHeader() {
        if (header) {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 40
            );
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    // ==============================
    // MOBILE NAVIGATION - FIXED
    // ==============================

    function closeMenu() {
        if (!navLinks || !menuToggle) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = !navLinks.classList.contains("open");

            navLinks.classList.toggle("open", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        navLinks.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function (event) {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    // ==============================
    // SCROLL REVEAL ANIMATIONS
    // ==============================

    const revealElements = document.querySelectorAll(
        ".reveal:not(.hero .reveal)"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element, index) => {
            element.style.transitionDelay =
                `${(index % 4) * 90}ms`;

            revealObserver.observe(element);
        });

    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }



    // ==============================
    // ACTIVE NAV LINK - CURRENT PAGE
    // ==============================

    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    navItems.forEach(link => {
        const linkPage = link.getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        link.classList.toggle("active", linkPage === currentPage);
    });



    // ==============================
    // SWAP DEPARTURE AND ARRIVAL
    // ==============================

    if (swapCities && flightForm) {
        swapCities.addEventListener("click", () => {
            const fromInput = flightForm.elements.from;
            const toInput = flightForm.elements.to;

            const previousFrom = fromInput.value;

            fromInput.value = toInput.value;
            toInput.value = previousFrom;
        });
    }

    // ==============================
    // MINIMUM DEPARTURE DATE
    // ==============================

    if (flightForm && flightForm.elements.departure) {
        const departureInput = flightForm.elements.departure;

        const today = new Date();

        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        departureInput.min = localToday;
    }

    // ==============================
    // FLIGHT SEARCH -> 404 PAGE
    // ==============================

    if (flightForm) {
        flightForm.addEventListener("submit", event => {
            event.preventDefault();

            const from = flightForm.elements.from.value.trim();
            const to = flightForm.elements.to.value.trim();
            const departure =
                flightForm.elements.departure.value;

            if (from.toLowerCase() === to.toLowerCase()) {
                alert(
                    "Departure and arrival cities must be different!"
                );
                return;
            }

            if (!departure) {
                alert("Please select your departure date.");
                return;
            }

            // Open 404 page after valid form submission
            window.location.href = "404.html";
        });
    }

    /* ==========================================
   TRAVEL JOURNAL SCROLL ANIMATIONS
========================================== */

const journalItems = document.querySelectorAll(
    "#blogs .journal-reveal"
);

if (journalItems.length) {

    if ("IntersectionObserver" in window) {

        const journalObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("journal-visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }
        );

        journalItems.forEach((item) => {
            journalObserver.observe(item);
        });

    } else {

        journalItems.forEach((item) => {
            item.classList.add("journal-visible");
        });

    }

}


/* SKYTRIP DESTINATIONS INTERACTIONS */

// Scroll reveal animation
const destinationRevealItems = document.querySelectorAll(
    "#destinations .reveal-destination"
);

if ("IntersectionObserver" in window) {
    const destinationObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    destinationRevealItems.forEach((item) => {
        destinationObserver.observe(item);
    });
} else {
    destinationRevealItems.forEach((item) => {
        item.classList.add("is-visible");
    });
}

// Favorite destination buttons
document.querySelectorAll(
    "#destinations .destination-favorite"
).forEach((button) => {
    button.addEventListener("click", () => {
        const isFavorite =
            button.getAttribute("aria-pressed") === "true";

        button.setAttribute(
            "aria-pressed",
            String(!isFavorite)
        );

        const icon = button.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-solid", !isFavorite);
            icon.classList.toggle("fa-regular", isFavorite);
        }
    });
});

/* CONTACT SECTION SCROLL ANIMATION */

const contactElements = document.querySelectorAll(
    "#contact .reveal-contact"
);

if ("IntersectionObserver" in window) {

    const contactObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("contact-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    contactElements.forEach((element) => {
        contactObserver.observe(element);
    });

} else {
    contactElements.forEach((element) => {
        element.classList.add("contact-visible");
    });
}

});

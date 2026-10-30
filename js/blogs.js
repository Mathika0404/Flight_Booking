/* SKYTRIP — PRELOADER + HEADER/NAVIGATION + FOOTER ONLY
   Section-specific interactions and animations intentionally excluded. */

document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const loaderProgress = document.getElementById("loaderProgress");
    const loaderPercent = document.getElementById("loaderPercent");
    const loaderText = document.getElementById("loaderText");

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");
    const yearElement = document.getElementById("year");

    /* Footer copyright year */
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* Preloader */
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

            if (loaderProgress) loaderProgress.style.width = "100%";
            if (loaderPercent) loaderPercent.textContent = "100%";
            if (loaderText) loaderText.textContent = "Welcome aboard!";

            setTimeout(() => {
                preloader.classList.add("hide");
                document.body.classList.remove("loading");
            }, reducedMotion ? 0 : 250);
        }

        function animateLoader(now) {
            if (preloaderFinished) return;
            const progress = Math.min((now - startTime) / loadingDuration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const percent = Math.round(eased * 100);

            if (loaderProgress) loaderProgress.style.width = percent + "%";
            if (loaderPercent) loaderPercent.textContent = percent + "%";

            const messageIndex = Math.min(
                Math.floor(progress * loadingMessages.length),
                loadingMessages.length - 1
            );
            if (loaderText) loaderText.textContent = loadingMessages[messageIndex];

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                finishPreloader();
            }
        }
        requestAnimationFrame(animateLoader);
    }

    /* Header scroll background */
    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 40);
        }
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* Mobile navigation */
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

        navLinks.addEventListener("click", event => event.stopPropagation());

        document.addEventListener("click", event => {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) closeMenu();
        });
    }

    /* Highlight current page link */
    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    navItems.forEach(link => {
        const href = link.getAttribute("href") || "";
        const linkPage = href.split("/").pop().toLowerCase();
        link.classList.toggle("active", linkPage === currentPage);
    });
    /* FEATURED BLOGS — SCROLL REVEAL */

const blogRevealItems = document.querySelectorAll(
    ".sky-featured-blogs .blog-reveal"
);

if (blogRevealItems.length) {
    const blogRevealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("blog-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    blogRevealItems.forEach((item) => {
        blogRevealObserver.observe(item);
    });
}

/* KEYBOARD ACCESSIBILITY */
document.querySelectorAll(".sky-blog-card").forEach((card) => {
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            window.location.href = "404.html";
        }
    });
});

/* SKYTRIP INSPIRATION — REVEAL ON SCROLL */

const inspirationElements = document.querySelectorAll(
    ".sky-inspiration .inspiration-reveal"
);

if ("IntersectionObserver" in window) {
    const inspirationObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("inspiration-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    inspirationElements.forEach((element) => {
        inspirationObserver.observe(element);
    });
} else {
    inspirationElements.forEach((element) => {
        element.classList.add("inspiration-visible");
    });
}

/* SKYTRIP JOURNAL — REVEAL ON SCROLL */

const journalRevealElements = document.querySelectorAll(
    ".sky-journal .journal-reveal"
);

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
            rootMargin: "0px 0px -30px 0px"
        }
    );

    journalRevealElements.forEach((element) => {
        journalObserver.observe(element);
    });
} else {
    journalRevealElements.forEach((element) => {
        element.classList.add("journal-visible");
    });
}

/* DESTINATION CARDS — SCROLL REVEAL */

const destinationRevealItems = document.querySelectorAll(
    ".sky-destination-section .destination-reveal"
);

if ("IntersectionObserver" in window) {
    const destinationObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("destination-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    destinationRevealItems.forEach((item) => {
        destinationObserver.observe(item);
    });
} else {
    destinationRevealItems.forEach((item) => {
        item.classList.add("destination-visible");
    });
}
});

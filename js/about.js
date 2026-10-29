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

    
/* ==========================================
   SKYTRIP ABOUT HERO — ANIMATION CONTROLLER
   Add inside the existing DOMContentLoaded
========================================== */

/* 1. About hero elements */
const aboutHero = document.querySelector(".about-hero");
const aboutBackground = document.querySelector(".about-hero-bg");
const aboutContent = document.querySelector(".about-hero-content");
const aboutVisual = document.querySelector(".about-hero-visual");
const aboutPlane = document.querySelector(".about-plane-circle");
const aboutCards = document.querySelectorAll(".about-floating-card");
const aboutButtons = document.querySelectorAll(
    ".about-hero-btn, .about-hero-link"
);

const aboutReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* 2. Reveal hero content in sequence */
if (aboutHero) {
    const revealTargets = [
        ".about-eyebrow",
        ".about-hero-content h1",
        ".about-hero-content > p",
        ".about-hero-buttons",
        ".about-hero-bottom-info"
    ];

    revealTargets.forEach((selector, index) => {
        const element = aboutHero.querySelector(selector);
        if (!element) return;

        element.classList.add("about-js-reveal");

        if (!aboutReducedMotion) {
            element.style.setProperty(
                "--about-reveal-delay",
                `${index * 160}ms`
            );
        } else {
            element.classList.add("about-js-visible");
        }
    });

    if (!aboutReducedMotion) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aboutHero.querySelectorAll(".about-js-reveal")
                    .forEach(element => {
                        element.classList.add("about-js-visible");
                    });
            });
        });
    }
}


/* 3. Scroll reveal for story section */
const aboutStory = document.querySelector(".about-story");

if (aboutStory && !aboutReducedMotion &&
    "IntersectionObserver" in window) {

    const storyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("about-story-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18
    });

    storyObserver.observe(aboutStory);
} else if (aboutStory) {
    aboutStory.classList.add("about-story-visible");
}


/* 4. Background parallax on scroll */
let aboutScrollTicking = false;

function updateAboutScrollEffects() {
    if (!aboutHero || aboutReducedMotion) {
        aboutScrollTicking = false;
        return;
    }

    const rect = aboutHero.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom > 0 && rect.top < viewportHeight) {
        const scrollOffset = Math.max(0, -rect.top);

        if (aboutBackground) {
            aboutBackground.style.setProperty(
                "--about-scroll-y",
                `${Math.min(scrollOffset * 0.12, 70)}px`
            );
        }

        if (aboutContent) {
            aboutContent.style.setProperty(
                "--about-content-y",
                `${Math.min(scrollOffset * 0.04, 22)}px`
            );
        }
    }

    aboutScrollTicking = false;
}

window.addEventListener("scroll", () => {
    if (aboutScrollTicking) return;

    aboutScrollTicking = true;
    requestAnimationFrame(updateAboutScrollEffects);
}, { passive: true });


/* 5. Mouse-follow movement on desktop */
if (aboutHero && aboutVisual &&
    !aboutReducedMotion &&
    window.matchMedia("(pointer: fine)").matches) {

    let mouseFrame = null;

    aboutHero.addEventListener("pointermove", event => {
        if (mouseFrame) cancelAnimationFrame(mouseFrame);

        mouseFrame = requestAnimationFrame(() => {
            const rect = aboutHero.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            aboutVisual.style.setProperty(
                "--about-mouse-x",
                `${x * 15}px`
            );

            aboutVisual.style.setProperty(
                "--about-mouse-y",
                `${y * 15}px`
            );

            if (aboutPlane) {
                aboutPlane.style.setProperty(
                    "--about-plane-x",
                    `${x * 9}px`
                );

                aboutPlane.style.setProperty(
                    "--about-plane-y",
                    `${y * 9}px`
                );
            }
        });
    });

    aboutHero.addEventListener("pointerleave", () => {
        aboutVisual.style.setProperty("--about-mouse-x", "0px");
        aboutVisual.style.setProperty("--about-mouse-y", "0px");

        if (aboutPlane) {
            aboutPlane.style.setProperty("--about-plane-x", "0px");
            aboutPlane.style.setProperty("--about-plane-y", "0px");
        }
    });
}


/* 6. Floating cards react gently to pointer movement */
if (aboutHero && aboutCards.length &&
    !aboutReducedMotion &&
    window.matchMedia("(pointer: fine)").matches) {

    aboutHero.addEventListener("pointermove", event => {
        const rect = aboutHero.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        aboutCards.forEach((card, index) => {
            const direction = index === 0 ? 1 : -1;

            card.style.setProperty(
                "--about-card-x",
                `${x * 9 * direction}px`
            );

            card.style.setProperty(
                "--about-card-y",
                `${y * 7 * direction}px`
            );
        });
    });

    aboutHero.addEventListener("pointerleave", () => {
        aboutCards.forEach(card => {
            card.style.setProperty("--about-card-x", "0px");
            card.style.setProperty("--about-card-y", "0px");
        });
    });
}


/* 7. Button ripple effect */
if (!aboutReducedMotion) {
    aboutButtons.forEach(button => {
        button.addEventListener("pointerdown", event => {
            const rect = button.getBoundingClientRect();

            const ripple = document.createElement("span");
            ripple.className = "about-click-ripple";

            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;

            button.appendChild(ripple);

            ripple.addEventListener("animationend", () => {
                ripple.remove();
            }, { once: true });
        });
    });
}


/* 8. Smooth scroll to the story section */
document.querySelectorAll(
    '.about-hero a[href="#about-story"]'
).forEach(link => {
    link.addEventListener("click", event => {
        const target = document.getElementById("about-story");

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: aboutReducedMotion ? "auto" : "smooth",
            block: "start"
        });
    });
});


/* 9. Animate story section heading and paragraph */
if (aboutStory) {
    const storyItems = aboutStory.querySelectorAll(
        "h2, p"
    );

    storyItems.forEach((item, index) => {
        item.classList.add("about-story-item");

        if (!aboutReducedMotion) {
            item.style.transitionDelay = `${index * 180}ms`;
        } else {
            item.classList.add("about-story-item-visible");
        }
    });

    if (aboutStory.classList.contains("about-story-visible")) {
        storyItems.forEach(item => {
            item.classList.add("about-story-item-visible");
        });
    }

    if (aboutStory && "IntersectionObserver" in window &&
        !aboutReducedMotion) {

        const storyItemsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "about-story-item-visible"
                    );
                    storyItemsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        storyItems.forEach(item => storyItemsObserver.observe(item));
    }
}

/* =====================================
   ABOUT STORY — SCROLL ANIMATIONS
===================================== */

const storySection = document.querySelector(".story-section");

if (storySection) {
    const storyRevealItems = storySection.querySelectorAll(".story-reveal");

    const storyRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("story-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    storyRevealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index % 4, 3) * 100}ms`;
        storyRevealObserver.observe(item);
    });

    const storyActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                storySection.classList.add("story-active");
            }
        });
    }, {
        threshold: 0.15
    });

    storyActiveObserver.observe(storySection);

    /* Animated counters */
    const storyCounters = storySection.querySelectorAll(".story-counter");
    let storyCountersStarted = false;

    const startStoryCounters = () => {
        if (storyCountersStarted) return;
        storyCountersStarted = true;

        storyCounters.forEach((counter) => {
            const target = Number(counter.dataset.target);

            if (!Number.isFinite(target)) return;

            const duration = 1800;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 4);

                counter.textContent = Math.floor(target * easedProgress);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    const storyCounterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startStoryCounters();
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.4
    });

    const statsContainer = storySection.querySelector(".story-stats");

    if (statsContainer) {
        storyCounterObserver.observe(statsContainer);
    }
}

/* SKYTRIP PURPOSE SECTION ANIMATION */

const purposeCards = document.querySelectorAll(".sky-purpose-card");

if (purposeCards.length) {
    const purposeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("purpose-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px"
    });

    purposeCards.forEach((card) => {
        purposeObserver.observe(card);
    });
}

/* WHY SKYTRIP — SCROLL REVEAL */

const whySkytrip = document.querySelector(".sky-why");

if (whySkytrip) {
    const whyItems = whySkytrip.querySelectorAll(
        ".sky-why-item, .sky-why-highlights"
    );

    const whyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("why-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    whyItems.forEach((item) => {
        whyObserver.observe(item);
    });
}

/* DESTINATION SECTION SCROLL ANIMATION */

const destinationElements = document.querySelectorAll(
    ".sky-destinations .destination-reveal"
);

if (destinationElements.length) {
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

    destinationElements.forEach((element) => {
        destinationObserver.observe(element);
    });
}

/* Keyboard accessibility for destination cards */
document.querySelectorAll(".sky-destination-card").forEach((card) => {
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            window.location.href = "404.html";
        }
    });
});
});



document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const sidebar = $('#sidebar'), overlay = $('#sidebarOverlay'), menuToggle = $('#menuToggle');
  const dashboardSection = $('#dashboardSection'), otherSection = $('#otherSection');
  const displayName = (email) => {
    if (!email || !email.includes('@')) return 'Admin';
    const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    return base.split(/\s+/).map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' ') || 'Admin';
  };

  // Read common storage keys; login.js below stores skytripEmail as the canonical key.
  const storedEmail = localStorage.getItem('skytripEmail') || sessionStorage.getItem('skytripEmail') || localStorage.getItem('loggedInEmail') || sessionStorage.getItem('loggedInEmail') || localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || localStorage.getItem('email') || sessionStorage.getItem('email') || '';
  const email = storedEmail.trim();
  const name = displayName(email);
  $('#sideName').textContent = name;
  $('#sideEmail').textContent = email || 'Admin account';
  $('#topName').textContent = name;
  $('#welcomeName').textContent = name.split(' ')[0] || 'Admin';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'A';
  $('#sideAvatar').textContent = initials;
  $('#topAvatar').textContent = initials;
  $('#currentYear').textContent = new Date().getFullYear();
  $('#todayDate').textContent = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

  // Mobile sidebar handlers are registered only once.
  const closeSidebar = () => {
    sidebar?.classList.remove('sidebar-open');
    overlay?.classList.remove('show', 'active');
    document.body.classList.remove('menu-open');
  };

  const openSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.add('sidebar-open');
    overlay?.classList.add('show', 'active');
    document.body.classList.add('menu-open');
  };

  menuToggle?.addEventListener('click', event => {
    event.preventDefault();
    sidebar?.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
  });

  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSidebar();
  });

  // Animated reveal and KPI counters.
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });

  $$('.reveal').forEach(element => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 1300;
    const start = performance.now();

    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('en-IN');

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  }), { threshold: 0.4 });

  $$('.counter').forEach(counter => counterObserver.observe(counter));

  // Search filters the visible recent-booking rows.
  const searchInput = $('#bookingSearch');
  const rows = $$('#bookingRows tr');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let count = 0;

    rows.forEach(row => {
      const matches = row.textContent.toLowerCase().includes(query);
      row.hidden = !matches;
      if (matches) count++;
    });

    const showingCount = $('#showingCount');
    const emptyState = $('#emptyState');

    if (showingCount) showingCount.textContent = count;
    if (emptyState) emptyState.hidden = count !== 0;
  });

  function toast(message) {
    const element = $('#toast');
    const toastText = $('#toastText');

    if (!element || !toastText) return;

    toastText.textContent = message;
    element.classList.add('show');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => element.classList.remove('show'), 2600);
  }

  $('#newBookingBtn')?.addEventListener('click', () => toast('Booking creation can be connected to your booking form.'));
  $('#notificationBtn')?.addEventListener('click', () => toast('You are all caught up on notifications.'));
  $('#profileTrigger')?.addEventListener('click', () => toast(email || 'Signed in as Admin'));
  $('#filterBtn')?.addEventListener('click', () => {
    searchInput?.focus();
    toast('Type a passenger name, email, flight, or booking ID to filter.');
  });

  $('#chartRange')?.addEventListener('change', event => {
    const chart = $('.line-chart');

    if (chart) {
      chart.style.opacity = '.3';
      setTimeout(() => {
        chart.style.opacity = '1';
        chart.style.transition = 'opacity .35s';
      }, 120);
    }

    toast(`Showing the ${event.target.selectedOptions[0].text.toLowerCase()} view.`);
  });

  // Export handler intentionally remains disabled.
  // $('#exportBtn')?.addEventListener('click', () => { ... });

  $$('.row-more').forEach((button, index) => {
    button.addEventListener('click', () => {
      toast(`Booking ${rows[index]?.querySelector('.booking-id')?.textContent || ''} selected.`);
    });
  });

  $$('.pagination button:not(:disabled)').forEach(button => {
    button.addEventListener('click', () => {
      $$('.pagination button').forEach(item => item.classList.remove('page-current'));
      if (/^\d+$/.test(button.textContent.trim())) button.classList.add('page-current');
      toast('Demo pagination: sample bookings are displayed.');
    });
  });

  const preloader = $('#preloader');

  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-hidden'), 700);
    });

    setTimeout(() => preloader.classList.add('is-hidden'), 2200);
  }
});


/* All booking buttons navigate to 404 */
function go404() {
  window.location.href = "dashboard-404.html";
}


/* Animated statistic counters */
function animateBookingCounters() {
  document.querySelectorAll("#bookingsSection .booking-counter").forEach(counter => {
    const target = Number(counter.dataset.value || 0);
    const duration = 1200;
    const startTime = performance.now();

    function updateCounter(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = Math.round(target * eased).toLocaleString("en-IN");

      if (progress < 1) requestAnimationFrame(updateCounter);
    }

    requestAnimationFrame(updateCounter);
  });
}


/* Search and status filter */
function filterBookingRows() {
  const search = document.getElementById("bookingManagerSearch");
  const filter = document.getElementById("bookingStatusFilter");
  const rows = document.querySelectorAll("#bookingManagerRows tr");
  const noResults = document.getElementById("bookingNoResults");

  const query = (search?.value || "").toLowerCase().trim();
  const status = filter?.value || "all";
  let visible = 0;

  rows.forEach(row => {
    const matchesText = row.textContent.toLowerCase().includes(query);
    const matchesStatus = status === "all" || row.dataset.status === status;
    const show = matchesText && matchesStatus;

    row.hidden = !show;
    if (show) visible++;
  });

  if (noResults) noResults.hidden = visible !== 0;
}

document.getElementById("bookingManagerSearch")
  ?.addEventListener("input", filterBookingRows);

document.getElementById("bookingStatusFilter")
  ?.addEventListener("change", filterBookingRows);


/* Passenger search and filters */
function filterPassengerRows() {
  const searchInput = document.getElementById("passengerSearch");
  const tierFilter = document.getElementById("passengerTierFilter");
  const statusFilter = document.getElementById("passengerStatusFilter");
  const tableBody = document.getElementById("passengerTableRows");
  const emptyState = document.getElementById("passengerEmpty");
  const resultCount = document.getElementById("passengerResultCount");

  if (!tableBody) return;

  const searchText = (searchInput?.value || "").trim().toLowerCase();
  const selectedTier = tierFilter?.value || "all";
  const selectedStatus = statusFilter?.value || "all";

  const rows = Array.from(tableBody.querySelectorAll("tr"));
  let visibleCount = 0;

  rows.forEach(row => {
    const matchesSearch = row.textContent.toLowerCase().includes(searchText);
    const matchesTier = selectedTier === "all" || row.dataset.tier === selectedTier;
    const matchesStatus = selectedStatus === "all" || row.dataset.status === selectedStatus;
    const isVisible = matchesSearch && matchesTier && matchesStatus;

    row.hidden = !isVisible;
    if (isVisible) visibleCount++;
  });

  if (emptyState) emptyState.hidden = visibleCount !== 0;

  if (resultCount) {
    resultCount.textContent =
      `Showing ${visibleCount} sample passenger${visibleCount === 1 ? "" : "s"}`;
  }
}

document.getElementById("passengerSearch")
  ?.addEventListener("input", filterPassengerRows);

document.getElementById("passengerTierFilter")
  ?.addEventListener("change", filterPassengerRows);

document.getElementById("passengerStatusFilter")
  ?.addEventListener("change", filterPassengerRows);


/* Second DOMContentLoaded handles navigation and the remaining dashboard features. */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const menuToggle = $("#menuToggle");

  /* ADMIN PROFILE / DATE */
  function displayName(email) {
    if (!email || !email.includes("@")) return "Admin";

    const base = email.split("@")[0].replace(/[._-]+/g, " ").trim();

    return base
      .split(/\s+/)
      .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
      .join(" ") || "Admin";
  }

  const storedEmail =
    localStorage.getItem("skytripEmail") ||
    sessionStorage.getItem("skytripEmail") ||
    localStorage.getItem("loggedInEmail") ||
    sessionStorage.getItem("loggedInEmail") ||
    localStorage.getItem("userEmail") ||
    sessionStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    sessionStorage.getItem("email") ||
    "";

  const email = storedEmail.trim();
  const name = displayName(email);

  const sideName = $("#sideName");
  const sideEmail = $("#sideEmail");
  const topName = $("#topName");
  const welcomeName = $("#welcomeName");
  const sideAvatar = $("#sideAvatar");
  const topAvatar = $("#topAvatar");
  const currentYear = $("#currentYear");
  const todayDate = $("#todayDate");

  if (sideName) sideName.textContent = name;
  if (sideEmail) sideEmail.textContent = email || "Admin account";
  if (topName) topName.textContent = name;
  if (welcomeName) welcomeName.textContent = name.split(" ")[0] || "Admin";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "A";

  if (sideAvatar) sideAvatar.textContent = initials;
  if (topAvatar) topAvatar.textContent = initials;
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  if (todayDate) {
    todayDate.textContent = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }

  // IMPORTANT: Do not add another sidebar click handler here.
  // The first DOMContentLoaded block already registers it.

    // Used by section navigation to close the mobile sidebar.
    const closeSidebar = () => {
        sidebar?.classList.remove("sidebar-open");
        overlay?.classList.remove("show", "active");
        document.body.classList.remove("menu-open");
    };

    /* =========================================
       UNIFIED SECTION NAVIGATION
    ========================================= */

    const sectionMap = {
        dashboard: "dashboardSection",
        bookings: "bookingsSection",
        flights: "flightsSection",
        passengers: "passengersSection",
        reports: "reportsSection",
        settings: "otherSection",
        payments: "otherSection"
    };

    const sectionInfo = {
        dashboard: {
            title: "Dashboard",
            description: "Your flight operations overview."
        },

        bookings: {
            title: "Bookings",
            description:
                "Review reservations, passenger details, payment status, and booking changes."
        },

        flights: {
            title: "Flights",
            description:
                "Manage flight schedules, routes, aircraft details, and departure status."
        },

        passengers: {
            title: "Passengers",
            description:
                "Review passenger profiles and manage traveller information."
        },

        reports: {
            title: "Reports",
            description:
                "Review booking performance and revenue analytics."
        },

        settings: {
            title: "Settings",
            description:
                "Manage your SkyTrip admin workspace preferences."
        },

        payments: {
            title: "Payments",
            description:
                "Track transactions, refunds, and payment summaries."
        }
    };

    function navigateToSection(sectionName) {
        const targetId = sectionMap[sectionName];

        const targetSection = targetId
            ? document.getElementById(targetId)
            : null;

        if (!targetSection) {
            console.error(
                `Cannot navigate to "${sectionName}". ` +
                `Section "${targetId}" was not found in the HTML.`
            );
            return;
        }

        // Hide all sections first.
        $$(".main-area .page-content, .main-area .placeholder-page")
            .forEach(section => {
                section.hidden = true;
                section.style.display = "";
            });

        // Show only the selected section.
        targetSection.hidden = false;
        targetSection.style.display = "";

        // Update active sidebar menu.
        $$(".sidebar .nav-link[data-section]").forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.section === sectionName
            );
        });

        const info = sectionInfo[sectionName] || sectionInfo.dashboard;
        const breadcrumb = $("#breadcrumbTitle");

        if (breadcrumb) {
            breadcrumb.textContent = info.title;
        }

        // Settings and Payments use the existing placeholder.
        if (targetId === "otherSection") {
            const otherTitle = $("#otherTitle");
            const otherDescription = $("#otherDescription");

            if (otherTitle) {
                otherTitle.textContent = info.title;
            }

            if (otherDescription) {
                otherDescription.textContent = info.description;
            }
        }

        closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (sectionName === "bookings") {
            animateCounters(
                "#bookingsSection .booking-counter",
                "value"
            );
        }

        if (sectionName === "flights") {
            animateCounters(
                "#flightsSection .flight-counter",
                "value"
            );
        }

        if (sectionName === "passengers") {
            filterPassengerRows();
        }
    }

    // One navigation handler for all sidebar items.
    document.addEventListener("click", event => {
        const navLink = event.target.closest(
            ".nav-link[data-section]"
        );

        if (navLink && navLink.closest(".sidebar")) {
            event.preventDefault();
            navigateToSection(navLink.dataset.section);
            return;
        }

        const jumpButton = event.target.closest(
            "[data-section-jump]"
        );

        if (jumpButton) {
            event.preventDefault();

            navigateToSection(
                jumpButton.dataset.sectionJump
            );
        }
    });

    $("#backDashboard")?.addEventListener("click", () => {
        navigateToSection("dashboard");
    });

    window.navigateToSection = navigateToSection;

    /* =========================================
       REVEAL ANIMATIONS
    ========================================= */

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        $$(".reveal").forEach(element => {
            revealObserver.observe(element);
        });

        const counterObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const counter = entry.target;
                    const target = Number(
                        counter.dataset.count || 0
                    );

                    const duration = 1300;
                    const start = performance.now();

                    function update(now) {
                        const progress = Math.min(
                            (now - start) / duration,
                            1
                        );

                        const eased =
                            1 - Math.pow(1 - progress, 4);

                        counter.textContent = Math.round(
                            target * eased
                        ).toLocaleString("en-IN");

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }

                    requestAnimationFrame(update);
                    counterObserver.unobserve(counter);
                });
            },
            { threshold: 0.4 }
        );

        $$(".counter").forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /* =========================================
       TOAST NOTIFICATIONS
    ========================================= */

    function showToast(message, type = "success") {
        let toastContainer = $("#toastContainer");

        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toastContainer";

            Object.assign(toastContainer.style, {
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: "99999",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            });

            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `skytrip-toast ${type}`;
        toast.textContent = message;

        Object.assign(toast.style, {
            padding: "14px 20px",
            borderRadius: "10px",
            background: type === "error" ? "#b42318" : "#061638",
            color: "#ffffff",
            boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
            fontSize: "14px",
            maxWidth: "320px",
            opacity: "0",
            transform: "translateX(20px)",
            transition: "opacity .25s ease, transform .25s ease"
        });

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(20px)";

            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.showToast = showToast;

    /* =========================================
       BOOKINGS SEARCH
    ========================================= */

    const bookingSearch = $(
        "#bookingSearch, #searchBookings, [data-search='bookings']"
    );

    function filterBookingRows() {
        const searchInput = $(
            "#bookingSearch, #searchBookings, [data-search='bookings']"
        );

        const query = searchInput?.value
            ?.trim()
            .toLowerCase() || "";

        const rows = $$("#bookingsSection tbody tr");

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? "" : "none";
        });
    }

    bookingSearch?.addEventListener("input", filterBookingRows);

        /* =========================================
       FLIGHT SEARCH
    ========================================= */

    const flightSearch = $(
        "#flightSearch, #searchFlights, [data-search='flights']"
    );

    function filterFlightRows() {
        const searchInput = $(
            "#flightSearch, #searchFlights, [data-search='flights']"
        );

        const query = searchInput?.value?.trim().toLowerCase() || "";
        const rows = $$("#flightsSection tbody tr");

        rows.forEach(row => {
            row.style.display =
                row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    }

    flightSearch?.addEventListener("input", filterFlightRows);


    /* =========================================
       PASSENGER SEARCH
    ========================================= */

    const passengerSearch = $(
        "#passengerSearch, #searchPassengers, [data-search='passengers']"
    );

    function filterPassengerRows() {
        const searchInput = $(
            "#passengerSearch, #searchPassengers, [data-search='passengers']"
        );

        const query = searchInput?.value?.trim().toLowerCase() || "";
        const rows = $$("#passengersSection tbody tr");

        rows.forEach(row => {
            row.style.display =
                row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    }

    passengerSearch?.addEventListener("input", filterPassengerRows);


    /* =========================================
       GENERIC STATUS FILTERS
    ========================================= */

    $$("[data-filter-section]").forEach(filter => {
        filter.addEventListener("change", () => {
            const sectionName = filter.dataset.filterSection;
            const sectionId = sectionMap[sectionName];
            const section = sectionId
                ? document.getElementById(sectionId)
                : null;

            if (!section) return;

            const selectedStatus = filter.value.trim().toLowerCase();
            const rows = $$("tbody tr", section);

            rows.forEach(row => {
                if (
                    !selectedStatus ||
                    selectedStatus === "all" ||
                    selectedStatus === "all status"
                ) {
                    row.style.display = "";
                    return;
                }

                row.style.display =
                    row.textContent.toLowerCase().includes(selectedStatus)
                        ? ""
                        : "none";
            });
        });
    });


    /* =========================================
       COUNTER ANIMATION HELPER
    ========================================= */

    function animateCounters(selector, dataAttribute = "count") {
        const elements = $$(selector);

        elements.forEach(element => {
            const rawValue =
                element.dataset[dataAttribute] ||
                element.dataset.count ||
                element.textContent.replace(/,/g, "").trim();

            const target = Number(rawValue);
            if (!Number.isFinite(target)) return;

            const duration = 1000;
            const startTime = performance.now();

            function step(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                element.textContent = Math.round(
                    target * eased
                ).toLocaleString("en-IN");

                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        });
    }

    window.animateCounters = animateCounters;


    /* =========================================
       CLEAR SEARCH WHEN RESET IS CLICKED
    ========================================= */

    document.addEventListener("click", event => {
        const resetButton = event.target.closest("[data-reset-search]");
        if (!resetButton) return;

        const inputSelector = resetButton.dataset.resetSearch;
        const input = inputSelector ? $(inputSelector) : null;

        if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    });


    /* =========================================
       INITIAL COUNTER / FILTER SETUP
    ========================================= */

    if (bookingSearch) filterBookingRows();
    if (flightSearch) filterFlightRows();
    if (passengerSearch) filterPassengerRows();


    /* =========================================
       404 PAGE NAVIGATION
    ========================================= */

    window.go404 = function () {
        window.location.href = "dashboard-404.html";
    };

    $$("[data-go-404]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            window.location.href = "dashboard-404.html";
        });
    });


    /* =========================================
       EXIT / LOGOUT
    ========================================= */

    const exitButton = $(
        "#logoutBtn, #exitBtn, [data-action='logout']"
    );

    exitButton?.addEventListener("click", event => {
        event.preventDefault();

        const confirmed = window.confirm("Are you sure you want to exit?");
        if (!confirmed) return;

        window.location.href = "index.html";
    });


    /* =========================================
       PRELOADER
    ========================================= */

    const preloader = $(
        "#preloader, #pageLoader, .page-loader, .preloader"
    );

    if (preloader) {
        const finishPreloader = () => {
            preloader.classList.add("loaded", "hidden");
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            preloader.style.pointerEvents = "none";
            document.body.classList.remove("loading");
        };

        document.body.classList.add("loading");

        window.addEventListener("load", () => {
            setTimeout(finishPreloader, 500);
        }, { once: true });

        if (document.readyState === "complete") {
            setTimeout(finishPreloader, 500);
        }
    }


    /* =========================================
       GENERAL BUTTON FEEDBACK
    ========================================= */

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-toast-message]");
        if (!button) return;

        const message = button.dataset.toastMessage || "Action completed.";
        const type = button.dataset.toastType || "success";

        showToast(message, type);
    });


    /* =========================================
       INITIAL DASHBOARD STATE
    ========================================= */

    const activeLink = $(
        ".sidebar .nav-link[data-section].active"
    );

    const visibleSection = $(
        ".main-area .page-content:not([hidden]), " +
        ".main-area .placeholder-page:not([hidden])"
    );

    if (activeLink) {
        const sectionName = activeLink.dataset.section;

        if (!visibleSection) {
            navigateToSection(sectionName || "dashboard");
        }
    } else {
        navigateToSection("dashboard");
    }

});
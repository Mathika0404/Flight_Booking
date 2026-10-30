
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const menuToggle = $("#menuToggle");
  const preloader = $("#preloader");

  /* =========================================
     USER PROFILE / ACCOUNT DETAILS
  ========================================= */

  function getStoredValue(keys) {
    for (const key of keys) {
      const value =
        localStorage.getItem(key) ||
        sessionStorage.getItem(key);

      if (value && value.trim()) return value.trim();
    }

    return "";
  }

  const email = getStoredValue([
    "skytripEmail",
    "loggedInEmail",
    "userEmail",
    "email"
  ]);

  const savedProfileName = localStorage.getItem("skytripProfileName") || "";

  function nameFromEmail(value) {
    if (!value || !value.includes("@")) return "Traveller";

    return value
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim()
      .split(/\s+/)
      .map(word => word
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : ""
      )
      .join(" ") || "Traveller";
  }

  const userName = savedProfileName || nameFromEmail(email);

  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase() || "U";

  if ($("#sideName")) $("#sideName").textContent = userName;
  if ($("#sideEmail")) $("#sideEmail").textContent = email || "Traveller account";
  if ($("#topName")) $("#topName").textContent = userName;
  if ($("#welcomeName")) $("#welcomeName").textContent = userName.split(" ")[0];
  if ($("#sideAvatar")) $("#sideAvatar").textContent = userInitials;
  if ($("#topAvatar")) $("#topAvatar").textContent = userInitials;
  if ($("#profileLargeAvatar")) $("#profileLargeAvatar").textContent = userInitials;
  if ($("#profileHeadingName")) $("#profileHeadingName").textContent = userName;
  if ($("#profileHeadingEmail")) $("#profileHeadingEmail").textContent = email || "Your SkyTrip account";

  if ($("#currentYear")) {
    $("#currentYear").textContent = new Date().getFullYear();
  }

  if ($("#todayDate")) {
    $("#todayDate").textContent = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }

  /* =========================================
     MOBILE SIDEBAR
  ========================================= */

  function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("sidebar-open");
    overlay?.classList.add("show", "active");
    document.body.classList.add("menu-open");
  }

  function closeSidebar() {
    sidebar?.classList.remove("sidebar-open");
    overlay?.classList.remove("show", "active");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", event => {
    event.preventDefault();

    if (sidebar?.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay?.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSidebar();
  });

  /* =========================================
     TOAST MESSAGE
  ========================================= */

  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    const toastText = $("#toastText");

    if (!toast || !toastText) {
      window.alert(message);
      return;
    }

    toastText.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  window.showToast = showToast;

  /* =========================================
     SECTION NAVIGATION
  ========================================= */

  const sectionMap = {
    dashboard: "dashboardSection",
    bookFlight: "bookFlightSection",
    myTrips: "myTripsSection",
    checkin: "checkinSection",
    profile: "profileSection",
    support: "supportSection"
  };

  const sectionTitles = {
    dashboard: "Dashboard",
    bookFlight: "Book a Flight",
    myTrips: "My Trips",
    checkin: "Web Check-in",
    profile: "My Profile",
    support: "Help & Support"
  };

  function navigateToSection(sectionName) {
    const targetId = sectionMap[sectionName];

    const targetSection = targetId
      ? document.getElementById(targetId)
      : null;

    if (!targetSection) {
      console.error("User dashboard section not found:", sectionName);
      return;
    }

    $$(".main-area > .page-content").forEach(section => {
      section.hidden = true;
    });

    targetSection.hidden = false;

    $$(".sidebar .nav-link[data-section]").forEach(link => {
      link.classList.toggle(
        "active",
        link.dataset.section === sectionName
      );
    });

    if ($("#breadcrumbTitle")) {
      $("#breadcrumbTitle").textContent =
        sectionTitles[sectionName] || "Dashboard";
    }

    closeSidebar();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Restart reveal animations for the selected section.
    $$(".reveal", targetSection).forEach((element, index) => {
      element.style.animation = "none";
      void element.offsetWidth;
      element.style.animation =
        `userFadeUp .55s ease ${Math.min(index * 45, 250)}ms both`;
    });
  }

  document.addEventListener("click", event => {
    const navLink = event.target.closest(".nav-link[data-section]");

    if (navLink && navLink.closest(".sidebar")) {
      event.preventDefault();
      navigateToSection(navLink.dataset.section);
      return;
    }

    const jumpButton = event.target.closest("[data-section-jump]");

    if (jumpButton) {
      event.preventDefault();
      navigateToSection(jumpButton.dataset.sectionJump);
    }
  });

  window.navigateToSection = navigateToSection;

  /* =========================================
     DASHBOARD-SPECIFIC 404 NAVIGATION
  ========================================= */

  function openDashboard404() {
    const activeSection = $(
      ".main-area > .page-content:not([hidden])"
    );

    // Save current dashboard URL.
    sessionStorage.setItem(
      "skytripDashboardReturnUrl",
      window.location.href
    );

    // Save currently visible section ID.
    sessionStorage.setItem(
      "skytripDashboardReturnSection",
      activeSection?.id || "dashboardSection"
    );

    window.location.href = "dashboard-404.html";
  }

  // Make function available for inline onclick buttons.
  window.openDashboard404 = openDashboard404;

  // Intercept dashboard links pointing to 404 pages.
  document.addEventListener("click", event => {

    const errorLink = event.target.closest('a[href*="404.html"]');

    if (!errorLink) return;

    // Do not intercept links opening in a new tab.
    if (errorLink.target === "_blank") return;

    event.preventDefault();

    openDashboard404();

  }, true);

  /* =========================================
     DEMO BUTTONS / NOTIFICATIONS
  ========================================= */

  $("#notificationBtn")?.addEventListener("click", () => {
    showToast("You're all caught up on notifications.");
  });

  $("#profileTrigger")?.addEventListener("click", () => {
    navigateToSection("profile");
  });

  $$("[data-demo-action]").forEach(button => {
    button.addEventListener("click", () => {
      showToast(
        button.dataset.demoAction ||
        "This demo action is not connected."
      );
    });
  });

  /* =========================================
     PRELOADER
  ========================================= */

  function finishPreloader() {
    if (!preloader) return;

    preloader.classList.add("is-hidden");
    document.body.classList.remove("loading");
  }

  if (preloader) {
    const fallbackTimer = setTimeout(finishPreloader, 2200);

    window.addEventListener("load", () => {
      clearTimeout(fallbackTimer);
      setTimeout(finishPreloader, 450);
    }, { once: true });

    if (document.readyState === "complete") {
      setTimeout(finishPreloader, 450);
    }
  }

  /* =========================================
     REVEAL / COUNTER ANIMATIONS
  ========================================= */

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }

      });

    }, { threshold: 0.12 });

    $$("#dashboardSection .reveal").forEach(element => {
      revealObserver.observe(element);
    });
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.count || 0);
    const duration = 1100;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      counter.textContent = Math.round(
        target * eased
      ).toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window) {

    const counterObserver = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);

      });

    }, { threshold: 0.35 });

    $$("#dashboardSection .counter").forEach(counter => {
      counterObserver.observe(counter);
    });

  } else {

    $$("#dashboardSection .counter").forEach(animateCounter);

  }

  /* =========================================
     BOOK FLIGHT FORM
  ========================================= */

  const departureDate = $("#departureDate");
  const returnDate = $("#returnDate");
  const returnDateField = $("#returnDateField");

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const today = localDateString(new Date());

  if (departureDate) departureDate.min = today;
  if (returnDate) returnDate.min = today;

  $$("input[name='tripType']").forEach(radio => {

    radio.addEventListener("change", () => {

      const isRoundTrip =
        $("input[name='tripType']:checked")?.value === "roundtrip";

      if (returnDateField) {
        returnDateField.hidden = !isRoundTrip;
      }

      if (returnDate) {
        returnDate.required = isRoundTrip;

        if (!isRoundTrip) {
          returnDate.value = "";
        }
      }

    });

  });

  departureDate?.addEventListener("change", () => {

    if (!returnDate || !departureDate.value) return;

    returnDate.min = departureDate.value;

    if (returnDate.value && returnDate.value < departureDate.value) {
      returnDate.value = "";
    }

  });

  $("#flightSearchForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const from = $("#fromCity")?.value.trim();
    const to = $("#toCity")?.value.trim();
    const departure = departureDate?.value;

    const tripType =
      $("input[name='tripType']:checked")?.value || "roundtrip";

    const returning = returnDate?.value;
    const travellers = $("#travellerCount")?.value;
    const cabin = $("#cabinClass")?.value;

    if (!from || !to || !departure) {
      showToast("Please complete your flight details.");
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      showToast("Departure and destination must be different.");
      return;
    }

    if (tripType === "roundtrip" && returning && returning < departure) {
      showToast("Return date cannot be earlier than departure.");
      return;
    }

    // Open dashboard-specific 404 page.
    openDashboard404();

  });

  /* =========================================
     MY TRIPS FILTER
  ========================================= */

  $$("[data-trip-filter]").forEach(button => {

    button.addEventListener("click", () => {

      const filter = button.dataset.tripFilter;

      $$("[data-trip-filter]").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      let visibleCount = 0;

      $$(".trip-card[data-trip-status]").forEach(card => {

        const matches =
          filter === "all" ||
          card.dataset.tripStatus === filter;

        card.hidden = !matches;

        if (matches) visibleCount++;

      });

      if (visibleCount === 0) {
        showToast("There are no trips in this category.");
      }

    });

  });

  /* =========================================
     WEB CHECK-IN DEMO
  ========================================= */

  $("#checkinForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const reference = $("#checkinReference")?.value.trim();
    const surname = $("#checkinSurname")?.value.trim();

    if (!reference || !surname) {
      showToast("Enter your booking reference and surname.");
      return;
    }

    // Open dashboard-specific 404 page.
    openDashboard404();

  });

  /* =========================================
     PROFILE FORM
  ========================================= */

  const profileNameInput = $("#profileName");
  const profileEmailInput = $("#profileEmail");
  const profilePhoneInput = $("#profilePhone");
  const profileCabinInput = $("#profileCabin");

  if (profileNameInput) {
    profileNameInput.value =
      localStorage.getItem("skytripProfileName") || userName;
  }

  if (profileEmailInput) {
    profileEmailInput.value =
      localStorage.getItem("skytripProfileEmail") || email;
  }

  if (profilePhoneInput) {
    profilePhoneInput.value =
      localStorage.getItem("skytripProfilePhone") || "";
  }

  if (profileCabinInput) {
    profileCabinInput.value =
      localStorage.getItem("skytripProfileCabin") || "Economy";
  }

  $("#profileForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const newName = profileNameInput?.value.trim();
    const newEmail = profileEmailInput?.value.trim();

    if (!newName || !newEmail) {
      showToast("Please enter your name and email.");
      return;
    }

    // SAVE EXISTING PROFILE DETAILS
    localStorage.setItem("skytripProfileName", newName);
    localStorage.setItem("skytripProfileEmail", newEmail);
    localStorage.setItem(
      "skytripProfilePhone",
      profilePhoneInput?.value.trim() || ""
    );

    localStorage.setItem(
      "skytripProfileCabin",
      profileCabinInput?.value || "Economy"
    );

    // SAVE ADDITIONAL PROFILE DETAILS
    const additionalProfileFields = [
      "profileDOB",
      "profileGender",
      "profileNationality",
      "profileAddress",
      "profileCity",
      "profileState",
      "profilePostal",
      "profileCountry",
      "profileSeat",
      "profileMeal",
      "profileCurrency",
      "profileEmergencyName",
      "profileRelationship",
      "profileEmergencyPhone"
    ];

    additionalProfileFields.forEach(id => {

      const field = $("#" + id);

      if (field) {
        localStorage.setItem(
          "skytrip_" + id,
          field.value
        );
      }

    });

    // SAVE NOTIFICATION PREFERENCES
    const notificationFields = [
      "profileBookingNotify",
      "profileFlightNotify",
      "profileOffersNotify"
    ];

    notificationFields.forEach(id => {

      const field = $("#" + id);

      if (field) {
        localStorage.setItem(
          "skytrip_" + id,
          field.checked
        );
      }

    });

    // GENERATE AVATAR INITIALS
    const initials = newName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase();

    // UPDATE DASHBOARD DETAILS
    if ($("#sideName")) $("#sideName").textContent = newName;
    if ($("#topName")) $("#topName").textContent = newName;

    if ($("#welcomeName")) {
      $("#welcomeName").textContent = newName.split(" ")[0];
    }

    if ($("#sideEmail")) {
      $("#sideEmail").textContent = newEmail;
    }

    if ($("#topAvatar")) {
      $("#topAvatar").textContent = initials || "U";
    }

    if ($("#sideAvatar")) {
      $("#sideAvatar").textContent = initials || "U";
    }

    if ($("#profileLargeAvatar")) {
      $("#profileLargeAvatar").textContent = initials || "U";
    }

    if ($("#profileHeadingName")) {
      $("#profileHeadingName").textContent = newName;
    }

    if ($("#profileHeadingEmail")) {
      $("#profileHeadingEmail").textContent = newEmail;
    }

setTimeout(() => {
    openDashboard404();
}, 500);

  });

  /* =========================================
     LOAD ADDITIONAL PROFILE DETAILS
  ========================================= */

  function loadAdditionalProfileDetails() {

    const additionalProfileFields = [
      "profileDOB",
      "profileGender",
      "profileNationality",
      "profileAddress",
      "profileCity",
      "profileState",
      "profilePostal",
      "profileCountry",
      "profileSeat",
      "profileMeal",
      "profileCurrency",
      "profileEmergencyName",
      "profileRelationship",
      "profileEmergencyPhone"
    ];

    additionalProfileFields.forEach(id => {

      const field = $("#" + id);
      const savedValue = localStorage.getItem("skytrip_" + id);

      if (field && savedValue !== null) {
        field.value = savedValue;
      }

    });

    // LOAD NOTIFICATION PREFERENCES
    const notificationFields = [
      "profileBookingNotify",
      "profileFlightNotify",
      "profileOffersNotify"
    ];

    notificationFields.forEach(id => {

      const field = $("#" + id);
      const savedValue = localStorage.getItem("skytrip_" + id);

      if (field && savedValue !== null) {
        field.checked = savedValue === "true";
      }

    });

  }

  // INITIAL LOAD
  loadAdditionalProfileDetails();

  /* =========================================
     LOG OUT
  ========================================= */

  $("#logoutBtn")?.addEventListener("click", event => {

    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to log out?");

    if (confirmed) {
      window.location.href = "login.html";
    }

  });

  /* =========================================
     INITIAL DASHBOARD / RESTORE LAST SECTION
  ========================================= */

  const shouldRestoreDashboard =
    sessionStorage.getItem("skytripDashboardRestore") === "true";

  const savedDashboardSection = sessionStorage.getItem(
    "skytripDashboardReturnSection"
  );

  if (shouldRestoreDashboard && savedDashboardSection) {

    const savedSectionName = Object.keys(sectionMap).find(
      key => sectionMap[key] === savedDashboardSection
    );

    if (savedSectionName) {
      navigateToSection(savedSectionName);
    } else {
      navigateToSection("dashboard");
    }

    // Clear saved return information after restoring.
    sessionStorage.removeItem("skytripDashboardRestore");
    sessionStorage.removeItem("skytripDashboardReturnSection");
    sessionStorage.removeItem("skytripDashboardReturnUrl");

  } else {

    // Normal dashboard opening.
    navigateToSection("dashboard");

  }

});

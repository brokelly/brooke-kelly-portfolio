"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const currentYear = document.getElementById("currentYear");
    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");
    const navigationLinks = document.querySelectorAll(".nav-links a");
    const pageSections = document.querySelectorAll("main section[id]");

    /*
        Automatically displays the current year in the footer.
    */
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /*
        Opens and closes the mobile navigation menu.
    */
    if (menuButton && navLinks) {
        menuButton.addEventListener("click", function () {
            const menuIsOpen = navLinks.classList.toggle("show");

            menuButton.setAttribute(
                "aria-expanded",
                menuIsOpen.toString()
            );

            menuButton.textContent = menuIsOpen ? "✕" : "☰";
        });
    }

    /*
        Closes the mobile navigation after a link is selected.
    */
    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navLinks) {
                navLinks.classList.remove("show");
            }

            if (menuButton) {
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            }
        });
    });

    /*
        Highlights the navigation link for the section
        currently visible on the page.
    */
    function updateActiveNavigation() {
        let activeSectionId = "";

        pageSections.forEach(function (section) {
            const sectionTop = section.offsetTop - 160;
            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                activeSectionId = section.getAttribute("id");
            }
        });

        navigationLinks.forEach(function (link) {
            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                "#" + activeSectionId
            ) {
                link.classList.add("active");
            }
        });
    }

    /*
        Adds a small reveal effect as project cards
        enter the screen.
    */
    const projectCards =
        document.querySelectorAll(".project-card");

    if ("IntersectionObserver" in window) {
        const cardObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        projectCards.forEach(function (card) {
            cardObserver.observe(card);
        });
    } else {
        projectCards.forEach(function (card) {
            card.classList.add("visible");
        });
    }

    window.addEventListener("scroll", updateActiveNavigation);

    updateActiveNavigation();
});

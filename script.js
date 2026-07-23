"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const currentYear =
        document.getElementById("currentYear");

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.getElementById("navLinks");

    const navigationLinks =
        document.querySelectorAll(".nav-links a");

    /*
        Add the current year to the footer.
    */
    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    /*
        Open and close the mobile navigation menu.
    */
    if (menuButton && navLinks) {
        menuButton.addEventListener(
            "click",
            function () {
                const menuIsOpen =
                    navLinks.classList.toggle("show");

                menuButton.setAttribute(
                    "aria-expanded",
                    menuIsOpen.toString()
                );

                menuButton.textContent =
                    menuIsOpen ? "✕" : "☰";
            }
        );
    }

    /*
        Close the mobile menu after selecting a link.
    */
    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navLinks) {
                navLinks.classList.remove("show");
            }

            if (menuButton) {
                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.textContent = "☰";
            }
        });
    });
});

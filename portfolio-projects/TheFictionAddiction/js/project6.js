"use strict";

/*
    Displays the user's blog post in the preview area.
*/
function submitBlogPost() {
    const titleInput = document.getElementById("blogTitle");
    const authorInput = document.getElementById("blogAuthor");
    const contentInput = document.getElementById("blogContent");
    const blogDisplay = document.getElementById("blogDisplay");

    if (!titleInput || !authorInput || !contentInput || !blogDisplay) {
        return;
    }

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const content = contentInput.value.trim();

    if (title === "" || author === "" || content === "") {
        alert("Please fill in all fields before submitting.");
        return;
    }

    /*
        Using textContent instead of inserting raw user input
        directly into innerHTML helps prevent unwanted HTML code
        from being added to the page.
    */
    blogDisplay.innerHTML = "";

    const postTitle = document.createElement("h2");
    postTitle.textContent = title;

    const postAuthor = document.createElement("h4");
    postAuthor.textContent = `by ${author}`;

    const postContent = document.createElement("p");
    postContent.textContent = content;

    blogDisplay.appendChild(postTitle);
    blogDisplay.appendChild(postAuthor);
    blogDisplay.appendChild(postContent);
}

/*
    Displays the selected section on the Top Fiction Lists page.
*/
function showContent(sectionId) {
    const sections = document.querySelectorAll(".content-section");
    const selectedSection = document.getElementById(sectionId);

    sections.forEach(function (section) {
        section.classList.remove("active");
    });

    if (selectedSection) {
        selectedSection.classList.add("active");
    }
}

/*
    Opens the contact pop-up.
*/
function openModal() {
    const modal = document.getElementById("popupModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

/*
    Closes the contact pop-up.
*/
function closeModal() {
    const modal = document.getElementById("popupModal");

    if (modal) {
        modal.style.display = "none";
    }
}

/*
    Closes the pop-up when the user clicks the dark area
    outside the modal content.
*/
window.addEventListener("click", function (event) {
    const modal = document.getElementById("popupModal");

    if (modal && event.target === modal) {
        closeModal();
    }
});

/*
    Closes the pop-up when the Escape key is pressed.
*/
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

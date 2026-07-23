document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll(".menu-btn");
  const contentSections = document.querySelectorAll(".content-section");

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");

      contentSections.forEach((section) => {
        section.classList.remove("active");
      });

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
          updateAllFlipCardHeights();
        }, 80);
      }
    });
  });

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function setFlipCardHeight(card) {
    if (!card) return;

    const inner = card.querySelector(".flip-inner");
    const front = card.querySelector(".flip-front");
    const back = card.querySelector(".flip-back");

    if (!inner || !front || !back) return;

    const wasFlipped = card.classList.contains("flipped");
    card.style.height = "auto";
    inner.style.height = "auto";

    if (wasFlipped) {
      card.classList.remove("flipped");
    }

    const frontHeight = front.scrollHeight;
    const backHeight = back.scrollHeight;
    const tallest = Math.max(frontHeight, backHeight);

    if (tallest > 0) {
      card.style.height = `${tallest}px`;
      inner.style.height = `${tallest}px`;
    }

    if (wasFlipped) {
      card.classList.add("flipped");
    }
  }

  function updateAllFlipCardHeights() {
    document.querySelectorAll(".flip-card").forEach((card) => {
      setFlipCardHeight(card);
    });
  }

  function closeAllFlippedCards(exceptCard = null) {
    document.querySelectorAll(".flip-card.flipped").forEach((card) => {
      if (card !== exceptCard) {
        card.classList.remove("flipped");
        setFlipCardHeight(card);
      }
    });
  }

  /* -------------------------
     Favorites
  ------------------------- */
  const favoritesGrid = document.getElementById("favoritesGrid");
  const homeFavoritesGrid = document.getElementById("homeFavoritesGrid");
  const panelFavoritesList = document.getElementById("panelFavoritesList");
  const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");

  function getFavorites() {
    return JSON.parse(localStorage.getItem("bg3Favorites")) || [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem("bg3Favorites", JSON.stringify(favorites));
  }

  function createFavoriteFlipCard(favorite, index, preview = false) {
    const title = escapeHtml(favorite.name);
    const notes = favorite.notes && favorite.notes.trim()
      ? escapeHtml(favorite.notes)
      : "Saved build favorite.";

    const frontButtons = preview
      ? `
        <div class="card-actions">
          <button class="btn explore-btn" type="button">View Details</button>
          <a class="btn" href="builds.html">Manage</a>
        </div>
      `
      : `
        <div class="card-actions">
          <button class="btn explore-btn" type="button">View Details</button>
          <button class="btn remove-favorite-btn" data-index="${index}" type="button">Remove</button>
        </div>
      `;

    const backButtons = preview
      ? `
        <div class="back-actions">
          <button class="btn back-btn" type="button">Back</button>
          <a class="btn" href="builds.html">Go to Builds</a>
        </div>
      `
      : `
        <div class="back-actions">
          <button class="btn back-btn" type="button">Back</button>
          <button class="btn remove-favorite-btn" data-index="${index}" type="button">Remove</button>
        </div>
      `;

    return `
      <article class="favorite-card flip-card">
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <div class="tier-badge s">Favorite</div>
            <h4>${title}</h4>
            <p class="card-copy favorite-front-note">${notes}</p>
            ${frontButtons}
          </div>

          <div class="flip-face flip-back">
            <h4>${title}</h4>
            <p class="mini-meta"><strong>Saved Notes:</strong></p>
            <p class="card-copy">${notes}</p>
            ${backButtons}
          </div>
        </div>
      </article>
    `;
  }

  function renderFavorites() {
    const favorites = getFavorites();

    if (favoritesGrid) {
      if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
          <div class="empty-state">
            <p>No favorites saved yet. Start clicking Favorite on a build card and your little chaos museum will appear here.</p>
          </div>
        `;
      } else {
        favoritesGrid.innerHTML = favorites
          .map((favorite, index) => createFavoriteFlipCard(favorite, index, false))
          .join("");
      }
    }

    if (homeFavoritesGrid) {
      if (favorites.length === 0) {
        homeFavoritesGrid.innerHTML = `
          <div class="empty-state">
            <p>No favorites yet. Your future obsessions are still in the wild.</p>
          </div>
        `;
      } else {
        homeFavoritesGrid.innerHTML = favorites
          .slice(0, 4)
          .map((favorite, index) => createFavoriteFlipCard(favorite, index, true))
          .join("");
      }
    }

    if (panelFavoritesList) {
      if (favorites.length === 0) {
        panelFavoritesList.innerHTML = `<div class="panel-favorite-item">No favorites saved yet.</div>`;
      } else {
        panelFavoritesList.innerHTML = favorites
          .slice(0, 6)
          .map((favorite) => `
            <div class="panel-favorite-item">
              <strong>${escapeHtml(favorite.name)}</strong><br>
              <span>${favorite.notes ? escapeHtml(favorite.notes) : "Saved build favorite."}</span>
            </div>
          `)
          .join("");
      }
    }

    setTimeout(updateAllFlipCardHeights, 40);
  }

  function addFavorite(name, notes = "") {
    if (!name || !name.trim()) return;

    const favorites = getFavorites();
    const cleanedName = name.trim();
    const cleanedNotes = notes.trim();

    const existingIndex = favorites.findIndex(
      (fav) => fav.name.toLowerCase() === cleanedName.toLowerCase()
    );

    if (existingIndex !== -1) {
      if (cleanedNotes) {
        favorites[existingIndex].notes = cleanedNotes;
      }
      saveFavorites(favorites);
      renderFavorites();
      return;
    }

    favorites.push({
      name: cleanedName,
      notes: cleanedNotes
    });

    saveFavorites(favorites);
    renderFavorites();
  }

  if (clearFavoritesBtn) {
    clearFavoritesBtn.addEventListener("click", () => {
      localStorage.removeItem("bg3Favorites");
      renderFavorites();
    });
  }

  /* -------------------------
     Info panel
  ------------------------- */
  const infoPanel = document.getElementById("infoPanel");
  const panelOverlay = document.getElementById("panelOverlay");
  const openInfoPanel = document.getElementById("openInfoPanel");
  const closeInfoPanel = document.getElementById("closeInfoPanel");

  function openPanel() {
    if (infoPanel) infoPanel.classList.add("open");
    if (panelOverlay) panelOverlay.classList.add("show");
  }

  function closePanel() {
    if (infoPanel) infoPanel.classList.remove("open");
    if (panelOverlay) panelOverlay.classList.remove("show");
  }

  if (openInfoPanel) {
    openInfoPanel.addEventListener("click", openPanel);
  }

  if (closeInfoPanel) {
    closeInfoPanel.addEventListener("click", closePanel);
  }

  if (panelOverlay) {
    panelOverlay.addEventListener("click", closePanel);
  }

  /* -------------------------
     Global delegated clicks
  ------------------------- */
  document.addEventListener("click", (event) => {
    const exploreBtn = event.target.closest(".explore-btn");
    const backBtn = event.target.closest(".back-btn");
    const favoriteBtn = event.target.closest(".fav-build-btn, .fav-from-card");
    const removeFavoriteBtn = event.target.closest(".remove-favorite-btn");
    const removeSavedBtn = event.target.closest(".remove-saved-btn");
    const clickedCard = event.target.closest(".flip-card");

    if (exploreBtn) {
      const card = exploreBtn.closest(".flip-card");
      if (card) {
        closeAllFlippedCards(card);
        card.classList.add("flipped");
        setFlipCardHeight(card);
      }
      return;
    }

    if (backBtn) {
      const card = backBtn.closest(".flip-card");
      if (card) {
        card.classList.remove("flipped");
        setFlipCardHeight(card);
      }
      return;
    }

    if (favoriteBtn) {
      const name = favoriteBtn.getAttribute("data-fav") || "";
      const note = favoriteBtn.getAttribute("data-note") || "";
      addFavorite(name, note);
      return;
    }

    if (removeFavoriteBtn) {
      const index = parseInt(removeFavoriteBtn.getAttribute("data-index"), 10);
      const favorites = getFavorites();
      favorites.splice(index, 1);
      saveFavorites(favorites);
      renderFavorites();
      return;
    }

    if (removeSavedBtn) {
      const index = parseInt(removeSavedBtn.getAttribute("data-index"), 10);
      const builds = getSavedBuilds();
      builds.splice(index, 1);
      saveSavedBuilds(builds);
      renderSavedBuilds();
      return;
    }

    if (!clickedCard && !event.target.closest("#infoPanel") && !event.target.closest("#openInfoPanel")) {
      closeAllFlippedCards();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllFlippedCards();
      closePanel();
    }
  });

  /* -------------------------
     Build filtering
  ------------------------- */
  const buildFilterInput = document.getElementById("buildFilter");
  const roleFilterSelect = document.getElementById("roleFilter");
  const tierFilterSelect = document.getElementById("tierFilter");
  const clearFilterBtn = document.getElementById("clearFilterBtn");
  const tierSections = [
    {
      heading: document.querySelector(".tier-heading.s"),
      container: document.getElementById("tierS")
    },
    {
      heading: document.querySelector(".tier-heading.a"),
      container: document.getElementById("tierA")
    },
    {
      heading: document.querySelector(".tier-heading.b"),
      container: document.getElementById("tierB")
    }
  ];

  function filterBuilds() {
    const buildCards = document.querySelectorAll(".build-card");
    const searchValue = buildFilterInput ? buildFilterInput.value.toLowerCase().trim() : "";
    const roleValue = roleFilterSelect ? roleFilterSelect.value.toLowerCase().trim() : "";
    const tierValue = tierFilterSelect ? tierFilterSelect.value.toLowerCase().trim() : "";

    buildCards.forEach((card) => {
      const searchableText = (card.getAttribute("data-search") || "").toLowerCase();
      const roleText = (card.getAttribute("data-role") || "").toLowerCase();
      const tierText = (card.getAttribute("data-tier") || "").toLowerCase();

      const matchesSearch = searchableText.includes(searchValue);
      const matchesRole = roleValue === "" || roleText.includes(roleValue);
      const matchesTier = tierValue === "" || tierText === tierValue;

      if (matchesSearch && matchesRole && matchesTier) {
        card.style.display = "";
      } else {
        card.style.display = "none";
        card.classList.remove("flipped");
      }
    });

    tierSections.forEach((section) => {
      if (!section.heading || !section.container) return;

      const visibleCards = [...section.container.querySelectorAll(".build-card")].filter(
        (card) => card.style.display !== "none"
      );

      section.heading.style.display = visibleCards.length ? "" : "none";
      section.container.style.display = visibleCards.length ? "" : "none";
    });

    setTimeout(updateAllFlipCardHeights, 40);
  }

  if (buildFilterInput) {
    buildFilterInput.addEventListener("input", filterBuilds);
  }

  if (roleFilterSelect) {
    roleFilterSelect.addEventListener("change", filterBuilds);
  }

  if (tierFilterSelect) {
    tierFilterSelect.addEventListener("change", filterBuilds);
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", () => {
      if (buildFilterInput) buildFilterInput.value = "";
      if (roleFilterSelect) roleFilterSelect.value = "";
      if (tierFilterSelect) tierFilterSelect.value = "";
      filterBuilds();
    });
  }

  /* -------------------------
     Saved builds
  ------------------------- */
  const buildForm = document.getElementById("buildForm");
  const savedBuildsGrid = document.getElementById("savedBuildsGrid");
  const clearSavedBtn = document.getElementById("clearSavedBtn");
  const difficulty = document.getElementById("difficulty");
  const difficultyValue = document.getElementById("difficultyValue");

  const submitterName = document.getElementById("submitterName");
  const characterName = document.getElementById("characterName");
  const buildName = document.getElementById("buildName");
  const mainClass = document.getElementById("mainClass");
  const race = document.getElementById("race");
  const notes = document.getElementById("notes");

  function getSavedBuilds() {
    return JSON.parse(localStorage.getItem("bg3SavedBuilds")) || [];
  }

  function saveSavedBuilds(builds) {
    localStorage.setItem("bg3SavedBuilds", JSON.stringify(builds));
  }

  function createSavedBuildFlipCard(build, index) {
    const buildTitle = escapeHtml(build.buildName);
    const notesText = build.notes && build.notes.trim()
      ? escapeHtml(build.notes)
      : "No extra notes saved.";

    return `
      <article class="saved-build-card flip-card">
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <div class="tier-badge a">Saved Build</div>
            <h4>${buildTitle}</h4>
            <p class="card-copy saved-front-note">
              <strong>${escapeHtml(build.characterName)}</strong><br>
              ${escapeHtml(build.mainClass)}<br>
              ${escapeHtml(build.race)} | Difficulty ${escapeHtml(build.difficulty)}/50
            </p>
            <div class="card-actions">
              <button class="btn explore-btn" type="button">View Build</button>
              <button class="btn remove-saved-btn" data-index="${index}" type="button">Remove</button>
            </div>
          </div>

          <div class="flip-face flip-back">
            <h4>${buildTitle}</h4>
            <p class="mini-meta"><strong>Submitted By:</strong> ${escapeHtml(build.submitterName)}</p>
            <p class="mini-meta"><strong>Character:</strong> ${escapeHtml(build.characterName)}</p>
            <p class="mini-meta"><strong>Main Class:</strong> ${escapeHtml(build.mainClass)}</p>
            <p class="mini-meta"><strong>Race:</strong> ${escapeHtml(build.race)}</p>
            <p class="mini-meta"><strong>Difficulty:</strong> ${escapeHtml(build.difficulty)}/50</p>
            <p class="mini-meta"><strong>Notes:</strong> ${notesText}</p>
            <div class="back-actions">
              <button class="btn back-btn" type="button">Back</button>
              <button class="btn remove-saved-btn" data-index="${index}" type="button">Remove</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderSavedBuilds() {
    if (!savedBuildsGrid) return;

    const builds = getSavedBuilds();

    if (builds.length === 0) {
      savedBuildsGrid.innerHTML = `
        <div class="empty-state">
          <p>No submitted builds saved yet. Time to cook up something terrifying.</p>
        </div>
      `;
      return;
    }

    savedBuildsGrid.innerHTML = builds
      .map((build, index) => createSavedBuildFlipCard(build, index))
      .join("");

    setTimeout(updateAllFlipCardHeights, 40);
  }

  if (difficulty && difficultyValue) {
    const syncDifficulty = () => {
      difficultyValue.textContent = `${difficulty.value}/50`;
    };
    difficulty.addEventListener("input", syncDifficulty);
    syncDifficulty();
  }

  if (buildForm) {
    buildForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const newBuild = {
        submitterName: submitterName ? submitterName.value.trim() : "",
        characterName: characterName ? characterName.value.trim() : "",
        buildName: buildName ? buildName.value.trim() : "",
        mainClass: mainClass ? mainClass.value.trim() : "",
        race: race ? race.value.trim() : "",
        difficulty: difficulty ? difficulty.value : "30",
        notes: notes ? notes.value.trim() : ""
      };

      if (
        !newBuild.submitterName ||
        !newBuild.characterName ||
        !newBuild.buildName ||
        !newBuild.mainClass ||
        !newBuild.race
      ) {
        return;
      }

      const builds = getSavedBuilds();
      builds.push(newBuild);
      saveSavedBuilds(builds);
      renderSavedBuilds();
      buildForm.reset();

      if (difficulty) {
        difficulty.value = "30";
      }
      if (difficultyValue) {
        difficultyValue.textContent = "30/50";
      }
    });
  }

  if (clearSavedBtn) {
    clearSavedBtn.addEventListener("click", () => {
      localStorage.removeItem("bg3SavedBuilds");
      renderSavedBuilds();
    });
  }

  renderFavorites();
  renderSavedBuilds();

  window.addEventListener("load", updateAllFlipCardHeights);
  window.addEventListener("resize", updateAllFlipCardHeights);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateAllFlipCardHeights();
    });
  }

  setTimeout(updateAllFlipCardHeights, 120);
});
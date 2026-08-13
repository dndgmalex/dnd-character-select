(() => {
  "use strict";
  const characters = Array.isArray(window.CHARACTERS) ? window.CHARACTERS : [];
  const layer = document.querySelector("#character-layer");
  const panel = document.querySelector("#character-info");
  const nameEl = document.querySelector("#character-name");
  const subtitleEl = document.querySelector("#character-subtitle");
  const descriptionEl = document.querySelector("#character-description");
  const kickerEl = document.querySelector("#character-kicker");
  const closeupEl = document.querySelector("#character-closeup");
  const audio = document.querySelector("#character-audio");
  const audioToggle = document.querySelector("#audio-toggle");
  const musicStatus = document.querySelector("#music-status");

  let selectedId = null;
  let previewId = null;
  let muted = false;
  let autoplayPending = false;

  const getCharacter = id => characters.find(character => character.id === id);

  function renderInfo(character, mode = "selected") {
    panel.classList.remove("is-changing");
    void panel.offsetWidth;
    panel.classList.add("is-changing");
    nameEl.textContent = character.name;
    subtitleEl.textContent = character.subtitle ?? "";
    descriptionEl.textContent = character.description ?? "";
    kickerEl.textContent = mode === "selected" ? "Personaggio scelto" : "Anteprima";
    closeupEl.src = character.closeup || character.image;
    closeupEl.alt = `Ritratto di ${character.name}`;
    const detail = character.detail ?? {};
    closeupEl.style.setProperty("--closeup-scale", detail.scale ?? 1.35);
    closeupEl.style.setProperty("--closeup-x", `${detail.x ?? 50}%`);
    closeupEl.style.setProperty("--closeup-y", `${detail.y ?? 18}%`);
    musicStatus.textContent = character.theme ? `Tema: ${character.theme}` : "Tema non assegnato";
  }

  function renderEmptyInfo() {
    closeupEl.removeAttribute("src");
    closeupEl.alt = "";
    kickerEl.textContent = "Seleziona un personaggio";
    nameEl.textContent = "Nessun personaggio";
    subtitleEl.textContent = "";
    descriptionEl.textContent = "";
    musicStatus.textContent = "Passa il mouse su un personaggio";
  }

  function updateAudioButton() {
    audioToggle.classList.toggle("is-muted", muted);
    audioToggle.setAttribute("aria-pressed", String(muted));
    audioToggle.setAttribute("aria-label", muted ? "Attiva audio" : "Disattiva audio");
  }

  function syncCards() {
    document.querySelectorAll(".character-card").forEach(card => {
      const active = card.dataset.id === selectedId;
      const previewed = card.dataset.id === previewId;
      card.classList.toggle("is-selected", active);
      card.classList.toggle("is-previewed", previewed);
      card.setAttribute("aria-pressed", String(active));
    });
  }

  async function playTheme(character, reset = true) {
    if (!character?.music) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      autoplayPending = false;
      return;
    }
    const target = new URL(character.music, window.location.href).href;
    if (audio.src !== target) {
      audio.src = character.music;
      reset = true;
    }
    if (reset) audio.currentTime = 0;
    audio.muted = muted;
    try {
      await audio.play();
      autoplayPending = false;
    } catch {
      autoplayPending = true;
      if (character.theme) musicStatus.textContent = `Tema: ${character.theme} · partirà alla prima interazione`;
    }
  }

  async function choose(id) {
    selectedId = id;
    previewId = null;
    const character = getCharacter(id);
    syncCards();
    renderInfo(character, "selected");
    await playTheme(character);
  }

  function preview(character) {
    previewId = character.id;
    syncCards();
  }

  function clearPreview() {
    previewId = null;
    syncCards();
    if (!selectedId) renderEmptyInfo();
  }

  async function unlockAutoplay() {
    if (!autoplayPending || muted) return;
    const character = getCharacter(selectedId);
    if (character) await playTheme(character, false);
  }

  for (const character of characters) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "character-card";
    card.dataset.id = character.id;
    card.dataset.labelPosition = character.labelPosition ?? "bottom";
    card.style.setProperty("--label-x", `${character.labelX ?? 50}%`);
    card.style.setProperty("--label-y", `${character.labelY ?? 10}%`);
    card.style.setProperty("--x", `${character.x ?? 50}%`);
    card.style.setProperty("--y", `${character.y ?? 95}%`);
    card.style.setProperty("--width", `${character.width ?? 18}%`);
    card.style.setProperty("--scale", character.scale ?? 1);
    card.style.setProperty("--z", character.z ?? 1);
    card.setAttribute("aria-label", `Scegli ${character.name}`);
    card.setAttribute("aria-pressed", "false");
    const image = document.createElement("img");
    image.src = character.image;
    image.alt = "";
    image.draggable = false;
    const tag = document.createElement("span");
    tag.className = "character-tag";
    tag.textContent = character.shortName || character.name;
    card.append(image, tag);
    card.addEventListener("mouseenter", () => preview(character));
    card.addEventListener("focus", () => preview(character));
    card.addEventListener("mouseleave", clearPreview);
    card.addEventListener("blur", clearPreview);
    card.addEventListener("click", () => choose(character.id));
    layer.append(card);
  }

  audioToggle.addEventListener("click", async event => {
    event.stopPropagation();
    muted = !muted;
    audio.muted = muted;
    updateAudioButton();
    const character = getCharacter(selectedId);
    if (!muted && audio.paused && character) await playTheme(character, false);
  });
  document.addEventListener("pointerdown", unlockAutoplay, { passive: true });
  document.addEventListener("keydown", unlockAutoplay);
  syncCards();
  updateAudioButton();
})();

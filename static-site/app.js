const demoTracks = [
  {
    id: "1",
    title: "Let It Be",
    artist: "The Beatles",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    chosen: 129,
    source: "demo",
    externalUrl: ""
  },
  {
    id: "2",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    chosen: 94,
    source: "demo",
    externalUrl: ""
  },
  {
    id: "3",
    title: "The Night We Met",
    artist: "Lord Huron",
    cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
    preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    chosen: 72,
    source: "demo",
    externalUrl: ""
  },
  {
    id: "4",
    title: "Space Oddity",
    artist: "David Bowie",
    cover: "https://images.unsplash.com/photo-1461784180009-21121b2f2048?auto=format&fit=crop&w=600&q=80",
    preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    chosen: 65,
    source: "demo",
    externalUrl: ""
  },
  {
    id: "5",
    title: "Hurt",
    artist: "Johnny Cash",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    chosen: 58,
    source: "demo",
    externalUrl: ""
  },
  {
    id: "6",
    title: "Exit Music (For a Film)",
    artist: "Radiohead",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=600&q=80",
    preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    chosen: 52,
    source: "demo",
    externalUrl: ""
  }
];

const reasons = [
  { track: "Let It Be", city: "Токио", text: "Потому что в ней есть принятие без капитуляции." },
  { track: "Bohemian Rhapsody", city: "Берлин", text: "Мне нужна последняя песня, которая все еще ощущается бесконечной." },
  { track: "The Night We Met", city: "Варшава", text: "Она болит ровно так, как нужно." }
];

const liveFeed = [
  { city: "Токио", track: "Let It Be", artist: "The Beatles" },
  { city: "Сеул", track: "Bohemian Rhapsody", artist: "Queen" },
  { city: "Минск", track: "Space Oddity", artist: "David Bowie" },
  { city: "Лиссабон", track: "Hurt", artist: "Johnny Cash" }
];

const state = {
  query: "",
  selected: null,
  tracks: [...demoTracks],
  searchResults: [],
  reasons: [...reasons],
  liveFeed: [...liveFeed],
  audio: null,
  searchAbortController: null
};

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const selectedCard = document.getElementById("selectedCard");
const boardRows = document.getElementById("boardRows");
const reasonsWrap = document.getElementById("reasons");
const marquee = document.getElementById("marquee");
const liveFeedWrap = document.getElementById("liveFeed");
const shareModal = document.getElementById("shareModal");
const shareTextNode = document.getElementById("shareText");
const closeModal = document.getElementById("closeModal");

function normalizeTrack(track) {
  return {
    id: String(track.trackId),
    title: track.trackName,
    artist: track.artistName,
    cover: track.artworkUrl100?.replace("100x100bb", "600x600bb") || demoTracks[0].cover,
    preview: track.previewUrl || "",
    chosen: 1,
    source: "itunes",
    externalUrl: track.trackViewUrl || track.collectionViewUrl || ""
  };
}

function getTimezoneCity() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Где-то";
  return zone.split("/").pop().replaceAll("_", " ");
}

async function fetchMusicResults(query) {
  if (state.searchAbortController) {
    state.searchAbortController.abort();
  }

  const controller = new AbortController();
  state.searchAbortController = controller;

  const fallback = state.tracks
    .filter((track) => `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error("Music API request failed");
    }

    const payload = await response.json();
    const remoteResults = (payload.results || []).map(normalizeTrack);
    state.searchResults = remoteResults.length ? remoteResults : fallback;
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    state.searchResults = fallback;
  }

  renderResults();
}

function renderResults() {
  const query = state.query.trim();

  if (!query) {
    searchResults.classList.add("hidden");
    searchResults.innerHTML = "";
    return;
  }

  const matches = state.searchResults;

  if (!matches.length) {
    searchResults.classList.remove("hidden");
    searchResults.innerHTML =
      '<div class="result-row"><div></div><div class="song-sub">Ничего не найдено. Попробуй другое название или исполнителя.</div><div></div></div>';
    return;
  }

  searchResults.classList.remove("hidden");
  searchResults.innerHTML = matches
    .map(
      (track) => `
        <button class="result-row" data-select="${track.id}">
          <div class="cover"><img src="${track.cover}" alt="${track.title}"></div>
          <div>
            <div class="song-title">${track.title}</div>
            <div class="song-sub">${track.artist}${track.source === "itunes" ? " / найдено через Apple Music" : ""}</div>
          </div>
          <div>↗</div>
        </button>
      `
    )
    .join("");
}

function renderSelected() {
  if (!state.selected) {
    selectedCard.classList.add("hidden");
    selectedCard.innerHTML = "";
    return;
  }

  const track = state.selected;
  selectedCard.classList.remove("hidden");
  selectedCard.innerHTML = `
    <div class="selected-top">
      <div class="selected-cover"><img src="${track.cover}" alt="${track.title}"></div>
      <div>
        <p class="eyebrow muted">Выбранный трек</p>
        <h3 class="selected-title">${track.title}</h3>
        <p class="selected-meta">${track.artist}</p>
        <div class="selected-actions">
          <button class="ghost-button" id="playPreview">${track.preview ? "Слушать превью" : "Превью недоступно"}</button>
          ${
            track.externalUrl
              ? `<a class="ghost-button" href="${track.externalUrl}" target="_blank" rel="noreferrer">Открыть трек</a>`
              : `<a class="ghost-button" href="#board">К рейтингу</a>`
          }
        </div>
      </div>
    </div>
    <div class="reason-wrap">
      <p class="eyebrow muted">Почему именно она? (необязательно)</p>
      <textarea id="reasonInput" class="reason-input" maxlength="150" placeholder="Последняя память, признание, извинение или причина."></textarea>
      <div class="reason-meta"><span id="reasonCounter">0</span>/150</div>
    </div>
    <button class="primary-button" id="confirmChoice">Да, это моя последняя песня</button>
  `;

  const reasonInput = document.getElementById("reasonInput");
  const reasonCounter = document.getElementById("reasonCounter");
  const playPreview = document.getElementById("playPreview");
  const confirmChoice = document.getElementById("confirmChoice");

  reasonInput.addEventListener("input", () => {
    reasonCounter.textContent = String(reasonInput.value.length);
  });

  playPreview.addEventListener("click", () => {
    if (!track.preview) {
      return;
    }
    if (state.audio) {
      state.audio.pause();
    }
    state.audio = new Audio(track.preview);
    state.audio.play().catch(() => {});
  });

  confirmChoice.addEventListener("click", () => {
    const existing = state.tracks.find((item) => item.id === track.id);
    if (existing) {
      existing.chosen += 1;
    } else {
      state.tracks.push({
        ...track,
        chosen: 1
      });
    }

    const quote = reasonInput.value.trim();
    if (quote) {
      state.reasons.unshift({
        track: track.title,
        city: getTimezoneCity(),
        text: quote
      });
      state.reasons = state.reasons.slice(0, 8);
    }

    state.liveFeed.unshift({
      city: getTimezoneCity(),
      track: track.title,
      artist: track.artist
    });
    state.liveFeed = state.liveFeed.slice(0, 6);

    renderBoard();
    renderReasons();
    renderMarquee();
    renderLiveFeed();
    openShare(track);
  });
}

function renderBoard() {
  const sorted = [...state.tracks].sort((a, b) => b.chosen - a.chosen);
  boardRows.innerHTML = sorted
    .map(
      (track, index) => `
        <button class="board-row" data-select="${track.id}">
          <div class="rank">${String(index + 1).padStart(2, "0")}</div>
          <div class="track-cell">
            <div class="cover"><img src="${track.cover}" alt="${track.title}"></div>
            <div class="track-copy">
              <div class="song-title">${track.title}</div>
              <div class="song-sub">${track.artist}${track.source === "itunes" ? " / найдено через Apple Music" : ""}</div>
            </div>
          </div>
          <div class="artist-cell song-sub">${track.artist}</div>
          <div class="chosen">${track.chosen} чел.</div>
        </button>
      `
    )
    .join("");
}

function renderReasons() {
  reasonsWrap.innerHTML = state.reasons
    .slice(0, 3)
    .map(
      (item) => `
        <div class="reason-item">
          <div class="reason-text">"${item.text}"</div>
          <div class="song-sub"><strong>${item.track}</strong> / ${item.city}</div>
        </div>
      `
    )
    .join("");
}

function renderMarquee() {
  const items = [...state.reasons, ...state.reasons];
  marquee.innerHTML = items.map((item) => `<span>"${item.text}" / ${item.track} / ${item.city}</span>`).join("");
}

function renderLiveFeed() {
  liveFeedWrap.innerHTML = state.liveFeed
    .slice(0, 4)
    .map(
      (item) => `
        <div class="live-item">
          Кто-то из <strong>${item.city}</strong> только что выбрал <strong>${item.track}</strong> — ${item.artist}.
        </div>
      `
    )
    .join("");
}

function openShare(track) {
  const origin = window.location.origin;
  const text = `Я выбрал своей последней песней ${track.title} — ${track.artist}. А какая будет у тебя? Выбери на ${origin}`;
  shareTextNode.textContent = text;
  shareModal.classList.remove("hidden");
  shareModal.dataset.shareText = text;
  shareModal.dataset.shareUrl = origin;
}

function bindEvents() {
  let searchTimer;

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.searchResults = [];
    renderResults();

    window.clearTimeout(searchTimer);

    if (!state.query.trim()) {
      return;
    }

    searchTimer = window.setTimeout(() => {
      fetchMusicResults(state.query.trim());
    }, 260);
  });

  searchResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select]");
    if (!button) return;
    const track =
      state.searchResults.find((item) => item.id === button.dataset.select) ||
      state.tracks.find((item) => item.id === button.dataset.select);
    if (!track) return;
    state.selected = track;
    searchInput.value = `${track.title} - ${track.artist}`;
    state.query = searchInput.value;
    searchResults.classList.add("hidden");
    renderSelected();
  });

  boardRows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select]");
    if (!button) return;
    const track = state.tracks.find((item) => item.id === button.dataset.select);
    if (!track) return;
    state.selected = track;
    renderSelected();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  closeModal.addEventListener("click", () => {
    shareModal.classList.add("hidden");
  });

  shareModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      shareModal.classList.add("hidden");
    }
  });

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", async () => {
      const shareText = shareModal.dataset.shareText;
      const shareUrl = shareModal.dataset.shareUrl;
      const fullText = `${shareText}`;
      const action = button.dataset.share;

      if (action === "copy") {
        await navigator.clipboard.writeText(fullText);
        button.textContent = "Скопировано";
        window.setTimeout(() => {
          button.textContent = "Скопировать ссылку";
        }, 1200);
        return;
      }

      const urls = {
        x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(fullText)}`,
        vk: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
      };

      window.open(urls[action], "_blank", "noopener,noreferrer");
    });
  });
}

renderBoard();
renderReasons();
renderMarquee();
renderLiveFeed();
bindEvents();

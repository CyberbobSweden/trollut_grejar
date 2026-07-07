/* ==========================================================================
   TROLLUT GREJAR — marknadskalender
   -----------------------------------------------------------------------
   Redigera listan MARKET_DATES nedan för att lägga till, ändra eller ta
   bort marknader. Datum skrivs som "ÅÅÅÅ-MM-DD". Gamla datum (som redan
   passerat) visas inte längre automatiskt — du behöver alltså inte städa
   bort dem själv.

   OBS: exemplen nedan är platshållare. Byt ut mot era riktiga datum och
   platser innan sidan publiceras skarpt.
   ========================================================================== */

const MARKET_DATES = [
  {
    date: "2026-07-25",
    title: "Sommarmarknad, Älvsbyn centrum",
    place: "Storgatan, Älvsbyn"
  },
  {
    date: "2026-08-15",
    title: "Hantverksmarknad",
    place: "Framnäs friluftsområde, Älvsbyn"
  },
  {
    date: "2026-09-12",
    title: "Höstmarknad",
    place: "Piteå centrum"
  },
  {
    date: "2026-11-28",
    title: "Julmarknad, första advent",
    place: "Älvsbyns torg"
  },
  {
    date: "2026-12-12",
    title: "Julmarknad",
    place: "Framnäs friluftsområde, Älvsbyn"
  }
];

const MONTHS_SV = ["JAN","FEB","MAR","APR","MAJ","JUN","JUL","AUG","SEP","OKT","NOV","DEC"];

function renderCalendar() {
  const list = document.getElementById("cal-list");
  if (!list) return;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = MARKET_DATES
    .map(ev => ({ ...ev, dateObj: new Date(ev.date + "T00:00:00") }))
    .filter(ev => ev.dateObj >= now)
    .sort((a, b) => a.dateObj - b.dateObj);

  if (upcoming.length === 0) {
    list.innerHTML = `
      <div class="cal-empty">
        Inga inbokade marknader just nu — men fler är på gång.
        Håll utkik på Instagram, eller beställ som postorder redan idag.
      </div>`;
    return;
  }

  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  list.innerHTML = upcoming.map(ev => {
    const isSoon = (ev.dateObj - now) <= oneWeek;
    const day = String(ev.dateObj.getDate()).padStart(2, "0");
    const month = MONTHS_SV[ev.dateObj.getMonth()];
    return `
      <div class="cal-item">
        <div class="cal-date">
          <span class="d">${day}</span>
          <span class="m">${month}</span>
        </div>
        <div class="cal-where">
          <h4>${ev.title}</h4>
          <p>${ev.place}</p>
        </div>
        <span class="cal-status ${isSoon ? "soon" : "open"}">${isSoon ? "Snart" : "Kommande"}</span>
      </div>`;
  }).join("");
}

/* ==========================================================================
   FÅNGA TROLLET — litet minispel
   -----------------------------------------------------------------------
   Rent klientbaserat spel: rabattkoden är samma för alla som når
   GAME_WIN_SCORE, den är alltså inte unik eller spärrad automatiskt.
   Vill ni koppla riktiga, engångskoder krävs ett litet backend-steg
   (t.ex. generera koder i förväg och markera dem som förbrukade).
   ========================================================================== */

const GAME_DURATION = 20;      // sekunder
const GAME_WIN_SCORE = 8;      // antal fångade troll för rabatt
const GAME_DISCOUNT_CODE = "TROLL25";

let gameScore = 0;
let gameTimeLeft = GAME_DURATION;
let gameMoveTimeoutId = null;
let gameCountdownId = null;
let gameActive = false;

function initTrollGame() {
  const startBtn = document.getElementById("gameStartBtn");
  const stage = document.getElementById("gameStage");
  const trollBtn = document.getElementById("trollBtn");
  const hint = document.getElementById("gameHint");
  const resultPanel = document.getElementById("gameResult");
  const scoreEl = document.getElementById("gameScore");
  const timeEl = document.getElementById("gameTime");
  const thresholdEl = document.getElementById("winThreshold");
  if (!startBtn || !stage || !trollBtn) return;

  if (thresholdEl) thresholdEl.textContent = GAME_WIN_SCORE;

  startBtn.addEventListener("click", startTrollGame);
  trollBtn.addEventListener("click", catchTroll);

  function startTrollGame() {
    clearTimeout(gameMoveTimeoutId);
    clearInterval(gameCountdownId);

    gameScore = 0;
    gameTimeLeft = GAME_DURATION;
    gameActive = true;

    scoreEl.textContent = gameScore;
    timeEl.textContent = gameTimeLeft;
    hint.hidden = true;
    resultPanel.hidden = true;
    startBtn.textContent = "Spelar...";
    startBtn.disabled = true;

    moveTroll();

    gameCountdownId = setInterval(() => {
      gameTimeLeft -= 1;
      timeEl.textContent = Math.max(gameTimeLeft, 0);
      if (gameTimeLeft <= 0) endTrollGame();
    }, 1000);
  }

  function moveTroll() {
    if (!gameActive) return;
    clearTimeout(gameMoveTimeoutId);

    const stageRect = stage.getBoundingClientRect();
    const size = trollBtn.offsetWidth || 64;
    const maxX = Math.max(stageRect.width - size, 0);
    const maxY = Math.max(stageRect.height - size, 0);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    trollBtn.style.left = `${x}px`;
    trollBtn.style.top = `${y}px`;
    trollBtn.hidden = false;
    trollBtn.classList.remove("caught");
    // Omstarta pop-animationen
    trollBtn.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    trollBtn.offsetHeight;
    trollBtn.style.animation = "";

    // Trollet blir lite snabbare ju längre spelet pågår
    const visibleTime = Math.max(1100 - gameScore * 40, 550);
    gameMoveTimeoutId = setTimeout(moveTroll, visibleTime);
  }

  function catchTroll() {
    if (!gameActive) return;
    gameScore += 1;
    scoreEl.textContent = gameScore;
    trollBtn.classList.add("caught");
    clearTimeout(gameMoveTimeoutId);
    gameMoveTimeoutId = setTimeout(moveTroll, 160);
  }

  function endTrollGame() {
    gameActive = false;
    clearTimeout(gameMoveTimeoutId);
    clearInterval(gameCountdownId);
    trollBtn.hidden = true;

    startBtn.textContent = "Spela igen";
    startBtn.disabled = false;

    const resultInner = document.getElementById("gameResultInner");
    const won = gameScore >= GAME_WIN_SCORE;

    resultInner.innerHTML = won ? `
      <div class="result-card">
        <span class="result-score">${gameScore} troll fångade!</span>
        <h3>Snyggt trollat 🎉</h3>
        <p>Du har låst upp 25% rabatt på ditt nästa köp. Visa koden i DM på Instagram så löser vi det.</p>
        <div class="discount-code">
          <span id="discountCodeText">${GAME_DISCOUNT_CODE}</span>
          <button type="button" id="copyCodeBtn">Kopiera</button>
        </div>
        <p style="font-size:0.85rem;opacity:0.8;">Gäller ett köp per person, kan inte kombineras med andra erbjudanden.</p>
      </div>
    ` : `
      <div class="result-card">
        <span class="result-score">${gameScore} troll fångade</span>
        <h3>Nästan där!</h3>
        <p>Fånga minst ${GAME_WIN_SCORE} troll på ${GAME_DURATION} sekunder för att låsa upp 25% rabatt. Testa igen!</p>
      </div>
    `;
    resultPanel.hidden = false;

    if (won) {
      const copyBtn = document.getElementById("copyCodeBtn");
      copyBtn.addEventListener("click", () => {
        const text = GAME_DISCOUNT_CODE;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = "Kopierad!";
            setTimeout(() => (copyBtn.textContent = "Kopiera"), 1600);
          });
        }
      });
    }
  }
}
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Stäng menyn när en länk klickas
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeNav);
  });

  // Stäng menyn om man klickar utanför den
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav();
    }
  });

  // Stäng menyn om fönstret breddas ut över mobilläget
  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) closeNav();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  initMobileNav();
  initTrollGame();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

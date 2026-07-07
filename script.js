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

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

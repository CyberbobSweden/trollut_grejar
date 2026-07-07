# Trollut Grejar

Enkel, statisk hemsida för **Trollut Grejar** — handgjorda smycken (mestadels polymerlera) från Älvsbyn. Sidan är byggd för att driva trafik till [Instagram](https://www.instagram.com/trollut_grejar) och visa var försäljning sker via en marknadskalender, utöver postorder.

🔗 Live-demo: publicera via GitHub Pages (se nedan) för en länk.

## Struktur

```
trollut_grejar/
├── index.html      # all markup och innehåll
├── style.css        # designsystem (färger, typografi, layout)
├── script.js         # marknadskalender-logik + data
└── images/            # produktbilder och Instagram-QR
```

Ren HTML/CSS/JS utan byggsteg eller beroenden — funkar direkt i vilken webbserver som helst.

## Redigera marknadskalendern

Öppna `script.js` och redigera listan `MARKET_DATES` högst upp i filen:

```js
const MARKET_DATES = [
  {
    date: "2026-08-15",
    title: "Hantverksmarknad",
    place: "Framnäs friluftsområde, Älvsbyn"
  },
  // ... lägg till fler här
];
```

- Datum skrivs som `"ÅÅÅÅ-MM-DD"`.
- Marknader vars datum redan passerat visas inte längre — inget behöver städas bort manuellt.
- Är listan tom (eller alla datum har passerat) visas ett vänligt tomt-läge istället.

> **Obs:** exempeldatumen som ligger i filen från start är platshållare. Byt ut dem mot era riktiga marknader innan sidan publiceras skarpt.

## Byta ut bilder

Lägg nya produktbilder i `images/` och peka på dem i `index.html` (i `<section id="gallery">`). Behåll gärna kvadratiska eller liknande beskurna bilder för att gallerirutnätet ska se enhetligt ut.

## Publicera med GitHub Pages

1. Gå till repots **Settings → Pages**.
2. Under "Build and deployment", välj **Deploy from a branch**.
3. Välj branch `main` och mappen `/ (root)`.
4. Spara — sidan publiceras på `https://cyberbobsweden.github.io/trollut_grejar/` inom någon minut.

## Kontakt

Beställningar och frågor tas just nu emot via DM på Instagram: [@trollut_grejar](https://www.instagram.com/trollut_grejar).

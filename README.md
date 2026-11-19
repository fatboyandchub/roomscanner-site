# roomscanner.3dlibrary.app

The website for **Home Inspect: Room Scanner**, served by GitHub Pages at
https://roomscanner.3dlibrary.app (the `CNAME` file names it).

Plain HTML and CSS, the system font, one small script of our own. Nothing is
loaded from anywhere else: no web fonts, no analytics, no cookies.

## The pages

- `index.html` — the home page.
- `support.html` — support and the FAQ (also at `/support`).
- `privacy.html` — the privacy policy (also at `/privacy`).
- `404.html` — the page for a wrong address.

## Changing things

- **The price** is in one place only: the price card near the bottom of
  `index.html` (look for "The price lives here"). The support page links to it
  instead of repeating it.
- **The support email** is `roomscanner@3dlibrary.app`, in the footers and the
  support and privacy pages.
- After changing any picture, the stylesheet or the script, run
  `python3 tools/stamp.py` from this folder. It puts a fresh `?v=` on every
  asset address so browsers fetch the new file, and refreshes the
  `support/index.html` and `privacy/index.html` copies.

## Looking at it

`python3 -m http.server 8791` in this folder, then open
http://127.0.0.1:8791/ in a browser.

# Bhuv1nation Website

A complete, animated, pastel-themed website for Bhuv1nation home page, content showcase,
brand collaboration form, and an interactive appointment booking system.

## Files

```
bhuv1nation-website/
├── index.html   → all page content/structure
├── style.css    → all styling, animations, layout, colors
├── script.js    → all interactivity (nav, calendar, forms, dashboard)
└── README.md    → this file
```

No build step, no dependencies to install it's plain HTML/CSS/JS.

## How to run it locally

**Easiest option:** just double-click `index.html` and it opens in your browser. Everything
works this way layout, animations, forms.

**Recommended option (local server):** some browsers are stricter about local files, so a
quick local server avoids any edge cases. Pick whichever you have installed:

Using Python (already on most Macs/Linux, and on Windows if installed):
```bash
cd bhuv1nation-website
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

Using Node.js:
```bash
cd bhuv1nation-website
npx serve .
```
It will print a local URL to open.

Using VS Code: install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

To stop a running server, press `Ctrl + C` in the terminal.

## Before this goes live update these

1. **Your photo** open `index.html`, search for `📸 REPLACE PHOTO` (two spots: the hero
   section and the About section). Replace the placeholder `<div class="portrait-placeholder">`
   with `<img src="your-photo.jpg" class="portrait-photo" alt="Bhuvan Bhuv1nation">` and
   place your photo file in this folder.
2. **Contact email** currently `collab@bhuv1nation.com` (search and replace in `index.html`).
3. **Instagram / X links** currently placeholder `href="#"` in the footer and Contact section.
4. **Admin passcode** in `script.js`, search for `ADMIN_PASSCODE = 'bhuv2026'` and change it
   to something private. This unlocks the "Creator Login" dashboard in the footer, which lists
   booking and collaboration form submissions.

## Important: how the booking/collab forms save data

The forms are wired to a persistent storage API that only exists **inside Claude.ai**, when this
site is opened as a Claude-rendered artifact. That's what powers the "Creator Login" dashboard.

If you host these files on your own domain (Netlify, Vercel, GitHub Pages, your own server,
etc.), that storage API won't be present. The site is built to handle this gracefully: if it
can't save a submission, it automatically opens the visitor's email app with the details
pre-filled instead, so you never silently lose an inquiry. But for a real production setup where
submissions save to a real database and notify you automatically, you'll want to connect a form
backend options include:

- **Formspree** or **Web3Forms** paste an endpoint URL into the two `<form>` tags, minimal setup
- **A small custom backend** (Node/Express + a database) if you want full control
- **Calendly embed** as an alternative to the custom calendar, if you'd rather offload scheduling entirely

Happy to help wire up any of these when you're ready to go live.

## Deploying

Since it's fully static, you can deploy by dragging this folder into:
- Netlify (drag-and-drop at app.netlify.com/drop)
- Vercel
- GitHub Pages
- Any standard web host

No configuration needed beyond the updates listed above.

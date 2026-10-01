# pansensoyi.github.io

Portfolio site for Ian Pansensoy — Technical Architect, CDP / MarTech / Adtech.

Live at **https://pansensoyi.github.io**

## Structure

Plain HTML, CSS and a little JavaScript. No build step, no dependencies, no analytics.

| File | Purpose |
|---|---|
| `index.html` | All content |
| `styles.css` | Styles, light and dark themes |
| `main.js` | Theme toggle, scroll reveal, nav highlight |
| `scripts/sync-projects.mjs` | Regenerates the "Open source" cards from each repo's metadata |

## Updating the project cards

The "Open source" section is generated from the `name` and `description` in each
project's `package.json` or `pyproject.toml`. With the project repos checked out
next to this one:

```bash
node scripts/sync-projects.mjs            # repos in ../
node scripts/sync-projects.mjs ~/code     # or point at another folder
```

## Preview locally

```bash
python3 -m http.server 4173
```

## Deploy

GitHub Pages serves the `main` branch root. Push to `main` and it is live.

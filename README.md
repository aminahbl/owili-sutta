# owili-sutta

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build) [![Netlify Status](https://api.netlify.com/api/v1/badges/c3f04fc3-5e04-477c-9adc-b5bd03490071/deploy-status)](https://app.netlify.com/sites/owili-sutta/deploys)

A site that serves random [suttas](https://suttacentral.net/discourses-guide-sujato?lang=en). No friction from interfaces, options, collection navigation, or whatever; just get a sutta! The primary focus is on short text that can be read in approximately 5mins.

## Project

- Hosted on Netlify (under GitLab account).

Local development:

```
npm run dev
```

The site is fully static. Netlify deploys the functions in `netlify/functions` separately; running them locally needs the Netlify CLI (`netlify dev`).

## Data

The sutta texts come from SuttaCentral's [bilara-data](https://github.com/suttacentral/bilara-data) and are stored in `data/`. The build reads them from there and makes no network requests.

- `data/suttas/{id}.json` holds one sutta: its source text and every English translation, filled into SuttaCentral's HTML templates.
- `short-suttas.json` and `long-suttas.json` list the sutta ids by translator. A short sutta has a translation file of 300 to 7,000 bytes, and a long one is larger. The `vinaya` and `name` folders are skipped.
- `translators.json` and `languages.json` hold the names shown on the site.

### Refreshing the texts

The refresh script reads a local clone of bilara-data on its `published` branch and rewrites everything in `data/`. Pulling the clone is the only download.

```bash
git -C ~/code/clones/bilara-data pull
npm run refresh -- ~/code/clones/bilara-data
```

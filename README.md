# owili-sutta

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build) [![Netlify Status](https://api.netlify.com/api/v1/badges/c3f04fc3-5e04-477c-9adc-b5bd03490071/deploy-status)](https://app.netlify.com/sites/owili-sutta/deploys)

A site that serves random [suttas](https://suttacentral.net/discourses-guide-sujato?lang=en). No friction from interfaces, options, collection navigation, or whatever; just get a sutta! The primary focus is on short text that can be read in approximately 5mins.

## Project

- Hosted on Netlify (under GitLab account).

Local development:

```
ntl login
ntl dev
```

## Data

Sourced from [SuttaCentral's API](https://discourse.suttacentral.net/t/api-documentation-question/24410).

### Sutta list data prep

LAST UPDATED: 2025-04-25T15:28:36.396Z

#### Short suttas

```bash
curl -s https://api.github.com/repos/suttacentral/bilara-data/git/trees/published:translation/en?recursive=1 | jq '[
    .tree[]
  | select(
      .type=="blob"
      and ( .path | test("(^|/)(vinaya|name)/") | not )
      and .size > 300
      and .size < 7000
    )
  | ( .path | split("/") ) as $p
  | { id:($p[-1]|split("_")[0]), translator:$p[0] }
]' > data/short-suttas.json
```

#### Long suttas

```bash
curl -s https://api.github.com/repos/suttacentral/bilara-data/git/trees/published:translation/en?recursive=1 | jq '[
    .tree[]
  | select(
      .type=="blob"
      and ( .path | test("(^|/)(vinaya|name)/") | not )
      and .size > 7000
    )
  | ( .path | split("/") ) as $p
  | { id:($p[-1]|split("_")[0]), translator:$p[0] }
]' > data/long-suttas.json
```
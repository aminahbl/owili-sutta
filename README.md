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

Standard length text filtering process

```
find /bilara-data/translation/en -type d -name "vinaya" -exec rm -r {} \;
find /bilara-data/translation/en -type f \( -size +7k -o -size -300c \) -exec rm {} \; && find . -type f > output.txt
```

Longer text filtering process

```
find /bilara-data/translation/en -type d -name "vinaya" -exec rm -r {} \;
find /bilara-data/translation/en -type f -7k -exec rm {} \; && find . -type f > output.txt
```


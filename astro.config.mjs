import { defineConfig } from "astro/config"

import netlify from "@astrojs/netlify"

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: netlify(),
  redirects: {
    // TODO: Astro's SSR `_redirects` file conflicts with redirects Netlify redirects (see: https://github.com/withastro/astro/issues/7970#issuecomment-1666570628). In theory, this might solve it (https://dev.to/cassidoo/setting-up-netlify-redirects-with-astro-426g#comment-2a2en), but Astro doesn't like Netlify's the sytax.
    // '/api/net/*': {
    //   status: 200,
    //   // https://docs.netlify.com/routing/redirects/redirect-options/
    //   destination: '/.netlify/functions/:splat ',
    // },
  }
})

import { getRandomSutta } from "~/scripts"
import { getSavedView, showView, suttaPath } from "~/scripts/view"

// Loads a random sutta page into the home page, so the home page keeps its own place in search.
const loadSutta = async () => {
  const { id, translator } = getRandomSutta()
  const view = getSavedView()

  try {
    const response = await fetch(`/${id}/`)
    if (!response.ok) throw new Error(`Fetching /${id}/ returned ${response.status}`)

    const page = new DOMParser().parseFromString(await response.text(), "text/html")
    const content = page.querySelector("[data-content]")
    const footer = page.querySelector("footer")
    if (!content || !footer) throw new Error(`/${id}/ has no sutta content`)

    document.querySelector("[data-content]")?.replaceWith(content)
    document.querySelector("main")?.after(footer)
    showView(view, translator)
  } catch (error) {
    console.error(error)
    window.location.replace(suttaPath(id, translator, view))
  }
}

loadSutta()

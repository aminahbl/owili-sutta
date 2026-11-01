import { getRandomSutta } from "~/scripts"
import { hideLoading } from "~/scripts/loading"

const contentBlock = document.querySelector("[data-content]") as HTMLElement

const fetchSutta = async () => {
  if (!contentBlock) {
    console.error("Content block not found")
    return
  }

  try {
    const url = ".netlify/functions/random"

    const data = await fetch(url).then((res) => res.json())

    const { id, translator, title, text } = data

    contentBlock.innerHTML = text

    history.replaceState(null, "", `/${translator}/${id}/`)
    document.title = title

    hideLoading()
  } catch (error) {
    console.error(error)
    // Every sutta also exists as a prerendered page, so fall back to one.
    window.location.pathname = getRandomSutta().path
  }
}

fetchSutta()

import { getTitle } from "~/scripts"

// The order in which the view button cycles through the views.
const VIEWS = ["translation", "both", "source"] as const
type View = (typeof VIEWS)[number]

const isView = (value: unknown): value is View => VIEWS.includes(value as View)

// The view used to build links. Only the view button changes it, and it lasts for one visit.
export const getSavedView = (): View => {
  try {
    const saved = sessionStorage.getItem("view")
    return isView(saved) ? saved : "translation"
  } catch {
    return "translation"
  }
}

const saveView = (view: View) => {
  try {
    sessionStorage.setItem("view", view)
  } catch {
    // The view then applies to this page only.
  }
}

export const suttaPath = (id: string, translator: string, view: View) => {
  if (view === "source") return `/${id}/`
  if (view === "both") return `/${id}/?translator=${translator}&source`
  return `/${id}/?translator=${translator}`
}

const viewName = (view: View, language: string) => {
  if (view === "source") return language
  if (view === "both") return `English and ${language}`
  return "English"
}

const getState = () => {
  const { view, translator = "" } = document.documentElement.dataset
  const content = document.querySelector("[data-content]") as HTMLElement
  const { id = "", root = "", language = "source" } = content.dataset
  return { view: isView(view) ? view : "translation", translator, id, root, language, content }
}

// Updates the parts of the page that the script in <head> runs too early to reach.
export const syncPage = () => {
  const { view, translator, id, language, content } = getState()
  const titleSelector =
    view === "source" ? "h1 .root" : `h1 [data-translator="${translator}"]`
  const suttaTitle = content.querySelector(titleSelector)?.textContent
  document.title = getTitle({ id, suttaTitle })

  const button = document.querySelector("[data-btn='view']")
  const label = `Change view (showing ${viewName(view, language)})`
  button?.setAttribute("title", label)
  button?.setAttribute("aria-label", label)
}

export const showView = (view: View, translator: string) => {
  document.documentElement.dataset.view = view
  document.documentElement.dataset.translator = translator

  const { id, root } = getState()
  history.replaceState(null, "", suttaPath(id, translator, view))

  // Only sutta pages have a canonical link; the home page must not gain one.
  const canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']")
  if (canonical) {
    canonical.href =
      view === "source"
        ? `https://suttacentral.net/${id}/${root}`
        : `https://suttacentral.net/${id}/en/${translator}`
  }

  syncPage()
}

// Moves to the next view, or the previous one when step is -1, saves it and returns its name.
export const changeView = (step: 1 | -1 = 1) => {
  const { view, translator, language } = getState()
  const next = VIEWS[(VIEWS.indexOf(view) + step + VIEWS.length) % VIEWS.length]
  showView(next, translator)
  saveView(next)
  return viewName(next, language)
}

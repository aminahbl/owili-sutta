import { getRandomSutta } from "~/scripts"
import { changeView, getSavedView, suttaPath, syncPage } from "~/scripts/view"

const clickTargets = document.querySelectorAll(
  "[data-click]"
) as NodeListOf<HTMLElement>

// The home page sets its view once it has loaded a sutta.
if (document.documentElement.dataset.view) syncPage()

const showTip = (element: HTMLElement, text: string) => {
  element.dataset.tip = text
  element.classList.add("tip")

  setTimeout(() => {
    element.classList.remove("tip")
  }, 1250)
}

clickTargets.forEach((clickable) => {
  const { btn } = clickable.dataset
  clickable.onclick = () => {
    if (btn === "short" || btn === "long") {
      const { id, translator } = getRandomSutta(btn)
      window.location.assign(suttaPath(id, translator, getSavedView()))
    }

    if (btn === "view") {
      showTip(clickable, changeView())
    }

    if (btn === "share") {
      const url = window.location.href

      navigator.clipboard.writeText(url).then(() => {
        showTip(clickable, "Link copied!")
      })
    }
  }
})

document.addEventListener("keydown", (event) => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return

  const key = event.key.toLowerCase()
  if (key !== "v" && key !== "c") return

  const button = document.querySelector<HTMLElement>("[data-btn='view']")
  if (button) showTip(button, changeView(key === "v" ? 1 : -1))
})

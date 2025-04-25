import { getRandomSutta } from "~/scripts"

const navEntries = performance.getEntriesByType(
  "navigation"
) as PerformanceNavigationTiming[]

const clickTargets = document.querySelectorAll(
  "[data-click]"
) as NodeListOf<HTMLElement>

const isReload = navEntries[0].type === "reload"

const { path } = getRandomSutta()

if (isReload) {
  window.location.pathname = path
}

clickTargets.forEach((clickable) => {
  const { btn } = clickable.dataset
  clickable.onclick = () => {
    if (btn === "short") {
      window.location.pathname = path
    }

    if (btn === "long") {
      window.location.pathname = getRandomSutta("long").path
    }

    if (btn === "share") {
      const url = window.location.href

      navigator.clipboard.writeText(url).then(() => {
        clickable.classList.add("copied")

        setTimeout(() => {
          clickable.classList.remove("copied")
        }, 1250)
      })
    }
  }
})

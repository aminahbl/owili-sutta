import { getRandomSutta } from "~/scripts"

const navEntries = performance.getEntriesByType(
  "navigation"
) as PerformanceNavigationTiming[]

const clickTargets = document.querySelectorAll(
  "[data-umami-click]"
) as NodeListOf<HTMLElement>

const isReload = navEntries[0].type === "reload"

const { path } = getRandomSutta()

if (isReload) {
  window.location.pathname = path
}

clickTargets.forEach((clickable) => {
  const { btn, umamiClick } = clickable.dataset
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

    // TODO: umami has an issue with not returning event data. Was reported as fixed, but looks like not: https://forum.cloudron.io/topic/6936/umami-package-updates/31#31. In the meantime, one hack:
    window.umami.track(umamiClick, {
      name: [
        ["clickEvent", umamiClick],
        ["currentSutta", window.location.pathname],
        ["session history", window.history.length],
      ],
    })
  }
})

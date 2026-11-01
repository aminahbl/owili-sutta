import { getRandomSutta } from "~/scripts"
import { hideLoading, showLoading } from "~/scripts/loading"

const clickTargets = document.querySelectorAll(
  "[data-click]"
) as NodeListOf<HTMLElement>

// A page restored by the back button would otherwise keep showing the overlay.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) hideLoading()
})

clickTargets.forEach((clickable) => {
  const { btn } = clickable.dataset
  clickable.onclick = () => {
    if (btn === "short" || btn === "long") {
      showLoading()
      window.location.pathname = getRandomSutta(btn === "long" ? "long" : "short").path
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

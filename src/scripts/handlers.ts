import { getRandomSutta } from "~/scripts"

const clickTargets = document.querySelectorAll(
  "[data-click]"
) as NodeListOf<HTMLElement>

const loadingoverlay = document.getElementById("loading-overlay");

clickTargets.forEach((clickable) => {
  const { btn } = clickable.dataset
  clickable.onclick = () => {
    if (btn === "short" || btn === "long") {
      if (!loadingoverlay) {
        console.error("Loading overlay not found")
        return
      }
      loadingoverlay.style.opacity = "1";
      loadingoverlay.style.pointerEvents = "auto";
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
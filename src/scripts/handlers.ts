import { getRandomSutta } from "~/scripts"

const clickTargets = document.querySelectorAll(
  "[data-click]"
) as NodeListOf<HTMLElement>

clickTargets.forEach((clickable) => {
  const { btn } = clickable.dataset
  clickable.onclick = () => {
    if (btn === "short") {
      window.location.pathname = getRandomSutta().path
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

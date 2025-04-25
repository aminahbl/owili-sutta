const contentBlock = document.querySelector("[data-content]") as HTMLElement
const loadingoverlay = document.getElementById("loading-overlay");

const fetchSutta = async () => {
  if (!contentBlock || !loadingoverlay) {
    console.error("Content block or loading overlay not found")
    return
  }

  loadingoverlay.style.opacity = "1";
  loadingoverlay.style.pointerEvents = "auto";

  const url = ".netlify/functions/random"

  const data = await fetch(url).then((res) => res.json())

  const { id, translator, title, text } = data
  
  contentBlock.innerHTML = text
  
  history.replaceState(null, "", `/${translator}/${id}/`)
  document.title = title

  loadingoverlay.style.opacity = "0";
  loadingoverlay.style.pointerEvents = "none";
}

fetchSutta()

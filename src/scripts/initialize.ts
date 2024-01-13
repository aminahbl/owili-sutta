const contentBlock = document.querySelector("[data-content]") as HTMLElement

const fetchSutta = async () => {
  if (!contentBlock) return

  const url = ".netlify/functions/random"

  const data = await fetch(url).then((res) => res.json())

  const { id, translator, title, text } = data
  
  const loadingSpan = document.querySelector("[data-loading]")
  
  contentBlock.innerHTML = text
  loadingSpan && loadingSpan.remove()
  
  history.replaceState(null, "", `/${translator}/${id}/`)
  document.title = title
}

fetchSutta()

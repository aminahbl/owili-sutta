import shorts from "../../data/short-suttas.json"
import long from "../../data/long-suttas.json"

type GetContent = {
  id: string
  translator: string
}

export const getRandomSutta = (type: "short" | "long" | "any" = "short") => {
  let suttaGroup = shorts

  if (type === "long") {
    suttaGroup = long
  }

  if (type === "any") {
    suttaGroup = [...shorts, ...long]
  }

  const index = Math.floor(Math.random() * suttaGroup.length)

  const { id, translator } = suttaGroup[index]
  return { id, translator, path: `/${translator}/${id}/` }
}

// SuttaCentral's API sometimes answers with a 502 that succeeds on a second try.
const RETRY_DELAYS_MS = [1000, 3000]

export const getContent = async ({ id, translator }: GetContent) => {
  const url = `https://suttacentral.net/api/bilarasuttas/${id}/${translator}`
  const options = {
    headers: new Headers({
      "Content-Type": "text/plain; charset=UTF-8",
    }),
  }

  let data = await fetch(url, options)

  for (const delay of RETRY_DELAYS_MS) {
    if (data.ok) break
    await new Promise((resolve) => setTimeout(resolve, delay))
    data = await fetch(url, options)
  }

  if (!data.ok) {
    throw new Error(`SuttaCentral returned ${data.status} for ${id}/${translator}`)
  }

  const { translation_text, html_text } = (await data.json()) as {
    translation_text: Record<string, string>
    html_text: Record<string, string>
  }

  return Object.entries(translation_text)
    .map(([key, value]) => html_text[key].replace("{}", value))
    .join("\n")
}

export const getTitle = ({ content, id }: { content: string; id: string }) => {
  var match = content.match(/<h1.*?>(.*?)<\/h1>/)
  var suttaTitle = match ? match[1] : "I love it!"
  return `OhWowASutta! · ${id} · ${suttaTitle}`
}

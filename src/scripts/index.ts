import shorts from "../../data/short-suttas.json"
import long from "../../data/long-suttas.json"

// Each translator's version is a separate entry, so the choice is made over all entries.
export const getRandomSutta = (type: "short" | "long" = "short") => {
  const groups: Record<string, string[]> = type === "long" ? long : shorts
  const entries = Object.entries(groups)
  const total = entries.reduce((sum, [, ids]) => sum + ids.length, 0)
  let index = Math.floor(Math.random() * total)

  for (const [translator, ids] of entries) {
    if (index < ids.length) return { id: ids[index], translator }
    index -= ids.length
  }

  throw new Error(`The ${type} sutta list is empty`)
}

export const getTitle = ({ id, suttaTitle }: { id: string; suttaTitle?: string | null }) =>
  `OhWowASutta! · ${id} · ${suttaTitle?.trim() || "I love it!"}`

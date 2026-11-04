// Regenerates data/ from a local clone of bilara-data on its `published` branch.
// Usage: npm run refresh -- ~/code/clones/bilara-data

import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { join, relative } from "node:path"

type Segments = Record<string, string>

const SHORT_MIN_BYTES = 300
const SHORT_MAX_BYTES = 7000
const DEFAULT_TRANSLATOR = "sujato"

const clone = process.argv[2]
if (!clone) throw new Error("Pass the path of a bilara-data clone")

const head = readFileSync(join(clone, ".git/HEAD"), "utf8").trim()
if (head !== "ref: refs/heads/published") {
  throw new Error(`bilara-data must be on the published branch, found ${head}`)
}

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"))

const listFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(dir, entry.name)
      return entry.isDirectory() ? listFiles(path) : [path]
    })

const idOf = (path: string) => path.split("/").pop()!.split("_")[0]

// Root files are at root/{language}/{edition}/…/{id}_root-{language}-{edition}.json.
const rootFiles = new Map(
  listFiles(join(clone, "root")).map((path) => [idOf(path), path])
)

const translationDir = join(clone, "translation/en")
const short: Record<string, string[]> = {}
const long: Record<string, string[]> = {}
const translationFiles = new Map<string, Map<string, string>>()

for (const path of listFiles(translationDir)) {
  const relativePath = relative(translationDir, path)
  if (/(^|\/)(vinaya|name)\//.test(relativePath)) continue

  const size = statSync(path).size
  let list = null
  if (size > SHORT_MIN_BYTES && size < SHORT_MAX_BYTES) list = short
  if (size > SHORT_MAX_BYTES) list = long
  if (!list) continue

  const id = idOf(path)
  const translator = relativePath.split("/")[0]
  list[translator] ??= []
  list[translator].push(id)

  if (!translationFiles.has(id)) translationFiles.set(id, new Map())
  translationFiles.get(id)!.set(translator, path)
}

const byDefaultFirst = (a: string, b: string) => {
  if (a === DEFAULT_TRANSLATOR) return -1
  if (b === DEFAULT_TRANSLATOR) return 1
  return a.localeCompare(b)
}

// A few translations have segments with no template or source text.
// Each such key goes after the key that precedes it in the translation,
// and its text gets a paragraph of its own.
const mergeKeys = (template: Segments, translations: Segments[]) => {
  const keys = Object.keys(template)
  for (const translation of translations) {
    let previous = -1
    for (const key of Object.keys(translation)) {
      const index = keys.indexOf(key)
      if (index === -1) {
        previous += 1
        keys.splice(previous, 0, key)
      } else {
        previous = index
      }
    }
  }
  return keys
}

const suttasDir = "data/suttas"
rmSync(suttasDir, { recursive: true, force: true })
mkdirSync(suttasDir)

const languageCodes = new Set<string>()

for (const [id, files] of translationFiles) {
  const rootPath = rootFiles.get(id)
  if (!rootPath) throw new Error(`No source text for ${id}`)

  const [language, edition] = relative(join(clone, "root"), rootPath).split("/")
  languageCodes.add(language)

  const htmlPath = rootPath
    .replace(join(clone, "root"), join(clone, "html"))
    .replace(/_root-.*$/, "_html.json")
  const template: Segments = readJson(htmlPath)
  const root: Segments = readJson(rootPath)
  const translators = [...files.keys()].sort(byDefaultFirst)
  const translations: Segments[] = translators.map((translator) =>
    readJson(files.get(translator)!)
  )

  const html = mergeKeys(template, translations)
    .map((key) => {
      let text = key in root ? `<span class='root'>${root[key]}</span>` : ""
      translators.forEach((translator, i) => {
        if (key in translations[i]) {
          text += `<span class='translation' data-translator='${translator}'>${translations[i][key]}</span>`
        }
      })
      return (template[key] ?? "<p>{}</p>").replace("{}", text)
    })
    .join("\n")

  const titleKey = Object.keys(template).find((key) => template[key].includes("<h1"))
  const title = titleKey ? translations[0][titleKey]?.trim() : undefined

  writeFileSync(
    join(suttasDir, `${id}.json`),
    JSON.stringify({ root: `${language}/${edition}`, translators, title, html }) + "\n"
  )
}

const writeData = (file: string, data: object) =>
  writeFileSync(join("data", file), JSON.stringify(data, null, 2) + "\n")

const pickNames = (source: Record<string, { name: string }>, keys: Iterable<string>) =>
  Object.fromEntries([...keys].sort().map((key) => [key, source[key].name]))

writeData("short-suttas.json", short)
writeData("long-suttas.json", long)
writeData(
  "translators.json",
  pickNames(readJson(join(clone, "_author.json")), [...Object.keys(short), ...Object.keys(long)])
)
writeData("languages.json", pickNames(readJson(join(clone, "_language.json")), languageCodes))

console.log(`Wrote ${translationFiles.size} suttas to ${suttasDir}`)

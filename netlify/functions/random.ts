import { type Handler } from "@netlify/functions"
import { getContent, getRandomSutta, getTitle } from "~/scripts"

const handler: Handler = async () => {
  const { id, translator } = getRandomSutta()

  const content = await getContent({ id, translator })

  const title = getTitle({ content, id })

  return {
    statusCode: 200,
    body: JSON.stringify({ id, translator, title, text: content }),
  }
}

export { handler }

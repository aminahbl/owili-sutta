import { type Handler, type HandlerEvent } from "@netlify/functions"


const handler: Handler = async (event: HandlerEvent) => {

  return {
    statusCode: 200,
    body: "Namo tassa bhagavato arahato sammā-sambuddhassa"
  }
}

export { handler }

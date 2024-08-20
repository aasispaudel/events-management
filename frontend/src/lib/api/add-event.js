import { fastApiUrl } from "../env"

export async function addEvent({ myEvent }) {
  try {
    const res = await fetch(`${fastApiUrl}/api/event/add`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(myEvent),
    })
    const data = await res.json()
    if (!res.ok || !data.id) {
      return { error: data.detail }
    }
    return { data }
  } catch (error) {
    console.log({ error })

    return { error }
  }
}

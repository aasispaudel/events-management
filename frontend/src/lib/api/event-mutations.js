import { fastApiUrl } from "../env"

export async function addEvent({ myEvent }) {
  try {
    const res = await fetch(`${fastApiUrl}/add`, {
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

export async function updateEvent({ myEvent }) {
  try {
    const res = await fetch(`${fastApiUrl}/update/${myEvent.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
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

export async function deleteEvent({ eventId }) {
  try {
    const res = await fetch(`${fastApiUrl}/delete/${eventId}`, {
      method: "DELETE",
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

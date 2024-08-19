export const fetchCountries = async () => {
  const url = "https://holidayapi.com/v1/countries"
  const params = new URLSearchParams({
    pretty: "true",
    key: "f42ac06c-5777-4399-afb5-6e15a24565c5",
  })

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
    console.log(data)
  } catch (error) {
    return { error }
    console.error("Error fetching countries:", error)
  }
}

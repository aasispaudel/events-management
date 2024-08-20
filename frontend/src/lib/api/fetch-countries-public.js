import "client-only"

export const fetchCountries = async () => {
  const url = "https://holidayapi.com/v1/countries"
  const params = new URLSearchParams({
    public: true,
    pretty: true,
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

    let data = await response.json()
    data = formatCountries(data.countries)

    const dataJsonString = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(dataJsonString)
    return { data }
  } catch (error) {
    return { error }
    console.error("Error fetching countries:", error)
  }
}

const formatCountries = (countries) => {
  return countries.map((country) => {
    return {
      code: country.code,
      name: country.name,
    }
  })
}

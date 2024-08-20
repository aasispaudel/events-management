"use client"

import { CountryContext } from "@/app/Providers"
import { fastApiUrl } from "@/lib/env"
import { rectifyTimezone } from "@/lib/misc/rectify"
import { getLocalTimeZone } from "@internationalized/date"
import { Select, SelectItem } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import SelectTimezones from "./SelectTimezones"

const SelectCountries = () => {
  const { setCountry: setGlobalCountry } = useContext(CountryContext)

  const [countries, setCountries] = useState([])
  const [error, setError] = useState(null)

  const [selectedCountry, setSelectedCountry] = useState()

  useEffect(() => {
    if (selectedCountry) {
      setGlobalCountry(selectedCountry)
    }
  }, [selectedCountry])

  useEffect(() => {
    ;(async () => {
      try {
        const req1 = fetch("data/countries.json")

        const r2Url = new URL(`${fastApiUrl}/country-code`)
        r2Url.searchParams.append(
          "timezone",
          rectifyTimezone(getLocalTimeZone())
        )
        const req2 = fetch(r2Url)

        const [res1, res2] = await Promise.all([req1, req2])

        const countries = await res1.json()
        setError(null)
        setCountries(countries)

        if (!res2.ok) {
          toast.warning("Something went wrong. Defaultin to US/New_York")
          setSelectedCountry("US")
          return
        }

        const data = await res2.json()
        setSelectedCountry(data.country_code)
      } catch (error) {
        setCountries([])
        setError(error)
        console.log({ error })
      }
    })()
  }, [])

  const onCountrySelect = (e) => {
    const value = e.target.value
    if (value.size === 0) return
    setSelectedCountry(value)
  }

  return (
    <div className="flex gap-x-2 w-full">
      <Select
        className="text-black dark:text-white"
        size="sm"
        label="Select country"
        items={countries}
        selectedKeys={[selectedCountry]}
        onChange={onCountrySelect}
      >
        {(country) => (
          <SelectItem className="text-black dark:text-white" key={country.code}>
            {country.name}
          </SelectItem>
        )}
      </Select>

      <SelectTimezones countryCode={selectedCountry} />
    </div>
  )
}

export default SelectCountries

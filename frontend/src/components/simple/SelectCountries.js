"use client"

import { Select, SelectItem } from "@nextui-org/react"
import { useEffect, useState } from "react"
import SelectTimezones from "./SelectTimezones"

const SelectCountries = () => {
  const [countries, setCountries] = useState([])
  const [error, setError] = useState(null)

  const [selectedCountry, setSelectedCountry] = useState(new Set(["US"]))

  console.log({ selectedCountry })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("data/countries.json")
        const data = await res.json()

        setError(null)
        setCountries(data)
      } catch (error) {
        setCountries([])
        setError(error)
        console.log({ error })
      }
    })()
  }, [])

  const onCountrySelect = (value) => {
    if (value.size === 0) return
    setSelectedCountry(value)
  }

  return (
    <div className="flex gap-x-2 w-full">
      <Select
        className=""
        size="sm"
        label="Select country"
        items={countries}
        selectedKeys={selectedCountry}
        onSelectionChange={onCountrySelect}
      >
        {(country) => (
          <SelectItem key={country.code}>{country.name}</SelectItem>
        )}
      </Select>

      <SelectTimezones countryCode={Array.from(selectedCountry)[0]} />
    </div>
  )
}

export default SelectCountries

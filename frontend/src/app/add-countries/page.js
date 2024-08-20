"use client"

import { fetchCountries } from "@/lib/api/fetch-countries-public"
import { Button } from "@nextui-org/react"

const page = () => {
  const addCountries = async () => {
    const { data, error } = await fetchCountries()
    console.log({ data, error })
  }

  return (
    <div className="flex justify-center min-h-screen items-center">
      <Button onPress={addCountries}>Add countries</Button>
    </div>
  )
}

export default page

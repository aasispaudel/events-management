export const makeReadableOffset = (offsetInMilis) => {
  const totalMinutes = offsetInMilis / (1000 * 60)
  const hours = Math.floor(Math.abs(totalMinutes) / 60)
  const minutes = Math.abs(totalMinutes) % 60

  // Handle the sign (positive or negative)
  const sign = offsetInMilis >= 0 ? "+" : "-"

  // Format the hours and minutes to always have two digits
  const formattedHours = String(hours).padStart(2, "0")
  const formattedMinutes = String(minutes).padStart(2, "0")

  return `${sign}${formattedHours}:${formattedMinutes}`
}

/**
 * This method helps to correct if there is any known mismatches between timezone names
 * between client and server
 * Known bug:
 * Asia/Katmandu from Intl library should be Asia/Kathmandu
 */
export function rectifyTimezone(timezone) {
  if (timezone === "Asia/Katmandu") return "Asia/Kathmandu"
  return timezone
}

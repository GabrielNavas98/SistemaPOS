// src/lib/utils/getToken.ts
import Cookies from "js-cookie"

export const getToken = (): string | undefined => {
    console.log('Cookies.get("token")',Cookies.get("token"));
  return Cookies.get("token")
}

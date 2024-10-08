import ThemeButton from "@/components/simple/ThemeButton"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import Providers from "./Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Asis Events Management",
  description: "Manage events with Asis",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" dark:bg-[#000000] w-[100%] h-[100%] absolute overflow-x-hidden">
          <Providers>
            <div className="relative flex justify-between w-full h-16 bg-default rounded-sm px-2 py-3">
              <Toaster richColors position="top-right" />

              <div className="flex justify-end  w-full gap-x-4 items-center mr-2 mt-2 z-[100]">
                <ThemeButton />
              </div>
            </div>

            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}

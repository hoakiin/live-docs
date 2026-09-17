import { cn } from "@/lib/utils"
import { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import "./globals.css"
import Provider from "./Provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "LiveDocs",
  description: "Your go-to collaborative editor",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: { colorPrimary: "#3371FF", fontSize: "16px" },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn("antialiased", fontSans.variable, "font-sans")}>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}

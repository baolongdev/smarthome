import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MongoSync } from "@/components/MongoSync"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Smart Home",
  description: "Local-first Smart Home Control Panel",
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable}`}>
      <body className="h-full bg-bg-primary text-text-secondary overflow-x-hidden antialiased">
        <MongoSync />
        {children}
      </body>
    </html>
  )
}

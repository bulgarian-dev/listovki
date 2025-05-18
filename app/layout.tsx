import "@/styles/globals.css";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import { DiscordIcon } from "@/components/icons";

export const metadata = {
  title: "Listovkite",
  description: "Quiz for the Bulgarian drivers license theory",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 flex-grow pt-16">
              {children}
            </main>
            <footer className="w-full flex flex-col items-center justify-center py-4 gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://github.com/balgariya/listovki">
                  <span className="text-default-600 text-xs sm:text-sm">
                    GitHub Repository
                  </span>
                </Link>
                <span className="text-default-400 hidden sm:inline">|</span>
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://dsc.gg/maximjsx">
                  <DiscordIcon className="h-4 w-4" />
                  <span className="text-default-600 text-xs sm:text-sm">
                    Join our Discord
                  </span>
                </Link>
              </div>
              <div className="text-default-500 text-xs sm:text-sm">
                © {new Date().getFullYear()} Maxim.jsx
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

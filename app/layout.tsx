import "./globals.css";
import { Open_Sans } from "next/font/google";
import Providers from "@/utils/Provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ModalProvider from "@/components/providers/ModalProvider";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "@uploadthing/react/styles.css";
import { SocketIoProvider } from "@/components/providers/SocketIoProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Chat Application",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="discord-theme"
        >
          <SocketIoProvider>
            <Providers>
              <ModalProvider />
              {children}
            </Providers>
          </SocketIoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

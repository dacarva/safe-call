// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { ChakraProvider } from "@chakra-ui/react";
import UserProvider from "@/components/Context/UserContext";
import BottomNavbar from "@/components/BottomNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vox-Guard",
  description: "Vox-Guard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ChakraProvider>
            <UserProvider>
              <ErudaProvider>
                <MiniKitProvider>{children}</MiniKitProvider>
              </ErudaProvider>
              <BottomNavbar />
              {/* Mostrar solo si el usuario está autenticado */}
            </UserProvider>
          </ChakraProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

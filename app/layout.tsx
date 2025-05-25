import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Header } from "@/components/Header";
import QueryProvider from "@/lib/providers/QueryClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <QueryProvider>
          <SessionProvider>
            <Header />
            {children}
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

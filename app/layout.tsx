import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Header } from "@/components/Header";
import QueryProvider from "@/lib/providers/QueryClientProvider";
import ScrollRestorer from "@/lib/providers/ScrollRestorer";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="h-dvh">
        <QueryProvider>
          <SessionProvider>
            <Suspense fallback={<>ScrollRestorer Fallback</>}>
              <ScrollRestorer />
            </Suspense>
            <Header />
            {children}
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

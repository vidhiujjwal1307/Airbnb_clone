import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Air bnb | Stays across India",
  description: "Find great places to stay across India with air bnb.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-airbnb-brand selection:text-white">
        <ToastProvider>
          <UserProvider>
            <WishlistProvider>
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

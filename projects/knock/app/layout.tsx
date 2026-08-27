import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knock — permission gate",
  description: "The call already fired. Don't let the run hang.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

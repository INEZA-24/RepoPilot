import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoPilot | Navigate Open Source Repositories in Minutes",
  description:
    "RepoPilot helps developers understand, navigate, and contribute to GitHub repositories faster.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

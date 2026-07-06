import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GR Games Quiz",
  description: "Quiz de futebol da GR Games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

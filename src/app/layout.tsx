import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voice AI Concierge",
  description: "Voice-enabled RAG assistant grounded in your knowledge base.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

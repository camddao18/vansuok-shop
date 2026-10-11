import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"], // variable weight + optical size, like the Google Fonts URL in index.html
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duck Delivery - Mỗi nghề một chất",
  description:
    "Áo thun theo chủ đề nghề nghiệp dành cho trader, thủy thủ, nail artist và nhiều nghề khác. Sticker và móc khóa sắp ra mắt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${mono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

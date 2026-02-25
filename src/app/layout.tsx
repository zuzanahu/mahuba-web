import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahuba",
  description: "Osobní web a blog Mahuba",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={inter.className}>
      <body>
        <header>
          <nav>
            <Link href="/">Domů</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/o-mne">O mně</Link>
            <Link href="/kontakt">Kontakt</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <Link href="/ochrana-osobnich-udaju">Ochrana osobních údajů</Link>
          <p>&copy; {new Date().getFullYear()} Mahuba</p>
        </footer>
      </body>
    </html>
  );
}

import { NavProvider } from "@admin/Nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavProvider>{children}</NavProvider>;
}

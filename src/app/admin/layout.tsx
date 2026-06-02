import { NavConfigProvider } from "@admin/Nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavConfigProvider>{children}</NavConfigProvider>;
}

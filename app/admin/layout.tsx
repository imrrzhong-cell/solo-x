import { Sidebar } from '@/components/admin/sidebar';
import './globals.css';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
}

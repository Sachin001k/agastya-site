import AdminSidebar from './components/AdminSidebar';
import AdminAuthCheck from './components/AdminAuthCheck';

export const metadata = {
  title: { default: 'Admin', template: '%s · Admin' },
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthCheck>
      <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: '#f5f0e8' }}>
        <AdminSidebar />
        <main className="admin-main" style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </AdminAuthCheck>
  );
}

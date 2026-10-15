import { isAdmin } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Saqib Ullah" };

export default async function AdminPage() {
  const authed = await isAdmin();

  return (
    <main className="min-h-screen bg-surface-soft">
      <header className="bg-canvas border-b border-hairline-soft">
        <div className="container-page h-16 flex items-center justify-between">
          <a href="/" className="t-subtitle-lg text-ink-deep heading-feature">
            Saqib Ullah <span className="t-body-sm text-steel">/ admin</span>
          </a>
          <a href="/" className="pill-tab">
            ← View site
          </a>
        </div>
      </header>
      <div className="container-page py-10">
        {authed ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </main>
  );
}

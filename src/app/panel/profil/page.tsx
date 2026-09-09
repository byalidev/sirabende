import { requireUser } from "../../../server/auth/auth";
import { ProfileForm } from "../../../components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const user = await requireUser();
  return <div className="dashboard-page"><header className="dashboard-page-header"><div><span className="eyebrow">Hesap ayarları</span><h1>Profilim</h1><p>Kişisel bilgilerini ve hesap şifreni yönet.</p></div></header><ProfileForm user={{ firstName: user.firstName ?? "", lastName: user.lastName ?? "", username: user.username, email: user.email, phone: user.phone ?? "" }} /></div>;
}

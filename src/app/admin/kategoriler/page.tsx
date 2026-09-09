import { getAdminCategories } from "../../../server/admin/repository";
import { CategoryManager } from "../../../components/admin/CategoryManager";

export default async function AdminCategoriesPage() { const categories = await getAdminCategories(); return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">İçerik</span><h1>Kategoriler</h1><p>Kategori adını ve slug bilgisini yönet.</p></div></header><CategoryManager categories={categories.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} /></div>; }

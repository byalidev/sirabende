"use client";

import { useState } from "react";

type Category = { id: string; name: string; slug: string; description: string | null; isActive: boolean; createdAt: string; _count: { requests: number; products: number } };
export function CategoryManager({ categories }: { categories: Category[] }) {
	const [items, setItems] = useState(categories);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [error, setError] = useState("");
	const save = async (event: React.FormEvent) => {
		event.preventDefault(); setError("");
		const endpoint = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
		const response = await fetch(endpoint, { method: editingId ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, slug }) });
		const body = await response.json();
		if (!response.ok) { setError(body.error ?? "Kategori kaydedilemedi."); return; }
		setItems((current) => editingId ? current.map((item) => item.id === editingId ? body.category : item) : [body.category, ...current]);
		setName(""); setSlug(""); setEditingId(null);
	};
	const edit = (category: Category) => { setEditingId(category.id); setName(category.name); setSlug(category.slug); setError(""); };
	const remove = async (id: string) => { if (!window.confirm("Bu kategoriyi silmek istediğine emin misin?")) return; const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" }); const body = await response.json(); if (!response.ok) { setError(body.error ?? "Kategori silinemedi."); return; } setItems((current) => current.filter((item) => item.id !== id)); };
	return <><form className="admin-toolbar" onSubmit={save}><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Kategori adı" /><input required value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="slug" /><button className="button-primary" type="submit">{editingId ? "Kaydet" : "Kategori ekle"}</button>{editingId ? <button className="button-quiet" type="button" onClick={() => { setEditingId(null); setName(""); setSlug(""); }}>Vazgeç</button> : null}</form>{error ? <p className="admin-form-error">{error}</p> : null}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ad</th><th>Slug</th><th>Bağlı kayıtlar</th><th /></tr></thead><tbody>{items.map((category) => <tr key={category.id}><td><strong>{category.name}</strong></td><td>{category.slug}</td><td>{category._count.requests} talep · {category._count.products} ürün</td><td><button className="admin-row-link" type="button" onClick={() => edit(category)}>Düzenle</button> <button className="admin-danger-button" type="button" onClick={() => remove(category.id)}>Sil</button></td></tr>)}</tbody></table></div></>;
}

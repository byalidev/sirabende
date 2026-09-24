export type RequestCondition = "NEW" | "USED" | "REFURBISHED" | "UNKNOWN";

export type RequestImage = {
  id: string;
  name: string;
  url: string;
};

export type RequestFormData = {
  searchText: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  flexibleBudget: boolean;
  city: string;
  district: string;
  condition: RequestCondition | "";
  title: string;
  description: string;
  preferredFeatures: string[];
  images: RequestImage[];
  sameDayNeeded: boolean;
};

export const initialRequestData: RequestFormData = {
  searchText: "",
  category: "",
  minBudget: "",
  maxBudget: "",
  flexibleBudget: false,
  city: "",
  district: "",
  condition: "",
  title: "",
  description: "",
  preferredFeatures: [],
  images: [],
  sameDayNeeded: false,
};

export const requestExamples = [
  "Temiz bir PS5 Slim arıyorum",
  "iPhone 15 Pro",
  "Gaming Laptop",
  "125cc Motosiklet",
];

export const requestCategories = [
  { slug: "telefon", name: "Telefon", icon: "▣", description: "Akıllı telefon ve aksesuar" },
  { slug: "bilgisayar", name: "Bilgisayar", icon: "⌘", description: "Laptop, masaüstü ve parça" },
  { slug: "oyun-konsolu", name: "Oyun Konsolu", icon: "◈", description: "Konsol, oyun ve ekipman" },
  { slug: "motosiklet", name: "Motosiklet", icon: "○", description: "Motosiklet ve ekipman" },
  { slug: "otomobil", name: "Otomobil", icon: "◇", description: "İhtiyacına uygun araç" },
  { slug: "ev", name: "Ev & Yaşam", icon: "⌂", description: "Ev eşyası ve yaşam" },
];

export const requestConditions: Array<{
  value: RequestCondition;
  label: string;
  description: string;
}> = [
  { value: "NEW", label: "Sıfır", description: "Hiç kullanılmamış" },
  { value: "USED", label: "İkinci El", description: "Kullanılmış, temiz" },
  { value: "REFURBISHED", label: "Yenilenmiş", description: "Kontrolden geçmiş" },
  { value: "UNKNOWN", label: "Fark Etmez", description: "En iyi seçeneği göster" },
];

export const requestMatchFeatures = [
  { value: "BOX_INCLUDED", label: "Kutu dahil , " },
  { value: "INVOICE", label: "Fatura var , " },
  { value: "FAST_DELIVERY", label: "Hızlı teslim , " },
  { value: "SHIPPING_INCLUDED", label: "Kargo dahil , " },
  { value: "CERTIFIED", label: "Sertifikalı / kontrol edilmiş , " },
  { value: "PAYMENT_PLAN", label: "Taksit imkanı , " },
] as const;

export const requestMatchFeatureLabels = Object.fromEntries(
  requestMatchFeatures.map((feature) => [feature.value, feature.label]),
) as Record<string, string>;

export const steps = [
  { label: "İhtiyaç", shortLabel: "Talep" },
  { label: "Kategori", shortLabel: "Kategori" },
  { label: "Bütçe", shortLabel: "Bütçe" },
  { label: "Konum", shortLabel: "Konum" },
  { label: "Durum", shortLabel: "Durum" },
  { label: "Detaylar", shortLabel: "Detay" },
  { label: "Özellikler", shortLabel: "Özellik" },
  { label: "Önizleme", shortLabel: "Önizleme" },
];

export const conditionLabels: Record<RequestCondition, string> = {
  NEW: "Sıfır",
  USED: "İkinci El",
  REFURBISHED: "Yenilenmiş",
  UNKNOWN: "Fark Etmez",
};

export const categoryLabels = Object.fromEntries(
  requestCategories.map((category) => [category.slug, category.name]),
) as Record<string, string>;
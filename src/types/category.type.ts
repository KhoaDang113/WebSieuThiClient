// Category related types
export interface SubCategory {
  name: string;
  href: string;
  mobileImage?: string;
}

export interface CategorySideBar {
  name: string;
  href: string;
  icon?: React.ReactNode;
  mobileImage?: string;
  subCategories?: SubCategory[];
}

export interface CategoryNav {
  id: string;
  name: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

export interface CategoryNavProps {
  categories?: CategoryNav[];
  selectedCategoryId?: string;
  onCategorySelect?: (category: CategoryNav) => void;
  variant?: "home" | "product-page";
  showScrollButtons?: boolean;
}

// API Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  order?: number;
  isActive: boolean;
  subcategories?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

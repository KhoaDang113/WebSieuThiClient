// Category related types
export interface SubCategory {
  name: string;
  href: string;
}

export interface CategorySideBar {
  name: string;
  href: string;
  icon?: React.ReactNode;
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

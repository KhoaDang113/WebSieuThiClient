import { useState, useEffect } from "react";
import productService from "../services/productService";
import type { ProductQuery, PaginatedResponse } from "../types";
import type { Product } from "../../types";

/**
 * Hook để lấy danh sách sản phẩm
 */
export const useProducts = (params?: ProductQuery) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Product>["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProducts(params);
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return { products, pagination, loading, error, refetch };
};

/**
 * Hook để lấy chi tiết một sản phẩm
 */
export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

/**
 * Hook để search sản phẩm
 */
export const useSearchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    query: string,
    params?: Omit<ProductQuery, "search">
  ) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await productService.searchProducts(query, params);
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tìm kiếm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setProducts([]);
    setError(null);
  };

  return { products, loading, error, search, clearResults };
};

import { writable } from 'svelte/store';

export interface Product {
  SKU: string;
  product_name: string;
  Category: string;
  Brand: string;
  Currency: string;
  Price: string;
  date_of_load: string;
  reference_link: string;
  Image: string;
}

// Store for all products
export const allProductsStore = writable<Product[]>([]);

// Store for current page configuration
export const pageConfigStore = writable({
  pageSize: 50,
  currentPage: 1
});

export async function fetchAllProducts() {
  try {
    const response = await fetch('http://127.0.0.1:8000/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: Product[] = await response.json();
    allProductsStore.set(data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Function to get paginated products
export function getPaginatedProducts(products: Product[], pageSize: number, currentPage: number) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return products.slice(startIndex, endIndex);
}

// Function to get total number of pages
export function getTotalPages(totalProducts: number, pageSize: number) {
  return Math.ceil(totalProducts / pageSize);
}
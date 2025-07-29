// src/types/search.ts

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchResult {
  id?: string;
  barcode?: string;
  name?: string;
  brand?: string;
  category?: string;
  [key: string]: unknown;
}

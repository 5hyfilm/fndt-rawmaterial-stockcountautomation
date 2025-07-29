// Path: src/types/barcode.ts

export interface BarcodeFormat {
  name: string;
  pattern: RegExp;
  length: number | number[];
  checksum?: boolean;
}

export interface BarcodeValidation {
  isValid: boolean;
  format?: BarcodeFormat;
  errors: string[];
  suggestions?: string[];
}

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
}

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface BarcodeProcessingOptions {
  normalize: boolean;
  validate: boolean;
  format?: string;
  timeout?: number;
}

export interface BarcodeProcessingResult {
  originalBarcode: string;
  normalizedBarcode: string;
  isValid: boolean;
  format?: string;
  processingTime: number;
  errors?: string[];
}

export interface UseBarcodeDebounceOptions {
  delay: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface UseBarcodeDebounceReturn<
  T extends (...args: unknown[]) => unknown
> {
  debouncedFunction: DebouncedFunction<T>;
  isPending: boolean;
  cancel: () => void;
  flush: () => void;
}

import { Invoice } from "@/store/slices/invoicesSlice"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkNullValues(invoices: Invoice[]) {
  for (const invoice of invoices) {
    if (invoice.products.some(product => product.name === null || product.quantity === 0 || product.unitPrice === 0 || product.tax === 0 || product.discount === 0)) {
      return true
    }
    if (invoice.customer.name === null || invoice.customer.phoneNumber === null) {
      return true
    }
    if (invoice.date === null || invoice.serialNumber === null || invoice.totalAmount === 0 || invoice.totalTax === 0) {
      return true
    }
  }
  return false
}

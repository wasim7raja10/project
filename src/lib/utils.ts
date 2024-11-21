import { Invoice } from "@/store/slices/invoicesSlice"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkNullValues(invoices: Invoice[]) {
  for (const invoice of invoices) {
    if (invoice.products.some(product => !product.name)) {
      return true
    }
    if (!invoice.customer.name || !invoice.customer.phoneNumber) {
      return true
    }
    if (!invoice.date || !invoice.serialNumber) {
      return true
    }
  }
  return false
}

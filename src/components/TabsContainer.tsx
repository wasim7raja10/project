import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTable } from "./tables/InvoicesTable"
import { ProductsTable } from "./tables/ProductsTable"
import { CustomersTable } from "./tables/CustomersTable"
import { selectAllInvoices } from "@/store/slices/invoicesSlice";
import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, X } from "lucide-react";
import { checkNullValues } from "@/lib/utils";

export function TabsContainer() {
  const invoices = useAppSelector(selectAllInvoices);
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  useEffect(() => {
    if (invoices.length > 0) {
      const nullValues = checkNullValues(invoices)
      if (nullValues) {
        setIsAlertOpen(true)
      }
    }
  }, [invoices])

  return (
    <div className="container mx-auto py-4">

      {/* Alert for null values */}
      {isAlertOpen && <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hello User</AlertTitle>
        <AlertDescription>
          Please check your data for null values and update them.
          <br />
          If there is 0 for any field, it means that the value is 0 or value is missing in the invoice.
        </AlertDescription>
        <button
          onClick={() => setIsAlertOpen(false)}
          className="absolute top-2 right-2 p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </Alert>}

      {/* Total Unique Invoices */}
      <h3 className="text-lg font-semibold mb-4">Total Unique Invoices: {invoices.length}</h3>

      {/* Tabs */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <InvoicesTable />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTable selectedInvoice={null} />
        </TabsContent>
        <TabsContent value="customers">
          <CustomersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
} 
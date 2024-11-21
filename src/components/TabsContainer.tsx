import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTable } from "./tables/InvoicesTable"
import { ProductsTable } from "./tables/ProductsTable"
import { CustomersTable } from "./tables/CustomersTable"
import { selectAllInvoices } from "@/store/slices/invoicesSlice";
import { useAppSelector } from "@/store/hooks";

export function TabsContainer() {
  const invoices = useAppSelector(selectAllInvoices);
  return (
    <div className="container mx-auto py-10">
      <h3 className="text-lg font-semibold mb-4">Total Unique Invoices: {invoices.length}</h3>
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
          <ProductsTable />
        </TabsContent>
        <TabsContent value="customers">
          <CustomersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
} 
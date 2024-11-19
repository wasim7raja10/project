import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTable } from "./tables/InvoicesTable"
import { ProductsTable } from "./tables/ProductsTable"
import { CustomersTable } from "./tables/CustomersTable"

export function TabsContainer() {
  return (
    <div className="container mx-auto py-10">
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
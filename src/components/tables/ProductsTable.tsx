import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppSelector } from "@/store/hooks"
import { selectAllInvoices } from "@/store/slices/invoicesSlice"

export function ProductsTable() {
  const invoices = useAppSelector(selectAllInvoices)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Price with Tax</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* flatten the products array */}
          {invoices.flatMap(invoice => invoice.products).map((product) => (
            <TableRow key={product.name}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.unitPrice}</TableCell>
              <TableCell>{product.tax}</TableCell>
              <TableCell>{product.priceWithTax}</TableCell>
              <TableCell>{product.discount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
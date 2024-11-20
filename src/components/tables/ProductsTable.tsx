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
import { EmptyCell } from "../ui/Empty"

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
              <TableCell>{product.name || <EmptyCell />}</TableCell>
              <TableCell>{product.quantity || <EmptyCell />}</TableCell>
              <TableCell>{product.unitPrice || <EmptyCell />}</TableCell>
              <TableCell>{product.tax || <EmptyCell />}</TableCell>
              <TableCell>{product.priceWithTax || <EmptyCell />}</TableCell>
              <TableCell>{product.discount || <EmptyCell />}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
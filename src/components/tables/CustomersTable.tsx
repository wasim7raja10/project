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

export function CustomersTable() {
  const invoices = useAppSelector(selectAllInvoices)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Total Purchase Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.serialNumber}>
              <TableCell>{invoice.customer.name}</TableCell>
              <TableCell>{invoice.customer.phoneNumber}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
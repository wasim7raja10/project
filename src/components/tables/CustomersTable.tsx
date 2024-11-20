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
              <TableCell>{invoice.customer.name || <EmptyCell />}</TableCell>
              <TableCell>{invoice.customer.phoneNumber || <EmptyCell />}</TableCell>
              <TableCell>{invoice.totalAmount || <EmptyCell />}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
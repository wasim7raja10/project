import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/strore/hooks"
import { selectAllCustomers } from "@/strore/slices/customersSlice"

export function CustomersTable() {
  const customers = useAppSelector(selectAllCustomers)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Total Purchase Amount</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Last Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
              <TableCell>${customer.totalPurchaseAmount.toFixed(2)}</TableCell>
              <TableCell>{customer.email || '-'}</TableCell>
              <TableCell>
                <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>{customer.numberOfOrders}</TableCell>
              <TableCell>
                {customer.lastPurchaseDate
                  ? new Date(customer.lastPurchaseDate).toLocaleDateString()
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
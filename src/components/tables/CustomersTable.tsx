import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppSelector } from "@/store/hooks"
import { Badge } from "@/components/ui/badge"
import { selectAllCustomers } from "@/store/slices/customersSlice"

export function CustomersTable() {
  const customers = useAppSelector(selectAllCustomers)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Purchase Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Customer Since</TableHead>
            <TableHead>Segment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
              <TableCell>{customer.email || '-'}</TableCell>
              <TableCell>${customer.totalPurchaseAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>{customer.numberOfOrders}</TableCell>
              <TableCell>
                {customer.customerSince && new Date(customer.customerSince).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {customer.customerSegment || 'retail'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
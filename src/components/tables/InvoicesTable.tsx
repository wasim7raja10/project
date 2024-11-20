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
import { selectAllInvoices } from "@/store/slices/invoicesSlice"
import { selectAllCustomers } from "@/store/slices/customersSlice"
import { selectAllProducts } from "@/store/slices/productsSlice"

export function InvoicesTable() {
    const invoices = useAppSelector(selectAllInvoices)
    const customers = useAppSelector(selectAllCustomers)
    const products = useAppSelector(selectAllProducts)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.serialNumber}</TableCell>
                            <TableCell>{customers.find(customer => customer.id === invoice.customerId)?.name}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {invoice.items.map((item) => (
                                        <div key={item.productId} className="text-sm">
                                            {products.find(product => product.id === item.productId)?.name} (x{item.quantity})
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(invoice.status)}>
                                    {invoice.status}
                                </Badge>
                            </TableCell>
                            <TableCell>${invoice.tax.toFixed(2)}</TableCell>
                            <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {invoice.dueDate && new Date(invoice.dueDate).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

// Helper function for status badge variants
function getStatusVariant(status: 'paid' | 'pending' | 'overdue'): 'default' | 'secondary' | 'destructive' {
    switch (status) {
        case 'paid':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'overdue':
            return 'destructive'
    }
} 
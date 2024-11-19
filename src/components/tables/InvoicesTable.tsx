import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAppSelector } from "@/strore/hooks"
import { selectAllInvoices } from "@/strore/slices/invoicesSlice"

export function InvoicesTable() {
    const invoices = useAppSelector(selectAllInvoices)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.serialNumber}>
                            <TableCell>{invoice.serialNumber}</TableCell>
                            <TableCell>{invoice.customerName}</TableCell>
                            <TableCell>{invoice.product.name}</TableCell>
                            <TableCell>{invoice.product.quantity}</TableCell>
                            <TableCell>${invoice.product.tax.toFixed(2)}</TableCell>
                            <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
} 
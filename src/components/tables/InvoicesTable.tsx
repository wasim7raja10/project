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

export function InvoicesTable() {
    const invoices = useAppSelector(selectAllInvoices)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Total Tax</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.serialNumber}>
                            <TableCell>{invoice.serialNumber}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.totalAmount}</TableCell>
                            <TableCell>{invoice.totalTax}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

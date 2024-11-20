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
                            <TableCell>{invoice.serialNumber || <EmptyCell />}</TableCell>
                            <TableCell>{invoice.date || <EmptyCell />}</TableCell>
                            <TableCell>{invoice.totalAmount || <EmptyCell />}</TableCell>
                            <TableCell>{invoice.totalTax || <EmptyCell />}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

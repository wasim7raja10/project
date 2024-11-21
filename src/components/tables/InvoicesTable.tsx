import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { deleteInvoice, Invoice, selectAllInvoices, updateInvoice } from "@/store/slices/invoicesSlice"
import { EmptyCell } from "../ui/Empty"
import { Button } from "../ui/button"
import { DotsVerticalIcon } from "@radix-ui/react-icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button as DialogFooter } from "@/components/ui/button"
import { useState } from "react"
import { Eye } from "lucide-react"
import { ProductsTable } from "./ProductsTable"

export function InvoicesTable() {
    const [invoicePayload, setInvoicePayload] = useState<Invoice>({} as Invoice)
    const [serialNumber, setSerialNumber] = useState<string>("")
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const invoices = useAppSelector(selectAllInvoices)
    const dispatch = useAppDispatch()

    const handleInvoiceEdit = (invoice: Invoice) => {
        setIsEditDialogOpen(true)
        setInvoicePayload({ ...invoice })
        setSerialNumber(invoice.serialNumber)
    }

    const handleInvoiceView = (invoice: Invoice) => {
        setSerialNumber(invoice.serialNumber)
        setIsViewDialogOpen(true)
    }

    return (
        <div className="rounded-md border">

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Invoice Details</DialogTitle>
                        <DialogDescription>
                            View Products in this invoice here.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Show Products in Table */}
                    <div className="grid gap-4 py-4">
                        <ProductsTable selectedInvoice={serialNumber} />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Invoice</DialogTitle>
                        <DialogDescription>
                            Make changes to invoice here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="serialNumber" className="text-right">
                                Serial Number
                            </Label>
                            <Input id="seriaNumber" onChange={(e) => { setInvoicePayload({ ...invoicePayload, serialNumber: e.target.value }) }} value={invoicePayload.serialNumber} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <Input id="date" onChange={(e) => setInvoicePayload({ ...invoicePayload, date: e.target.value })} value={invoicePayload.date} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalAmount" className="text-right">
                                Total Amount
                            </Label>
                            <Input id="totalAmount" onChange={(e) => setInvoicePayload({ ...invoicePayload, totalAmount: Number(e.target.value) })} value={invoicePayload.totalAmount} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalTax" className="text-right">
                                Total Tax
                            </Label>
                            <Input id="totalTax" onChange={(e) => setInvoicePayload({ ...invoicePayload, totalTax: Number(e.target.value) })} value={invoicePayload.totalTax} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={() => {
                            dispatch(updateInvoice({ invoice: invoicePayload, serialNumber }))
                            setIsEditDialogOpen(false)
                        }}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Total Tax</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.serialNumber + invoice.date + invoice.totalAmount + invoice.totalTax}>
                            <TableCell>{invoice.serialNumber || <EmptyCell />}</TableCell>
                            <TableCell>{invoice.customer.name || <EmptyCell />}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon"
                                    onClick={() => handleInvoiceView(invoice)}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </TableCell>
                            <TableCell>{invoice.date || <EmptyCell />}</TableCell>
                            <TableCell>{invoice.totalAmount}</TableCell>
                            <TableCell>{invoice.totalTax}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <DotsVerticalIcon className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                onClick={() => handleInvoiceEdit(invoice)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-500"
                                                onClick={() => dispatch(deleteInvoice(invoice.serialNumber))}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

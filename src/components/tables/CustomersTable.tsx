import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Customer, deleteCustomer, selectAllInvoices, updateCustomer } from "@/store/slices/invoicesSlice"
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
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function CustomersTable() {
  const invoices = useAppSelector(selectAllInvoices)
  const dispatch = useAppDispatch()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [customerPayload, setCustomerPayload] = useState<{
    customer: Customer,
    totalPurchaseAmount: number,
    serialNumber: string
  }>({} as {
    customer: Customer,
    totalPurchaseAmount: number,
    serialNumber: string
  })

  const handleCustomerEdit = (customer: Customer, totalPurchaseAmount: number, serialNumber: string) => {
    setIsEditDialogOpen(true)
    setCustomerPayload({ customer, totalPurchaseAmount, serialNumber })
  }

  return (
    <div className="rounded-md border">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Make changes to your customer here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" onChange={(e) => setCustomerPayload({ ...customerPayload, customer: { ...customerPayload.customer, name: e.target.value } })} value={customerPayload?.customer?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input type="number" id="phoneNumber" onChange={(e) => setCustomerPayload({ ...customerPayload, customer: { ...customerPayload.customer, phoneNumber: e.target.value } })} value={customerPayload?.customer?.phoneNumber} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalPurchaseAmount" className="text-right">
                Total Purchase Amount
              </Label>
              <Input type="number" id="totalPurchaseAmount" onChange={(e) => setCustomerPayload({ ...customerPayload, totalPurchaseAmount: Number(e.target.value) })} value={customerPayload.totalPurchaseAmount} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => {
              dispatch(updateCustomer({
                customer: customerPayload.customer,
                totalPurchaseAmount: customerPayload.totalPurchaseAmount,
                serialNumber: customerPayload.serialNumber
              }))
              setIsEditDialogOpen(false)
            }}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Total Purchase Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.serialNumber + invoice.customer.name + invoice.customer.phoneNumber + invoice.totalAmount}>
              <TableCell>{invoice.customer.name || <EmptyCell />}</TableCell>
              <TableCell>{invoice.customer.phoneNumber || <EmptyCell />}</TableCell>
              <TableCell>{invoice.totalAmount || <EmptyCell />}</TableCell>
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
                        onClick={() => handleCustomerEdit(invoice.customer, invoice.totalAmount, invoice.serialNumber)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => dispatch(deleteCustomer(invoice.serialNumber))}
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
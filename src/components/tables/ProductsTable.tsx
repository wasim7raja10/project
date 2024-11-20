import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { deleteProduct, selectAllInvoices } from "@/store/slices/invoicesSlice"
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

export function ProductsTable() {
  const invoices = useAppSelector(selectAllInvoices)
  const dispatch = useAppDispatch()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Price with Tax</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* flatten the products array */}
          {invoices.flatMap(invoice => invoice.products).map((product) => (
            <TableRow key={product.name}>
              <TableCell>{product.name || <EmptyCell />}</TableCell>
              <TableCell>{product.quantity || <EmptyCell />}</TableCell>
              <TableCell>{product.unitPrice || <EmptyCell />}</TableCell>
              <TableCell>{product.tax || <EmptyCell />}</TableCell>
              <TableCell>{product.priceWithTax || <EmptyCell />}</TableCell>
              <TableCell>{product.discount || <EmptyCell />}</TableCell>
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
                      <DropdownMenuItem>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => dispatch(deleteProduct({
                          invoiceSerialNumber: invoices.find(invoice => invoice.products.includes(product))?.serialNumber || '',
                          productName: product.name
                        }))}
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
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
                      <DropdownMenuItem className="text-red-500">
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
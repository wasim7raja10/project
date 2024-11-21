import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { deleteProduct, Product, selectAllInvoices, updateProduct } from "@/store/slices/invoicesSlice"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


export function ProductsTable() {
  const invoices = useAppSelector(selectAllInvoices)
  const dispatch = useAppDispatch()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [productPayload, setProductPayload] = useState<Product>({} as Product)
  const [productLocation, setProductLocation] = useState<{
    invoiceSerialNumber: string
    productName: string
  }>({} as {
    invoiceSerialNumber: string
    productName: string
  })

  return (
    <div className="rounded-md border">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to product here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serialNumber" className="text-right">
                Serial Number
              </Label>
              <Input id="seriaNumber" onChange={(e) => setProductPayload({ ...productPayload, name: e.target.value })} value={productPayload.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input type="number" id="quantity" onChange={(e) => setProductPayload({ ...productPayload, quantity: Number(e.target.value) })} value={productPayload.quantity} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">
                Unit Price
              </Label>
              <Input id="unitPrice" type="number" onChange={(e) => setProductPayload({ ...productPayload, unitPrice: Number(e.target.value) })} value={productPayload.unitPrice} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tax" className="text-right">
                Tax
              </Label>
              <Input type="number" id="tax" onChange={(e) => setProductPayload({ ...productPayload, tax: Number(e.target.value) })} value={productPayload.tax} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount
              </Label>
              <Input type="number" id="discount" onChange={(e) => setProductPayload({ ...productPayload, discount: Number(e.target.value) })} value={productPayload.discount} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priceWithTax" className="text-right">
                Price with Tax
              </Label>
              <Input type="number" id="priceWithTax" onChange={(e) => setProductPayload({ ...productPayload, priceWithTax: Number(e.target.value) })} value={productPayload.priceWithTax} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => {
              dispatch(updateProduct({ productPayload, productLocation }))
              setIsEditDialogOpen(false)
            }}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Invoice Serial Number</TableHead>
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
          {invoices.flatMap(invoice => ({ products: invoice.products, invoiceSerialNumber: invoice.serialNumber })).map(({ products, invoiceSerialNumber }) => (
            products.map((product, index) => (
              <TableRow key={product.name + product.quantity + product.unitPrice + product.tax + product.priceWithTax + product.discount + index}>
                <TableCell>{product.name || <EmptyCell />}</TableCell>
                <TableCell>{invoiceSerialNumber || <EmptyCell />}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setProductLocation({
                              invoiceSerialNumber,
                              productName: product.name
                            })
                            setIsEditDialogOpen(true)
                            setProductPayload(product)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => dispatch(deleteProduct({
                            invoiceSerialNumber,
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
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
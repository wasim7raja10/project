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
import { selectAllProducts } from "@/store/slices/productsSlice"

export function ProductsTable() {
  const products = useAppSelector(selectAllProducts)

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
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
              <TableCell>${product.tax.toFixed(2)}</TableCell>
              <TableCell>${product.priceWithTax.toFixed(2)}</TableCell>
              <TableCell>
                {product.discount ? `${product.discount}%` : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
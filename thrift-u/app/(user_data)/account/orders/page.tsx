import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
    quantity: 2,
    date: "2025-10-26 14:00",
    totalAmount: "$250.00"
  },
  {
    invoice: "INV002",
    paymentStatus: "Fulfilled",
    paymentMethod: "PayPal",
    quantity: 1,
    date: "2025-10-25 11:30",
    totalAmount: "$500.00"
  },
  {
    invoice: "INV003",
    paymentStatus: "Canceled",
    paymentMethod: "Visa",
    quantity: 3,
    date: "2025-10-23 09:15",
    totalAmount: "$1,750.00"
  }
];

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id NUMBER</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Quanity</TableHead>
          <TableHead>Date/Time</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.quantity}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export interface Order {
  id: string
  customer: string
  product: string
  qty: number
  total: number
  status: "Pending" | "Shipped" | "Fulfilled" | "Cancelled"
}

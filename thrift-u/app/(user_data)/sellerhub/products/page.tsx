import React from "react"

export function ProductsPage() {
  const products = [
    { id: 1201789, name: "Football", price: "$25.00", quantity: 100 },
    { id: 11598764, name: "Basketball", price: "$30.00", quantity: 53 },
    { id: 32456, name: "Soccer ball", price: "$20.00", quantity: 85 },
    { id: 424553, name: "Hockey stick", price: "$45.00", quantity: 39 },
    { id: 53563, name: "Tennis ball", price: "$10.00", quantity: 15 },
    { id: 232426, name: "Hoodies", price: "$35.00", quantity: 69 },
    { id: 745678, name: "Sweat shirt", price: "$28.00", quantity: 79 },
    { id: 89658, name: "Jerseys", price: "$40.00", quantity: 88 },
    { id: 956788, name: "Basketball shorts", price: "$22.00", quantity: 90 },
    { id: 1034654, name: "Football pants", price: "$25.00", quantity: 56 },
    { id: 1345641, name: "Tennis shorts", price: "$20.00", quantity: 87 },
    { id: 109872, name: "Arm sleeve", price: "$12.00", quantity: 72 },
    { id: 134563, name: "Leg sleeve", price: "$14.00", quantity: 42 },
    { id: 198544, name: "Football pads", price: "$60.00", quantity: 49 },
    { id: 15675, name: "Hockey puck", price: "$8.00", quantity: 20 },
    { id: 156786, name: "Football cleats", price: "$70.00", quantity: 86 },
    { id: 109877, name: "Baseball", price: "$9.00", quantity: 14 },
    { id: 15678, name: "Baseball cleats", price: "$65.00", quantity: 56 },
    { id: 1987549, name: "Baseball gloves", price: "$40.00", quantity: 57 },
    { id: 20567, name: "Baseball bat", price: "$50.00", quantity: 45 },
    { id: 212345, name: "Basketball on court shoes", price: "$80.00", quantity: 35 },
    { id: 221456, name: "Tennis on court shoes", price: "$75.00", quantity: 54 },
    { id: 2456213, name: "Banners", price: "$18.00", quantity: 40 },
    { id: 256784, name: "Team shirts", price: "$30.00", quantity: 58 },
    { id: 2987655, name: "Bowling ball", price: "$55.00", quantity: 35 },
    { id: 20796956, name: "Bowling ball casing", price: "$20.00", quantity: 16 },
    { id: 2358987, name: "Baseball bat cover", price: "$15.00", quantity: 69 },
    { id: 270798, name: "Gym bag", price: "$35.00", quantity: 46 },
    { id: 260799, name: "Lava lamp", price: "$25.00", quantity: 84 },
    { id: 367540, name: "Traffic cone", price: "$12.00", quantity: 70 },
  ]

  return (
    <div className="p-6">
      <h2 className="text-lg mb-3 font-semibold">Items for Sale</h2>

      <table className="w-full border-collapse border text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Product Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.quantity}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="font-semibold">
            <td className="p-2" colSpan= {3}>Total Products</td>
            <td className="p-2">{products.length}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}


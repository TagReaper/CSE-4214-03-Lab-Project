"use client";

import Link from "next/link"; // ✅ import Next.js Link for routing

export default function SellerHubPage() {
  return (
    <div>
      {/*  Remove <style jsx> (only works in client components, can be fragile) */}
      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          background-color: #f9fafb;
          color: #222;
        }

        header {
          background-color: #2563eb;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        header h1 {
          font-size: 1.5rem;
          margin: 0;
        }

        nav {
          display: flex;
          gap: 1rem;
        }

        nav a,
        nav button {
          color: white;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font: inherit;
        }

        nav a:hover,
        nav button:hover {
          text-decoration: underline;
        }
      `}</style>

      <header>
        <h1>Seller Hub</h1>
        <nav>
          {/* ✅ Link to actual Next.js routes */}
          <Link href="/sellerhub">Dashboard</Link>
          <Link href="/sellerhub/orders">Orders</Link>
          <Link href="/sellerhub/products">Products</Link>
          <Link href="/sellerhub/logout">Logout</Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>
        <h2>Welcome to your Seller Dashboard!</h2>
        <p>Manage your products and view performance metrics here.</p>
      </main>
    </div>
  );
}

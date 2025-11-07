'use client'

import { Suspense } from "react";
import Search from "../../../components/search"

export default function SearchPage() {
    return (
    <Suspense fallback={<div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Loading search...</h2>
    </div>}>
      <Search />
    </Suspense>
    );
}
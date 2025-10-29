"use client";
import { useState } from "react";
import { AddressForm } from "./addressForm";
import { Button } from "@/components/ui/button";

export function AddressDisplayManager({ currentAddress }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayAddress, setDisplayAddress] = useState(currentAddress);

  const handleEditComplete = (updatedAddress) => {
    if (updatedAddress) {
      setDisplayAddress(updatedAddress);
    }
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="font-medium">Address</p>
          <p className="text-muted-foreground">
            {displayAddress.Address || "Not set"}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-medium">City</p>
          <p className="text-muted-foreground">
            {displayAddress.City || "Not set"}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="space-y-2 w-full">
            <p className="font-medium">State</p>
            <p className="text-muted-foreground">
              {displayAddress.State || "Not set"}
            </p>
          </div>
          <div className="space-y-2 w-full">
            <p className="font-medium">Zip Code</p>
            <p className="text-muted-foreground">
              {displayAddress.ZipCode || "Not set"}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>Edit Address</Button>
      </div>
    );
  }

  return (
    <div>
      <AddressForm
        currentAddress={displayAddress}
        onEditComplete={handleEditComplete}
      />
      <Button
        variant="ghost"
        onClick={() => setIsEditing(false)}
        className="mt-2"
      >
        Cancel
      </Button>
    </div>
  );
}

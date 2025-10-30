"use client";
import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateAddressAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function AddressForm({ currentAddress, onEditComplete }) {
  const [state, formAction] = useActionState(updateAddressAction, {
    error: null,
    success: null,
    data: null,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Success!", {
        description: state.success,
      });
      // Call onEditComplete with the updated address data
      if (state.data && onEditComplete) {
        onEditComplete(state.data);
      }
    }
    if (state.error) {
      toast.error("Error", {
        description: state.error,
      });
    }
  }, [state, onEditComplete]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={currentAddress.Address}
          placeholder="123 Main Street"
          minLength={5}
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground">
          Street address with number (5-100 characters)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            defaultValue={currentAddress.City}
            placeholder="Starkville"
            pattern="[a-zA-Z\s\-']+"
            minLength={2}
            maxLength={50}
            title="City name can only contain letters, spaces, hyphens, and apostrophes"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            defaultValue={currentAddress.State}
            placeholder="MS"
            pattern="[A-Za-z]{2}"
            minLength={2}
            maxLength={2}
            title="Enter 2-letter state code (e.g., MS, CA, NY)"
            style={{ textTransform: "uppercase" }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            defaultValue={currentAddress.ZipCode}
            placeholder="39762"
            pattern="\d{5}(-\d{4})?"
            title="5-digit ZIP code or ZIP+4 format (e.g., 12345 or 12345-6789)"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}

export default AddressForm;

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

export function AddressForm({ currentAddress }) {
  const [state, formAction] = useActionState(updateAddressAction, {
    error: null,
    success: null,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Success!", {
        description: state.success,
      });
    }
    if (state.error) {
      toast.error("Error", {
        description: state.error,
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={currentAddress.Address}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            defaultValue={currentAddress.City}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            defaultValue={currentAddress.State}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            defaultValue={currentAddress.ZipCode}
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

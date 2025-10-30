"use client";
import { useState } from "react";
import { EmailForm } from "./emailForm";
import { PasswordForm } from "./passwordForm";
import { Button } from "@/components/ui/button";

export function SecurityDisplayManager({ type, currentEmail }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  if (type === "email") {
    if (!isEditing) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Current Email</p>
            <p className="text-muted-foreground">{currentEmail}</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Change Email</Button>
        </div>
      );
    }

    return (
      <div>
        <EmailForm
          currentEmail={currentEmail}
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

  if (type === "password") {
    if (!isEditing) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Password</p>
            <p className="text-muted-foreground">••••••••</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Change Password</Button>
        </div>
      );
    }

    return (
      <div>
        <PasswordForm onEditComplete={handleEditComplete} />
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

  return null;
}

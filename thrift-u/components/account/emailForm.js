"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FireData from "@/firebase/clientApp";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function SubmitButton({ disabled }) {
  return (
    <Button type="submit" disabled={disabled} className="w-full sm:w-auto">
      {disabled ? "Updating..." : "Update Email"}
    </Button>
  );
}

export function EmailForm({ currentEmail, onEditComplete }) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // validation
    if (!newEmail || !confirmEmail || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError("Email addresses do not match.");
      setLoading(false);
      return;
    }

    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setError("New email must be different from current email.");
      setLoading(false);
      return;
    }

    try {
      const user = FireData.auth.currentUser;

      if (!user) {
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }

      // reauthenticate user with current password
      const credential = EmailAuthProvider.credential(currentEmail, password);
      await reauthenticateWithCredential(user, credential);

      // update email in auth
      await updateEmail(user, newEmail.trim().toLowerCase());

      // update email in db
      const userDocRef = doc(FireData.db, "User", user.uid);
      await updateDoc(userDocRef, {
        email: newEmail.trim().toLowerCase(),
      });

      // get new id token and update cookie
      const idToken = await user.getIdToken(true);
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: idToken,
          Secondary: idToken,
        },
      });

      toast.success("Success!", {
        description:
          "Email updated successfully. Please verify your new email address.",
      });

      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error("Error updating email:", error);

      switch (error.code) {
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/email-already-in-use":
          setError("This email is already in use by another account.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address format.");
          break;
        case "auth/requires-recent-login":
          setError(
            "Please log out and log back in before changing your email."
          );
          break;
        default:
          setError("Failed to update email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentEmail">Current Email</Label>
        <Input
          id="currentEmail"
          type="email"
          value={currentEmail}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newEmail">New Email</Label>
        <Input
          id="newEmail"
          name="newEmail"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="new.email@example.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmEmail">Confirm New Email</Label>
        <Input
          id="confirmEmail"
          name="confirmEmail"
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          placeholder="new.email@example.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Current Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your current password"
          minLength={10}
          required
        />
        <p className="text-xs text-muted-foreground">
          Required to confirm your identity
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end pt-2">
        <SubmitButton disabled={loading} />
      </div>
    </form>
  );
}

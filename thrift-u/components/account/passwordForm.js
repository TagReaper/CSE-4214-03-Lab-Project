"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FireData from "@/firebase/clientApp";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  validatePassword,
} from "firebase/auth";

const UIPasswordValidation = (password) => {
  return {
    minLength: password.length >= 10,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };
};

function SubmitButton({ disabled }) {
  return (
    <Button type="submit" disabled={disabled} className="w-full sm:w-auto">
      {disabled ? "Updating..." : "Update Password"}
    </Button>
  );
}

export function PasswordForm({ onEditComplete }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValidation(UIPasswordValidation(newPassword));
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      setLoading(false);
      return;
    }

    // check all validation criteria
    const allValid = Object.values(validation).every((v) => v === true);
    if (!allValid) {
      setError("Password does not meet all security requirements.");
      setLoading(false);
      return;
    }

    try {
      const user = FireData.auth.currentUser;

      if (!user || !user.email) {
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }

      // validate password against policy
      const passwordValidationStatus = await validatePassword(
        FireData.auth,
        newPassword
      );

      if (!passwordValidationStatus.isValid) {
        setError("Password does not meet the security policy.");
        setLoading(false);
        return;
      }

      // reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // update password in firebase auth
      await updatePassword(user, newPassword);

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
        description: "Password updated successfully.",
      });

      if (onEditComplete) {
        onEditComplete();
      }

      // clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);

      switch (error.code) {
        case "auth/wrong-password":
          setError("Incorrect current password. Please try again.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger password.");
          break;
        case "auth/requires-recent-login":
          setError(
            "Please log out and log back in before changing your password."
          );
          break;
        default:
          setError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
          minLength={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          minLength={10}
          required
        />
        <div className="text-sm space-y-1 mt-2">
          <p
            className={validation.minLength ? "text-green-600" : "text-red-500"}
          >
            ✓ At least 10 characters
          </p>
          <p
            className={
              validation.hasLowercase ? "text-green-600" : "text-red-500"
            }
          >
            ✓ A lowercase letter
          </p>
          <p
            className={
              validation.hasUppercase ? "text-green-600" : "text-red-500"
            }
          >
            ✓ An uppercase letter
          </p>
          <p
            className={validation.hasNumber ? "text-green-600" : "text-red-500"}
          >
            ✓ A number
          </p>
          <p
            className={
              validation.hasSpecialChar ? "text-green-600" : "text-red-500"
            }
          >
            ✓ A special character (!@#$%^&*)
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          minLength={10}
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end pt-2">
        <SubmitButton disabled={loading} />
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import Link from "next/link";
import FireData from "../../firebase/clientApp";
import { notifyAdminsNewSeller } from "./actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(10, {
        message: "Password must be at least 10 characters.",
      })
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain a special character (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
    sellerAccount: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showConfirmSeller, setShowConfirmSeller] = useState(false);
  const serverTime = new Date();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      sellerAccount: false,
    },
  });

  const password = form.watch("password");

  const passwordValidation = {
    minLength: password.length >= 10,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };

  const handleSubmit = async (values) => {
    setError("");

    // If seller account is requested and not yet confirmed, show confirmation
    if (values.sellerAccount && !showConfirmSeller) {
      setShowConfirmSeller(true);
      return;
    }

    setLoading(true);

    try {
      const passwordValidationStatus = await validatePassword(
        FireData.auth,
        values.password
      );

      if (!passwordValidationStatus.isValid) {
        setError("Password does not meet the security policy.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        FireData.auth,
        values.email,
        values.password
      );

      const user = userCredential.user;
      var idToken = await user.getIdToken();
      const parts = idToken.split(".");
      var payload = JSON.parse(atob(parts[1]));

      await setDoc(doc(FireData.db, "User", user.uid), {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        accessLevel: values.sellerAccount ? "Seller" : "Buyer",
        dateCreated: serverTime.toLocaleString(),
        deletedAt: "",
      });

      if (values.sellerAccount) {
        payload.role = "Seller";
        payload.status = "pending";
        await setDoc(doc(FireData.db, "Seller", user.uid), {
          banned: false,
          validated: false,
          Flags: 0,
          deletedAt: "",
          unclaimedIncome: Number(0),
          income: Number(0),
          pendingOrders: [],
          reviews: [],
        });

        await notifyAdminsNewSeller(
          user.uid,
          values.firstName + " " + values.lastName
        );
      } else {
        payload.role = "Buyer";
        payload.status = "null";
        await setDoc(doc(FireData.db, "Buyer", user.uid), {
          banned: false,
          address: "",
          city: "",
          state: "",
          zip: "",
          numOrders: Number(0),
          cart: [],
          deletedAt: "",
        });
      }

      payload = btoa(JSON.stringify(payload));
      idToken = parts[0] + "." + payload + "." + parts[2];

      await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      toast.success("Account created successfully!", {
        description: "Redirecting to your dashboard...",
        duration: 2000,
      });

      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (error) {
      console.error("error creating account:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email address is already registered to an account.");
          break;
        case "auth/invalid-email":
          setError("Email address is invalid.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger password.");
          break;
        default:
          setError("Error creating account, please try again. " + error.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            success: "bg-green-50 text-green-900 border-green-200",
            error: "bg-red-50 text-red-900 border-red-200",
          },
        }}
      />
      <div
        className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-8"
        style={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)" }}
      >
        <Form {...form}>
          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="text-shadow-lg text-[#8B1538]">
                Create an Account
              </h1>
              <p className="text-gray-600 text-sm">
                Sign up to get started with ThriftU
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-[#8B1538] border border-[#8B1538]/30 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white border-gray-300 focus-visible:border-[#8B1538] focus-visible:ring-[#8B1538]/50"
                        placeholder="John"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white border-gray-300 focus-visible:border-[#8B1538] focus-visible:ring-[#8B1538]/50"
                        placeholder="Doe"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white border-gray-300 focus:border-[#8B1538] focus:ring-[#8B1538]"
                      placeholder="you@example.com"
                      type="email"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white border-gray-300 focus:border-[#8B1538] focus:ring-[#8B1538]"
                      placeholder="Create a strong password"
                      type="password"
                      disabled={loading}
                      onFocus={() => setPasswordFocused(true)}
                      {...field}
                    />
                  </FormControl>
                  {passwordFocused && (
                    <div className="mt-2 text-xs space-y-1">
                      <div
                        className={
                          passwordValidation.minLength
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {passwordValidation.minLength ? "✓" : "✗"} At least 10
                        characters
                      </div>
                      <div
                        className={
                          passwordValidation.hasLowercase
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {passwordValidation.hasLowercase ? "✓" : "✗"} A
                        lowercase letter
                      </div>
                      <div
                        className={
                          passwordValidation.hasUppercase
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {passwordValidation.hasUppercase ? "✓" : "✗"} An
                        uppercase letter
                      </div>
                      <div
                        className={
                          passwordValidation.hasNumber
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {passwordValidation.hasNumber ? "✓" : "✗"} A number
                      </div>
                      <div
                        className={
                          passwordValidation.hasSpecialChar
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {passwordValidation.hasSpecialChar ? "✓" : "✗"} A
                        special character (!@#$%^&*)
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white border-gray-300 focus:border-[#8B1538] focus:ring-[#8B1538]"
                      placeholder="Re-enter your password"
                      type="password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellerAccount"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="data-[state=checked]:bg-[#8B1538] data-[state=checked]:border-[#8B1538]"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal text-sm text-gray-700">
                      Request seller account
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Check this if you want to sell items on ThriftU
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-[#8B1538] hover:bg-[#6B0F2A] text-white"
              type="button"
              disabled={loading}
              onClick={form.handleSubmit(handleSubmit)}
            >
              {loading
                ? "Creating Account..."
                : showConfirmSeller
                ? "Confirm Seller Account Request"
                : "Create Account"}
            </Button>

            {showConfirmSeller && (
              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                type="button"
                disabled={loading}
                onClick={() => {
                  setShowConfirmSeller(false);
                  form.setValue("sellerAccount", false);
                }}
              >
                Cancel - Create Buyer Account Instead
              </Button>
            )}

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                className="text-[#8B1538] hover:underline font-medium"
                href="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </>
  );
};

export default SignUp;

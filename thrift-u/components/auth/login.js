"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import Link from "next/link";
import FireData from "../../firebase/clientApp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [banned, setBanned] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values) => {
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        FireData.auth,
        values.email,
        values.password
      );

      const userRef = await getDoc(
        doc(FireData.db, "User", credential.user.uid)
      );

      if (userRef.data().deletedAt != "") {
        await FireData.auth.signOut();
        await fetch("/api/auth", {
          method: "POST",
        });
        setBanned(true);
        throw new Error(
          "Your account was banned from, or was denied access to, ThriftU.\nContact us if you believe this to be a mistake."
        );
      }

      var idToken = await credential.user.getIdToken();
      const parts = idToken.split(".");
      const access = userRef.data().accessLevel;
      var payload = JSON.parse(atob(parts[1]));

      switch (access) {
        case "Admin":
          payload.role = "Admin";
          payload.status = "null";
          break;
        case "Buyer":
          payload.role = "Buyer";
          payload.status = "null";
          const buyerRef = await getDoc(
            doc(FireData.db, "Buyer", credential.user.uid)
          );
          if (buyerRef.data().banned) {
            await FireData.auth.signOut();
            await fetch("/api/auth", {
              method: "POST",
            });
            setBanned(true);
            throw new Error(
              "Your account was banned from, or was denied access to, ThriftU.\nContact us if you believe this to be a mistake."
            );
          }
          break;
        case "Seller":
          payload.role = "Seller";
          const sellerRef = await getDoc(
            doc(FireData.db, "Seller", credential.user.uid)
          );
          if (sellerRef.data().banned) {
            await FireData.auth.signOut();
            await fetch("/api/auth", {
              method: "POST",
            });
            setBanned(true);
            throw new Error(
              "Your account was banned from, or was denied access to, ThriftU.\nContact us if you believe this to be a mistake."
            );
          }
          if (sellerRef.data().validated) {
            payload.status = "approved";
          } else {
            payload.status = "pending";
          }
          break;
      }

      payload = btoa(JSON.stringify(payload));
      idToken = parts[0] + "." + payload + "." + parts[2];

      await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      location.reload();
    } catch (error) {
      console.error("error during account login:", error);
      if (!banned) {
        setError("Failed to log in. Please check your email and password.");
      } else {
        setError(
          "Your account was banned from, or was denied access to, ThriftU.\nContact us if you believe this to be a mistake."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md bg-gray-50 rounded-lg border border-gray-200 p-8"
      style={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)" }}
    >
      <Form {...form}>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-shadow-lg text-[#8B1538]">Welcome back</h1>
            <p className="text-gray-600 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-[#8B1538] border border-[#8B1538]/30 px-4 py-3 rounded text-sm whitespace-pre-line">
              {error}
            </div>
          )}

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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <a
                    className="text-[#8B1538] text-sm hover:underline"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    className="bg-white border-gray-300 focus:border-[#8B1538] focus:ring-[#8B1538]"
                    placeholder="Enter your password"
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-[#8B1538] hover:bg-[#6B0F2A] text-white"
            type="button"
            disabled={loading}
            onClick={form.handleSubmit(handleLogin)}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="text-[#8B1538] hover:underline font-medium"
              href="/signup"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;

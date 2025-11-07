"use client";

export function AccountHeader({ firstName, lastName, email }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Your Account</h1>
      <p className="text-lg text-muted-foreground">
        Welcome back, {firstName} {lastName}
      </p>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
  );
}

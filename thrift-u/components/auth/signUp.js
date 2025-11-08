"use client";

import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import FireData from "../../firebase/clientApp";
import { doc, setDoc } from "@firebase/firestore";

const UIPasswordValidation = (password) => {
  return {
    minLength: password.length >= 10,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  });
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [sellerReq, setSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const serverTime = new Date();

  useEffect(() => {
    setValidation(UIPasswordValidation(password));
  }, [password]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const passwordValidationStatus = await validatePassword(
        FireData.auth,
        password
      );
      if (!passwordValidationStatus.isValid) {
        setError("Password does not meet the security policy.");
        setLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        FireData.auth,
        email,
        password
      );
      const user = userCredential.user;
      var idToken = await user.getIdToken();
      const parts = idToken.split(".");
      var payload = JSON.parse(atob(parts[1]));

      await setDoc(doc(FireData.db, "User", user.uid), {
        email: email,
        firstName: firstName,
        lastName: lastName,
        accessLevel: sellerReq ? "Seller" : "Buyer",
        dateCreated: serverTime.toLocaleString(),
        deletedAt: "",
      });

      if (sellerReq) {
        const confirmed = confirm(
          "Are you sure you want to request a seller account?"
        );
        if (confirmed) {
          payload.role = "Seller";
          payload.status = "pending";
          await setDoc(doc(FireData.db, "Seller", user.uid), {
            banned: false,
            validated: false,
            Flags: 0,
            deletedAt: "",
            unclaimedIncome: Number(0),
            income: Number(0),
            pendingOrders: []
          });

          await notificationService.notifyAllAdmins(
            NotificationType.NEW_SELLER_APPLICATION,
            {
              applicantId: user.uid,
              applicantName: firstName + " " + lastName,
            }
          );
        } else {
          setSeller(false);
        }
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
        //send token to api route to set cookie
        method: "POST",
        headers: {
          Authorization: `${idToken}`,
        },
      });

      alert("Account created successfully");
      location.reload()
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
    <form className="m-5 flex flex-col" onSubmit={handleSubmit}>
      <input
        className="m-1 text-black border-1 rounded border-black"
        required
        type="text"
        value={firstName}
        onChange={(e) => setFirst(e.target.value)}
        placeholder="First name"
      />
      <input
        className="m-1 text-black border-1 rounded border-black"
        required
        type="text"
        value={lastName}
        onChange={(e) => setLast(e.target.value)}
        placeholder="Last name"
      />
      <input
        className="m-1 text-black border-1 rounded border-black"
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="m-1 text-black border-1 rounded border-black"
        required
        type="password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Password (10+ characters)"
      />
      <div className="m-1 p-2 text-sm">
        <ul>
          <li style={{ color: validation.minLength ? "green" : "red" }}>
            {" "}
            At least 10 characters
          </li>
          <li style={{ color: validation.hasLowercase ? "green" : "red" }}>
            {" "}
            A lowercase letter
          </li>
          <li style={{ color: validation.hasUppercase ? "green" : "red" }}>
            An uppercase letter
          </li>
          <li style={{ color: validation.hasNumber ? "green" : "red" }}>
            {" "}
            A number
          </li>
          <li style={{ color: validation.hasSpecialChar ? "green" : "red" }}>
            A special character (!@#$...)
          </li>
        </ul>
      </div>
      <input
        className="m-1 text-black border-1 rounded border-black"
        required
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
      />
      <span className="m-1 text-black border-1 rounded border-black">
        Request Seller Account?&nbsp;
        <input
          type="checkbox"
          checked={sellerReq}
          onChange={(e) => setSeller(e.target.checked)}
        />
      </span>
      {error && <p className="m-1 text-red-500">{error}</p>}
      &nbsp;&nbsp;
      <button
        className="m-1 text-black border-2 rounded border-black disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Confirm"}
      </button>
    </form>
  );
};

export default SignUp;

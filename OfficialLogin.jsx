import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SpinnerModal from "../components/SpinnerModal"; // optional: adjust if different
import { auth } from "../utils/Firebase"; // ensure this path is correct
import { signInWithEmailAndPassword } from "firebase/auth";

const OfficialLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OfficialLogin mounted");
  }, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    console.log("onSubmit called", formData);

    const { email, password } = formData;

    // 1) Hard-coded admin quick check
    if (email === "admin@gmail.com" && password === "Admin@123") {
      console.log("Hardcoded admin matched — navigating to official dashboard");
      navigate("/official-dashboard");
      return;
    }

    // 2) Otherwise try Firebase sign in
    try {
      setSpinner(true);
      console.log("Calling Firebase signInWithEmailAndPassword...");
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase sign-in result:", result);

      // OPTIONAL: if you need to check admin by email list in code, do it here:
      // const adminEmails = ["admin@gmail.com", "principal@gmail.com"];
      // if (adminEmails.includes(email)) { navigate("/official-dashboard"); return; }

      // If you want to redirect students to student dashboard:
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const msg = error?.message || "Login failed";
      setErr(msg.includes(": ") ? msg.split(": ")[1] : msg);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#DFFDFC] p-8">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-center text-2xl font-bold mb-6">Admin Login</h2>

          {err && (
            <div className="mb-4 text-red-600 font-medium">
              Error: {err}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block mb-2">E-mail</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border mb-4"
              placeholder="admin@gmail.com"
              type="email"
              required
            />

            <label className="block mb-2">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border mb-4"
              placeholder="Admin@123"
              type="password"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      {spinner && <SpinnerModal />}
    </>
  );
};

export default OfficialLogin;

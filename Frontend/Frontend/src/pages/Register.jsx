import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 font-poppins">

      {/* LEFT SIDE */}
      <div className="hidden md:flex bg-zinc-950 text-white p-16 flex-col justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="hover:text-zinc-300 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-semibold cursor-pointer"
          >
            InteractX
          </h1>
        </div>

        <div>
          <h2 className="text-4xl font-semibold leading-tight">
            Create your workspace.
            <br />
            <span className="text-zinc-500">
              Start building today.
            </span>
          </h2>

          <p className="mt-6 text-zinc-400 max-w-sm leading-relaxed">
            Join thousands of teams who trust InteractX to simplify
            collaboration and accelerate execution.
          </p>
        </div>

        <div className="text-sm text-zinc-500">
          © 2026 InteractX
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-zinc-50 px-6 py-16">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-10">

          <h2 className="text-2xl font-semibold tracking-tight">
            Create account
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Enter your details to get started
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition"
            >
              Register
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-zinc-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-medium text-black cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;
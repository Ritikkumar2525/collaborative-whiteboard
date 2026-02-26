import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {ArrowLeft} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
  "http://localhost:8000/api/auth/login",
  form
);
      const { accessToken } = res.data;
      login(accessToken);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/api/auth/google";
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 font-poppins">

      {/* LEFT SIDE */}
      <div className="hidden md:flex bg-zinc-950 text-white p-16 flex-col justify-between">
        <div className="flex items-center justify-start gap-4">
          <button 
            onClick={() => navigate("/")}
            className="text-xs font-medium hover:text-zinc-300 transition"
          >
            <ArrowLeft size={16} />
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
            Welcome back.
            <br />
            <span className="text-zinc-500">
              Let’s get you inside.
            </span>
          </h2>

          <p className="mt-6 text-zinc-400 max-w-sm leading-relaxed">
            Access your workspace, reconnect with your team,
            and continue building without friction.
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
            Sign in
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">

            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
            onClick={handleLogin}
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400">OR</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-4"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-sm text-center text-zinc-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-medium text-black cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
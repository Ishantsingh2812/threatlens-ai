import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username,
          password
        }
      );

      alert("Account created successfully!");

      navigate("/login");

    } catch (error) {

      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-white">
            Threat<span className="text-cyan-400">Lens</span>
          </h1>

          <p className="text-slate-400 mt-2">
            Create your security account
          </p>

        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <div>

            <label className="block text-sm text-slate-300 mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Choose username"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          </div>

          <div>

            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Choose password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-slate-400 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;
// LoginPage.jsx
import { useState } from "react";
import { auth } from "../data/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/vibe-match");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-yellow-200 via-pink-200 to-purple-200 p-6">
      <h2 className="text-4xl font-bold text-purple-700 mb-6">Login to Continue</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-3 rounded w-80 border border-purple-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 p-3 rounded w-80 border border-purple-400"
      />
      <button
        onClick={handleLogin}
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg shadow-md hover:from-purple-600 hover:to-pink-500 transition"
      >
        Login
      </button>
    </div>
  );
}

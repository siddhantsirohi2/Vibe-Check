import { useState } from "react";
import { auth, db } from "../data/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gender || !email || !password) {
      return alert("Please fill all fields");
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), {
        name,
        gender,
        email,
        createdAt: new Date(),
      });
      setLoading(false);
      navigate("/vibe-questions");
    } catch (error) {
      setLoading(false);
      alert(error.message);
      console.error("Registration error:", error);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-tr from-purple-300 via-pink-300 to-yellow-200 flex justify-center items-center px-6">
<div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-xl max-w-md w-full p-10 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 tracking-wide">
          Welcome to <span className="text-pink-500">My-Match</span>
        </h1>
        <p className="text-center text-purple-600 font-semibold text-lg mb-4">
          Register & Discover Your Vibe
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-purple-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-purple-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your Gender
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
              <option value="preferNot">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-purple-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-purple-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-md hover:from-pink-500 hover:to-purple-600 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Get My Vibe"}
          </button>
        </form>
      </div>
    </div>
  );
}

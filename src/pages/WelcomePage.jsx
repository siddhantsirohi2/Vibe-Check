import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-purple-300 via-pink-300 to-yellow-200 flex flex-col justify-center items-center px-6 text-center">
      <h1 className="text-5xl font-extrabold text-purple-700 mb-6 drop-shadow-lg">
        Welcome to <span className="text-pink-500">My-Match</span>
      </h1>
      <p className="text-purple-600 max-w-md mb-10 text-lg font-semibold">
        Discover your unique vibe and find your perfect match. 
        Let’s start this exciting journey together!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/register")}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl font-bold text-xl shadow-lg hover:from-pink-500 hover:to-purple-600 transition"
        >
          Know Your Vibe
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-pink-400 text-white rounded-3xl font-bold text-xl shadow-lg hover:from-pink-400 hover:to-yellow-500 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

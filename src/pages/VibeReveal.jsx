import React, { useEffect, useState } from "react";
import { auth, db } from "../data/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import confetti from "canvas-confetti";
import Groq from "groq-sdk";
import { useNavigate } from "react-router-dom";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function VibeReveal() {
  const [loading, setLoading] = useState(true);
  const [vibe, setVibe] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

const fetchVibe = async () => {
  console.log("fetchVibe started");
  const user = auth.currentUser;
  console.log("Current user:", user);
  if (!user) return;

  const docRef = doc(db, "user_choices", user.uid);
  let docSnap;
  try {
    docSnap = await getDoc(docRef);
  } catch (e) {
    console.error("Error fetching user_choices:", e);
    return;
  }

  console.log("User choices doc snap exists:", docSnap.exists());
  if (!docSnap.exists()) {
    setVibe("No Data");
    return;
  }

  const data = docSnap.data();
  console.log("User choices data:", data);

  if (!data || typeof data !== "object") {
    setVibe("No Data");
    return;
  }

  const prompt = Object.entries(data)
    .filter(
      ([, obj]) =>
        obj && typeof obj === "object" && "question" in obj && "answer" in obj
    )
    .map(([, obj]) => `${obj.question}: ${obj.answer}`)
    .join("\n");
  console.log("Prompt for vibe generation:", prompt);

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a creatively attuned personality psychologist. Carefully read and reflect on the user’s answers to the following emotionally rich, self-reflective questions. Then, distill their overall emotional and psychological vibe into exactly two words.
These two words must reflect the essence of the user — not just their outward personality, but their emotional layers, inner conflicts, longings, or worldview. Use metaphorical, poetic, or unusual language if needed. Think: "tender storm," "haunted optimist," or "curious ache."
You must base your response on the actual answers provided. Do not generalize. Avoid vague or surface-level phrases like “nice person” or “happy human.” Be precise, evocative, and original.Here are the responses:\n\n${prompt}`,
        },
      ],
    });
    console.log("Groq API result:", result);
    const vibeResponse = result.choices?.[0]?.message?.content?.trim() || "Undefined Vibe";
    setVibe(vibeResponse);

    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, { generatedVibe: vibeResponse });
      console.log("Vibe saved to Firestore:", vibeResponse);
    } catch (e) {
      console.error("Error saving vibe:", e);
    }
  } catch (error) {
    console.error("Groq API error:", error);
    setVibe("Undefined Vibe");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchVibe();
}, []);
    
    
  const handleClick = () => {
    if (loading || flipped) return;

    setFlipped(true);

    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  // Navigate to vibe match page
  const goToMatchPage = () => {
    navigate("/vibe-match");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 gap-8">
      <div
        className="w-full max-w-[500px] h-[320px] md:h-[400px] perspective cursor-pointer"
        onClick={handleClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-[1200ms] transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 rounded-3xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold select-none p-6 text-center border-4 border-purple-500 hover:scale-105 transition-transform">
            {loading ? "Loading Your Vibe..." : "Know Your Vibe"}
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-fuchsia-600 via-rose-500 to-orange-400 rounded-3xl shadow-2xl flex flex-col items-center justify-center px-6 text-center border-4 border-pink-500">
            <p className="text-white text-lg font-semibold tracking-wide uppercase drop-shadow-md">
              Your Vibe Is
            </p>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mt-2 select-text">
              {vibe}
            </h2>
            <p className="mt-4 text-white text-4xl animate-pulse">🎉✨</p>
          </div>
        </div>
      </div>

      {/* Button to navigate to vibe matching page */}
      <button
        disabled={loading || !vibe}
        onClick={goToMatchPage}
        className="px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg transition"
      >
        Match Your Vibe with Others
      </button>
    </div>
  );
}

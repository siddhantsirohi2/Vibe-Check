import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../data/firebase";
import { doc, getDoc } from "firebase/firestore";

import DilDhadakneDo from "../Songs/DilDhadakneDo.mp3";
import GaltiSeMistake from "../Songs/GaltiSeMistake.mp3";
import TeraHoneLagaHoon from "../Songs/TeraHoneLagaHoon.mp3";
import TumSeHi from "../Songs/TumSeHi.mp3";

export default function VibeMatchDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [matchUserData, setMatchUserData] = useState(null);
  const [currentUserChoices, setCurrentUserChoices] = useState(null);
  const [matchUserChoices, setMatchUserChoices] = useState(null);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [matchedResponses, setMatchedResponses] = useState([]);

  // Ref to hold audio element
  const audioRef = useRef(null);

  // Select song based on matchPercentage
  const getSongByPercentage = (percentage) => {
    if (percentage >= 75) return TumSeHi;
    if (percentage >= 50) return DilDhadakneDo;
    if (percentage >= 25) return TeraHoneLagaHoon;
    return GaltiSeMistake;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to see matches.");
        navigate("/login");
        return;
      }
      if (!userId) {
        alert("No matched user specified.");
        navigate("/vibe-match");
        return;
      }

      try {
        const matchedUserDoc = await getDoc(doc(db, "users", userId));
        if (!matchedUserDoc.exists()) {
          alert("Matched user not found.");
          navigate("/vibe-match");
          return;
        }
        setMatchUserData(matchedUserDoc.data());

        const currentChoicesDoc = await getDoc(doc(db, "user_choices", user.uid));
        const matchChoicesDoc = await getDoc(doc(db, "user_choices", userId));

        const currentChoicesData = currentChoicesDoc.exists() ? currentChoicesDoc.data() : {};
        const matchChoicesData = matchChoicesDoc.exists() ? matchChoicesDoc.data() : {};

        setCurrentUserChoices(currentChoicesData);
        setMatchUserChoices(matchChoicesData);

        const currentKeys = Object.keys(currentChoicesData);
        let totalCompared = 0;
        let matchedCount = 0;
        let matchedQAs = [];

        for (const key of currentKeys) {
          const currentChoice = currentChoicesData[key];
          const matchChoice = matchChoicesData[key];

          if (
            currentChoice &&
            matchChoice &&
            currentChoice.answer &&
            matchChoice.answer &&
            typeof currentChoice.answer === "string" &&
            typeof matchChoice.answer === "string"
          ) {
            totalCompared++;
            if (
              currentChoice.answer.trim().toLowerCase() ===
              matchChoice.answer.trim().toLowerCase()
            ) {
              matchedCount++;
              matchedQAs.push({
                question: currentChoice.question,
                answer: currentChoice.answer,
              });
            }
          }
        }

        const percentage = totalCompared === 0 ? 0 : (matchedCount / totalCompared) * 100;
        setMatchPercentage(percentage.toFixed(2));
        setMatchedResponses(matchedQAs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  // Play the correct song when matchPercentage changes
  useEffect(() => {
    if (matchPercentage === 0) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const songSrc = getSongByPercentage(Number(matchPercentage));

    if (songSrc) {
      const audio = new Audio(songSrc);
      audio.loop = true;
      audio.volume = 0.4; // optional, to keep volume low
      audio.play().catch((e) => {
        // Autoplay might be blocked by browser policies
        console.log("Audio play failed:", e);
      });
      audioRef.current = audio;
    }

    // Cleanup audio on unmount or when matchPercentage changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [matchPercentage]);

  if (loading) return <div className="p-8 text-white">Loading match data...</div>;

  if (!matchUserData)
    return <div className="p-8 text-white">No data found for this user.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8 text-white">
      <button
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          navigate(-1);
        }}
        className="mb-6 px-4 py-2 bg-pink-600 rounded hover:bg-pink-700"
      >
        ← Back
      </button>
      <h1 className="text-5xl font-extrabold mb-4">
        Vibe Match with {matchUserData.name || "Unnamed User"}
      </h1>

      <p className="text-8xl font-black text-pink-500 mb-8 text-center">
        {matchPercentage}%
      </p>

      <h2 className="text-3xl font-semibold mb-4">Matched Responses</h2>
      {matchedResponses.length === 0 ? (
        <p className="text-lg italic">No matched responses found.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {matchedResponses.map(({ question, answer }, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-purple-700 via-pink-700 to-red-700 rounded-xl p-4 shadow"
            >
              <p className="font-semibold">{question}</p>
              <p className="italic mt-1">Answer: {answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

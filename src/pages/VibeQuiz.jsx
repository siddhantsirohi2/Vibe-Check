// src/pages/VibeQuestions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../data/firebase";
import { doc, setDoc } from "firebase/firestore";

// Import images
import DiljitDosanjh from "../Project-Pictures/Artists/DiljitDosanjh.png";
import TaylorSwift from "../Project-Pictures/Artists/TaylorSwift.jpg";
import TheWeeknd from "../Project-Pictures/Artists/TheWeeknd.jpg";

import BombardinoCroc from "../Project-Pictures/Brainrot/BombardinoCroc.png";
import TralaTrala from "../Project-Pictures/Brainrot/TralaTrala.jpg";
import TTTSahur from "../Project-Pictures/Brainrot/TTTSahur.png";

import Colorful from "../Project-Pictures/Colours/Colorful.jpg";
import Dark from "../Project-Pictures/Colours/Dark.jpg";
import Pastel from "../Project-Pictures/Colours/Pastel.jpg";

import DessertParty from "../Project-Pictures/FoodChoices/DessertParty.jpg";
import IndianParty from "../Project-Pictures/FoodChoices/IndianParty.jpg";
import PizzaParty from "../Project-Pictures/FoodChoices/PizzaParty.jpg";

import CafeWorkspace from "../Project-Pictures/IdealWorkspace/CafeWorkspace.jpg";
import CozyWorkspace from "../Project-Pictures/IdealWorkspace/CozyWorkspace.jpg";
import MinimalisticWorkspace from "../Project-Pictures/IdealWorkspace/MinimalisticWorkspace.jpg";

import Autumn from "../Project-Pictures/Seasons/Autumn.jpg";
import Rainy from "../Project-Pictures/Seasons/Rainy.jpg";
import Snowy from "../Project-Pictures/Seasons/Snowy.png";

import Friends from "../Project-Pictures/Sitcom/friends.jpg";
import HIMYM from "../Project-Pictures/Sitcom/howimet.png";
import ModernFamily from "../Project-Pictures/Sitcom/ModernFamily.png";

import Close from "../Project-Pictures/SocialStyle/Close.jpg";
import FriendsSocial from "../Project-Pictures/SocialStyle/Friends.jpg";
import Solo from "../Project-Pictures/SocialStyle/Solo.jpg";

import CityExplorer from "../Project-Pictures/WeekendMood/City-Explorer.jpg";
import CouchPotato from "../Project-Pictures/WeekendMood/Couch-Potato.jpg";
import NatureEscape from "../Project-Pictures/WeekendMood/Nature-Escape.jpg";

export default function VibeQuestions() {
  const navigate = useNavigate();

  const questionsData = [
    {
      key: "Artists",
      question: "Pick your concert vibe:",
      images: [
        { src: DiljitDosanjh, value: "Diljit Dosanjh" },
        { src: TaylorSwift, value: "Taylor Swift" },
        { src: TheWeeknd, value: "TheWeeknd" },
      ],
    },
    {
      key: "Brainrot",
      question: "Which meme energy do you radiate today?",
      images: [
        { src: BombardinoCroc, value: "Bombardino Crocodilo" },
        { src: TralaTrala, value: "Tralalero Tralala" },
        { src: TTTSahur, value: "Tung Tung Tung Sahur" },
      ],
    },
    {
      key: "Colours",
      question: "What color palette feels like you?",
      images: [
        { src: Colorful, value: "Colorful and Bright" },
        { src: Dark, value: "Dark Hues" },
        { src: Pastel, value: "Pastel Shades" },
      ],
    },
    {
      key: "Food Choices",
      question: "Which feast are you crashing today?",
      images: [
        { src: DessertParty, value: "Dessert Party" },
        { src: IndianParty, value: "Indian Party" },
        { src: PizzaParty, value: "Pizza Party" },
      ],
    },
    {
      key: "Ideal Workspace",
      question: "Pick your dream workspace:",
      images: [
        { src: CafeWorkspace, value: "Cafe and People Workspace" },
        { src: CozyWorkspace, value: "Cozy, Green and Homely Workspace" },
        { src: MinimalisticWorkspace, value: "Minimalistic and Alone Workspace" },
      ],
    },
    {
      key: "Seasons",
      question: "Which season matches your soul?",
      images: [
        { src: Autumn, value: "Autumn" },
        { src: Rainy, value: "Rainy" },
        { src: Snowy, value: "Snowy" },
      ],
    },
    {
      key: "Sitcom",
      question: "Your comfort sitcom?",
      images: [
        { src: Friends, value: "Friends" },
        { src: ModernFamily, value: "ModernFamily" },
        { src: HIMYM, value: "How I Met Your Mother" },
      ],
    },
    {
      key: "SocialStyle",
      question: "How do you prefer to vibe?",
      images: [
        { src: Close, value: "Close Friends" },
        { src: FriendsSocial, value: "Many Friends" },
        { src: Solo, value: "Solo" },
      ],
    },
    {
      key: "WeekendMood",
      question: "Your weekend mood board looks like:",
      images: [
        { src: CityExplorer, value: "City Explorer" },
        { src: CouchPotato, value: "Couch Potato" },
        { src: NatureEscape, value: "Nature Escape" },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState({});

  const handleSelect = (questionKey, value) => {
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [questionKey]: [value],
    }));
  };

  const handleNext = async () => {
    const currentQuestion = questionsData[currentIndex];
    const selected = userChoices[currentQuestion.key];

    if (!selected || selected.length === 0) {
      alert("Please select an option to continue.");
      return;
    }

    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("User not authenticated. Please login again.");
          navigate("/register");
          return;
        }

        const formattedChoices = {};
        questionsData.forEach(({ key, question }) => {
          const answer = userChoices[key]?.[0];
          if (answer) {
            formattedChoices[key] = {
              question,
              answer,
            };
          }
        });

        await setDoc(doc(db, "user_choices", user.uid), {
          ...formattedChoices,
          updatedAt: new Date(),
        });

        alert("Your vibe choices have been saved!");
        navigate("/vibe-reveal");
      } catch (error) {
        console.error("Error saving choices:", error);
        alert("Failed to save your choices. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const currentQuestion = questionsData[currentIndex];
  const selectedForCurrent = userChoices[currentQuestion.key] || [];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-300 via-pink-300 to-yellow-200 flex flex-col justify-center items-center p-6">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-xl max-w-5xl w-full p-8">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-8 text-center">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentQuestion.images.map(({ src, value }) => (
            <div
              key={value}
              onClick={() => handleSelect(currentQuestion.key, value)}
              className={`cursor-pointer rounded-xl overflow-hidden border-4 transition duration-200 ease-in-out ${
                selectedForCurrent.includes(value)
                  ? "border-pink-500 shadow-xl scale-105"
                  : "border-transparent hover:scale-105"
              }`}
            >
              <img
                src={src}
                alt={value}
                className="w-full h-auto object-contain rounded-xl"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
              currentIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
              selectedForCurrent.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
            disabled={selectedForCurrent.length === 0}
          >
            {currentIndex === questionsData.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

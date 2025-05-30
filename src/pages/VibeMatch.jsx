import React, { useEffect, useState } from "react";
import { auth, db } from "../data/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VibeMatch() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Please log in to see users.");
        navigate("/login");
        return;
      }

      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allUsers = [];

        usersSnapshot.forEach((doc) => {
          if (doc.id !== currentUser.uid) {
            allUsers.push({ id: doc.id, ...doc.data() });
          }
        });

        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl">
        Loading users...
      </div>
    );

  if (users.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl">
        No other users found.
      </div>
    );

  return (
  <div className="min-h-screen bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 p-8">
    <h1 className="text-4xl font-bold text-white mb-8 text-center">
      Find Your Vibe Match
    </h1>
    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => navigate(`/vibe-match-detail/${user.id}`)}
          className="cursor-pointer bg-white bg-opacity-25 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:bg-pink-600 hover:text-white transition-all duration-300"
        >
          <p className="text-3xl font-bold mb-3">{user.name || "Unnamed User"}</p>
          <p className="text-xl font-serif italic text-pink-100">
            {user.generatedVibe || "No vibe yet"}
          </p>
        </div>
      ))}
    </div>
  </div>
);

}

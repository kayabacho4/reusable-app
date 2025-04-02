import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { TextField } from "../components/TextField";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import apiService from "../apis/api";

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [userId, user, navigate]);

  const handleSaveProfile = async () => {
    const response = await apiService.updateUserById(user?.id ?? '', {
      display_name: displayName,
      username: user?.username ?? '',
    })

    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <>
      {" "}
      <Header
        pageName="Profile"
        user={user}
        onLogout={() => {
          logout();
        }}
      />
      <div className="container mx-auto max-w-2xl p-4">
        <div className="flex justify-start">
          <button
            onClick={() => {
              navigate("/home");
            }}
            className="block text-left px-4 py-2 text-blue-600 rounded-md cursor-pointer"
          >
            {"< Home"}
          </button>
        </div>
        <Card className="mb-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex items-center mb-4">
            {user ? (
              user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="w-10 h-10 rounded-full mr-4"
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-4 flex items-center justify-center bg-gray-300 text-gray-600">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>
              )
            ) : (
              <div className="w-10 h-10 rounded-full mr-4 bg-gray-200"></div>
            )}
            <div className="flex-grow">
              {isEditing ? (
                <TextField
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Type your display name..."
                />
              ) : (
                <h2 className="text-2xl font-bold">{user.display_name}</h2>
              )}
              <p className="text-gray-500">@{user.username}</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="rounded-md">
                Edit
              </Button>
            ) : (
              <></>
            )}
          </div>

          {user?.id === user.id && (
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile}>Save</Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
          <div className="flex justify-center">
            <button
              onClick={logout}
              className="block text-left px-4 py-2 text-xs underline text-red-600 rounded-md cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

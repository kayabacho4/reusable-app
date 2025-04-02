import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../apis/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { TextField } from "../components/TextField";
import { useAuth } from "../hooks/useAuth";
import { AuthUser } from "../types/types";
import Header from "../components/Header";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    try {
      const result = await apiService.login({ username, password });
      console.log(result);
      if (result.success) {
        login(result.data ?? ({} as AuthUser));
        navigate("/home");
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <>
      <Header pageName="" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96 px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex-col">
            <TextField
              label="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="mb-4"
            />
            <TextField
              type="password"
              label="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          <div className="flex justify-end">
            <Button className="mt-4" onClick={handleLogin}>
              Sign In
            </Button>
          </div>
          <div className="flex justify-end">
            <div className="text-center mt-3">
              <button
                className={`
                text-blue-600
                bg-transparent
                border-none
                cursor-pointer
                px-4
                text-sm
            `}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

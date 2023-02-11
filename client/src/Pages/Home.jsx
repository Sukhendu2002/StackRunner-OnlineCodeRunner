import React from "react";
import { auth, provider } from "../config.js";
import GoogleButton from "react-google-button";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const handleSignIn = async () => {
    await signInWithPopup(auth, provider).then(async (result) => {
      localStorage.setItem("authToken", result.user.accessToken);
      navigate("/run");
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Welcome to StackRunner
      </h1>
      <GoogleButton
        onClick={() => {
          handleSignIn();
        }}
      />
    </div>
  );
};

export default Home;

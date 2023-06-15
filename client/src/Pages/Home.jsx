import React, { useEffect } from "react";
import { auth, provider } from "../config.js";
import GoogleButton from "react-google-button";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken") && localStorage.getItem("uid")) {
      navigate("/run");
    }
  }, []);

  const handleSignIn = async () => {
    await signInWithPopup(auth, provider).then(async (result) => {
      console.log(result.user);
      localStorage.setItem("authToken", result.user.accessToken);
      localStorage.setItem("uid", result.user.uid);
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

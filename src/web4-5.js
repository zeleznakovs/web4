import React, { useRef, useState } from "react";
import { signup, login, logout, useAuth } from "./firebase";
import Profile from "./Profile";

export default function App() {
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const genderRef = useRef();
  const ageRef = useRef();
  const phoneNumberRef = useRef();
  const countryRef = useRef();
  const profileImageRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  async function handleSignup() {
    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  function togglePasswordVisibility() {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  function handleAgeChange() {
    const enteredAge = parseInt(ageRef.current.value);
    if (enteredAge < 18) {
      setAgeError("You must be at least 18 years old.");
    } else {
      setAgeError("");
    }
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const genders = ["Male", "Female", "Other"];
  const countries = ["USA", "Canada", "UK", "Ukraine", "BNR", "Australia", "Japan", "Germany"];

  return (
    <div id="main">
      <div>Currently logged in as: {currentUser?.email}</div>

      <div id="fields">
        <input ref={emailRef} placeholder="Email" required />
        <input
          ref={passwordRef}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
        />
        <button onClick={togglePasswordVisibility}>
          {showPassword ? "Hide" : "Show"} Password
        </button>
        <input ref={nameRef} placeholder="Full Name" />
        <select ref={genderRef} defaultValue="" required>
          <option value="" disabled hidden>
            Choose Gender
          </option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        <input
          ref={ageRef}
          type="number"
          placeholder="Age"
          required
          onChange={handleAgeChange}
        />
        {ageError && <div style={{ color: "red" }}>{ageError}</div>}
        <input
          ref={phoneNumberRef}
          type="tel"
          placeholder="Phone Number"
          required
        />
        <select ref={countryRef} defaultValue="" required>
          <option value="" disabled hidden>
            Choose Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div id="buttons">
        <button disabled={loading || currentUser} onClick={handleSignup}>
          Sign Up
        </button>
        <button disabled={loading || currentUser} onClick={handleLogin}>
          Log In
        </button>
        <button disabled={loading || !currentUser} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div id="avatar-container">
        {profileImageUrl && (
          <img src={profileImageUrl} alt="Avatar" className="avatar" />
        )}
      </div>

      <Profile />

      <div id="image-upload">
        <input
          ref={profileImageRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
        {uploadedImageUrl && (
          <img src={uploadedImageUrl} alt="Uploaded" className="uploaded-image" />
        )}
      </div>
    </div>
  );
}

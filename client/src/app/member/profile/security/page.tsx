"use client";

import axios from "axios";
import { useRef, useState } from "react";
import PasswordStrengthDropdown from "./password-strenght-dropdown";

export default function SecurityPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    lengthValid: false,
    upperCaseValid: false,
    lowerCaseValid: false,
    numberValid: false,
    symbolValid: false,
  });

  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    setPasswordStrength({
      lengthValid: isLongEnough,
      upperCaseValid: hasUpperCase,
      lowerCaseValid: hasLowerCase,
      numberValid: hasNumber,
      symbolValid: hasSpecialChar,
    });
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate if new password and confirm password match
    if (password !== confirmedPassword) {
      setError("New password and confirmation password do not match");
      return;
    }

    try {
      const memberID = "677a8e65ed9cec6c6df559d2"; // Replace with dynamic member email

      // Step 1: Verify the old password
      const { data } = await axios.post(
        `http://localhost:3001/api/member/${memberID}/verify-password`,
        { oldPassword }
      );

      console.log(data);

      if (!data.isValid) {
        setError("Old password is incorrect.");
        return;
      }

      // Step 2: Update the password
      await axios.put(`http://localhost:3001/api/member/${memberID}/password`, {
        oldPassword,
        newPassword: password,
      });

      setSuccess("Password updated successfully!");
      setOldPassword("");
      setPassword("");
      setConfirmedPassword("");
    } catch (error) {
      console.error("Failed to update password:", error);
      setError("Failed to update password. Please try again.");
    }
  };

  const handleReset = () => {
    setOldPassword("");
    setPassword("");
    setConfirmedPassword("");
    setError(null);
    setSuccess(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword); // Update password validation status
  };

  return (
    <div className="bg-transparent h-screen w-1/2 p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Security</h1>
      <h3 className="text-2xl font-semibold mb-8 text-gray-200">
        Change Password
      </h3>
      <form onSubmit={handlePasswordUpdate}>
        {/* Old Password */}
        <div className="mb-4">
          <label
            htmlFor="old-password"
            className="block text-gray-300 font-medium"
          >
            Old Password
          </label>
          <div className="relative mt-2">
            <input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type="password"
              id="old-password"
              placeholder="Old password*"
              className="text-black w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="new-password"
            className="block text-gray-300 font-medium"
          >
            New Password
          </label>
          <div className="relative mt-2">
            <input
              ref={passwordInputRef}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              value={password}
              onChange={handlePasswordChange}
              type="password"
              id="new-password"
              placeholder="New password*"
              className="text-black w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {passwordFocus && (
            <PasswordStrengthDropdown
              passwordStrength={passwordStrength}
              open={passwordFocus}
              inputWidth={passwordInputRef.current?.offsetWidth || 0} // Pass width here
            />
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label
            htmlFor="confirm-password"
            className="block text-gray-300 font-medium"
          >
            Confirm Password
          </label>
          <div className="relative mt-2">
            <input
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              type="password"
              id="confirm-password"
              placeholder="Confirm password*"
              className="text-black w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-400"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

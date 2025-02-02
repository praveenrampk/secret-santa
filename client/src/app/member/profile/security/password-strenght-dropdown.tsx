import React from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";

type PasswordStrength = {
  lengthValid: boolean;
  upperCaseValid: boolean;
  lowerCaseValid: boolean;
  numberValid: boolean;
  symbolValid: boolean;
};

const getTickColor = (isValid: boolean) => {
  return isValid ? "text-green-500" : "text-gray-500";
};

const getMenuItems = (passwordStrength: PasswordStrength) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <li className="mb-1 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${getTickColor(passwordStrength.lengthValid)}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="ml-2">At least 8 characters long</span>
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li className="mb-1 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${getTickColor(
              passwordStrength.upperCaseValid
            )}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="ml-2">Upper and lowercase characters</span>
        </li>
      ),
      key: "1",
    },
    {
      label: (
        <li className="mb-1 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${getTickColor(passwordStrength.numberValid)}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="ml-2">Number & special character</span>
        </li>
      ),
      key: "2",
    },
  ];

  return items;
};

const PasswordStrengthDropdown = ({
  passwordStrength,
  open,
  inputWidth,
}: {
  passwordStrength: PasswordStrength;
  open: boolean;
  inputWidth: number;
}) => (
  <div className="w-full">
    <Dropdown
      menu={{ items: getMenuItems(passwordStrength) }}
      trigger={["click"]}
      open={open}
      overlayStyle={{ width: inputWidth }}
      overlayClassName="no-rounded-dropdown"
    ></Dropdown>
  </div>
);

export default PasswordStrengthDropdown;

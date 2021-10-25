import React from "react"

function SadFace({ width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      version="1.1"
      viewBox="0 0 50 50"
      xmlSpace="preserve"
    >
      <circle cx="26" cy="25" r="20" fill="#FFC55F"></circle>
      <path
        d="M44.5 32.5c-4.2 10.2-15.8 15.1-26.1 11S3.3 27.7 7.5 17.5c.1-.2.1-.3.2-.5C4.5 26.2 9 36.4 18.2 40.2c9.5 3.8 20.3-.7 24.1-10.2 3.7-9.1-.4-19.6-9.3-23.7.2 0 .4.1.5.2 10.3 4.1 15.2 15.8 11 26z"
        opacity="0.1"
      ></path>
      <path
        fill="none"
        stroke="#515151"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M20 13c-.2 1-1 2.1-2.1 3-1.1.9-2.4 1.4-3.4 1.5M31.5 13c.2 1 1 2.1 2.1 3 1.1.9 2.4 1.4 3.4 1.5"
        opacity="0.5"
      ></path>
      <path
        fill="none"
        stroke="#515151"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M21.8 20.3c-.7 1.4-2 2.4-3.6 2.7s-3.2-.2-4.3-1.2M38.1 21.7c-1.1 1-2.7 1.5-4.3 1.2-1.6-.3-2.9-1.3-3.6-2.7"
        opacity="0.75"
      ></path>
      <path
        fill="#515151"
        d="M16 35.2c.2-2.8 1.6-5.3 3.7-7 .6-.5 1.2-.9 1.9-1.2 1.3-.6 2.8-1 4.4-1 1.6 0 3.1.4 4.4 1 .7.3 1.3.7 1.9 1.2 2.1 1.7 3.5 4.2 3.7 7 0 .4-.3.8-.7.8H16.7c-.4 0-.7-.4-.7-.8z"
        opacity="0.75"
      ></path>
      <path
        fill="#F56E5F"
        d="M32 34H20c1.8-1 3.8-2.5 6-2.5 2.1 0 4.1 1.5 6 2.5z"
      ></path>
    </svg>
  );
}

export default SadFace

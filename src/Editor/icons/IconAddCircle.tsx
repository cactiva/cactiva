import React from "react";

export default ({ color, size }: { color: string; size: any }) => {
  return (
    <svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill={color || "#fff"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="icon/content/add_circle_24px">
        <path
          id="icon/content/add_circle_24px_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 12C2 6.48001 6.48001 2 12 2C17.52 2 22 6.48001 22 12C22 17.52 17.52 22 12 22C6.48001 22 2 17.52 2 12ZM13 13H16C16.55 13 17 12.55 17 12C17 11.45 16.55 11 16 11H13V8C13 7.45001 12.55 7 12 7C11.45 7 11 7.45001 11 8V11H8C7.45001 11 7 11.45 7 12C7 12.55 7.45001 13 8 13H11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V13Z"
        />
      </g>
    </svg>
  );
};
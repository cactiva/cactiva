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
      <g id="icon/content/paste_24px">
        <path
          id="icon/content/paste_24px_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.60001 1.84 9.17999 3H5C3.89999 3 3 3.89999 3 5V21C3 22.1 3.89999 23 5 23H19C20.1 23 21 22.1 21 21V5C21 3.89999 20.1 3 19 3ZM12 3C12.55 3 13 3.45001 13 4C13 4.54999 12.55 5 12 5C11.45 5 11 4.54999 11 4C11 3.45001 11.45 3 12 3ZM5 20C5 20.55 5.45001 21 6 21H18C18.55 21 19 20.55 19 20V6C19 5.45001 18.55 5 18 5H17V6C17 7.10001 16.1 8 15 8H9C7.89999 8 7 7.10001 7 6V5H6C5.45001 5 5 5.45001 5 6V20Z"
        />
      </g>
    </svg>
  );
};

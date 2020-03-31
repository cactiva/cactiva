import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/editor/vertical_align_center_24px">
				<path
					id="icon/editor/vertical_align_center_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M14.79 5H13V2C13 1.45 12.55 1 12 1C11.45 1 11 1.45 11 2V5H9.20999C8.76001 5 8.54001 5.54 8.85001 5.85L11.64 8.64C11.84 8.84 12.15 8.84 12.35 8.64L15.14 5.85C15.46 5.54 15.24 5 14.79 5ZM9.20999 19H11V22C11 22.55 11.45 23 12 23C12.55 23 13 22.55 13 22V19H14.79C15.24 19 15.46 18.46 15.14 18.15L12.35 15.36C12.15 15.16 11.84 15.16 11.64 15.36L8.85001 18.15C8.54001 18.46 8.76001 19 9.20999 19ZM5 13C4.45001 13 4 12.55 4 12C4 11.45 4.45001 11 5 11H19C19.55 11 20 11.45 20 12C20 12.55 19.55 13 19 13H5Z"
				/>
			</g>
		</svg>;
};

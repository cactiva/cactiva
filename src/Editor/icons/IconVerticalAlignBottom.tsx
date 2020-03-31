import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/editor/vertical_align_bottom_24px">
				<path
					id="icon/editor/vertical_align_bottom_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M13 13H14.79C15.24 13 15.46 13.54 15.15 13.85L12.36 16.64C12.16 16.84 11.85 16.84 11.65 16.64L8.85999 13.85C8.54001 13.54 8.76001 13 9.20999 13H11V4C11 3.45 11.45 3 12 3C12.55 3 13 3.45 13 4V13ZM5 21C4.45001 21 4 20.55 4 20C4 19.45 4.45001 19 5 19H19C19.55 19 20 19.45 20 20C20 20.55 19.55 21 19 21H5Z"
				/>
			</g>
		</svg>;
};

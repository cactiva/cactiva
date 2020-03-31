import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/editor/vertical_align_top_24px">
				<path
					id="icon/editor/vertical_align_top_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5 5C4.45001 5 4 4.55 4 4C4 3.45 4.45001 3 5 3H19C19.55 3 20 3.45 20 4C20 4.55 19.55 5 19 5H5ZM11 11H9.20999C8.76001 11 8.54001 10.46 8.85001 10.15L11.64 7.36C11.84 7.16 12.15 7.16 12.35 7.36L15.14 10.15C15.46 10.46 15.24 11 14.79 11H13V20C13 20.55 12.55 21 12 21C11.45 21 11 20.55 11 20V11Z"
				/>
			</g>
		</svg>;
};

import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/action/vertical_split_24px">
				<path
					id="icon/action/vertical_split_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M21 18C21 17.45 20.55 17 20 17H14C13.45 17 13 17.45 13 18C13 18.55 13.45 19 14 19H20C20.55 19 21 18.55 21 18ZM14 13H20C20.55 13 21 13.45 21 14C21 14.55 20.55 15 20 15H14C13.45 15 13 14.55 13 14C13 13.45 13.45 13 14 13ZM20 9H14C13.45 9 13 9.45001 13 10C13 10.55 13.45 11 14 11H20C20.55 11 21 10.55 21 10C21 9.45001 20.55 9 20 9ZM20 5H14C13.45 5 13 5.45001 13 6C13 6.54999 13.45 7 14 7H20C20.55 7 21 6.54999 21 6C21 5.45001 20.55 5 20 5ZM4 19L10 19C10.55 19 11 18.55 11 18L11 6C11 5.45001 10.55 5 10 5H4C3.44995 5 3 5.45001 3 6V18C3 18.55 3.44995 19 4 19Z"
				/>
			</g>
		</svg>;
};

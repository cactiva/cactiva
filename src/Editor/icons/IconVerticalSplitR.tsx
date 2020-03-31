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
					d="M3 6C3 6.54999 3.44995 7 4 7H10C10.55 7 11 6.54999 11 6C11 5.45001 10.55 5 10 5H4C3.44995 5 3 5.45001 3 6ZM10 11H4C3.44995 11 3 10.55 3 10C3 9.45001 3.44995 9 4 9H10C10.55 9 11 9.45001 11 10C11 10.55 10.55 11 10 11ZM4 15H10C10.55 15 11 14.55 11 14C11 13.45 10.55 13 10 13H4C3.44995 13 3 13.45 3 14C3 14.55 3.44995 15 4 15ZM4 19H10C10.55 19 11 18.55 11 18C11 17.45 10.55 17 10 17H4C3.44995 17 3 17.45 3 18C3 18.55 3.44995 19 4 19ZM20 5H14C13.45 5 13 5.45001 13 6V18C13 18.55 13.45 19 14 19H20C20.55 19 21 18.55 21 18V6C21 5.45001 20.55 5 20 5Z"
				/>
			</g>
		</svg>;
};

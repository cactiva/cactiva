import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/image/photo_size_select_actual_24px">
				<path
					id="icon/image/photo_size_select_actual_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M3 3H21C22 3 23 4 23 5V19C23 20 22 21 21 21H3C1.90002 21 1 20.1 1 19V5C1 4 2 3 3 3ZM8.12 12.99L5.63 16.19C5.37 16.52 5.60999 17 6.0199 17.01H18.01C18.4199 17.01 18.6599 16.54 18.4099 16.21L14.8999 11.53C14.7 11.26 14.2999 11.26 14.1 11.52L11 15.51L8.8999 12.98C8.69995 12.73 8.31995 12.74 8.12 12.99Z"
				/>
			</g>
		</svg>;
};

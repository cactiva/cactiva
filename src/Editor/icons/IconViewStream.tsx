import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/action/view_stream_24px">
				<path
					id="icon/action/view_stream_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M10.5 20.5H6.5C5.95001 20.5 5.5 20.05 5.5 19.5L5.5 4.5C5.5 3.94995 5.95001 3.5 6.5 3.5H10.5C11.05 3.5 11.5 3.94995 11.5 4.5V19.5C11.5 20.05 11.05 20.5 10.5 20.5ZM18.5 4.5V19.5C18.5 20.05 18.05 20.5 17.5 20.5H13.5C12.95 20.5 12.5 20.05 12.5 19.5V4.5C12.5 3.94995 12.95 3.5 13.5 3.5H17.5C18.05 3.5 18.5 3.94995 18.5 4.5Z"
				/>
			</g>
		</svg>;
};

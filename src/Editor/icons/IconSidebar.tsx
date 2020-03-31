import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			stroke={color || '#fff'}
			fill="none"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
			<line x1="9" y1="3" x2="9" y2="21"></line>
		</svg>;
};

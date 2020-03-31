import React from 'react';

export default ({ color, size }: { color: string; size: any }) => {
	return <svg
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill={color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/editor/title_24px">
				<path
					id="icon/editor/title_24px_2"
					d="M12 7.2C12 7.864 12.5264 8.4 13.1786 8.4H16.3214V16.8C16.3214 17.464 16.8479 18 17.5 18C18.1521 18 18.6786 17.464 18.6786 16.8V8.4H21.8214C22.4736 8.4 23 7.864 23 7.2C23 6.536 22.4736 6 21.8214 6H13.1786C12.5264 6 12 6.536 12 7.2Z"
				/>
				<path
					id="icon/editor/title_24px_3"
					d="M1 7.2C1 7.864 1.52643 8.4 2.17857 8.4H5.32143V16.8C5.32143 17.464 5.84786 18 6.5 18C7.15214 18 7.67857 17.464 7.67857 16.8V8.4H10.8214C11.4736 8.4 12 7.864 12 7.2C12 6.536 11.4736 6 10.8214 6H2.17857C1.52643 6 1 6.536 1 7.2Z"
				/>
			</g>
		</svg>;
};

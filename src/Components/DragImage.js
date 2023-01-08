import React, { useContext, useRef, useState } from 'react';
import { photoContext } from '../Pages/AlbumPage';

const DragImage = (props) => {
	const context = useContext(photoContext);
	const height = useRef(null);
	const width = useRef(null);

	const [ style, setStyle ] = useState({});

	const touchStart = (e) => {
		handleStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY, e);
	};

	const touchMove = (e) => {
		handleMove(e.changedTouches[0].pageX, e.changedTouches[0].pageY, e);
	};

	const touchEnd = (e) => {
		handleEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY, e);
	};

	// const mouseMove = (e) => {
	// 	handleMove(e.pageX, e.pageY);
	// };

	// const mouseEnd = (e) => {
	// 	handleMove(e.pageX, e.pageY);
	// };

	const handleStart = (x, y, e) => {
		height.current = e.target.offsetTop;
		width.current = e.target.offsetLeft;
		setStyle((currrent) => ({
			...currrent,
			position: 'fixed'
		}));
	};

	const handleMove = (x, y, e) => {
		const diferenceY = y - height.current;
		const diferenceX = x - width.current;

		setStyle((currrent) => ({
			...currrent,
			position: 'fixed',
			top: height.current + diferenceY,
			left: width.current + diferenceX
		}));
	};

	const handleEnd = (x, y, e) => {
		setStyle({ position: 'static' });
		context.fromDragToPage(e.target.dataset.photoid, x, y);
	};

	return (
		<div
			className="imgWraper"
			style={style}
			onTouchStart={touchStart}
			onTouchMove={touchMove}
			onTouchEnd={touchEnd}
			// onMouseDown={handleStart}
			// onMouseMove={mouseMove}
			// onMouseUp={mouseEnd}
		>
			<img
				src={`data:image/jpg;base64,${props.element.base64}`}
				alt=""
				key={props.element.id}
				data-photoid={props.element.id}
			/>
		</div>
	);
};

export default DragImage;

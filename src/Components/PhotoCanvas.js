import { useState, useEffect, useRef } from 'react';
// import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';

function PhotoCanvas(props) {
	// const [ canvas, setCanvas ] = useState('');
	const isInitialMount = useRef(true);
	const canvas = useRef(null);

	useEffect(
		() => {
			if (isInitialMount.current) {
				canvas.current = initCanvas();
				isInitialMount.current = false;
			} else {
				console.log(props.elements);
				addElements(canvas.current, props.elements);
			}
		},
		[ props.elements ]
	);

	const initCanvas = () => {
		const canvi = new fabric.Canvas('canvas', {
			height: props.height,
			width: props.width,
			backgroundColor: '#D9D9D9'
		});

		return canvi;
	};

	const addElements = (canvi, elements) => {
		elements.map((element) => {
			fabric.Image.fromURL(`data:image/jpg;base64,${element.base64}`, function(oImg) {
				oImg.set({
					left: 10,
					top: 10
				});
				oImg.scaleToWidth(200);
				canvi.add(oImg);
			});
		});
		canvi.renderAll();
	};

	return (
		<div>
			<h1>Fabric.js on React - fabric.Canvas('...')</h1>
			<canvas id="canvas" />
		</div>
	);
}

export default PhotoCanvas;

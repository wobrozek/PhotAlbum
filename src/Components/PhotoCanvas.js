import { useState, useEffect } from 'react';
// import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';

function PhotoCanvas(props) {
	const [ canvas, setCanvas ] = useState('');
	useEffect(
		() => {
			console.log(props.elements);
			const can = initCanvas();
			setCanvas(can);
		},
		[ props.elements ]
	);

	const initCanvas = () => {
		const canvi = new fabric.Canvas('canvas', {
			height: props.height,
			width: props.width,
			backgroundColor: '#D9D9D9'
		});

		props.elements.map((element) => {
			fabric.Image.fromURL(`data:image/png;base64,${element.base64}`, function(oImg) {
				oImg.alt = '';
				canvi.add(oImg);
			});
		});

		return canvi;
	};
	return (
		<div>
			<h1>Fabric.js on React - fabric.Canvas('...')</h1>
			<canvas id="canvas" />
		</div>
	);
}

export default PhotoCanvas;

import { useState, useEffect, useRef, useContext } from 'react';
// import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';
import CloseIcon from '@mui/icons-material/Close';
import { photoContext } from '../Pages/AlbumPage';

function PhotoCanvas(props) {
	// const [ canvas, setCanvas ] = useState('');
	const isInitialMount = useRef(true);
	const canvas = useRef(null);
	const context = useContext(photoContext);

	useEffect(
		() => {
			if (isInitialMount.current) {
				canvas.current = initCanvas();
				isInitialMount.current = false;
			} else {
				if (context.page) addElements(canvas.current);
			}
		},
		[ props.width, props.height, context.page ]
	);

	const initCanvas = () => {
		const canvi = new fabric.Canvas('canvas', {
			height: props.height,
			width: props.width,
			backgroundColor: '#D9D9D9'
		});

		//edit photo edit border
		fabric.Object.prototype.transparentCorners = false;
		fabric.Object.prototype.cornerColor = 'blue';
		fabric.Object.prototype.cornerStyle = 'circle';

		//add delete button
		fabric.Object.prototype.controls.deleteControl = new fabric.Control({
			x: 0.5,
			y: -0.4,
			offsetY: 16,
			cursorStyle: 'pointer',
			mouseUpHandler: deleteObject,
			render: renderIcon
		});

		return canvi;
	};

	const deleteObject = (eventData, transform) => {
		var target = transform.target;
		props.delete(target.id);
	};

	function renderIcon(ctx, left, top, styleOverride, fabricObject) {
		ctx.save();
		ctx.translate(left, top);
		ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));

		var deleteIcon =
			"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

		var img = document.createElement('img');
		img.src = deleteIcon;

		let size = 24;
		ctx.drawImage(img, -size / 2, -size / 2, size, size);

		ctx.restore();
	}

	const addElements = (canvi, elements) => {
		canvi.clear();
		canvi.backgroundColor = '#D9D9D9';
		canvi.height = props.height;
		canvi.width = props.width;

		console.log(context);
		context.page.map((element) => {
			fabric.Image.fromURL(`data:image/jpg;base64,${element.base64}`, function(oImg) {
				oImg.set({
					left: 10,
					top: 10
				});
				oImg.id = element.id;
				oImg.scaleToWidth(200);
				canvi.add(oImg);
			});
		});
		canvi.renderAll();
	};

	return (
		<div>
			<canvas id="canvas" />
		</div>
	);
}

export default PhotoCanvas;

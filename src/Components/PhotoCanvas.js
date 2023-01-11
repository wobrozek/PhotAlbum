import { useState, useEffect, useRef, useContext } from 'react';
// import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';
import CloseIcon from '@mui/icons-material/Close';
import { photoContext } from '../Pages/AlbumPage';
import { height } from '@mui/system';

function PhotoCanvas(props) {
	const isInitialMount = useRef(true);
	const isInitalPhotos = useRef(true);
	const canvas = useRef(null);
	const context = useContext(photoContext);

	useEffect(
		() => {
			if (isInitialMount.current) {
				canvas.current = initCanvas();
				isInitialMount.current = false;
			} else {
				if (context.page) {
					addElements(canvas.current);
				}
			}
		},
		[ context.page ]
	);

	useEffect(
		() => {
			if (context.isLoad) {
				photoSizeAndPosition(canvas.current);
			}
		},
		[ context.isLoad ]
	);

	const photoSizeAndPosition = () => {
		const canvasHeight = context.cordinantsRef.current.height;
		const canvasWidth = context.cordinantsRef.current.width;
		let lastI = null;

		context.allPages[0].map((_, columnIndex) => {
			let rowIndex = 0;
			context.allPages.map((row) => {
				if (!row[columnIndex]) return;
				let i = new Image();
				lastI = i;

				i.onload = function() {
					console.log(i.height, i.width);
					context.allPages[i.rowIndex][i.columnIndex].height = i.height;
					context.allPages[i.rowIndex][i.columnIndex].width = i.width;
				};

				i.src = `data:image/jpg;base64,${row[columnIndex].base64}`;
				i.columnIndex = columnIndex;
				i.rowIndex = rowIndex;
				rowIndex += 1;
			});
		});

		lastI.onload = function() {
			context.allPages[0].map((_, columnIndex) => {
				let rowIndex = 0;
				context.allPages.map((row) => {
					if (!row[columnIndex]) return;

					const [ newLeft, newTop ] = setPosition(columnIndex, rowIndex, canvasWidth, canvasHeight);

					rowIndex += 1;
				});
			});
		};
	};

	function setPosition(columnIndex, rowIndex, canvasWidth, canvasHeight) {
		let photoWidth = context.allPages[rowIndex][columnIndex].width;
		let photoHeight = context.allPages[rowIndex][columnIndex].height;
		let halfCanvasWidth = canvasWidth / 2 - 10;
		let halfCanvasHeight = canvasHeight / 2 - 10;
		let aspectRatio = photoWidth / photoHeight;
		let left = 0;
		let top = 0;

		switch (columnIndex) {
			case 0:
				left = 10;
				top = 10;
				break;
			case 1:
				left = 10 + halfCanvasWidth;
				top = 10;
				break;
			case 2:
				top = 10 + halfCanvasHeight;
				left = 10;
				break;
			case 3:
				top = 10 + halfCanvasHeight;
				left = 10 + halfCanvasWidth;
				break;
			default:
				top = 0;
				left = 0;
		}

		if (photoHeight > photoWidth) {
			setHorizontal(top, left, columnIndex, rowIndex, aspectRatio, halfCanvasHeight);
			left = halfCanvasWidth;
		} else {
			setVertical(top, left, columnIndex, rowIndex, aspectRatio, halfCanvasWidth);
			left = halfCanvasWidth;
		}

		return [ left, top ];
	}

	function setVertical(top, left, columnIndex, rowIndex, aspectRatio, halfCanvasWidth) {
		context.allPages[rowIndex][columnIndex].top = top;
		context.allPages[rowIndex][columnIndex].left = left;
		context.allPages[rowIndex][columnIndex].width = halfCanvasWidth;
		context.allPages[rowIndex][columnIndex].height = halfCanvasWidth / aspectRatio;
	}

	function setHorizontal(top, left, columnIndex, rowIndex, aspectRatio, halfCanvasHeight) {
		context.allPages[rowIndex][columnIndex].top = top;
		context.allPages[rowIndex][columnIndex].left = left;
		context.allPages[rowIndex][columnIndex].width = halfCanvasHeight / aspectRatio;
		context.allPages[rowIndex][columnIndex].height = halfCanvasHeight;
	}

	function getSize() {
		const msWordAspectRatio = 297 / 210;

		if (window.innerHeight > window.innerWidth) {
			let width = window.innerWidth - 40;
			let height = width * msWordAspectRatio;
			return [ width, height ];
		} else {
			let height = window.innerHeight - 300;
			let width = height / msWordAspectRatio;
			return [ width, height ];
		}
	}

	const initCanvas = () => {
		const [ widthGet, heightGet ] = getSize();
		const canvi = new fabric.Canvas('canvas', {
			height: heightGet,
			width: widthGet,
			backgroundColor: '#D9D9D9'
		});

		//send corinants info to parent
		context.cordinantsRef.current = {
			height: heightGet,
			width: widthGet,
			top: canvi._offset.top,
			left: canvi._offset.left
		};

		//edit photo edit border
		fabric.Object.prototype.transparentCorners = false;
		fabric.Object.prototype.cornerColor = '#924274';
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
		context.fromPageToDrag(target.id);
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

		context.page.map((element) => {
			fabric.Image.fromURL(`data:image/jpg;base64,${element.base64}`, function(oImg) {
				oImg.set({
					left: element.left,
					top: element.top
				});
				oImg.id = element.id;
				oImg.scaleToWidth(element.width);
				oImg.scaleToHeight(element.height);
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

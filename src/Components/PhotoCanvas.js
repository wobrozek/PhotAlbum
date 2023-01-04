import axios from 'axios';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';

function downloadPhotos(albumId) {
	axios
		.get(`https://8feb88c6-7249-42ff-942f-8f21da1f33a2.mock.pstmn.io/album/${albumId}/photos`)
		.then((response) => {
			return response.data;
		})
		.catch((err) => console.error(err.message));
}

function PhotoCanvas(elements, width, height) {
	const { editor, onReady } = useFabricJSEditor();

	return <FabricJSCanvas onReady={onReady} />;
}

export default PhotoCanvas;

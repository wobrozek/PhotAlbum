import React, { useEffect, useState } from 'react';
import PhotoCanvas from './PhotoCanvas';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CanvasStack = () => {
	const parms = useParams();
	const [ elements, setElements ] = useState([]);

	function downloadPhotos(albumId) {
		axios
			.get(`https://8feb88c6-7249-42ff-942f-8f21da1f33a2.mock.pstmn.io/album/${albumId}/photos`)
			.then((response) => {
				console.log(response.data);
				setElements(response.data);
			})
			.catch((err) => console.error(err.message));
	}

	useEffect(() => {
		downloadPhotos(parms.id);
	}, []);

	return <PhotoCanvas elements={elements} width={500} height={500} />;
};

export default CanvasStack;

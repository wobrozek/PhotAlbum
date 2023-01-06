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
				setElements(response.data);
			})
			.catch((err) => console.error(err.message));
	}

	const deletePhoto = (id) => {
		setElements(elements.filter((element) => element.id !== id));
	};

	useEffect(
		() => {
			downloadPhotos(parms.id);
		},
		[ parms.id ]
	);

	return (
		<React.Fragment>
			<PhotoCanvas elements={elements} width={500} height={500} delete={deletePhoto} />
		</React.Fragment>
	);
};

export default CanvasStack;

import { useContext, useState } from 'react';
import { photoContext } from '../Pages/AlbumPage';
import DragImage from './DragImage';

export const PhotoPlaceholder = () => {
	const context = useContext(photoContext);

	const LoadPhotos = () => {
		if (context.dragImages.length !== 0) {
			return context.dragImages.map((element) => <DragImage element={element} key={element.id} />);
		} else {
			return <div className="textCenter">Usuń zdjęcie a pojawi się tutaj by przenieść je na inną stronę</div>;
		}
	};

	return (
		<div className="flex photoPlaceholder">
			<LoadPhotos />
		</div>
	);
};

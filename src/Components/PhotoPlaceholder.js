import { useContext, useState } from 'react';
import { photoContext } from '../Pages/AlbumPage';
import DragImage from './DragImage';

export const PhotoPlaceholder = () => {
	const context = useContext(photoContext);

	const LoadPhotos = () => {
		if (context.dragImages.length !== 0) {
			return context.dragImages.map((element) => <DragImage element={element} key={element.id} />);
		} else {
			return <div className="textCenter">Usun zdjecie a pojawia sie tutaj by przeniesc je na inna strone</div>;
		}
	};

	return (
		<div className="flex photoPlaceholder">
			<LoadPhotos />
		</div>
	);
};

import { CanvasPageControler } from '../Components/CanvasPageControler';
import CanvasStack from '../Components/CanvasStack';
import { PhotoPlaceholder } from '../Components/PhotoPlaceholder';
import { createContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PhotoCanvas from '../Components/PhotoCanvas';

// const ContextApi = () => {
// 	const [ allPages, setAllPages ] = useState([ {} ]);
// 	const [ page, setPage ] = useState({});
// 	const removePage = (id) => {
// 		setPage((people) => {
// 			return people.filter((person) => person.id !== id);
// 		});
// 	};
// 	const changePage = (arr) => {
// 		setPage(arr);
// 	};
// };

export const photoContext = createContext();
export const pageContext = createContext();
// const pageContext = createContext([]);
// const dragImages = createContext([]);
// const pageIndex = createContext(0);

export const AlbumPage = () => {
	const [ allPages, setAllPages ] = useState([]);
	const [ page, setPage ] = useState({});
	const [ dragImages, setDragImages ] = useState([]);
	const [ index, setIndex ] = useState(0);

	const removePage = () => {
		// todo:what if zero
		// todo: move to dragable

		allPages.splice(index, 1);
		if (index > allPages.length - 1 && index !== 0) {
			setIndex((piervIndex) => piervIndex - 1);
		} else {
			setPage(allPages[index]);
		}
	};

	const newPage = () => {
		allPages.splice(index + 1, index, []);
		setIndex((piervIndex) => piervIndex + 1);
	};

	const nextPage = () => {
		if (index < allPages.length - 1) {
			setIndex((piervIndex) => piervIndex + 1);
		}
	};

	const previousPage = () => {
		if (index !== 0) {
			setIndex((piervIndex) => piervIndex - 1);
		}
	};

	// divide all photos into pages
	const initAllPage = (arr) => {
		for (let i = 0; i < arr.length; i += 4) {
			allPages.push(arr.slice(i, i + 4));
			console.log(allPages);
		}
		setPage(allPages[0]);
	};

	const removePhoto = (pageId, photonumber) => {
		allPages[pageId].splice(photonumber, photonumber);
	};

	const addPhoto = (pageId, photo) => {
		setPage[pageId].push(photo);
	};

	const fromDragToPage = (photoId) => {
		const pageWithoutElement = page.filter((element) => {
			if (photoId !== element.id) {
				return true;
			} else {
				setDragImages((previousState) => {
					return [ ...previousState, element ];
				});
				return false;
			}
		});
		setPage(pageWithoutElement);
	};

	const fromPageToDrag = (photoId) => {
		const pageWithoutElement = dragImages.filter((element) => {
			if (photoId !== element.id) {
				return true;
			} else {
				setPage((previousState) => {
					return [ ...previousState, element ];
				});
				return false;
			}
		});
		setDragImages(pageWithoutElement);
	};

	const changePhotoParametrs = (photoId, dictio) => {
		page.map((element) => {
			if ((element.id = photoId)) {
				for (const [ key, value ] in dictio) {
					element[key] = value;
				}
				return true;
			}
		});
	};

	function downloadPhotos(albumId) {
		axios
			.get(`https://8feb88c6-7249-42ff-942f-8f21da1f33a2.mock.pstmn.io/album/${albumId}/photos`)
			.then((response) => {
				initAllPage(response.data);
			})
			.catch((err) => console.error(err.message));
	}
	const parms = useParams();

	useEffect(
		() => {
			downloadPhotos(parms.id);
		},
		[ parms.id ]
	);

	useEffect(
		() => {
			setPage(allPages[index]);
		},
		[ index ]
	);

	return (
		<div className="flex-column">
			<pageContext.Provider value={{ page, allPages, index, nextPage, previousPage, removePage, newPage }}>
				<CanvasPageControler />
			</pageContext.Provider>
			<photoContext.Provider value={{ page, changePhotoParametrs, fromDragToPage, fromPageToDrag }}>
				<PhotoCanvas width={500} height={500} />
				<PhotoPlaceholder />
			</photoContext.Provider>
		</div>
	);
};

export default AlbumPage;

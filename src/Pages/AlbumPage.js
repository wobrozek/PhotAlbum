import { CanvasPageControler } from '../Components/CanvasPageControler';
import { PhotoPlaceholder } from '../Components/PhotoPlaceholder';
import { createContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PhotoCanvas from '../Components/PhotoCanvas';
import { height } from '@mui/system';

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
	const [ page, setPage ] = useState([]);
	const [ dragImages, setDragImages ] = useState([]);
	const [ index, setIndex ] = useState(0);
	const indexRef = useRef(0);
	const cordinantsRef = useRef({});
	// const canvas = useRef();

	const removePage = () => {
		// todo:what if zero
		// todo: move to dragable

		allPages.splice(index, 1);
		if (index > allPages.length - 1 && index !== 0) {
			setIndex((piervIndex) => piervIndex - 1);
		} else {
			setPage(() => allPages[index]);
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
		setPage(() => allPages[0]);
		console.log(page);
	};

	const removePhoto = (pageId, photonumber) => {
		allPages[pageId].splice(photonumber, photonumber);
	};

	const addPhoto = (pageId, photo) => {
		setPage[pageId].push(photo);
	};

	const fromPageToDrag = (photoId) => {
		console.log(indexRef);
		allPages[indexRef.current] = allPages[indexRef.current].filter((element) => {
			if (photoId !== element.id) {
				return element;
			} else {
				setDragImages((previousState) => {
					return [ ...previousState, element ];
				});
			}
		});
		setPage(allPages[indexRef.current]);
	};

	const isInCanvas = (x, y) => {
		if (
			x > cordinantsRef.current.left &&
			x < cordinantsRef.current.left + cordinantsRef.current.width &&
			y > cordinantsRef.current.top &&
			y < cordinantsRef.current.top + cordinantsRef.current.height
		) {
			return true;
		}
		return false;
	};

	const fromDragToPage = (photoId, x, y) => {
		photoId = parseInt(photoId);
		if (!isInCanvas(x, y)) return;
		const pageWithoutElement = dragImages.filter((element) => {
			if (photoId !== element.id) {
				return element;
			} else {
				setPage((previousState) => {
					return [ ...previousState, element ];
				});
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
			.get(`https://run.mocky.io/v3/c3b8a64f-87b3-44c8-bf95-a63c32168389/${albumId}`)
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
			indexRef.current = index;
			setPage(() => allPages[index]);
		},
		[ index ]
	);

	return (
		<div className="flex-column main">
			<pageContext.Provider value={{ page, allPages, index, nextPage, previousPage, removePage, newPage }}>
				<CanvasPageControler />
			</pageContext.Provider>
			<photoContext.Provider
				value={{ cordinantsRef, page, dragImages, changePhotoParametrs, fromDragToPage, fromPageToDrag }}
			>
				<PhotoCanvas width={500} height={500} />
				<PhotoPlaceholder />
			</photoContext.Provider>
		</div>
	);
};

export default AlbumPage;

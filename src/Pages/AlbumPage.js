import { CanvasPageControler } from '../Components/CanvasPageControler';
import { PhotoPlaceholder } from '../Components/PhotoPlaceholder';
import { createContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PhotoCanvas from '../Components/PhotoCanvas';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const photoContext = createContext();
export const pageContext = createContext();

export const AlbumPage = () => {
	const [ allPages, setAllPages ] = useState([]);
	const [ page, setPage ] = useState([]);
	const [ dragImages, setDragImages ] = useState([]);
	const [ index, setIndex ] = useState(0);
	const [ isLoad, setisLoad ] = useState(false);
	const indexRef = useRef(0);
	const cordinantsRef = useRef({});

	// const canvas = useRef();

	const removePage = () => {
		if (allPages.length === 1) return;
		let newArr = allPages[indexRef.current];
		setDragImages((pierv) => [ ...pierv, ...newArr ]);

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
		}
		setisLoad(true);
		setPage(() => allPages[0]);
	};

	const refreshPage = () => {
		setPage([ ...allPages[indexRef.current] ]);
	};

	const fromPageToDrag = (photoId) => {
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
				let halfPhotoWidth = element.width / 2;
				let halfphotoHeight = element.height / 2;
				element.left = x - halfPhotoWidth;
				element.top = y - halfphotoHeight;
				allPages[index].push(element);
				setPage(() => [ ...allPages[index] ]);
			}
		});
		setDragImages(pageWithoutElement);
	};

	const changePhotoParametrs = (photoId, dictio) => {
		let row = 0;
		allPages[indexRef.current].map((element) => {
			if (element.id === photoId) {
				for (const [ key, value ] of Object.entries(dictio)) {
					allPages[indexRef.current][row][key] = value;
				}
				return true;
			}
			row++;
		});
	};

	function downLoadPhotos(albumId) {
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
			downLoadPhotos(parms.id);
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
			{!isLoad && (
				<div className="absolute-center">
					<AutorenewIcon className="spin" />
				</div>
			)}
			<pageContext.Provider value={{ page, allPages, index, nextPage, previousPage, removePage, newPage }}>
				<CanvasPageControler />
			</pageContext.Provider>
			<photoContext.Provider
				value={{
					isLoad,
					cordinantsRef,
					allPages,
					page,
					dragImages,
					refreshPage,
					changePhotoParametrs,
					fromDragToPage,
					fromPageToDrag
				}}
			>
				<PhotoCanvas />
				<PhotoPlaceholder />
			</photoContext.Provider>
		</div>
	);
};

export default AlbumPage;

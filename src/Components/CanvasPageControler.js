import { useContext, useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import AlbumPage, { pageContext } from '../Pages/AlbumPage';
import { Document, Packer, Paragraph, ImageRun, PageBreak } from 'docx';
import { saveAs } from 'file-saver';


export const CanvasPageControler = () => {
	const context = useContext(pageContext);
	const [ isLast, setIsLast ] = useState(false);
	const [ isFirst, setIsFirst ] = useState(false);
	const [ isOne, setIsOne ] = useState(false);

	const saveAlbum = () => {
		let aspectRatio = 796 / context.cordinantsRef.current.width;
		let paragraphArray = [];

		context.allPages.map((_, rowIndex) => {
			let columnIndex = 0;
			context.allPages[rowIndex].map((row) => {
				paragraphArray.push(pharagraphCreator(context.allPages[rowIndex][columnIndex], aspectRatio));

				columnIndex++;
			});

			//add new page if not last
			if (rowIndex !== context.allPages.length - 1) paragraphArray.push(pharagraphPageBreak());
		});

		const doc = new Document({
			sections: [
				{
					children: [ ...paragraphArray ]
				}
			]
		});

		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, 'Album Ślubny.docx');
		});
	};

	const pharagraphCreator = (photo, multiply) => {
		//convert pixels to enums
		let left = Math.floor(photo.top / 96 * multiply * 914400);
		let top = Math.floor(photo.left / 96 * multiply * 914400);
		let img = new Paragraph({
			children: [
				new ImageRun({
					data: photo.base64,
					transformation: {
						width: photo.width * multiply,
						height: photo.height * multiply,
						rotation: photo.angle
					},
					floating: {
						horizontalPosition: {
							offset: top
						},
						verticalPosition: {
							offset: left
						}
					}
				})
			]
		});

		return img;
	};

	useEffect(
		() => {
			if (context.allPages.length === 1) {
				setIsOne(true);
				setIsFirst(true);
				setIsLast(true);
			} else if (context.index === context.allPages.length - 1) {
				setIsLast(true);
				setIsFirst(false);
				setIsOne(false);
			} else if (context.index === 0) {
				setIsFirst(true);
				setIsLast(false);
				setIsOne(false);
			} else {
				setIsFirst(false);
				setIsLast(false);
				setIsOne(false);
			}
		},
		[ context.index, context.page ]
	);

	const pharagraphPageBreak = () => {
		return new Paragraph({
			children: [ new PageBreak() ]
		});
	};

	const styleBack = {
		backgroundColor: isFirst ? '#978E91' : '#000',
		fill: '#fff'
	};

	const styleNext = {
		backgroundColor: isLast ? '#978E91' : '#000',
		fill: '#fff'
	};

	return (
		<nav className="flex-space-between navbar">
			<div className="flex">
				<button className="btn-round" onClick={context.previousPage}>
					<ArrowBackIcon style={styleBack} />
				</button>
				<div>{`Strona ${context.index}`}</div>
				<button className="btn-round" onClick={context.nextPage}>
					<ArrowForwardIcon style={styleNext} />
				</button>
			</div>
			<div className="flex">
				<button onClick={context.newPage}>
					<AddIcon />
				</button>
				<button onClick={context.removePage} style={{ fill: isOne ? '#978E91 ' : '#000' }}>
					<DeleteIcon />
				</button>
				<button>
					<DownloadIcon onClick={saveAlbum} />
				</button>
			</div>
		</nav>
	);
};

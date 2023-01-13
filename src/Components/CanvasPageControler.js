import { useContext } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import AlbumPage, { pageContext } from '../Pages/AlbumPage';
import { Document, Packer, Paragraph, ImageRun, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const CanvasPageControler = () => {
	const saveAlbum = () => {
		let paragraphArray = [];

		context.allPages[0].map((_, columnIndex) => {
			let rowIndex = 0;
			context.allPages.map((row) => {
				if (!row[columnIndex]) return;

				paragraphArray.push(pharagraphCreator(context.allPages[rowIndex][columnIndex]));

				rowIndex++;
			});
		});

		let img = [ pharagraphCreator(context.allPages[0][0]) ];
		img.push(pharagraphCreator(context.allPages[0][1]));
		console.log(...paragraphArray);
		console.log('orginal', img);

		const doc = new Document({
			sections: [
				{
					children: [ ...paragraphArray ]
				}
			]
		});

		console.log(doc);

		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, 'Album Ślubny.docx');
		});
	};

	const pharagraphCreator = (photo) => {
		console.log(photo.top, photo.left);
		let img = new Paragraph({
			children: [
				new ImageRun({
					data: photo.base64,
					transformation: {
						width: photo.width,
						height: photo.height,
						roation: photo.angle
					},
					floating: {
						horizontalPosition: {
							offset: 100
						},
						verticalPosition: {
							offset: 200
						}
					}
				})
			]
		});

		return img;
	};

	// const createDocxImage = (heightPhoto, widthPhoto, offsetLeft, offsetTop) => {
	// 	let image = new ImageRun({
	// 		data: context.allPages[0][0].base64,
	// 		transformation: {
	// 			width: widthPhoto,
	// 			height: heightPhoto
	// 		},
	// 		floating: {
	// 			horizontalPosition: {
	// 				offset: offsetLeft
	// 			},
	// 			verticalPosition: {
	// 				offset: offsetTop
	// 			}
	// 		}
	// 	});
	// 	return image;
	// };

	const context = useContext(pageContext);
	return (
		<nav className="flex-space-between navbar">
			<div className="flex">
				<button className="btn-round" onClick={context.previousPage}>
					<ArrowBackIcon />
				</button>
				<div>Strona{context.index}</div>
				<button className="btn-round" onClick={context.nextPage}>
					<ArrowForwardIcon />
				</button>
			</div>
			<div className="flex">
				<button onClick={context.newPage}>
					<AddIcon />
				</button>
				<button onClick={context.removePage}>
					<DeleteIcon />
				</button>
				<button>
					<DownloadIcon onClick={saveAlbum} />
				</button>
			</div>
		</nav>
	);
};

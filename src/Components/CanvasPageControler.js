import { useContext } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { pageContext } from '../Pages/AlbumPage';
import { Document, Packer, Paragraph, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

export const CanvasPageControler = () => {
	const saveAlbum = () => {
		const image = createDocxImage(300, 300, 1014400, 1014400);
		const doc = new Document({
			sections: [
				{
					children: [
						new Paragraph({
							children: [ image ]
						})
					]
				}
			]
		});

		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, 'Album Ślubny.docx');
		});
	};

	const createDocxImage = (heightPhoto, widthPhoto, offsetLeft, offsetTop) => {
		let image = new ImageRun({
			data: context.allPages[0][0].base64,
			transformation: {
				width: widthPhoto,
				height: heightPhoto
			},
			floating: {
				horizontalPosition: {
					offset: offsetLeft
				},
				verticalPosition: {
					offset: offsetTop
				}
			}
		});
		return image;
	};

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

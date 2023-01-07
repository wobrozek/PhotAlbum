import { useContext } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { pageContext } from '../Pages/AlbumPage';

export const CanvasPageControler = () => {
	const context = useContext(pageContext);
	return (
		<div className="flex-space-between">
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
				<button onClick={context.addPage}>
					<AddIcon />
				</button>
				<button onClick={context.removePage}>
					<DeleteIcon />
				</button>
				<button>
					<DownloadIcon />
				</button>
			</div>
		</div>
	);
};

import { getCoverURL, getNullRandomCover } from '@utils/index';
import "@styles/components/cards/RectangleSongBox.scss";
import CheckboxComponent from '@components/input/CheckboxComponent';

type Props = {
    keyV: number;
    cover: string | null;
    songName: string;
    artist: string;
    length: string;
    year: number;
    isChecked: boolean;
    CheckToggle: () => void;
}

const RectangleSongBoxView = (props: Props) => {
    return (
        <div className="RectangleSongBox fill">
                <div className='index'>
                    <CheckboxComponent isChecked={props.isChecked} CheckToggle={props.CheckToggle} />
                </div>
                <div className="song_cover">
                    {  !props.cover ? <img src={getCoverURL(getNullRandomCover(props.keyV))} alt="song-cover" /> : <img src={getCoverURL(props.cover)} alt="song-cover" /> }
                </div>
                <div className="song_name">
                    <h3>{props.songName}</h3>
                    <p>{props.artist}</p>
                </div>
                <p className="length">{props.length}</p>
                <p className="year">{props.year === 0 ? "~" : props.year.toString()}</p>
        </div>
    )
}

export default RectangleSongBoxView
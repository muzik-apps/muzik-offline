import { FunctionComponent } from "react";
import "@styles/components/input/WaveForm.scss";

type WaveFormProps = {
    currentPosition: number;
    duration: number;
    points: { x1: number, y1: number, x2: number, y2: number }[];
    player: "BarWave" | "FloatingBarWave" | "RoundedWave" | "SineWave";
}

const WaveForm: FunctionComponent<WaveFormProps> = (props: WaveFormProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="WaveForm">
            {
                props.points.map((point, index) => {
                    return (
                        <line
                            xmlns="http://www.w3.org/2000/svg"
                            key={index}
                            x1={point.x1}
                            y1={point.y1}
                            x2={point.x2}
                            y2={point.y2}
                        />
                    )
                })
            }
        </svg>
    )
}

export default WaveForm
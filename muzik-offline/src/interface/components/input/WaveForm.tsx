import { FunctionComponent } from "react";
import "@styles/components/input/WaveForm.scss";
import { motion } from "framer-motion";
import { readFile, BaseDirectory } from '@tauri-apps/plugin-fs';

type WaveFormProps = {
    currentPosition: number;
    player: "BarWave" | "FloatingBarWave" | "RoundedWave" | "SineWave";
    seekTo: (position: number) => void;
    barPoints?: { x1: number, y1: number, x2: number, y2: number }[];
    sineWavePoints?: { x: number, y: number }[];
}

const WaveForm: FunctionComponent<WaveFormProps> = (props: WaveFormProps) => {
    return (
        <>
        { 
            (props.player === "BarWave" || props.player === "FloatingBarWave") && props.barPoints ?
                <svg xmlns="http://www.w3.org/2000/svg" className="WaveForm">
                    {
                        props.barPoints.map((point, index) => {
                            return (
                                <motion.line
                                    initial={{ scale: 1 }}
                                    animate={props.currentPosition === index ? { scale: 1.5 } : { scale: 1 }}
                                    exit={{ scale: 1 }}
                                    whileHover={{ scale: 1.5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => props.seekTo(index)}
                                    className={(props.currentPosition >= index ? "line_active " : "")
                                        + (props.currentPosition === index ? " line_current " : "")
                                    }
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
            : null
        }
        </>
    )
}

export default WaveForm
import { FunctionComponent, useEffect, useState } from "react";
import "@styles/components/input/WaveForm.scss";
import { motion } from "framer-motion";
import { readFile } from '@tauri-apps/plugin-fs';
import { usePlayerStore } from "@store/index";
import WaveformData, { WaveformDataChannel } from 'waveform-data';

type WaveFormProps = {
    currentPosition: number;
    PlaybackFeedback: "BarWave" | "FloatingBarWave" | "RoundedWave" | "SineWave";
    seekTo: (position: number) => void;
}

const WaveForm: FunctionComponent<WaveFormProps> = (props: WaveFormProps) => {
    const { Player } = usePlayerStore((state) => { return { Player: state.Player }; });
    const [waveformChannel, setWaveformChannel] = useState<WaveformDataChannel | null>(null);
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const [waveformLength, setWaveformLength] = useState<number>(0);
    const [amountOfXPoints, setAmountOXPoints] = useState<number>(0);
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

    async function decodeWaveForm(WaveFormPath: string){
        const file_data = await readFile(WaveFormPath);
        const waveformData = WaveformData.create(file_data.buffer);
        setWaveformChannel(waveformData.channel(0));
        setWaveformLength(waveformData.duration);
    }

    function scaleTop(value: number, height: number): number {
        return (Math.abs(value) / 128) * (height / 2) + 2;
    }

    function scaleBottom(value: number, height: number): number {
        return ((Math.abs(value) / 128) * (height / 2)) + (height / 2);
    }

    function calculateTop(max: number, min: number, height: number): number {
        const top = scaleTop(max, height);
        const bottom = scaleBottom(min, height);
        const diff = bottom - top;
        return height - 2 - diff;
    }

    function calculateIndex(index: number, width: number): number {
        return index * (width / amountOfXPoints);
    }

    function setHoveredIndexValue(e: React.MouseEvent<SVGSVGElement, MouseEvent>){
        const indexEst = e.nativeEvent.offsetX / 5.0;

        if(indexEst < amountOfXPoints){
            setHoveredIndex(Math.round(indexEst));
        } else {
            setHoveredIndex(-1);
        }
    }

    function seekTo(){
        if(hoveredIndex !== -1){
            props.seekTo((hoveredIndex / amountOfXPoints) * 100);
        }
    }

    const getScale = (index: number) => {
        if (hoveredIndex !== -1 && index === hoveredIndex) return 1.5;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 1 || index === hoveredIndex + 1)) return 1.5;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 2 || index === hoveredIndex + 2)) return 1.45;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 3 || index === hoveredIndex + 3)) return 1.4;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 4 || index === hoveredIndex + 4)) return 1.35;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 5 || index === hoveredIndex + 5)) return 1.3;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 6 || index === hoveredIndex + 6)) return 1.25;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 7 || index === hoveredIndex + 7)) return 1.2;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 8 || index === hoveredIndex + 8)) return 1.15;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 9 || index === hoveredIndex + 9)) return 1.1;
        if (hoveredIndex !== -1 && (index === hoveredIndex - 10 || index === hoveredIndex + 10)) return 1.05;
        return 1;
    };

    useEffect(() => { 
        setAmountOXPoints((window.innerWidth / 4.0) / 5.0);

        window.addEventListener("resize", () => {
            setAmountOXPoints((window.innerWidth / 4.0) / 5.0); }); 
    }, []);

    useEffect(() => {
        if(Player.WaveFormPath)decodeWaveForm(Player.WaveFormPath); 
    }, [Player.WaveFormPath]);

    useEffect(() => {
        setCurrentPosition((props.currentPosition / 100) * amountOfXPoints);
    }, [props.currentPosition]);

    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" className="WaveForm" 
                onMouseMove={setHoveredIndexValue}
                onMouseLeave={() => setHoveredIndex(-1)}
                onMouseUp={seekTo}
                >
                    {
                        props.PlaybackFeedback === "FloatingBarWave" && waveformChannel && Array.from({ length: amountOfXPoints }, (_, i) => i).map((index) => {
                            return (
                                <motion.line
                                    animate={{ scale: getScale(index) }}
                                    className={(currentPosition >= index ? "line_active " : "")
                                        + (currentPosition === index ? " line_current " : "")
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    key={index}
                                    x1={index * 5}
                                    y1={scaleTop(waveformChannel.max_sample(calculateIndex(index, waveformLength)), 28)}
                                    x2={index * 5}
                                    y2={scaleBottom(waveformChannel.min_sample(calculateIndex(index, waveformLength)), 30)}
                                />
                            )
                        })
                    }
                    {
                        props.PlaybackFeedback === "BarWave" && waveformChannel && Array.from({ length: amountOfXPoints }, (_, i) => i).map((index) => {
                            return (
                                <motion.line
                                    animate={{ scale: getScale(index) }}
                                    className={(currentPosition >= index ? "line_active " : "")
                                        + (currentPosition === index ? " line_current " : "")
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    key={index}
                                    x1={index * 5}
                                    y1={calculateTop(
                                            waveformChannel.max_sample(calculateIndex(index, waveformLength)), 
                                            waveformChannel.min_sample(calculateIndex(index, waveformLength)), 
                                            28)}
                                    x2={index * 5}
                                    y2={28}
                                />
                            )
                        })
                    }
                    {
                        !waveformChannel && Array.from({ length: amountOfXPoints }, (_, i) => i).map((index) => {
                            return (
                                <motion.line
                                    xmlns="http://www.w3.org/2000/svg"
                                    key={index}
                                    x1={index * 5}
                                    y1={14.5}
                                    x2={index * 5}
                                    y2={15.5}
                                />
                            )
                        })
                    }
                </svg>
        </>
    )
}

export default WaveForm
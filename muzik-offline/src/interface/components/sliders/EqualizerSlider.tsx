import { FunctionComponent, useState, useEffect } from "react";
import "@styles/components/sliders/EqualizerSlider.scss";


type EqualizerSliderProps = {
    frequency: string;
    value: number;
    updateValue: (value: number) => void;
}

const EqualizerSlider: FunctionComponent<EqualizerSliderProps> = (props: EqualizerSliderProps) => {
    const [current_val, setValue] = useState<number>(props.value);

    useEffect(() => {setValue(props.value)}, [props.value])

    return (
        <div className="EqualizerSlider">
            <div className="input-container">
                <input type="range" id="equalizer-slider" max="100"
                    aria-orientation="vertical"
                    step={25} 
                    value={current_val}  
                    onChange={(e) => setValue(Number.parseInt(e.target.value))} 
                    onMouseUp={() => props.updateValue(current_val)}
                    style={{backgroundSize: current_val.toString() + "% 100%"}}/>
            </div>
            <h4>{props.frequency}</h4>
        </div>
    )
}

export default EqualizerSlider
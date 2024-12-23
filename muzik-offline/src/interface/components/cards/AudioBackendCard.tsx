import { capitalizeFirstLetter } from "@utils/index";
import { motion } from "framer-motion";
import "@styles/components/cards/AudioBackendCard.scss";

type AudioBackendCardProps = {
    isAvailable: boolean;
    selected: string;
    backendName: "rodio" | "kira";
    image: string;
    benefits: string[];
    downsides: string[];
    changeAudioBackend: (backend: "rodio" | "kira") => void;
}

const AudioBackendCard = (props: AudioBackendCardProps) => {
    return (
        <div className="audio-backend-card">
            { props.isAvailable ?
                    <motion.div className={"audio-backend audio-backend-hover" + (props.selected === props.backendName ? " selected" : "")}
                        whileTap={{scale: 0.98}} onClick={() => props.changeAudioBackend(props.backendName)}>
                        <div className="logo">
                            <img src={props.image} alt={`${capitalizeFirstLetter(props.backendName)} logo`} />
                        </div>
                        <h3>{capitalizeFirstLetter(props.backendName)}</h3>
                        <div className="details">
                            <div className="benefits">
                                <ul>
                                    {props.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="downsides">
                                <dl>
                                    {props.downsides.map((downside, index) => (
                                        <dd key={index}>- {downside}</dd>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </motion.div>
                : 
                <div className="audio-backend greyed_out">
                    <div className="logo">
                        <img src={props.image} alt={`${capitalizeFirstLetter(props.backendName)} logo`} />
                    </div>
                    <h3>{capitalizeFirstLetter(props.backendName)}</h3>
                    <div className="details">
                        <div className="benefits">
                            <ul>
                                {props.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="downsides">
                            <dl>
                                {props.downsides.map((downside, index) => (
                                    <dd key={index}>- {downside}</dd>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div> 
                }
        </div>
    )
}

export default AudioBackendCard
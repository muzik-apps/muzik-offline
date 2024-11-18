import { modal_variants } from "@content/index";
import { motion } from "framer-motion";
import { FunctionComponent, useRef, useState } from "react";
import "@styles/components/modals/AirplayPinModal.scss";

type AirplayPinModalProps = {
    isOpen: boolean;
    title: string;
    Icon: () => JSX.Element;
    onAirPlayPin: (pin: string) => void
}

const AirplayPinModal: FunctionComponent<AirplayPinModalProps> = (props: AirplayPinModalProps) => {
    const [pin, setPin] =  useState<string[]>(new Array(4).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
    
        if (/^[0-9]$/.test(value) || value === "") {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Focus the next input
            if (value !== "" && index < 3) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "Backspace" && pin[index] === "") {
            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };
    
    return (
        <div className={"AirplayPinModal" + (props.isOpen ? " AirplayPinModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget){
                setPin(new Array(4).fill(""));
                props.onAirPlayPin("");
            }}}>
            <motion.div 
                animate={props.isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="confirm_pin_modal">
                        <div className="covers">
                            <div className="first_cover "/>
                            <div className="second_cover"><props.Icon /></div>
                        </div>
                        <h3>Enter the pin on the screen for {props.title}</h3>
                        <div className="pin-inputs">
                            {pin.map((_, index) => 
                                <input 
                                    key={index} 
                                    ref={el => inputsRef.current[index] = el} 
                                    type="text" 
                                    maxLength={1} 
                                    value={pin[index]} 
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />)
                            }
                        </div>
                        <motion.div whileTap={{scale: 0.95}} className="connect_button" onClick={() => props.onAirPlayPin(pin.join(""))}>
                            <h4>connect</h4>
                        </motion.div>
            </motion.div>
        </div>
    )
}

export default AirplayPinModal
import { motion } from "framer-motion";
import "@styles/components/buttons/LoginButton.scss";

type LoginButtonProps = {
    logo: () => JSX.Element;
    text: string;
    disabled: boolean;
    promptLogin: () => void;
}

const LoginButton = (props: LoginButtonProps) => {
    return (
        <div>
            {
                props.disabled ? (
                    <div className="LoginButtonH">
                        <props.logo />
                        <h3>{props.text}</h3>
                    </div>
                )
                : (
                    <motion.div className="LoginButtonV" whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={props.promptLogin}>
                        <props.logo />
                        <h3>{props.text}</h3>
                    </motion.div>
                )
            }
        </div>
    )
}

export default LoginButton
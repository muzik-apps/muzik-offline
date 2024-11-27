import { Check } from '@assets/icons';
import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import "@styles/components/input/CheckboxComponent.scss";

type CheckboxComponentProps = {
    isChecked: boolean;
    CheckToggle: () => void;
}

const CheckboxComponent: FunctionComponent<CheckboxComponentProps> = (props: CheckboxComponentProps) => {
    return (
        <motion.div className={props.isChecked ? "checked" : "not-checked"} whileTap={{scale: 0.90}} onClick={props.CheckToggle}>
            {props.isChecked && <Check />}
        </motion.div>
    )
}

export default CheckboxComponent
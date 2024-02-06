import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import "@styles/components/toasts/NotifyBottomRight.scss";
import { toast } from 'types';
import { CheckGreen, Cross, CrossRed, InformationCircleContained, InformationCircleContainedBlue, AlertTriangle } from '@assets/icons';
import { useToastStore } from 'store';

const variants={
    open: {right: "16px"},
    closed: {right: "-300px"},
}

const NotifyBottomRight = () => {

    const { toastObject, unsetToast } = useToastStore((state) => { return { toastObject: state.toastObject, unsetToast: state.unsetToast }; });
    const [toast_d, set_toast_d] = useState<toast | null>(null);

    function getMatchingIcon(): () => JSX.Element{
        if(toast_d === null)return InformationCircleContained;
        else if(toast_d.type === "error")return CrossRed;
        else if(toast_d.type === "info")return InformationCircleContainedBlue;
        else if(toast_d.type === "success")return CheckGreen;
        else if(toast_d.type === "warning")return AlertTriangle;
        else return InformationCircleContained;
    }

    useEffect(() => {  
        const runTimer = () => {
            if(toastObject === null)return;
            set_toast_d(toastObject);
            const timer = setTimeout(unsetToast, toastObject.timeout);
            return () => clearTimeout(timer);
        }

        runTimer();
    }, [toastObject]);

    return (
        <motion.div className="NotifyBottomRight"
                animate={toastObject ? "open" : "closed"}
                variants={variants}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
            <div className="covers">
                <div className={"first_cover " + (toast_d && toast_d.type)}/>
                <div className="second_cover">
                    {(getMatchingIcon())()}
                </div>
            </div>
            <div className="title_and_message">
                <h2>{toast_d && toast_d.title}</h2>
                <h3>{toast_d && toast_d.message}</h3>
            </div>
            <motion.div className="close_button" whileTap={{scale: 0.98}} onClick={unsetToast}>
                <Cross/>
            </motion.div>
        </motion.div>
    )
}

export default NotifyBottomRight
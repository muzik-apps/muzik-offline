//import { BarsAnimated } from '@assets/icons';
import { motion } from 'framer-motion';
import "@styles/components/loader/LoaderAnimated.scss";
import { AppLogo } from '@assets/logos';

const LoaderAnimated = () => {
    return (
        <div className="LoaderAnimated">
            <div className='animation-container'>
                <motion.div 
                    className='svg-container'
                    initial={{ scale: 1}}
                    animate={{ scale: 1.3 }} 
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}>
                        <AppLogo/>
                </motion.div>
            </div>
            <h2>Loading...</h2>
        </div>
    )
}

export default LoaderAnimated
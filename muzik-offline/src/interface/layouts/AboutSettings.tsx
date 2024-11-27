import { App_logo } from "@logos/index";
import "@styles/layouts/AboutSettings.scss";
import { open } from '@tauri-apps/plugin-shell';
import { motion } from "framer-motion";

const AboutSettings = () => {
    return (
        <div className="AboutSettings">
            <h2>About Settings</h2>
            <div className="logo">
                <App_logo />
            </div>
            <h3>Copyright 2024 muzik-apps. All rights reserved.</h3>
            <h3>Version "0.7.0"</h3>
            <h3>
                <motion.span whileTap={{scale: 0.98}} onClick={() => open("https://github.com/muzik-apps/muzik-offline")}>
                    muzik-offline
                </motion.span>
                is made possible thanks to:
            </h3>
            <ul>
                <li>
                    <motion.span whileTap={{scale: 0.98}} onClick={() => open("https://tauri.app/")}>
                        Tauri
                    </motion.span>
                </li>
                <li>Chrome, Edge, Safari and WebkitGTK-4.0</li>
            </ul>
            <h3>For a full list of packages used by this application, visit 
                <motion.span whileTap={{scale: 0.98}} onClick={() => open("https://github.com/muzik-apps/muzik-offline#node-modules-used")}>
                    this
                </motion.span>
            </h3>
            <h3>
                Please support and star the repo on 
                <motion.span whileTap={{scale: 0.98}} onClick={() => open("https://github.com/muzik-apps/muzik-offline")}>
                    github
                </motion.span>
                if you like this application and check out our other
                <motion.span whileTap={{scale: 0.98}}  onClick={() => open("https://github.com/orgs/muzik-apps/repositories")}>
                    applications
                </motion.span>
            </h3>
        </div>
    )
}

export default AboutSettings
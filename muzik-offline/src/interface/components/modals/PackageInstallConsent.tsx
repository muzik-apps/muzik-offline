import { InformationCircleContainedBlue, Spinner } from "@assets/icons";
import { modal_variants } from "@content/index";
import { usePackagesStore, useToastStore } from "@store/index";
import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import "@styles/components/modals/PackageInstallConsent.scss";
import { invoke } from "@tauri-apps/api/core";
import { toastType } from "@muziktypes/index";

type PackageInstallConsentProps = {
    package_name: string;
    isOpen: boolean;
    closeModal: () => void;
}

const PackageInstallConsent: FunctionComponent<PackageInstallConsentProps> = (props: PackageInstallConsentProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const { setPackages } = usePackagesStore((state) => { return { setPackages: state.setPackages }; });

    function installPackage(){
        setLoading(true);
        invoke<string>("install_package", {name: props.package_name}).then((res) => {
            const packages: {
                name: string,
                description: string,
                installed: boolean,
                version: string
            }[] = JSON.parse(res);
            setPackages(packages);
            setToast({title: `${props.package_name} installed`, message: "You can now use this package", type: toastType.success, timeout: 3000});
            setLoading(false);
            localStorage.removeItem("audio_waveform_install_consent");
            props.closeModal();
        }).catch((err) => {
            setToast({title: "Failed to install package", message: err, type: toastType.error, timeout: 3000});
            setLoading(false);
        });
    }

    return (
        <div className={"PackageInstallConsent" + (props.isOpen ? " PackageInstallConsent-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget && !loading)props.closeModal()}}>
            <motion.div 
                animate={props.isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="confirm_install_modal">
                        <div className="covers">
                            <div className="first_cover "/>
                            <div className="second_cover">
                                <InformationCircleContainedBlue />
                            </div>
                        </div>
                        <h3>Are you sure you want to install {props.package_name} ?</h3>
                        { !loading ?
                            <motion.div whileTap={{scale: 0.95}} className="install_button" onClick={installPackage}>
                                <h4>yes, install it!</h4>
                            </motion.div>
                            :
                            <div className="loading_install_button">
                                <h4>yes, install it!</h4>
                                <Spinner />
                            </div>
                        }
                        { !loading ?
                            <motion.div whileTap={{scale: 0.95}} className="cancel_button" onClick={props.closeModal}>
                                <h4>no, I don't want it</h4>
                            </motion.div>
                            :
                            <div className="loading_cancel_button">
                                <h4>no, I don't want it</h4>
                            </div>  
                        }
            </motion.div>
        </div>
    )
}

export default PackageInstallConsent
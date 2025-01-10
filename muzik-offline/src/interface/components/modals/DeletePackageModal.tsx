import { AlertTriangle, Spinner } from "@assets/icons";
import { modal_variants } from "@content/index";
import { toastType } from "@muziktypes/index";
import { useToastStore, usePackagesStore, useSavedObjectStore } from "@store/index";
import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import "@styles/components/modals/DeletePackageModal.scss";

type DeletePackageModalProps = {
    package_name: string;
    isOpen: boolean;
    closeModal: () => void;
}

const DeletePackageModal: FunctionComponent<DeletePackageModalProps> = (props: DeletePackageModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const { setPackages } = usePackagesStore((state) => { return { setPackages: state.setPackages }; });
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });

    function uninstallPackage(){
        setLoading(true);
        invoke<string>("uninstall_package", {name: props.package_name}).then((res) => {
            const packages: {
                name: string,
                description: string,
                installed: boolean,
                version: string
            }[] = JSON.parse(res);
            setPackages(packages);
            setToast({title: `${props.package_name} uninstalled`, message: "Package was uninstalled successfully", type: toastType.success, timeout: 3000});
            setLoading(false);
            if(props.package_name === "audiowaveform"){
                const temp = local_store;
                temp.PlaybackFeedback = "LineBar";
                setStore(temp);
            }
            props.closeModal();
        }).catch((err) => {
            setToast({title: "Failed to uninstall package", message: err, type: toastType.error, timeout: 3000});
            setLoading(false);
        });
    }

    return (
        <div className={"DeletePackageModal" + (props.isOpen ? " DeletePackageModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget && !loading)props.closeModal()}}>
            <motion.div 
                animate={props.isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="confirm_uninstall_modal">
                        <div className="covers">
                            <div className="first_cover "/>
                            <div className="second_cover">
                                <AlertTriangle />
                            </div>
                        </div>
                        <h3>Are you sure you want to uninstall {props.package_name} ?</h3>
                        { !loading ?
                            <motion.div whileTap={{scale: 0.95}} className="uninstall_button" onClick={uninstallPackage}>
                                <h4>uninstall</h4>
                            </motion.div>
                            :
                            <div className="loading_uninstall_button">
                                <h4>uninstall</h4>
                                <Spinner />
                            </div>
                        }
                        { !loading ?
                            <motion.div whileTap={{scale: 0.95}} className="cancel_button" onClick={props.closeModal}>
                                <h4>cancel</h4>
                            </motion.div>
                            :
                            <div className="loading_cancel_button">
                                <h4>cancel</h4>
                            </div>  
                        }
            </motion.div>
        </div>
    )
}

export default DeletePackageModal
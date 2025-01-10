import { PackageAdd, PackageRemove } from "@assets/icons";
import { usePackagesStore } from "@store/index";
import { motion } from "framer-motion";
import { FunctionComponent, useEffect, useState } from "react";
import "@styles/layouts/PackagesSettings.scss";
import { invoke } from "@tauri-apps/api/core";

type PackagesSettingsProps = {
  openModal: (type: "install" | "uninstall", package_name: string) => void
}

const PackagesSettings: FunctionComponent<PackagesSettingsProps> = (props: PackagesSettingsProps) => {
  const [search, setSearch] = useState<string>("");
  const { packages, setPackages } = usePackagesStore((state) => { return { packages: state.packages, setPackages: state.setPackages }; });
  const [filteredPackages, setFilteredPackages] = useState<{
    name: string,
    description: string,
    installed: boolean,
    version: string
  }[]>([]);

  function captureSearch(e: React.ChangeEvent<HTMLInputElement>){
      setSearch(e.target.value);
      // filter by name or description
      setFilteredPackages(packages.filter((value) => value.name.toLowerCase().includes(e.target.value.toLowerCase()) || value.description.toLowerCase().includes(e.target.value.toLowerCase())));
  }

  useEffect(() => {
    if(search === "")setFilteredPackages(packages);
  }, [packages]);

  useEffect(() => {
    invoke<string>("get_packages").then((res) => {
      const packages: {
        name: string,
        description: string,
        installed: boolean,
        version: string
      }[] = JSON.parse(res);
      setFilteredPackages(packages);
      setPackages(packages);
    });
  }, []);

  return (
    <div className="PackagesSettings">
      <h2>Packages Settings</h2>
      <input type="text" placeholder="Search for a song" value={search} onChange={captureSearch}/>
      <div className="packages">
        {
          filteredPackages.map((value, index) => (
            <motion.div key={index} className="package">
              <h3>{value.name}</h3>
              <p>{value.description}</p>
              <motion.div className="icon" whileTap={{scale: 0.98}} onClick={() => {
                props.openModal(value.installed ? "uninstall" : "install", value.name);
              }}>
                {
                  value.installed ? <PackageRemove /> : <PackageAdd />
                }
              </motion.div>
            </motion.div>
          ))
        }
        {
          filteredPackages.length === 0 && <h4>No packages found</h4>
        }
      </div>
    </div>
  )
}

export default PackagesSettings
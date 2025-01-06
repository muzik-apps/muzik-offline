#[cfg(target_os = "linux")]
pub const UBUNTU_INSTALL_COMMANDS: &'static [&'static [&'static str]] = &[
    // sudo add-apt-repository ppa:chris-needham/ppa
    &["sudo", "add-apt-repository", "ppa:chris-needham/ppa"],
    // sudo apt-get update
    &["sudo", "apt-get", "update"],
    // sudo apt-get install audiowaveform
    &["sudo", "apt-get", "install", "audiowaveform"]
];
#[cfg(target_os = "linux")]
pub const DEBIAN_INSTALL_COMMANDS: &'static [&'static [&'static str]] = &[
    // sudo apt-get update
    &["sudo", "apt-get", "update"],
    // sudo dpkg -i audiowaveform-1.8.1-1-12.amd64.deb
    &["sudo", "dpkg", "-i", "audiowaveform-1.8.1-1-12.amd64.deb"],
    // sudo apt-get -f install -y
    &["sudo", "apt-get", "-f", "install", "-y"]
];
#[cfg(target_os = "linux")]
pub const RPM_INSTALL_COMMANDS: &'static [&'static [&'static str]] = &[
    // sudo yum install -y epel-release
    &["sudo", "yum", "install", "-y", "epel-release"],
    // sudo yum localinstall audiowaveform-1.8.1-1.el8.x86_64.rpm
    &["sudo", "yum", "localinstall", "audiowaveform-1.8.1-1.el8.x86_64.rpm"]
];

#[cfg(target_os = "macos")]
pub const MACOS_INSTALL_COMMANDS: &'static [&'static [&'static str]] = &[
    // brew tap bbc/audiowaveform
    &["brew", "tap", "bbc/audiowaveform"],
    // brew install audiowaveform
    &["brew", "install", "audiowaveform"]
];
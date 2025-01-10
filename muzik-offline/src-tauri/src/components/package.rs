use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Package{
    pub name: String,
    pub description: String,
    pub version: Option<String>,
    pub installed: bool,
}
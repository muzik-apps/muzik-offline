use image::imageops::FilterType;
use std::{path::Path, io::Cursor};
use rayon::prelude::*;
use base64::{Engine as _, engine::general_purpose};

pub fn duration_to_string(duration: &u64) -> String {
    let seconds = duration;
    let minutes = seconds / 60;
    let seconds = seconds % 60;
    let hours = minutes / 60;
    let minutes = minutes % 60;

    if hours > 0 {
        format!("{}:{:02}:{:02}", hours, minutes, seconds)
    } else {
        format!("{}:{:02}", minutes, seconds)
    }
}

pub fn extract_file_name(file_path: &str) -> String {
    let path = Path::new(file_path);

    match path.file_stem(){
        Some(file_name) => {
            file_name.to_string_lossy().to_string()
        },
        None => {
            String::from("Unknown file name")
        },
    }
}

pub fn resize_and_compress_image(original_data: &Vec<u8>, target_height: &u32) -> Option<Vec<u8>> {
    // Decode the original image
    match image::load_from_memory(&original_data){
        Ok(original_image) => {
            // Calculate the corresponding width to maintain aspect ratio
            let aspect_ratio = original_image.width() as f32 / original_image.height() as f32;
            let target_width = (*target_height as f32 * aspect_ratio) as u32;

            // Resize the image to a specific size (e.g., 250x250 pixels)
            let resized_image = original_image.resize_exact(target_width, *target_height, FilterType::Triangle);

            // Create a buffer to store the compressed image
            let mut compressed_buffer = Cursor::new(Vec::new());

            // Encode the resized image as JPEG with a certain quality
            match resized_image.write_to(&mut compressed_buffer, image::ImageOutputFormat::Jpeg(80)){
                Ok(_) => {
                    // Return the compressed image data
                    Some(compressed_buffer.into_inner())
                },
                Err(_) => {
                    None
                },
            }
        },
        Err(_) => {
            None
        },
    }
}

pub fn encode_image_in_parallel(image_as_vec: &Vec<u8>) -> String{
    let base64str = image_as_vec.par_iter()
                    .chunks(50) // Adjust the chunk size according to your needs
                    .flat_map(|chunk| {
                        chunk.into_iter().map(|&x| x).collect::<Vec<_>>()
                    })
                    .collect::<Vec<_>>()
                    .par_chunks(50)
                    .map(|chunk| 
                        general_purpose::STANDARD.encode(chunk)
                    )
                    .collect::<Vec<_>>()
                    .concat();
    return base64str;
}

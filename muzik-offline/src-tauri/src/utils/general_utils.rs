use image::imageops::FilterType;
use std::{path::Path, io::Cursor};
use rayon::prelude::*;
use base64::{Engine as _, engine::general_purpose};
use uuid::Uuid;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

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
    let base64str = image_as_vec
        .par_chunks(51) // Chunk size must always be a multiple of 3 otherwise it will not work
        .map(|chunk| general_purpose::STANDARD.encode(chunk))
        .collect::<Vec<_>>()
        .concat();
    return base64str;
    /*
    FURTHER EXPLANATION FOR CHUNK SIZES:
    This could potentially cause issues because the base64 encoding process involves 
    converting 3 bytes(each u8 in the image_as_vec is a byte) of input data into 4 bytes of output data. If a chunk doesn’t 
    contain a multiple of 3 bytes, the base64 encoding for that chunk will be padded 
    with one or two “=” characters. When you concatenate the encoded chunks, these 
    padding characters could end up in the middle of the final base64 string, 
    which would make it invalid.

    additionally seeing “=” characters scattered in the middle of a Base64 string is not a good sign.
    In Base64 encoding, “=” is used as a padding character and should only appear at the end of the encoded string. 
    If you’re seeing “=” characters in the middle of your Base64 string, 
    it suggests that something has gone wrong with the encoding process.
     */
}

pub fn decode_image_in_parallel(image_as_string: &String) -> Result<Vec<u8>, String>{
    let base64str = image_as_string.as_bytes();
    let decoded_image = base64str
        .par_chunks(68) // Chunk size must always be a multiple of 4 otherwise it will not work
        .map(|chunk| general_purpose::STANDARD.decode(chunk))
        .collect::<Vec<_>>();

    let mut returnable = Vec::new();
    for chunk in decoded_image.iter(){
        match chunk{
            Ok(chunk) => {
                returnable.extend(chunk);
            },
            Err(e) => {
                return Err(e.to_string());
            }
        }
    }

    return Ok(returnable);
    /*
    FURTHER EXPLANATION FOR CHUNK SIZES:
    This could potentially cause issues because the base64 encoding process involves 
    converting 3 bytes(each u8 in the image_as_vec is a byte) of input data into 4 bytes of output data. If a chunk doesn’t 
    contain a multiple of 3 bytes, the base64 encoding for that chunk will be padded 
    with one or two “=” characters. When you concatenate the encoded chunks, these 
    padding characters could end up in the middle of the final base64 string, 
    which would make it invalid.

    additionally seeing “=” characters scattered in the middle of a Base64 string is not a good sign.
    In Base64 encoding, “=” is used as a padding character and should only appear at the end of the encoded string. 
    If you’re seeing “=” characters in the middle of your Base64 string, 
    it suggests that something has gone wrong with the encoding process.
     */
}

pub fn string_to_uuid(input: &str) -> String {
    let mut hasher = DefaultHasher::new();
    input.hash(&mut hasher);

    let hash_result = hasher.finish();
    let uuid_from_string = Uuid::from_u128(hash_result.into());
    uuid_from_string.to_string()
}
use base64::{engine::general_purpose, Engine as _};
use image::imageops::FilterType;
use rayon::prelude::*;
use std::net::TcpListener;
use std::{io::Cursor, path::Path};

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

    match path.file_stem() {
        Some(file_name) => file_name.to_string_lossy().to_string(),
        None => String::from("Unknown file name"),
    }
}

pub fn resize_and_compress_image(original_data: &Vec<u8>, target_height: &u32) -> Option<Vec<u8>> {
    // Decode the original image
    match image::load_from_memory(&original_data) {
        Ok(original_image) => {
            // Calculate the corresponding width to maintain aspect ratio
            let aspect_ratio = original_image.width() as f32 / original_image.height() as f32;
            let target_width = (*target_height as f32 * aspect_ratio) as u32;

            // Resize the image to a specific size (e.g., 250x250 pixels)
            let resized_image =
                original_image.resize_exact(target_width, *target_height, FilterType::Triangle);

            // Create a buffer to store the compressed image
            let mut compressed_buffer = Cursor::new(Vec::new());

            // Encode the resized image as JPEG with a certain quality
            match resized_image.write_to(&mut compressed_buffer, image::ImageOutputFormat::Jpeg(80))
            {
                Ok(_) => {
                    // Return the compressed image data
                    Some(compressed_buffer.into_inner())
                }
                Err(_) => None,
            }
        }
        Err(_) => None,
    }
}

pub fn encode_image_in_parallel(image_as_vec: &Vec<u8>) -> String {
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

pub fn decode_image_in_parallel(image_as_string: &String) -> Result<Vec<u8>, String> {
    let base64str = image_as_string.as_bytes();
    let decoded_image = base64str
        .par_chunks(68) // Chunk size must always be a multiple of 4 otherwise it will not work
        .map(|chunk| general_purpose::STANDARD.decode(chunk))
        .collect::<Vec<_>>();

    let mut returnable = Vec::new();
    for chunk in decoded_image.iter() {
        match chunk {
            Ok(chunk) => {
                returnable.extend(chunk);
            }
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

pub fn is_media_file(path_as_str: &str) -> Result<bool, Box<dyn std::error::Error>> {
    let path = Path::new(path_as_str);
    if let Some(ext) = path.extension() {
        let ext = ext.to_str().unwrap_or("").to_lowercase();

        let media_extensions = [
            // Audio formats
            "mp3", "wav", "flac",
            "ogg",
            // for future use
            //"wma", "alac", "aiff", "pcm", "aac", "m4a",
        ];

        if media_extensions.contains(&ext.as_str()) {
            match id3::Tag::read_from_path(path) {
                Ok(_) => return Ok(true),
                Err(id3::Error {
                    kind: id3::ErrorKind::NoTag,
                    ..
                }) => {
                    return check_with_lofty(path);
                }
                Err(_) => return Ok(false),
            }
        }
    }

    Ok(false)
}

pub fn check_with_lofty(path: &Path) -> Result<bool, Box<dyn std::error::Error>> {
    if let Ok(probe) = lofty::Probe::open(path) {
        if let Ok(_) = probe.read() {
            return Ok(true);
        }
    }

    Ok(false)
}

pub fn get_random_port() -> u16 {
    match TcpListener::bind("127.0.0.1:0") {
        Ok(listener) => match listener.local_addr() {
            Ok(addr) => addr.port(),
            Err(_) => 30340,
        },
        Err(_) => 30340,
    }
}

pub fn get_cover_url_for_discord(
    _name: String,
    _artist: String,
    has_cover: bool,
    id: i32,
) -> String {
    if !has_cover {
        match id {
            id if id % 4 == 0 => {
                return format!("nullcoverone");
            }
            id if id % 4 == 1 => {
                return format!("nullcovertwo");
            }
            id if id % 4 == 2 => {
                return format!("nullcoverthree");
            }
            id if id % 4 == 3 => {
                return format!("nullcoverfour");
            }
            i32::MIN..=i32::MAX => {
                return format!("nullcovernull");
            }
        }
    } else {
        return format!("nullcovernull");
        // use musicbrainz api to get a close enough matching url for the cover using the name and artist
        // future impl
    }
}

pub fn convert_single_to_double_backward_slash_on_path(path: &String) -> String {
    #[cfg(target_os = "windows")]
    return path.replace("\\", "\\\\");

    #[cfg(not(target_os = "windows"))]
    return path.to_string();
}
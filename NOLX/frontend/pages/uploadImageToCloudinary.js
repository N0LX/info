// export const uploadImageToCloudinary = async (imageUri) => {
//   const data = new FormData();
//   data.append("file", {
//       uri: imageUri,
//       type: "image/jpeg", // Change type based on file format
//       name: "upload.jpg"
//   });
//   data.append("upload_preset", "ml_default"); 
//   data.append("cloud_name", "dpnvyr8p9");

//   try {
//       let response = await fetch("https://api.cloudinary.com/v1_1/dpnvyr8p9/image/upload", {
//           method: "POST",
//           body: data
//       });
//       let result = await response.json();
//       return result.secure_url; // Returns Cloudinary image URL
//   } catch (error) {
//       throw new Error("Image upload failed: " + error.message);
//   }
// };

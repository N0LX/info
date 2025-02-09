import axios from 'axios';

// Cloudinary Configuration
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dpnvyr8p9/image/upload';

// Function to upload an image to Cloudinary
export const uploadImageToCloudinary = async (uri) => {
  const formData = new FormData();
  const file = {
    uri: uri,
    type: 'image/jpeg', // You can adjust this for other file types
    name: 'image.jpg',  // Adjust the name as needed
  };

  formData.append('file', file);

  try {
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

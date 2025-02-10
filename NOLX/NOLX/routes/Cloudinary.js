const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpnvyr8p9',
  api_key: '881766593728861',
  api_secret: '2-bgUa7rC357be0EFlUBOBALXtw',
});

router.post("/upload", async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging

    const { photoUri } = req.body; // Ensure correct extraction

    if (!photoUri) {
      return res.status(400).json({ error: "No image URI received" });
    }

    console.log("Uploading image from URI:", photoUri);

    // Wait for the upload to complete
    const result = await cloudinary.uploader.upload(photoUri, {
      folder: "NOLX_uploads", // Organize uploads
    });

    console.log("Upload successful:", result.secure_url);
    return res.json({ imageUrl: result.secure_url });

  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({ error: "Cloudinary upload failed", details: error.message });
  }
});
module.exports = router;

import express from "express";
import axios from "axios";

const router = express.Router();

// Helper: map MIME types to file extensions
const getExtensionFromMime = (mimeType) => {
  const mimeMap = {
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      ".pptx",
    "application/octet-stream": ".bin", // fallback
  };
  return mimeMap[mimeType] || ".bin";
};

router.get("/", async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) {
      return res.status(400).json({ message: "URL parameter required" });
    }

    // 1. Start with the provided filename, or extract from URL
    let finalFilename = filename;
    if (!finalFilename) {
      const decodedUrl = decodeURIComponent(url);
      const lastSegment = decodedUrl.split("/").pop();
      const match = lastSegment.match(/[^?]+/);
      if (match) {
        let name = match[0];
        if (!name.includes(".")) {
          // Infer from Cloudinary URL path
          if (url.includes("/raw/")) {
            name += ".pdf";
          }
        }
        finalFilename = name;
      } else {
        finalFilename = "document";
      }
    }

    // 2. Fetch the file from Cloudinary to get Content-Type
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    // 3. Ensure the final filename has an extension
    const contentType =
      response.headers["content-type"] || "application/octet-stream";
    // If the filename has no dot, append the extension from Content-Type
    if (!finalFilename.includes(".")) {
      const ext = getExtensionFromMime(contentType);
      finalFilename += ext;
    }

    // 4. Set headers to force download with the correct filename
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${finalFilename}"`,
    );
    res.setHeader("Content-Type", "application/octet-stream"); // Let browser guess from extension
    res.setHeader("Content-Length", response.headers["content-length"]);

    // 5. Pipe the file stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error("Download proxy error:", error.message);
    res.status(500).json({ message: "Failed to download file" });
  }
});

export default router;

import express from "express";
import axios from "axios";

const router = express.Router();

// @route   GET /api/download
// @desc    Proxy file download with proper filename
router.get("/", async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) {
      return res.status(400).json({ message: "URL parameter required" });
    }

    // Use provided filename or generate one
    let finalFilename = filename;
    if (!finalFilename) {
      // Try to extract from URL
      const decodedUrl = decodeURIComponent(url);
      const lastSegment = decodedUrl.split("/").pop();
      const match = lastSegment.match(/[^?]+/);
      if (match) {
        let name = match[0];
        // If it has no extension, try to infer from Cloudinary's resource type
        if (!name.includes(".")) {
          // Check if it's likely a PDF (by URL path containing '/raw/')
          if (url.includes("/raw/")) {
            name += ".pdf";
          }
        }
        finalFilename = name;
      } else {
        finalFilename = "document.pdf";
      }
    }

    // Fetch the file from Cloudinary
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    // Force download with correct filename
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${finalFilename}"`,
    );
    res.setHeader("Content-Type", "application/octet-stream"); // Let browser guess from extension
    response.data.pipe(res);
  } catch (error) {
    console.error("Download proxy error:", error.message);
    res.status(500).json({ message: "Failed to download file" });
  }
});

export default router;

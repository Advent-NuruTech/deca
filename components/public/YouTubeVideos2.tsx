"use client";

// src/components/YouTubeVideos2.jsx
import React, { useEffect, useState } from "react";
import { Play, Youtube, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const YOUTUBE_API_KEY_2 = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2;
const YOUTUBE_CHANNEL_ID_2 = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID_2;
const MAX_VIDEOS = 4;

type YouTubeVideo = {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
    resourceId: { videoId: string };
  };
};

const YouTubeVideos2 = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Get uploads playlist ID
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID_2}&key=${YOUTUBE_API_KEY_2}`,
        );
        const channelData = (await channelResponse.json()) as {
          items: { contentDetails: { relatedPlaylists: { uploads: string } } }[];
        };
        const uploadsPlaylistId =
          channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Fetch latest videos
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_VIDEOS}&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY_2}`,
        );
        const playlistData = (await playlistResponse.json()) as { items: YouTubeVideo[] };
        setVideos(playlistData.items);
      } catch (err) {
        console.error("Failed to fetch YouTube videos:", err);
        setError("Could not load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600" />
        <p className="mt-3 text-gray-500">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <AnimatedSection delay={0.1} direction="up">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Watch Our Latest Videos From RemSam Homestead
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-3 rounded-full" />
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Encouragement, teachings, and stories from our homestead.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Thumbnail with overlay */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {/* Overlay with YouTube logo and link */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a
                  href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 text-white"
                >
                  <Youtube className="w-12 h-12 text-red-500" />
                  <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Watch on YouTube
                  </span>
                </a>
              </div>
              {/* YouTube logo corner (optional) */}
              <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
            </div>

            {/* Video title */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(video.snippet.publishedAt).toLocaleDateString()}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Watch on YouTube <ChevronRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID_2}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-emerald-700 transition"
        >
          <Youtube size={20} /> Visit Our YouTube Channel
        </a>
      </div>
    </AnimatedSection>
  );
};

export default YouTubeVideos2;

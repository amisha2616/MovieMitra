/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import AISummary from './AISummary'; 

const MovieDetail = ({ movie, onClose }) => {
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API_READ_ACCESS_TOKEN}`,
    },
  };

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Fetch credits (cast & crew)
        const creditsResponse = await fetch(
          `${API_BASE_URL}/movie/${movie.id}/credits`,
          API_OPTIONS
        );
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);

        // Fetch videos (trailers, teasers, etc.)
        const videosResponse = await fetch(
          `${API_BASE_URL}/movie/${movie.id}/videos`,
          API_OPTIONS
        );
        const videosData = await videosResponse.json();
        setVideos(
          videosData.results.filter((video) => video.site === "YouTube")
        );

        // Fetch similar movies
        const similarResponse = await fetch(
          `${API_BASE_URL}/movie/${movie.id}/similar`,
          API_OPTIONS
        );
        const similarData = await similarResponse.json();
        setSimilarMovies(similarData.results.slice(0, 6));

        // Fetch reviews
        const reviewsResponse = await fetch(
          `${API_BASE_URL}/movie/${movie.id}/reviews`,
          API_OPTIONS
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.results.slice(0, 3));
      } catch (error) {
        console.error("Error fetching additional movie data:", error);
      }
    };

    fetchAdditionalData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie.id]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 overflow-y-auto"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-[#153B44] rounded-xl max-w-6xl w-full shadow-xl my-8 mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#C6DE41] text-2xl hover:text-white p-2 z-10"
        >
          ✕
        </button>

        <div className="relative">
          {movie.backdrop_path && (
            <div className="w-full h-[300px] sm:h-[400px] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#153B44] to-transparent" />
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 p-6">
            <div className="shrink-0">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-movie.png"
                }
                alt={movie.title}
                className="w-[200px] rounded-lg shadow-lg mx-auto sm:mx-0"
              />
            </div>

            <div className="flex-1 text-left">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#C6DE41] mb-2">
                {movie.title}
                {movie.release_date && (
                  <span className="text-[#2D6E7E] text-xl ml-2">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </h2>

              <div className="flex flex-wrap gap-4 mb-4 text-[#d1e466]">
                {movie.release_date && (
                  <span>{formatDate(movie.release_date)}</span>
                )}
                {movie.runtime && (
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
                <span className="uppercase">{movie.original_language}</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <img src="/star.svg" alt="Rating" className="w-5 h-5" />
                <span className="text-[#C6DE41] font-bold">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>
                {movie.vote_count && (
                  <span className="text-[#2D6E7E]">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                )}
              </div>

              <AISummary data={movie} type="movie" />

              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-[#2D6E7E] text-[#C6DE41] px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.tagline && (
                <p className="text-[#ffffff] italic mt-5 mb-5 text-2xl">
                  &quot;{movie.tagline}&quot;
                </p>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#C6DE41] mb-2">
                  Overview
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {movie.budget > 0 && (
                  <div>
                    <span className="text-[#C6DE41] font-bold">Budget: </span>
                    <span className="text-white">
                      {formatCurrency(movie.budget)}
                    </span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <span className="text-[#C6DE41] font-bold">Revenue: </span>
                    <span className="text-white">
                      {formatCurrency(movie.revenue)}
                    </span>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <span className="text-[#C6DE41] font-bold">Status: </span>
                    <span className="text-white">{movie.status}</span>
                  </div>
                )}
                {movie.production_countries &&
                  movie.production_countries.length > 0 && (
                    <div>
                      <span className="text-[#C6DE41] font-bold">
                        Country:{" "}
                      </span>
                      <span className="text-white">
                        {movie.production_countries
                          .map((country) => country.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {credits && credits.cast && credits.cast.length > 0 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">Top Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {credits.cast.slice(0, 6).map((person) => (
                <div key={person.id} className="text-center">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : "/no-profile.png"
                    }
                    alt={person.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
                  />
                  <p className="text-[#C6DE41] font-medium">{person.name}</p>
                  <p className="text-[#2D6E7E] text-sm">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}


        {videos && videos.length > 0 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.slice(0, 2).map((video) => (
                <div key={video.id} className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </section>
        )}

        {similarMovies && similarMovies.length > 0 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">
              Similar Movies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((similar) => (
                <div key={similar.id} className="text-center">
                  <img
                    src={
                      similar.poster_path
                        ? `https://image.tmdb.org/t/p/w185${similar.poster_path}`
                        : "/no-movie.png"
                    }
                    alt={similar.title}
                    className="w-full rounded-lg mb-2"
                  />
                  <p className="text-[#C6DE41] text-sm font-medium line-clamp-2">
                    {similar.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {reviews && reviews.length > 0 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#0D2C33] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={
                        review.author_details.avatar_path
                          ? review.author_details.avatar_path.startsWith(
                              "/http"
                            )
                            ? review.author_details.avatar_path.substring(1)
                            : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                          : "/no-profile.png"
                      }
                      alt={review.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-[#C6DE41] font-medium">
                        {review.author}
                      </p>
                      <p className="text-[#2D6E7E] text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 line-clamp-20 text-left">{review.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import AISummary from './AISummary';

const ActorDetail = ({ actor, onClose }) => {
  const [personDetails, setPersonDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [images, setImages] = useState([]);
  const [socialMedia, setSocialMedia] = useState(null);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API_READ_ACCESS_TOKEN}`,
    },
  };

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        // Fetch detailed person information
        const detailsResponse = await fetch(
          `${API_BASE_URL}/person/${actor.id}`,
          API_OPTIONS
        );
        const detailsData = await detailsResponse.json();
        setPersonDetails(detailsData);

        // Fetch movie and TV credits
        const creditsResponse = await fetch(
          `${API_BASE_URL}/person/${actor.id}/combined_credits`,
          API_OPTIONS
        );
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);

        // Fetch images
        const imagesResponse = await fetch(
          `${API_BASE_URL}/person/${actor.id}/images`,
          API_OPTIONS
        );
        const imagesData = await imagesResponse.json();
        setImages(imagesData.profiles?.slice(0, 6) || []);

        // Fetch social media info
        const socialResponse = await fetch(
          `${API_BASE_URL}/person/${actor.id}/external_ids`,
          API_OPTIONS
        );
        const socialData = await socialResponse.json();
        setSocialMedia(socialData);
      } catch (error) {
        console.error("Error fetching actor data:", error);
      }
    };

    fetchActorData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor.id]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthdate, deathdate = null) => {
    if (!birthdate) return null;
    
    const birth = new Date(birthdate);
    const end = deathdate ? new Date(deathdate) : new Date();
    
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getSocialMediaLink = (platform, id) => {
    if (!id) return null;
    
    const links = {
      instagram: `https://instagram.com/${id}`,
      twitter: `https://twitter.com/${id}`,
      facebook: `https://facebook.com/${id}`,
      imdb: `https://www.imdb.com/name/${id}`,
    };
    
    return links[platform] || null;
  };

  const sortedMovieCredits = credits?.cast
    ?.filter(credit => credit.media_type === "movie")
    ?.sort((a, b) => b.popularity - a.popularity) || [];

  const sortedTVCredits = credits?.cast
    ?.filter(credit => credit.media_type === "tv")
    ?.sort((a, b) => b.popularity - a.popularity) || [];

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

        <div className="flex flex-col sm:flex-row gap-6 p-6">
          <div className="shrink-0">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "/no-profile.png"
              }
              alt={actor.name}
              className="w-[200px] sm:w-[300px] rounded-lg shadow-lg mx-auto sm:mx-0"
            />
            
            {socialMedia && (
              <div className="mt-4 flex justify-center sm:justify-start gap-4">
                {socialMedia.instagram_id && (
                  <a
                    href={getSocialMediaLink("instagram", socialMedia.instagram_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "#c7de41" }}
                  >
                    <img 
                      src='/instagram.svg'
                      alt="Instagram" 
                      className="w-6 h-6"
                    />
                  </a>
                )}
                {socialMedia.twitter_id && (
                  <a
                    href={getSocialMediaLink("twitter", socialMedia.twitter_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "#c7de41" }}
                  >
                    <img 
                      src='/twitter.svg' 
                      alt="Twitter" 
                      className="w-6 h-6"
                    />
                  </a>
                )}
                {socialMedia.facebook_id && (
                  <a
                    href={getSocialMediaLink("facebook", socialMedia.facebook_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "#c7de41" }}
                  >
                    <img 
                      src='/facebook.svg'
                      alt="Facebook" 
                      className="w-6 h-6"
                    />
                  </a>
                )}
                {socialMedia.imdb_id && (
                  <a
                    href={getSocialMediaLink("imdb", socialMedia.imdb_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "#c7de41" }}
                  >
                    <img 
                      src='/imdb.svg' 
                      alt="IMDb" 
                      className="w-6 h-6"
                    />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 text-left">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#C6DE41] mb-2">
              {personDetails?.name || actor.name}
            </h2>

            <div className="flex flex-wrap gap-4 mb-4 text-[#d1e466]">
              {personDetails?.birthday && (
                <div>
                  <span className="text-[#2D6E7E]">Born: </span>
                  <span>{formatDate(personDetails.birthday)}</span>
                  {calculateAge(personDetails.birthday, personDetails.deathday) && (
                    <span className="ml-2">
                      (Age: {calculateAge(personDetails.birthday, personDetails.deathday)})
                    </span>
                  )}
                </div>
              )}
              
              {personDetails?.deathday && (
                <div>
                  <span className="text-[#2D6E7E]">Died: </span>
                  <span>{formatDate(personDetails.deathday)}</span>
                </div>
              )}
              
              {personDetails?.place_of_birth && (
                <div>
                  <span className="text-[#2D6E7E]">Birthplace: </span>
                  <span>{personDetails.place_of_birth}</span>
                </div>
              )}
            </div>

            {personDetails?.known_for_department && (
              <div className="mb-4">
                <span className="bg-[#2D6E7E] text-[#C6DE41] px-3 py-1 rounded-full text-sm">
                  {personDetails.known_for_department}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <img src="/star.svg" alt="Popularity" className="w-5 h-5" />
              <span className="text-[#C6DE41] font-bold">
                {personDetails?.popularity?.toFixed(1) || "N/A"}
              </span>
              <span className="text-[#2D6E7E]">Popularity Score</span>
            </div>

            <AISummary data={actor} type="actor" />
            
            {personDetails?.biography && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#C6DE41] mb-2">Biography</h3>
                <p className="text-white/90 leading-relaxed">
                  {personDetails.biography || "No biography available."}
                </p>
              </div>
            )}
          </div>
        </div>

        {images && images.length > 1 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image, index) => (
                <div key={index} className="aspect-[2/3] overflow-hidden rounded-lg">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${image.file_path}`}
                    alt={`${personDetails?.name || actor.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {sortedMovieCredits.length > 0 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">
              Known For (Movies)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sortedMovieCredits.slice(0, 6).map((movie) => (
                <div key={movie.id} className="text-center">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                        : "/no-movie.png"
                    }
                    alt={movie.title}
                    className="w-full rounded-lg mb-2"
                  />
                  <p className="text-[#C6DE41] text-sm font-medium line-clamp-1">
                    {movie.title}
                  </p>
                  <p className="text-[#2D6E7E] text-xs line-clamp-1">
                    {movie.character || "Unknown role"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {sortedTVCredits.length > 0 && (
          <section className="p-6 border-t border-[#2D6E7E]">
            <h3 className="text-xl font-bold text-[#C6DE41] mb-4">
              Known For (TV)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sortedTVCredits.slice(0, 6).map((show) => (
                <div key={show.id} className="text-center">
                  <img
                    src={
                      show.poster_path
                        ? `https://image.tmdb.org/t/p/w185${show.poster_path}`
                        : "/no-movie.png"
                    }
                    alt={show.name}
                    className="w-full rounded-lg mb-2"
                  />
                  <p className="text-[#C6DE41] text-sm font-medium line-clamp-1">
                    {show.name}
                  </p>
                  <p className="text-[#2D6E7E] text-xs line-clamp-1">
                    {show.character || "Unknown role"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ActorDetail;
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ActorCard = ({ actor, onClick }) => {
  const {
    name,
    id,
    popularity,
    profile_path,
    known_for_department,
    gender
  } = actor;

  // Get known for title from first known_for entry if available
  const knownForTitle = actor.known_for && actor.known_for.length > 0 
    ? (actor.known_for[0].title || actor.known_for[0].name)
    : "";

  return (
    <div className="movie-card cursor-pointer" onClick={() => onClick(actor)}>
      <img
        src={
          profile_path
            ? `https://image.tmdb.org/t/p/w500/${profile_path}`
            : "/no-profile.png"
        }
        alt={name}
      />
      <div className="mt-4">
        <h3>{name}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Stars" />
            <p>{popularity ? popularity.toFixed(1) : "N/A"}</p>
          </div>
          <span>|</span>
          <p className="lang">{known_for_department || "Acting"}</p>
          <span>|</span>
          <p className="year">
            {knownForTitle || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActorCard;
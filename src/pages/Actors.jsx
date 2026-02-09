/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./Home.css";
import Search from "../components/Search.jsx";
import Loading from "../components/Loading.jsx";
import ActorCard from "../components/ActorCard.jsx";
import ActorDetail from "../components/ActorDetail.jsx";
import Footer from "../components/Footer.jsx";
import { useDebounce } from "react-use";
import { Link } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const VITE_API_READ_ACCESS_TOKEN = import.meta.env.VITE_API_READ_ACCESS_TOKEN;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${VITE_API_READ_ACCESS_TOKEN}`,
  },
};

const Actors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actorList, setActorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedActor, setSelectedActor] = useState(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchActors = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/person?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/person/popular`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch actors");

      const data = await response.json();
      setActorList(data.results || []);
    } catch (error) {
      setErrorMessage("Error fetching actors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActorDetails = async (actorId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/person/${actorId}`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Failed to fetch actor details");

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleActorClick = async (actor) => {
    const details = await fetchActorDetails(actor.id);
    if (details) setSelectedActor({ ...actor, ...details });
  };

  useEffect(() => {
    fetchActors(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header className="mt-30">
          <h1>
            Discover actors with
            <br />
            MovieMitra 🎭
          </h1>

          <Search
            searchTerm={searchTerm}
            setsearchTerm={setSearchTerm}
            PH="Search for Actors"
          />

          <Link to="/">
            <button className="home-button">Back to Movies</button>
          </Link>
        </header>

        <section className="all-movies">
          <h2>All Actors</h2>

          {isLoading ? (
            <Loading />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {Array.isArray(actorList) &&
                actorList.map((actor) => (
                  <ActorCard
                    key={actor.id}
                    actor={actor}
                    onClick={handleActorClick}
                  />
                ))}
            </ul>
          )}
        </section>

        {selectedActor && (
          <ActorDetail
            actor={selectedActor}
            onClose={() => setSelectedActor(null)}
          />
        )}

        <Footer />
        <Analytics />
      </div>
    </main>
  );
};

export default Actors;

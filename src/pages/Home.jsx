/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./Home.css";
import Search from "../components/Search.jsx";
import Loading from "../components/Loading.jsx";
import MovieCard from "../components/MovieCard.jsx";
import { useDebounce } from "react-use";
import MovieDetail from "../components/MovieDetail.jsx";
import Footer from "../components/Footer.jsx";
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

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingList, setTrendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending/movie/day`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Failed to fetch trending movies");

      const data = await response.json();
      setTrendingList(data.results || []);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movieId}`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Failed to fetch movie details");

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleMovieClick = async (movie) => {
    const details = await fetchMovieDetails(movie.id);
    if (details) setSelectedMovie(details);
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header className="mt-30">
          <h1>
            Discover movies with
            <br />
            MovieMitra 🎬
          </h1>

          <Search
            searchTerm={searchTerm}
            setsearchTerm={setSearchTerm}
            PH="Search for Movies"
          />

          <Link to="/actors">
            <button className="home-button">Search for Actors</button>
          </Link>
        </header>

        {Array.isArray(trendingList) && trendingList.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingList.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Loading />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {Array.isArray(movieList) &&
                movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={handleMovieClick}
                  />
                ))}
            </ul>
          )}
        </section>

        {selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}

        <Footer />
        <Analytics />
      </div>
    </main>
  );
};

export default Home;

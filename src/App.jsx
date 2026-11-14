import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "./MovieCard.css";
import "./App.css"; 

// Вставь сюда свой ключ, который пришел на почту!
const API_KEY = "ae96bc2b";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle, loading, error, success
  const [error, setError] = useState(null);

  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${API_KEY}`
      );
      if (!res.ok) throw new Error("Ошибка сети");

      const data = await res.json();

      if (data.Error) {
        setMovies([]);
        setStatus("error");
        setError(data.Error === "Movie not found!" ? "Ничего не найдено" : data.Error);
        return;
      }

      setMovies(data.Search || []);
      setStatus("success");
    } catch (err) {
      setMovies([]);
      setStatus("error");
      setError(err.message);
    }
  };

  // Автопоиск (Debounce) через useEffect
  useEffect(() => {
    // Если запрос слишком короткий, сбрасываем всё
    if (query.trim().length <= 2) {
      setMovies([]);
      setStatus("idle");
      setError(null);
      return;
    }

    // Ждем 500мс после последнего нажатия клавиши
    const timer = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchClick = () => {
    fetchMovies(query);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#1f2937" }}>Поиск фильмов</h1>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите название фильма (например, Matrix)"
          style={{ padding: "10px", width: "300px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", color: "#000" }}
        />
        <button
          onClick={handleSearchClick}
          disabled={status === "loading"}
          style={{ padding: "10px 20px", borderRadius: "8px", background: "#3b82f6", color: "#fff", border: "none", fontSize: "16px", cursor: status === "loading" ? "not-allowed" : "pointer" }}
        >
          {status === "loading" ? "Поиск..." : "Найти"}
        </button>
      </div>

      {/* Отображение состояний */}
      <div style={{ textAlign: "center", minHeight: "100px" }}>
        {status === "idle" && <p style={{ color: "#6b7280" }}>Введите название фильма (от 3-х букв) или нажмите «Найти».</p>}
        
        {status === "loading" && (
          <div>
            <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #3b82f6", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#6b7280" }}>Загрузка...</p>
          </div>
        )}
        
        {status === "error" && <p style={{ color: "#ef4444", fontWeight: "bold" }}>Ошибка: {error}</p>}
        
        {status === "success" && movies.length === 0 && <p>Ничего не найдено по вашему запросу.</p>}
      </div>

      {/* Список фильмов */}
      {status === "success" && movies.length > 0 && (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} apiKey={API_KEY} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
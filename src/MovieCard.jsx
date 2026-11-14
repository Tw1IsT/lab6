import { useState, useEffect } from "react";

export default function MovieCard({ movie, apiKey }) {
  const [plot, setPlot] = useState("Загрузка описания...");

  // Доп. задание: запрос полного описания по ID
  useEffect(() => {
    let isMounted = true;
    const fetchPlot = async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
        const data = await res.json();
        if (isMounted) {
          setPlot(data.Plot !== "N/A" ? data.Plot : "Описание отсутствует.");
        }
      } catch (err) {
        if (isMounted) setPlot("Не удалось загрузить описание.");
      }
    };
    
    fetchPlot();
    return () => { isMounted = false; }; // Защита от утечек памяти
  }, [movie.imdbID, apiKey]);

  const posterUrl = movie.Poster !== "N/A" 
    ? movie.Poster 
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <article className="movie-card">
      <img src={posterUrl} alt={movie.Title} className="movie-card__poster" />
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.Title}</h3>
        <p className="movie-card__year"><strong>Год:</strong> {movie.Year}</p>
        <p className="movie-card__plot">{plot}</p>
      </div>
    </article>
  );
}
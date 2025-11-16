import React, {useEffect, useState} from 'react';
import { fetchMovie, fetchVideos, fetchRecommendations } from './api';

function PlayButton({onClick}) {
  return <div className="play-btn" onClick={onClick}>▶</div>;
}

function PosterCard({movie, onClick}) {
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '';
  return (
    <div className="poster-card" onClick={() => onClick(movie.id)}>
      <img src={poster} alt={movie.title} />
      <div className="poster-title">{movie.title}</div>
    </div>
  );
}

export default function MoviePage(){
  const defaultId = process.env.REACT_APP_MOVIE_ID || '122917';
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState(null);
  const [recs, setRecs] = useState([]);
  const [playingKey, setPlayingKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieId, setMovieId] = useState(defaultId);

  useEffect(()=>{
    setLoading(true);
    Promise.all([fetchMovie(movieId), fetchVideos(movieId), fetchRecommendations(movieId)])
      .then(([m, v, r])=>{
        setMovie(m);
        setVideos(v.results || []);
        setRecs(r.results || []);
      })
      .catch(err => console.error(err))
      .finally(()=>setLoading(false));
  }, [movieId]);

  function openVideo(){
    // prefer official trailer, or first YouTube
    const yt = (videos || []).find(x => x.site === 'YouTube' && x.type === 'Trailer') ||
               (videos || []).find(x => x.site === 'YouTube');
    if(yt) setPlayingKey(yt.key);
    else alert('No trailer available');
  }

  function gotoMovie(id){
    setMovieId(id);
    window.scrollTo({top:0, behavior:'smooth'});
  }

  if(loading) return <div className="container">Loading...</div>;
  if(!movie) return <div className="container">Movie not found</div>;

  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
  const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : '';

  const director = (movie.credits && movie.credits.crew) ? movie.credits.crew.find(c => c.job === 'Director') : null;
  const cast = (movie.credits && movie.credits.cast) ? movie.credits.cast.slice(0,8) : [];

  return (
    <div className="container page-grid">
      <header className="topbar">
        <div className="logo">GOOJARA.to clone</div>
        <input className="search" placeholder="Search..." />
      </header>

      <main className="main">
        <div className="video-card">
          <div className="video-thumb" style={{backgroundImage: `url(${backdrop || poster})`}}>
            <PlayButton onClick={openVideo}/>
            <div className="video-title">{movie.title} ({new Date(movie.release_date||'').getFullYear() || ''})</div>
          </div>
        </div>

        <div className="info-card">
          <h1>{movie.title} ({new Date(movie.release_date||'').getFullYear() || ''})</h1>
          <div className="meta">
            <span>{movie.runtime}min</span> | <span>{movie.genres.map(g=>g.name).join(', ')}</span> | <span>{movie.release_date}</span>
          </div>
          <p className="overview">{movie.overview}</p>

          <div className="details-row">
            <div><strong>Director:</strong> {director ? director.name : '—'}</div>
            <div><strong>Cast:</strong> {cast.map(c=>c.name).join(', ')}</div>
          </div>
        </div>

      </main>

      <aside className="sidebar">
        <h3>Suggestions</h3>
        <div className="suggestions">
          {recs.slice(0,10).map(r => <PosterCard key={r.id} movie={r} onClick={gotoMovie} />)}
        </div>
      </aside>

      {playingKey && (
        <div className="modal" onClick={()=>setPlayingKey(null)}>
          <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            <iframe
              title="trailer"
              width="100%"
              height="480"
              src={`https://www.youtube.com/embed/${playingKey}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="close" onClick={()=>setPlayingKey(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}

const BASE = 'https://api.themoviedb.org/3';
const KEY = process.env.REACT_APP_TMDB_API_KEY;

export async function fetchMovie(id){
  const res = await fetch(`${BASE}/movie/${id}?api_key=${KEY}&language=en-US&append_to_response=credits`);
  if(!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

export async function fetchVideos(id){
  const res = await fetch(`${BASE}/movie/${id}/videos?api_key=${KEY}&language=en-US`);
  if(!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function fetchRecommendations(id){
  const res = await fetch(`${BASE}/movie/${id}/recommendations?api_key=${KEY}&language=en-US&page=1`);
  if(!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

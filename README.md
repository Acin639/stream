# BlackPhone Clone (React + TMDB)

This project is a **clone** of a movie detail page (layout shown by the user).  
It fetches movie details and recommendations from TMDB and renders:

- Header + search
- A video area (thumbnail with play button -> opens modal with YouTube iframe)
- Info box (title, runtime, genres, overview, director, cast)
- Suggestions column with posters

## Setup

1. Copy `.env.example` to `.env` and set your `REACT_APP_TMDB_API_KEY`.
2. (Optional) You can change `REACT_APP_MOVIE_ID` to the TMDB movie id you want to preview.
3. Run:
```
npm install
npm start
```

Notes:
- Trailer playback uses YouTube embeds returned by TMDB (videos endpoint).
- This is a simplified single-page clone meant for local development.

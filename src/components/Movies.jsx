// import './App.css';

import axios from 'axios';
import YouTube from 'react-youtube';
// import SearchMovie from './SearchMovie';
import { useCallback, useEffect, useState } from 'react';
import '../styles/movies.css';
import Navbar from './Navbar'
import SearchMovie from './SearchMovie';

const Movies = () => {

    // Clave para consumir API
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "ac4d09d6f3b45953d04be6f6b9050e0f";
    // Configuracion para obtener la imagen
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original"
    const URL_IMAGE = "https://image.tmdb.org/t/p/original"

    // State Variables
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("");
    const [trailer, setTrailer] = useState(null);
    const [movie, setMovie] = useState({ title: "Loading Movies" })
    const [playing, setPlaying] = useState(false);

    // Peticion GET to API
    const fetchMovies = useCallback(async (searchKey) => {
        // Buscamos una pelicula o solo queremos ver cuales son las mas taquilleras
        const type = searchKey ? "search" : "discover";
        // Destructuramos lo que traiga data, solo queremos la informacion por results
        // Hacemos la peticion haciendo referencia al direccion base concatenando el tipo
        // Pasamos los parametros adicionales pasando el api key y la busqueda de pelicula.
        // const { data: { results },
        // } = await axios.get(`${API_URL}/${type}/movie`, {
        //     params: {
        //         api_key: API_KEY,
        //         query: searchKey,
        //     },
        // });
        const results = (await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: API_KEY,
                query: searchKey,
            },
        })).data.results;
        // console.log(results);

        // console.log(results);
        setMovies(results);
        // Se almacena la primer pelicula de toda la coleccion recibida
        setMovie(results[0]);

        if (results.length) {
            await fetchMovie(results[0].id);
        }
    }, []);

    //   Peticion de un solo objeto y mostrar en reproductor de video
    const fetchMovie = async (id) => {
        // console.log(id);
        // console.log(`${API_URL}/movie/${id}`)
        const { data } = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos",
            }
        });
        // console.log(data);

        // console.log(data.videos.results.length);
        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(
                (vid) => vid.name === "Official Trailer"
            );
            // console.log(trailer)
            setTrailer(trailer ? trailer : data.videos.results[0]);
        }
        // console.log(data)
        setMovie(data);
    };

    const selectMovie = async (movie) => {
        fetchMovie(movie.id);
        setMovie(movie);
        window.scrollTo(0, 0);
    };

    // Buscar peliculas
    const searchMovie = (e) => {
        e.preventDefault();

        fetchMovies(searchKey);
    }

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    return (
        <div className="App">
            {/* Mostrar posters de las peliculas actuales */}
            <Navbar />

            {/* Contenedor del banner y contenedor de video */}
            <div>
                <main>
                    {movie.backdrop_path ? (
                        <div
                            className="viewtrailer"
                            style={{
                                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                            }}
                        >
                            {playing ? (
                                <>
                                    <YouTube
                                        videoId={trailer.key}
                                        className="reproductor container"
                                        containerClassName={"youtube-container amru"}
                                        opts={{
                                            width: "100%",
                                            height: "100%",
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 0,
                                                cc_load_policy: 0,
                                                fs: 0,
                                                iv_load_policy: 0,
                                                modestbranding: 0,
                                                rel: 0,
                                                showinfo: 0,
                                            },
                                        }}
                                    />
                                    <button onClick={() => setPlaying(false)} className="boton">
                                        Close
                                    </button>
                                </>
                            ) : (
                                <div className="container">
                                    {trailer ? (
                                        <button
                                            className="boton"
                                            onClick={() => setPlaying(true)}
                                            type="button"
                                        >
                                            Play Trailer
                                        </button>
                                    ) : (
                                        <h2 className='text-center'>Sorry, no trailer available</h2>
                                    )}
                                    <h1 className="text-white">{movie.title}</h1>
                                    <p className="text-white">{movie.overview}</p>
                                </div>
                            )}
                        </div>
                    ) : <h2 className='text-center'>Sorry, Image No Available</h2>}
                </main>
            </div>

            {/* Buscador */}
            <SearchMovie searchMovie={searchMovie} setSearchKey={setSearchKey} />

            {/* Contenedor para mostrar las peliculas que hay */}
            < div className='container mt-3' >
                <div className='row'>
                    {movies.map((movie) => (
                        // console.log(movie);
                        <div key={movie.id} className='col-md-4 mb-3' onClick={() => selectMovie(movie)}>
                            {movie.poster_path ? (

                                <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%" />
                            ) : (
                                <div className='no-poster'><h2>No poster available</h2></div>
                            )}
                            <h4 className='text-center'>{movie.title}</h4>
                        </div>
                    ))}
                </div>
            </div >
        </div >
    );
}

export default Movies;

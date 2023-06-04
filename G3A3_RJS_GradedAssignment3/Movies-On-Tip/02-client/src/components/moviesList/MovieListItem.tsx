import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import IMovie from "../../model/Imovie";
import {
  addMovie,
  deleteMovieById,
  getHighestMovieId,
  getMovieByTitle,
} from "../../services/movieService";
import "./MovieListItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

type Props = {
  movie: IMovie;
  path: string;
  onRemove: (title: string) => void;
};

const MovieListItem = ({ movie, path, onRemove }: Props) => {
  const toastTimeout = 1000;
  const isFavourite = path === "favourites";
  const [iconColor, setIconColor] = useState("white");
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false); 

  const { title, posterurl, year, imdbRating } = movie;

  var redirectPath = `${path}/${title}`;

  useEffect(() => {
   
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(movie.title)) {
      setIconColor("red");
      setIsAddedToFavorites(true);
    }
  }, [movie.title]);

  const addToFavourites = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const movieByTitle = await getMovieByTitle("favourites", movie.title);
      if (movieByTitle !== null) {
        toast.error("Already present in Favourites!", {
          autoClose: toastTimeout,
          theme: "dark",
        });
        return;
      }

      const highestId = await getHighestMovieId("favourites");
      movie.id = highestId + 1;
      await addMovie("favourites", movie);
      toast.success("Successfully added to Favourites!", {
        autoClose: toastTimeout,
        theme: "dark",
      });
      setIconColor("red");
      setIsAddedToFavorites(true);

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, movie.title])
      );
    } catch (errormsg: any) {
      toast.error("Failed to add the movie!", {
        autoClose: toastTimeout,
        theme: "dark",
      });
    }
  };

  const removeFromFavourites = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      if (movie.id === null) {
        toast.warn("Movie deletion error");
      }
      const data = await deleteMovieById("favourites", movie.id);
      toast.success("Successfully removed from Favourites!", {
        autoClose: toastTimeout,
        theme: "dark",
      });
      onRemove(movie.title);
      setIconColor("white");
      setIsAddedToFavorites(false);

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updatedFavorites = favorites.filter(
        (fav: string) => fav !== movie.title
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (errormsg: any) {
      toast.error("Failed to remove from Favourites", {
        autoClose: toastTimeout,
        theme: "dark",
      });
    }
  };

  return (
    <Card className="display-card" style={{ width: "20rem" }}>
      <Link to={redirectPath}>
        <Card.Img variant="top" height={300} src={`${posterurl}`} />
      </Link>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between d-flex-custom ">
          <div className="text-xs">{title}</div>
          <Card.Text>
            <span>{`Year: ${year}, IMDB: ${imdbRating}`}</span>
          </Card.Text>

          <div>
            <Button
              hidden={isFavourite}
              onClick={addToFavourites}
              variant="dark"
            >
              {isAddedToFavorites ? "Added to Favorites" : "Add to Favorites"}{" "}
              <FontAwesomeIcon icon={faHeart} style={{ color: iconColor }} />
            </Button>
            <Button
              hidden={!isFavourite}
              onClick={removeFromFavourites}
              variant="danger"
            >
              Remove from Favourites
            </Button>
          </div>
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default MovieListItem;

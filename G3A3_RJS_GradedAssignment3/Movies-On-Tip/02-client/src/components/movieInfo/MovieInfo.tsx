import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Alert, Col, Row, Modal } from "react-bootstrap";
import { faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isLoading } from "../../utils/types";
import IMovie from "../../model/Imovie";
import LoadingIndicator from "../common/Loader";
import Rating from "../common/Rating";
import { getMovieByTitle } from "../../services/movieService";
import PageNotFound from "../global/PageNotFound";
import "./MovieInfo.css";
import { Link } from "react-router-dom";


type Props = {
    moviesCategory: string;
    path: string;
};

const MoviesInfo = (props: RouteComponentProps<Props>) => {
    const [status, setStatus] = useState<isLoading>("LOADING");
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getMovieByTitle(
                    props.match.params.moviesCategory,
                    props.match.params.path
                );
                setMovie(data);
                setStatus("LOADED");
            } catch (errormsg: any) {
                setError(errormsg);
                setStatus("ERROR");
            }
        };

        fetchMovie();
    }, [props.match.params.path, props.match.params.moviesCategory]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    let element;

    switch (status) {
        case "LOADING":
            element = (
                <LoadingIndicator
                    size="large"
                    message="Loading. Please Wait..."
                />
            );
            break;
        case "LOADED":
            if (movie === null) {
                element = <PageNotFound />;
                break;
            }

            const {
                title,
                storyline,
                ratings,
                posterurl,
                duration,
                releaseDate,
                genres,
                actors,
                imdbRating,
            } = movie as IMovie;

            if (title === null) {
                element = <PageNotFound />;
                break;
            }
            const average = (arr: number[]) =>
                arr.reduce((a, b) => a + b, 0) / arr.length;
            var rating = parseInt(average(ratings).toFixed(2), 10) / 2;

            element = (
                <>
                    <Row>
                        <Col xs={12} className="my-2 bt-head">
                            <Link to={{ pathname: `/${props.match.params.moviesCategory}` }}> <FontAwesomeIcon icon={faArrowLeft} /> Back to {props.match.params.moviesCategory.replace(/-/g, " ")}
                            </Link>
                        </Col>
                    </Row>
                    <div className="info-display">
                        <Row>
                            <Col xs={12} className="my-2">
                                <h1>{title}</h1>
                                <hr />
                            </Col>
                            <Col xs={12} lg={4} className="my-2">
                                <img
                                    src={`${posterurl}`}
                                    alt={title}
                                    className="w-100"
                                    onClick={handleOpenModal}
                                    style={{ cursor: "pointer" }}
                                />
                            </Col>
                            <Col xs={12} lg={8}>
                                <div className="fs-5 my-2 st-details">
                                    <p>
                                        <b>Storyline</b> : {storyline}
                                    </p>
                                    <p>
                                        <b>Release Date</b> : {releaseDate}
                                    </p>
                                    <p>
                                        <b>Genre</b> :{" "}
                                        {genres.map((genre, key) => (
                                            <span key={key}>{genre}, </span>
                                        ))}
                                    </p>
                                    <p>
                                        <b>Actors</b> :{" "}
                                        {actors.map((actor, key) => (
                                            <span key={key}>{actor}, </span>
                                        ))}
                                    </p>
                                    <p>
                                        <b>IMDB Rating </b> : {imdbRating}
                                    </p>
                                </div>
                                <Row xs={3} className="text-sm my-2">
                                    <Col>
                                        <FontAwesomeIcon icon={faClock} />
                                        <span className="ms-2">{duration}</span>
                                    </Col>
                                    <Col>
                                        <Rating rating={rating} />
                                        {rating} ({ratings.length} Rated)
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        dialogClassName="modal-dialog-centered"
                    >
                        <Modal.Body>
                            <img
                                src={`${posterurl}`}
                                alt={title}
                                className="w-100"
                                style={{ maxHeight: "600px" }}
                            />
                        </Modal.Body>
                    </Modal>
                </>
            );
            break;

        case "ERROR":
            let msg = error?.message ?? "";

            if (msg?.indexOf("404") > -1) {
                element = <PageNotFound />;
            } else {
                element = <Alert variant="danger">{error?.message}</Alert>;
            }
            break;
    }

    return element;
};

export default MoviesInfo;

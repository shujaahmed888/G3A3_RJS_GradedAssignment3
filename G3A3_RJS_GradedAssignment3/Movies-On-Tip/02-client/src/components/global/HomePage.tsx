import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { menuData } from "../../services/movieService";
import PageNotFound from "./PageNotFound";
import Loader from "../common/Loader";
import OptionCard from "./OptionCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const imgArray = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [menu, setMenu] = useState<string[]>([]);

  useEffect(() => {
    const helper = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchMenu = await menuData();
        setMenu(fetchMenu);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    helper();
  }, []);

  return (
    <>
      {loading && (
        <>
          <Loader message="Loading..." size="large"></Loader>
        </>
      )}
      {!loading && error && (
        <>
          <PageNotFound></PageNotFound>
        </>
      )}
      {menu.length !== 0 && !loading && !error && (
        <>
          <div>
            <Container fluid style={{ paddingTop: "8%", paddingBottom: "8%" }}>
              <Row className="my-3">
                <h1>
                  <FontAwesomeIcon icon={faFilm} /> Movies On Tip
                </h1>
                <p>
                  Movies on Tip is an online movie manager whose responsibility
                  is to take care of all the activities a user can do on this
                  portal.{" "}
                </p>
                <hr />
              </Row>
              <Row xs={2} md={5}>
                {menu.map((item, idx) => (
                  <Col className="my-3">
                    <OptionCard
                      ImgUrl={`${imgArray[idx]}`}
                      RedirectUrl={`${item}`}
                      OptionName={item.replace(/-/g, " ")}
                    ></OptionCard>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;

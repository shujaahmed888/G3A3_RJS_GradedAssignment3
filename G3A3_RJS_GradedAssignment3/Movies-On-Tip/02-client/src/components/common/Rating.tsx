import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";



type Props = {
  rating: number;
  color: string;
};

const Rating = ({ rating, color }: Props) => {
  const numFullStars = Math.floor(rating); 
  const numHalfStars = rating - Math.floor(rating) >= 0.5 ? 1 : 0; 
  const numEmptyStars = 5 - (numFullStars + numHalfStars);

  return (
    <span style={{color: color}}>
      {Array.from({ length: numFullStars }).map((item, idx) => (
        <FontAwesomeIcon icon={faStar} key={idx} />
      ))}
      {numHalfStars ? <FontAwesomeIcon icon={faStarHalfAlt} /> : null}
      {Array.from({ length: numEmptyStars }).map((item, idx) => (
        <FontAwesomeIcon icon={faStarEmpty} key={idx} />
      ))}
    </span>
  );
};

Rating.defaultProps = {
  rating: 4,
  color: "goldenrod",
};

export default Rating;

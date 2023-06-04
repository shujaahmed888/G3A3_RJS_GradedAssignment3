import { Spinner } from "react-bootstrap";

type Props = {
  size: "small" | "medium" | "large";
  message: string;
};

const loadSize = {
  small: {
    width: "1.5rem",
    height: "1.5rem",
  },
  medium: {
    width: "2rem",
    height: "2rem",
  },
  large: {
    width: "3.5rem",
    height: "3.5rem",
  },
};

const Loader = ({ message, size }: Props) => {
  return (
    <div className="d-flex flex-column align-items-center my-4">
      <Spinner
        animation="border"
        variant="dark"
        role="status"
        style={loadSize[size]}
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      <span>{message}</span>
    </div>
  );
};

Loader.defaultProps = {
  size: "medium",
  message: "Loading...",
};

export default Loader;

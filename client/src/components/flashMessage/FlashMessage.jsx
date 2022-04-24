import { useEffect, useState } from "react";
import "./flashMessage.css";

const FlashMessage = ({ type, msg }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    setInterval(() => {
      setShow(false);
    }, 4000);
  }, [msg]);

  return <>{show && <div className={`alertMessage-${type}`}>{msg}</div>}</>;
};

export default FlashMessage;

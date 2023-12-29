import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const Portal = ({ children }: { children: JSX.Element }) => {
  const [portalDiv, setPortalDiv] = useState<HTMLElement | null>();

  useEffect(() => {
    setPortalDiv(document.getElementById("portal"));
  });
  return portalDiv ? ReactDOM.createPortal(children, portalDiv) : null;
};
import * as React from "react";
import { Details } from "../details/Details";
import "./Application.scss";

export function Application() {
  return (
    <div className="Application">
      <div className="welcome">
        halo rul, mantab
      </div>
      <Details />
    </div>
  );
}

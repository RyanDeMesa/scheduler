import React from "react";
import { render, cleanup } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

describe("Appointment", () => {
  xit("renders without crashing", () => {
    render(<Application />);
  });
});

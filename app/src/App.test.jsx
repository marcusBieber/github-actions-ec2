import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react"; // Falls React nicht automatisch importiert wird
import App from "./App";

test("berechnet Addition korrekt", () => {
  render(<App />);

  const input1 = screen.getByPlaceholderText("Zahl 1");
  const input2 = screen.getByPlaceholderText("Zahl 2");
  const select = screen.getByRole("combobox");
  const button = screen.getByText("Berechnen");

  fireEvent.change(input1, { target: { value: "10" } });
  fireEvent.change(input2, { target: { value: "5" } });
  fireEvent.change(select, { target: { value: "+" } });
  fireEvent.click(button);

  expect(screen.getByText("Ergebnis: 15")).toBeInTheDocument();
});

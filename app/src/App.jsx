import { useState } from "react";
import React from "react";
import "./App.css";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("+");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
      setResult("Bitte gültige Zahlen eingeben.");
      return;
    }

    let res;
    switch (operation) {
      case "+":
        res = a + b;
        break;
      case "-":
        res = a - b;
        break;
      case "*":
        res = a * b;
        break;
      case "/":
        res = b !== 0 ? a / b : "Nicht durch 0 teilen!";
        break;
      default:
        res = "Ungültige Operation";
    }

    setResult(res);
  };

  return (
    <>
      <h1>Hallo von meiner App</h1>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Zahl 1"
        />
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Zahl 2"
        />
        <button onClick={calculate}>Berechnen</button>
      </div>
      {result !== null && <h2>Ergebnis: {result}</h2>}
    </>
  );
}

export default App;
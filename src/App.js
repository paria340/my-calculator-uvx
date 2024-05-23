import React, { useState } from "react";
import CalculatorWrapper from "./components/CalculatorWrapper";
import ResultCal from "./components/ResultCal";
import ButtonContainer from "./components/ButtonContainer";
import Button from "./components/Button";
import { evaluate } from 'mathjs';

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) => {
  if (typeof num === "string") num = Number(num);
  return num.toLocaleString("en-US");
};

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {
  const [calc, setCalc] = useState({
    sign: "",
    num: "",
    res: "",
  });

  const numClickHandler = (e) => {
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === "0" && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? "" : calc.res,
      });
    }
  };

  const commaClickHandler = (e) => {
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (e) => {
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: "",
    });
  };

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      try {
        const expression = `${removeSpaces(calc.res)} ${calc.sign === "X" ? "*" : calc.sign} ${removeSpaces(calc.num)}`;
        const result = evaluate(expression);
        setCalc({
          ...calc,
          res: toLocaleString(result),
          sign: "",
          num: "",
        });
      } catch (error) {
        setCalc({
          ...calc,
          res: "Error",
          sign: "",
          num: "",
        });
      }
    }
  };

  const invertClickHandler = () => {
    try {
      const invertedNum = evaluate(`${removeSpaces(calc.num)} * -1`);
      const invertedRes = evaluate(`${removeSpaces(calc.res)} * -1`);
      setCalc({
        ...calc,
        num: calc.num ? toLocaleString(invertedNum) : "",
        res: calc.res ? toLocaleString(invertedRes) : "",
      });
    } catch (error) {
      setCalc({
        ...calc,
        res: "Error",
        sign: "",
        num: "",
      });
    }
  };

  const percentClickHandler = () => {
    try {
      const percentNum = evaluate(`${removeSpaces(calc.num)} / 100`);
      const percentRes = evaluate(`${removeSpaces(calc.res)} / 100`);
      setCalc({
        ...calc,
        num: percentNum.toString(),
        res: percentRes.toString(),
        sign: "",
      });
    } catch (error) {
      setCalc({
        ...calc,
        res: "Error",
        sign: "",
        num: "",
      });
    }
  };

  const resetClickHandler = () => {
    setCalc({
      sign: "",
      num: "",
      res: "",
    });
  };

  return (
    <CalculatorWrapper>
      <ResultCal value={calc.num || calc.res || "0"} />
      <ButtonContainer>
        {btnValues.flat().map((btn, i) => (
          <Button
            key={i}
            className={btn === "=" ? "equals" : ""}
            value={btn}
            onClick={
              btn === "C"
                ? resetClickHandler
                : btn === "+-"
                ? invertClickHandler
                : btn === "%"
                ? percentClickHandler
                : btn === "="
                ? equalsClickHandler
                : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                ? signClickHandler
                : btn === "."
                ? commaClickHandler
                : numClickHandler
            }
          />
        ))}
      </ButtonContainer>
    </CalculatorWrapper>
  );
};
export default App;

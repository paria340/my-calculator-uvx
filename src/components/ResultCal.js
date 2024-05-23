import { Textfit } from "react-textfit";

const ResultCal = ({ value }) => {
  return (
    <Textfit className="resultCalc" mode="single" max={70}>
      {value}
    </Textfit>
  );
};

export default ResultCal;
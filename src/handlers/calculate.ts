import { evaluate } from "advanced-calculator";
import { cleanExpression } from "../helpers/cleanExpression";

const calculate = (expression: string) => {
  const cleanExp = cleanExpression(expression);
  const result   = evaluate(cleanExp);

  return parseFloat(result);
};

export default calculate;
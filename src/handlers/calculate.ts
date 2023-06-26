import { evaluate } from  "mathjs";
import { cleanExpression } from "../helpers/cleanExpression";

const calculate = (expression: string) => {
  const cleanExp = cleanExpression(expression);
  const result   = evaluate(cleanExp);

  return parseFloat(result);
};

export default calculate;
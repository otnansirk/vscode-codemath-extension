import { evaluate } from "mathjs";
import { cleanExpression } from "../helpers/cleanExpression";

const calculate = (expression: string) => {
  try {
    const cleanExp = cleanExpression(expression);
    const result = evaluate(cleanExp);

    return parseFloat(result);
  } catch (error) {
    console.log("❌ Failed to calculate expression:", expression);
    return null;
  }
};

export default calculate;
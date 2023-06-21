import { evaluate } from "advanced-calculator";

const calculate = (expression: string) => parseFloat(evaluate(expression));

export default calculate;
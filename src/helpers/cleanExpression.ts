/**
 *
 * @param expression
 * @returns string
 */
export const cleanExpression = (expression: string): string => {
  const regex = /^[^\dA-Za-z-\s]+/;
  return expression.trim().replace(regex, '');
};
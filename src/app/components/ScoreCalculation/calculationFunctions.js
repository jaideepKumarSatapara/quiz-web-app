export const CalculateScore = (responses) => {
  return responses.reduce((total, response) => total + response?.score, 0);
};

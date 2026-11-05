export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Banking & Finance AI Chatbot API is running successfully.",
  });
};

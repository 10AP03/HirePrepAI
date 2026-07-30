export const recruiterOnly = (req, res, next) => {
  if (req.user && req.user.role === "recruiter") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Recruiter only.",
  });
};
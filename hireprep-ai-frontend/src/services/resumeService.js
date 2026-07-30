import api from "./api";

// Upload Resume
export const uploadResume = async (formData) => {
  const response = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get Resume
export const getResume = async () => {
  const response = await api.get("/resume");

  return response.data;
};

// Analyze Resume
export const analyzeResume = async () => {
  const response = await api.post("/resume/analyze");

  return response.data;
};

// Update Resume
export const updateResume = async (formData) => {
  const response = await api.put("/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Delete Resume
export const deleteResume = async () => {
  const response = await api.delete("/resume");

  return response.data;
};
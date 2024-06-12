// controllers/upload.controller.js
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  // Handle the uploaded file as needed
  res.status(200).send({
    message: "File uploaded successfully",
    file: req.file,
  });
};

export default { uploadFile };

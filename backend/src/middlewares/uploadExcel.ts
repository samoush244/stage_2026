import multer from "multer";

const storage = multer.memoryStorage();

const uploadExcel = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers Excel .xls ou .xlsx sont autorisés."));
    }
  },
});

export default uploadExcel;
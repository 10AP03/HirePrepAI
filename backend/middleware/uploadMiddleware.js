
import multer from "multer";              // Multer is an Express middleware used to handle file uploads

const storage = multer.diskStorage({        // Configure Storage

  destination: (req, file, cb) =>             // Destination Folder
  {           
    
    cb(null, "uploads/");                     // Store all uploaded resumes inside the uploads folder
  },

  filename: (req, file, cb) =>                // File Name
  {              
   
    const uniqueFileName = Date.now() + "-" + file.originalname;       // This prevents two users from overwriting each other's files
    cb(null, uniqueFileName);
  }
});

const fileFilter = (req, file, cb) => {             // File Filter

  if (file.mimetype === "application/pdf")            // Only allow PDF files to be uploaded
  {                                                

    cb(null, true);                                   // Accept the file
  } 
  else 
  {

    cb(new Error("Only PDF files are allowed."), false);          // Reject the file
  }

};

const upload = multer({                                       // Combines storage configuration and file filtering

  storage,
  fileFilter,

  limits: 
  {
    fileSize: 5 * 1024 * 1024
  }
});

export default upload;                      // Export Upload Middleware
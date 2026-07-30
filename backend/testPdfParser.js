// Import our PDF extraction utility
import extractTextFromPDF from "./utils/pdfParser.js";

const filePath = "./uploads/1782973068957-Arth_Patel_Resume.pdf";           // Path of the actual PDF stored

const testPdfParser = async () => {
    
    try 
    {
        const extractedText = await extractTextFromPDF(filePath);           // Call our PDF parser utility
        console.log("===== EXTRACTED RESUME TEXT =====");                   // Print the extracted resume text
        console.log(extractedText);

    } 
    catch (error) 
    {    
        console.error("PDF PARSER TEST FAILED:");                           // Print the exact error if extraction fails
        console.error(error.message);
    }
};

testPdfParser();
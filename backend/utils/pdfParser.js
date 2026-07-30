import fs from "fs/promises";             // Reads a PDF file and Input: filePath -> path of the stored PDF
import { PDFParse } from "pdf-parse";     // Extracts readable plain text. Output: plain text extracted from the PDF

const extractTextFromPDF = async (filePath) => 
{
  let parser;

  try 
  {
      const pdfBuffer = await fs.readFile(filePath);            // readFile() returns the file data as a Buffer.
      parser = new PDFParse({                                   // pdf-parse understands the PDF structure.
        data: pdfBuffer,
      });

      const result = await parser.getText();                    // Extract readable text from the PDF.
      return result.text;                                       // Return only the extracted plain text.

  } 
  catch (error) 
  {
      throw new Error(`Failed to extract PDF text: ${error.message}`);      // throw the error to the function that called this utility.
  } 
  finally 
  {
      if (parser)                                           // Release resources used internally by the PDF parser.
      {
        await parser.destroy();
      }
  }
};

export default extractTextFromPDF;
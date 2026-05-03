import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Use CDN for the worker to avoid Vite bundler issues with pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const withTimeout = (promise, ms, errorMessage) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

const extractRawTextFallback = async (arrayBuffer) => {
  console.log("[pdfParser] Falling back to raw text extraction...");
  const textDecoder = new TextDecoder('utf-8');
  const rawText = textDecoder.decode(arrayBuffer);
  // Very naive extraction: strip out non-printable binary characters
  const readableText = rawText.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim();
  console.log(`[pdfParser] Raw text fallback extracted ${readableText.length} characters.`);
  return readableText.substring(0, 5000); // Truncate to avoid massive garbage strings
};

export const extractTextFromPdf = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    console.log("[pdfParser] Starting robust PDF extraction process...");
    
    // Set an absolute upper bound of 60 seconds for the entire process
    const globalTimeoutId = setTimeout(() => {
      console.error("[pdfParser] Global PDF parsing timed out after 60 seconds.");
      reject(new Error("PDF parsing timed out after 60 seconds. The file is too complex."));
    }, 60000);

    const reader = new FileReader();
    
    reader.onload = async function() {
      const arrayBuffer = this.result;
      
      try {
        console.log("[pdfParser] FileReader successfully read file.");
        if (onProgress) onProgress("Parsing PDF structure...");
        
        console.log("[pdfParser] Getting document with pdfjsLib...");
        // Pass ArrayBuffer directly to getDocument
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await withTimeout(loadingTask.promise, 15000, "pdf.js getDocument timed out after 15s");
        console.log(`[pdfParser] Loaded PDF. Num pages: ${pdf.numPages}`);
        
        let fullText = '';
        
        // First pass: Try native text extraction with 10s timeout per page
        for (let i = 1; i <= pdf.numPages; i++) {
          if (onProgress) onProgress(`Extracting native text: Page ${i} / ${pdf.numPages}...`);
          try {
            console.log(`[pdfParser] Getting page ${i}...`);
            const page = await withTimeout(pdf.getPage(i), 10000, `getPage timed out for page ${i}`);
            
            console.log(`[pdfParser] Getting text content for page ${i}...`);
            const textContent = await withTimeout(page.getTextContent(), 10000, `getTextContent timed out for page ${i}`);
            
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          } catch (pageError) {
            console.warn(`[pdfParser] Skipping page ${i} due to error:`, pageError.message);
          }
        }
        
        // If we extracted a reasonable amount of text, return it immediately
        if (fullText.trim().length > 50) {
          console.log("[pdfParser] Successfully extracted native text.");
          clearTimeout(globalTimeoutId);
          return resolve(fullText);
        }
        
        // Otherwise, assume it's a scanned PDF and run OCR
        console.log("[pdfParser] Native text empty. Falling back to OCR...");
        if (onProgress) onProgress("Scanned PDF detected. Preparing OCR...");
        fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            console.log(`[pdfParser] Rendering page ${i} to canvas...`);
            const page = await withTimeout(pdf.getPage(i), 10000, `getPage timed out for page ${i} during OCR phase`);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            
            if (onProgress) onProgress(`Rendering Page ${i} for OCR...`);
            await withTimeout(page.render(renderContext).promise, 10000, `page.render timed out for page ${i}`);
            
            const imageData = canvas.toDataURL('image/jpeg');
            
            console.log(`[pdfParser] Running Tesseract OCR on page ${i}...`);
            // Run Tesseract OCR on the canvas image, limit to 15s per page
            const recognizePromise = Tesseract.recognize(
              imageData,
              'eng',
              { 
                logger: m => {
                  if(m.status === 'recognizing text' && onProgress) {
                     onProgress(`OCR Page ${i}: ${Math.round(m.progress * 100)}%`);
                  }
                } 
              }
            );
            
            const { data: { text } } = await withTimeout(recognizePromise, 15000, `Tesseract OCR timed out for page ${i}`);
            fullText += text + '\n\n';
          } catch (ocrError) {
            console.warn(`[pdfParser] Skipping OCR for page ${i} due to error:`, ocrError.message);
          }
        }
        
        if (fullText.trim().length === 0) {
            throw new Error("OCR could not extract any text from the document.");
        }

        console.log("[pdfParser] OCR extraction complete.");
        clearTimeout(globalTimeoutId);
        resolve(fullText);
        
      } catch (error) {
        console.error("[pdfParser] Error during pdf.js extraction. Attempting raw text fallback.", error);
        try {
          const rawText = await extractRawTextFallback(arrayBuffer);
          if (rawText.trim().length > 50) {
            console.log("[pdfParser] Raw fallback succeeded.");
            clearTimeout(globalTimeoutId);
            return resolve(rawText);
          } else {
             throw new Error("Raw text fallback yielded empty data.");
          }
        } catch (rawError) {
          console.error("[pdfParser] Raw fallback also failed:", rawError);
          clearTimeout(globalTimeoutId);
          reject(new Error("Failed to read the PDF file completely."));
        }
      }
    };
    
    reader.onerror = () => {
      console.error("[pdfParser] FileReader encountered an error.");
      clearTimeout(globalTimeoutId);
      reject(new Error("Failed to read the file with FileReader."));
    };
    
    console.log("[pdfParser] Starting to read file as ArrayBuffer...");
    reader.readAsArrayBuffer(file);
  });
};

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    let fullText = '';
    const maxPages = Math.min(pdfDoc.numPages, 20); // Process up to first 20 pages for speed

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as Array<{ str?: string }>)
        .map((item) => item.str || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (pageText) {
        fullText += `${pageText}\n\n`;
      }
    }

    return fullText.trim();
  } catch (err: unknown) {
    console.error("PDF parsing failed:", err);
    const message = err instanceof Error ? err.message : "Unable to parse PDF text. Please copy and paste the text directly into the input box.";
    throw new Error(message);
  }
}

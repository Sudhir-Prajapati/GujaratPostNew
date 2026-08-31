export interface GeneratePdfProgress {
  currentPage: number;
  totalPages: number;
  stage: 'rendering' | 'compiling' | 'completed' | 'error';
  message: string;
}

/**
 * Converts an array of HTML elements representing broadsheet newspaper pages into a multi-page PDF Blob & File.
 * Also extracts the first page image as a high-quality JPEG data URL for thumbnail display.
 */
export async function generateEPaperPdfFromElements(
  elements: HTMLElement[],
  fileName: string = 'gujarat_post_epaper.pdf',
  onProgress?: (progress: GeneratePdfProgress) => void
): Promise<{ pdfBlob: Blob; pdfFile: File; firstPageThumbnail: string }> {
  if (!elements || elements.length === 0) {
    throw new Error('No page elements provided for PDF generation.');
  }

  // Dynamic import on-demand so jspdf and html2canvas do not consume memory during initial load or dev compilation
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const totalPages = elements.length;
  // Standard A4 portrait in mm: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  let firstPageThumbnail = '';

  for (let i = 0; i < totalPages; i++) {
    const el = elements[i];
    if (!el) continue;

    if (onProgress) {
      onProgress({
        currentPage: i + 1,
        totalPages,
        stage: 'rendering',
        message: `Rendering Page ${i + 1} of ${totalPages}... (પેજ ${i + 1} પ્રોસેસિંગ)`,
      });
    }

    // Capture DOM element to high-res canvas (2x DPI scale for crisp text)
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: el.scrollWidth || 794,
      windowHeight: el.scrollHeight || 1123,
      onclone: (clonedDoc: Document) => {
        // Strip or convert any oklch(...) colors in cloned styles so html2canvas doesn't fail
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((tag) => {
          if (tag.textContent && tag.textContent.includes('oklch')) {
            tag.textContent = tag.textContent.replace(/oklch\([^)]+\)/gi, '#1e293b');
          }
        });

        // Also clean any inline styles
        const elementsWithStyle = clonedDoc.querySelectorAll('[style]');
        elementsWithStyle.forEach((node) => {
          const htmlNode = node as HTMLElement;
          const styleAttr = htmlNode.getAttribute('style') || '';
          if (styleAttr.includes('oklch')) {
            htmlNode.setAttribute('style', styleAttr.replace(/oklch\([^)]+\)/gi, '#1e293b'));
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i === 0) {
      firstPageThumbnail = imgData;
    }

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress({
      currentPage: totalPages,
      totalPages,
      stage: 'compiling',
      message: 'Compiling PDF document... (PDF ફાઇલ તૈયાર થઈ રહી છે)',
    });
  }

  const pdfBlob = pdf.output('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  if (onProgress) {
    onProgress({
      currentPage: totalPages,
      totalPages,
      stage: 'completed',
      message: 'PDF Generated successfully! (PDF તૈયાર છે)',
    });
  }

  return {
    pdfBlob,
    pdfFile,
    firstPageThumbnail,
  };
}

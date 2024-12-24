import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';

const COLOR_PALETTE = {
  PRIMARY: '#1E40AF',
  SECONDARY: '#4B5563',
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#4F5563',
  ACCENT: '#3B82F6',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F3F4F6'
};

interface Section {
  title: string;
  content: string;
}

export const exportToPDF = async (sections: Section[]) => {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });

  // Page setup
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = {
    top: 25,
    right: 20,
    bottom: 25,
    left: 20
  };
  let yPosition = margin.top;

  // Add title page
  pdf.setFillColor(COLOR_PALETTE.PRIMARY);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(COLOR_PALETTE.WHITE);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('Documentation', pageWidth / 2, pageHeight / 3, { align: 'center' });
  
  pdf.setFontSize(12);
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.text(date, pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });

  // Start content on new page
  pdf.addPage();
  yPosition = margin.top;

  // Process each section
  sections.forEach((section, index) => {
    // Check if we need a new page before the section
    if (yPosition > pageHeight - margin.bottom - 40) {
      pdf.addPage();
      yPosition = margin.top;
    }

    // Section title with accent line
    pdf.setDrawColor(COLOR_PALETTE.ACCENT);
    pdf.setLineWidth(0.5);
    pdf.line(margin.left, yPosition - 5, pageWidth - margin.right, yPosition - 5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(COLOR_PALETTE.TEXT_PRIMARY);
    pdf.text(section.title, margin.left, yPosition);
    yPosition += 15;

    // Process content
    const sanitizedContent = DOMPurify.sanitize(section.content);
    const plainContent = sanitizedContent
      .replace(/[^\x20-\x7E]/g, '') // Remove special characters
      .replace(/#+\s/g, '')         // Remove markdown headers
      .replace(/\*\*/g, '')         // Remove bold markers
      .replace(/\*/g, '')           // Remove italic markers
      .trim();

    // Content styling
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(COLOR_PALETTE.TEXT_SECONDARY);

    // Split content into paragraphs and handle them separately
    const paragraphs = plainContent.split('\n\n');
    
    paragraphs.forEach(paragraph => {
      if (yPosition > pageHeight - margin.bottom - 20) {
        pdf.addPage();
        yPosition = margin.top;
      }

      const lines = pdf.splitTextToSize(
        paragraph,
        pageWidth - (margin.left + margin.right)
      );

      lines.forEach(line => {
        if (yPosition > pageHeight - margin.bottom - 10) {
          pdf.addPage();
          yPosition = margin.top;
        }
        pdf.text(line, margin.left, yPosition);
        yPosition += 6;
      });

      yPosition += 8; // Add space between paragraphs
    });

    // Add extra space after section
    yPosition += 15;

    // Add page number
    const pageNumber = pdf.internal.pages.length;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(COLOR_PALETTE.TEXT_SECONDARY);
    pdf.text(
      `Page ${pageNumber}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  });

  // Save the PDF
  const filename = `documentation_${uuidv4()}.pdf`;
  pdf.save(filename);
  return filename;
};

export const exportToMarkdown = (sections: Section[]) => {
  try {
    const content = sections
      .map(section => `# ${section.title}\n\n${section.content}\n\n---\n\n`)
      .join('');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documentation_${uuidv4()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Markdown Export Failed:', error);
    throw error;
  }
};
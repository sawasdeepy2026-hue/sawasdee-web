const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function run() {
  const pdfPath = path.join(process.cwd(), 'sawasdee_menu.pdf');
  console.log('Leyendo PDF:', pdfPath);
  const dataBuffer = fs.readFileSync(pdfPath);
  const uint8Array = new Uint8Array(dataBuffer);

  const parser = new pdf.PDFParse(uint8Array);
  await parser.load();
  console.log('¡PDF cargado!');
  
  const textObj = await parser.getText();
  console.log('Total páginas:', textObj.total);
  
  // Gather text from all pages
  let fullText = '';
  for (let i = 1; i <= textObj.total; i++) {
    try {
      const pageText = await textObj.getPageText(i);
      if (pageText && typeof pageText === 'string') {
        fullText += `\n\n--- PÁGINA ${i} ---\n${pageText}`;
      }
    } catch(e) {
      console.log(`Error en página ${i}:`, e.message);
    }
  }
  
  if (fullText.trim().length > 0) {
    fs.writeFileSync('menu_full_text.txt', fullText);
    console.log('¡Texto completo guardado en menu_full_text.txt! Longitud:', fullText.length);
  } else {
    console.log('El PDF no tiene texto extraíble (es un PDF de imágenes escaneadas).');
  }

  parser.destroy();
}

run().catch(console.error);

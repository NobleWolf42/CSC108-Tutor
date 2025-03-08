from PyPDF2 import PdfReader
import os

def pdfToText(pdfPath):
    text = ""
    with open(pdfPath, 'rb') as file:
        reader = PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

folder_path = os.path.join(os.path.dirname(__file__), "pdf")
    
for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)
    if os.path.isfile(file_path):
        #Process each file
        print(f"Processing file: {filename}")
        try:
            f = open(filename.replace(".pdf", ".txt"), "w", encoding="utf-8")
            f.write(pdfToText(file_path).replace("Isabel Thies", ""))
            #print(file_path)
            f.close()
        except Exception as e:
            print(e)
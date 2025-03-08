 from PyPDF2 import PdfReader

    def pdf_to_text_pypdf2(pdf_path):
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or ""
        return text

    pdf_path = 'your_pdf_file.pdf'
    text_content = pdf_to_text_pypdf2(pdf_path)
    print(text_content)

    # Optionally, save to a text file:
    # with open('output.txt', 'w', encoding='utf-8') as outfile:
    #     outfile.write(text_content)

    folderPath = os.path.join(os.path.dirname(__file__), "data")
    
    for filename in os.listdir(folderPath):
        filePath = os.path.join(folderPath, filename)
        if os.path.isfile(filePath):
            #Process each file
            docIds.append(filename.replace(".txt", ""))
            try:
                f = open(filePath, "r", encoding="utf-8")
                documents.append(f.read())
                f.close()
            except Exception as e:
                print(e)
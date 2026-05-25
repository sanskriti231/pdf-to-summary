import fitz
import sys

doc = fitz.open(f"{sys.argv[1]}")
i = 0
for page in doc:
    print(i, end =":")
    text = page.get_text()
    print(text)
    i += 1
print(len(doc))
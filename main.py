import fitz
import sys
import re
from summarizer import generate_summary
import textwrap

def remove_citations(text):
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\(\w+ et al\., \d{4}\)", "", text)
    return text

def chunk_text(text, chunk_size=1000):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i+chunk_size]))
    return chunks

doc = fitz.open(f"{sys.argv[1]}")

text = ""
for page in doc:
    text += page.get_text()

text = " ".join(text.split())
text = remove_citations(text)
chunks = chunk_text(text, 240)

summary = generate_summary(chunks)
final_summary = "\n".join(summary)
formatted = textwrap.fill(final_summary, width=100)
formatted = formatted.capitalize()

with open("final_summary.txt", "w", encoding="utf-8") as file:
    file.write(formatted)

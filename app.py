import os
import sys
import re
import textwrap
import fitz
from flask import Flask, render_template, request, jsonify, send_file, url_for
from werkzeug.utils import secure_filename
from summarizer import generate_summary

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def remove_citations(text):
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\(\w+ et al\., \d{4}\)", "", text)
    return text


def chunk_text(text, chunk_size=1000):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i + chunk_size]))
    return chunks


def extract_pdf_text(pdf_path):
    """Extract text from PDF and return both full text and per-page texts."""
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        pages_text = []
        for page in doc:
            page_text = page.get_text()
            pages_text.append(page_text)
            full_text += page_text
        doc.close()
        return full_text, pages_text
    except Exception as e:
        return "", []


def get_pdf_page_count(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        count = len(doc)
        doc.close()
        return count
    except Exception:
        return 0


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        page_count = get_pdf_page_count(filepath)
        if page_count == 0:
            os.remove(filepath)
            return jsonify({'error': 'Invalid PDF file. Please upload a valid PDF.'}), 400

        file_size = os.path.getsize(filepath)

        return jsonify({
            'success': True,
            'filename': filename,
            'filepath': filepath,
            'page_count': page_count,
            'file_size': file_size
        })

    return jsonify({'error': 'Invalid file type. Only PDF allowed.'}), 400


@app.route('/preview/<filename>')
def preview_pdf(filename):
    """Serve PDF pages as images for preview."""
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    return send_file(filepath, mimetype='application/pdf')


@app.route('/process', methods=['POST'])
def process_pdf():
    data = request.get_json()
    filename = data.get('filename')

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    try:
        full_text, pages_text = extract_pdf_text(filepath)

        if not full_text.strip():
            return jsonify({'error': 'Could not extract text from PDF. The file may be scanned images or corrupted.'}), 400

        original_word_count = len(full_text.split())
        original_char_count = len(full_text)

        cleaned_text = remove_citations(full_text)
        cleaned_text = " ".join(cleaned_text.split())
        chunks = chunk_text(cleaned_text, 240)

        summary_parts = generate_summary(chunks)
        final_summary = "\n".join(summary_parts)
        formatted = textwrap.fill(final_summary, width=100)
        formatted = formatted.capitalize()

        summary_filename = filename.rsplit('.', 1)[0] + '_summary.txt'
        summary_path = os.path.join(app.config['UPLOAD_FOLDER'], summary_filename)
        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(formatted)

        summary_word_count = len(formatted.split())

        return jsonify({
            'success': True,
            'summary': formatted,
            'summary_filename': summary_filename,
            'original_word_count': original_word_count,
            'original_char_count': original_char_count,
            'summary_word_count': summary_word_count,
            'chunks_processed': len(chunks),
            'page_count': len(pages_text)
        })

    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500


@app.route('/download/<filename>')
def download_summary(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    return send_file(filepath, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
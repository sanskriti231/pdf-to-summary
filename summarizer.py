from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="t5-small"
)

def generate_summary(chunks):
    summaries = []
    for chunk in chunks:
        s = summarizer(
            chunk,
            max_length=120,
            min_length=40,
            do_sample=False
        )
        
        summaries.append(s[0]['summary_text'])
    return summaries
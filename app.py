import streamlit as st
from transformers import pipeline

# Load model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

st.title("AI Text Summarizer 📝")
st.write("Paste text below and get a short summary using AI.")

# Input text
input_text = st.text_area("Enter your text here", height=200)

if st.button("Summarize"):
    if input_text:
        summary = summarizer(input_text, max_length=100, min_length=30, do_sample=False)
        st.subheader("Summary:")
        st.write(summary[0]['summary_text'])
    else:
        st.warning("Please enter some text.")

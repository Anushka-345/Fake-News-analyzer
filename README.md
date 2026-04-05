# 📰 Fake News Analyzer

![Python](https://img.shields.io/badge/python-3.11-blue)
![Flask](https://img.shields.io/badge/flask-2.3-green)
![HTML](https://img.shields.io/badge/html-5-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 🌟 Overview
**Fake News Analyzer** is an AI-powered tool that detects misinformation in news articles, blogs, and social media posts. Using **Natural Language Processing (NLP)** and **Machine Learning (ML)**, it classifies content as **Real ✅** or **Fake ❌**, provides a confidence score, highlights suspicious keywords, and evaluates source credibility.  

Ideal for journalists, researchers, educators, and anyone who wants to verify online content.

---

## ✨ Key Features

### 🤖 AI-Powered Fact-Checking
- Integrates **Gemini 3 Flash** with **Google Search Grounding**  
- Verifies claims against **real-time web data**  

### 🖼️ Multimodal Analysis
- Supports **text and image analysis**  
- Detects **deepfakes**, misleading visuals, and contextual inconsistencies  

### 📊 Bias & Sentiment Profiling
- Visualizes **partisan bias**, **emotional intensity**, and **clickbait likelihood**  
- Uses **Radar and Pie charts** via **Recharts**  

### 🌐 Source Credibility Scoring
- Evaluates reliability based on **domain authority** and **historical transparency**  
- Provides a **trustworthiness score**  

### 🖥️ Modern, High-Performance UI
- Sleek **dark-themed interface** with **Tailwind CSS**, **Lucide React icons**, and **Framer Motion**  
- Smooth animations and transitions  

### ⚙️ Technical Highlights
- **Gemini Integration:** Structured JSON for credibility scores, sentiment, and fact-checks  
- **Responsive Design:** Optimized for desktop and mobile  
- **Real-Time Feedback:** Instant analysis with loading states and error handling  

---

## 🖥️ Frontend
- HTML + CSS + JavaScript  
- Dark-themed responsive interface  
- Paste text → Click analyze → See prediction & confidence  
- Highlights suspicious keywords  

---

## ⚙️ Backend
- Python + Flask REST API  
- TF-IDF + Logistic Regression ML model  
- Optional MongoDB for source credibility and user feedback  
- Receives text from frontend → transforms → predicts → returns JSON results  

---

## 🧩 How It Works
1. ✍️ User enters text in frontend  
2. 🔗 Frontend sends request to backend API  
3. 🧮 Backend converts text using TF-IDF  
4. 🤖 Logistic Regression predicts Real ✅ or Fake ❌  
5. 📤 Backend returns prediction, confidence score, and optional keyword highlights  
6. 🖥️ Frontend displays results in a user-friendly interface  

---

## 🌍 Impact
- 🛡️ **Combat misinformation** on social media  
- 🎓 **Educates users** about suspicious content  
- 📰 **Supports journalists** and researchers  
- ⚡ **Scalable & extendable** for real-time analysis  

---

## 🚀 Future Enhancements
- 🌎 Multi-language support  
- 🖼️ AI-powered image analysis for deepfakes  
- 🖥️ Browser extension for live scanning  
- 🌐 Community-driven fact-checking platform  

---

## 💻 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/fake-news-analyzer.git
cd fake-news-analyzer


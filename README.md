# 🌱 Plant Disease Detection using Deep Learning

A deep learning project that detects plant diseases using Convolutional Neural Networks (CNNs), providing real-time geolocation-based insights and yield prediction for precision agriculture.

---

## 🚀 Features

- 🔍 **Disease Detection**: Classifies plant leaf images into healthy or diseased classes using a custom CNN model.
- 🌍 **Geolocation-Based Analysis**: Integrates geospatial data to tailor insights based on the user's region.
- 📈 **Yield Prediction**: Predicts potential crop yield using historical and real-time weather data.
- 🧠 **Custom CNN Architecture**: Trained for high accuracy (94%) on crop disease datasets.
- 📊 **Streamlit Web App**: Easy-to-use frontend for uploading leaf images and visualizing results.

---

## 🛠️ Tech Stack

| Area             | Tools / Frameworks                          |
|------------------|----------------------------------------------|
| Language         | Python                                       |
| Deep Learning    | TensorFlow, Keras                            |
| Data Analysis    | Pandas, NumPy, Matplotlib                    |
| Frontend         | Streamlit                                    |
| Geolocation      | Geopy, Geopandas (optional)                  |
| Model Handling   | OpenCV, PIL                                  |



## 📂 Project Structure
Plant-Disease-Detection/
│
├── model/
│ ├── disease_model.h5 # Trained CNN model
│ ├── yield_model.pkl # (Optional) Yield prediction model
│
├── data/
│ ├── PlantVillage/ # Dataset used for training
│
├── app/
│ └── streamlit_app.py # Streamlit web application
│
├── notebooks/
│ ├── disease_detection.ipynb # Jupyter notebook for training CNN
│ └── yield_prediction.ipynb # Notebook for crop yield model
│
├── requirements.txt
└── README.md

---

## 🧠 Model Performance

| Task              | Accuracy | Tools Used   |
|-------------------|----------|--------------|
| Disease Detection | 94%      | Custom CNN + TensorFlow |
| Yield Prediction  | 90%      | Linear Regression + Weather Data |

---
## 📦 Setup Instructions
### 🔧 Prerequisites

- Python 3.7+
- pip or conda


### 🔌 Installation

git clone https://github.com/2003Harshit/Plant-Disease-Detection.git
cd Plant-Disease-Detection
pip install -r requirements.txt

▶️ Run the App
cd app
streamlit run streamlit_app.py

📚 Dataset
PlantVillage Dataset

Preprocessed and augmented for higher accuracy and generalization.

📈 Results
Disease classification using leaf image
Real-time yield prediction with geolocation
User-friendly interface with upload + results

📄 Publication
Effectiveness of Depthwise Separable CNNs for Disease Identification among Various Crops
📅 IEEE RMKMATE’25 Conference Proceedings – 2025
🔗 Read on IEEE Xplore

👨‍💻 Author
Harshit Aggarwal
📧 harshitaggarwal597@gmail.com
🔗 LinkedIn
🔗 GitHub







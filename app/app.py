import os
import json
import numpy as np
import tensorflow as tf
import streamlit as st
from PIL import Image

# Corrected relative paths
MODEL_PATH = "trained_model/plant_disease_prediction_model.h5"  
CLASS_INDICES_PATH = "trained_model/class_indices.json"  # Updated path

# Debugging info
st.write(f"📂 Current working directory: {os.getcwd()}")

# Check if model file exists
if not os.path.exists(MODEL_PATH):
    st.error(f"❌ Error: Model file not found at '{MODEL_PATH}'. Check the path and try again.")
    st.stop()

# Load the trained model
try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    st.error(f"❌ Model loading error: {e}")
    st.stop()

# Check if class indices file exists
if not os.path.exists(CLASS_INDICES_PATH):
    st.error(f"❌ Error: Class indices file not found at '{CLASS_INDICES_PATH}'. Check the path and try again.")
    st.stop()

# Load class indices
with open(CLASS_INDICES_PATH, "r") as f:
    class_indices = json.load(f)

# Reverse the class index mapping
index_to_class = {v: k for k, v in class_indices.items()}

# Function to preprocess the image
def load_and_preprocess_image(image):
    img = image.resize((224, 224))  # Resize image
    img_array = np.array(img) / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Function to predict the class
def predict_image_class(image):
    preprocessed_img = load_and_preprocess_image(image)
    predictions = model.predict(preprocessed_img)
    predicted_class_index = np.argmax(predictions, axis=1)[0]

    # Get the correct class name
    predicted_class_name = index_to_class.get(predicted_class_index, "Unknown")

    return predicted_class_name

# Streamlit UI
st.title("🌿 Plant Disease Classifier")

uploaded_image = st.file_uploader("Upload a leaf image...", type=["jpg", "jpeg", "png"])

if uploaded_image:
    image = Image.open(uploaded_image)
    col1, col2 = st.columns(2)

    with col1:
        st.image(image.resize((150, 150)), caption="Uploaded Image", use_column_width=True)

    with col2:
        if st.button("Classify"):
            prediction = predict_image_class(image)
            st.success(f"✅ Prediction: {prediction}")

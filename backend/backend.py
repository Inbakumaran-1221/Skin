import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from torchvision import transforms
import io
import pandas as pd
from transformers import AutoImageProcessor, Dinov2ForImageClassification
import os

# ====== Config ======
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "skin_condition.csv")
MODEL_PATH = os.path.join(BASE_DIR, "..", "skin_model.pth")  

df = pd.read_csv(CSV_PATH)
CLASS_NAMES = [
    'Basal Cell Carcinoma', 'Darier_s Disease', 'Epidermolysis Bullosa Pruriginosa',
    'Hailey-Hailey Disease', 'Herpes Simplex', 'Impetigo', 'Larva Migrans',
    'Leprosy Borderline', 'Leprosy Lepromatous', 'Leprosy Tuberculoid', 'Lichen Planus',
    'Lupus Erythematosus Chronicus Discoides', 'Melanoma', 'Molluscum Contagiosum',
    'Mycosis Fungoides', 'Neurofibromatosis', 'Papilomatosis Confluentes And Reticulate',
    'Pediculosis Capitis', 'Pityriasis Rosea', 'Porokeratosis Actinic', 'Psoriasis',
    'Tinea Corporis', 'Tinea Nigra', 'Tungiasis', 'actinic keratosis',
    'dermatofibroma', 'nevus', 'pigmented benign keratosis',
    'seborrheic keratosis', 'squamous cell carcinoma', 'vascular lesion'
]  # List all 31 class names in order

# ====== Flask App ======
app = Flask(__name__)
CORS(app)

# ====== Model Loading ======
def load_model():
    processor = AutoImageProcessor.from_pretrained("facebook/dinov2-base")
    model = Dinov2ForImageClassification.from_pretrained(
        "facebook/dinov2-base",
        num_labels=31  # Set this to the number of classes in your checkpoint
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device("cpu")))
    model.eval()
    return processor, model

processor, model = load_model()

# ====== Prediction Route ======
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    try:
        image = Image.open(file.stream).convert("RGB")
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            conf, pred = torch.max(probs, 1)
            idx = pred.item()
            # Get info from CSV
            row = df.iloc[idx]
            return jsonify({
                "class_name": row["ClassName"],           # <-- This is the class name
                "label": row["Diagnosis"],                # <-- This is the diagnosis/description
                "confidence": conf.item(),
                "description": row["Description"],
                "treatment": row["Treatment_Medication"],
                "recommendation": row["Recommendation"]
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ====== Main ======
if __name__ == "__main__":
    app.run(debug=True)

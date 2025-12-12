from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import uvicorn

# Initialize App
app = FastAPI()

# CORS Configuration - Allow All for Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class CropData(BaseModel):
    state: str
    district: str
    rainfall: float
    groundwater: float
    crop_history: str

# Global Variables
model = None
crop_encoder = None

def train_model():
    """Trains a Random Forest model on synthetic data."""
    global model, crop_encoder
    
    # Synthetic Dataset
    data = {
        'rainfall': [1200, 800, 300, 450, 1100, 600, 200, 950, 400, 1500, 100, 700, 150, 250, 600, 350, 400, 500, 2000, 800, 700, 300, 500, 550, 600, 1200, 300, 400, 450, 500],
        # Updated to represent Recharge (BCM) - Higher is better/Lower Risk
        # High rainfall + High recharge -> Low Risk
        # Low rainfall + Low recharge -> High Risk
        'groundwater': [20, 15, 2, 5, 25, 10, 1, 18, 4, 30, 0.5, 12, 3, 8, 12, 4, 5, 8, 25, 12, 10, 3, 7, 9, 8, 20, 4, 6, 7, 8], 
        'crop_history': ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Rice', 'Maize', 'Sugarcane', 'Wheat', 'Cotton', 'Rice', 'Sugarcane', 'Pulses', 'Mustard', 'Watermelon', 'Cucumber', 'Jowar', 'Bajra', 'Ragi', 'Banana', 'Soybean', 'Groundnut', 'Barley', 'Potato', 'Tomato', 'Onion', 'Orange', 'Muskmelon', 'Pumpkin', 'Bitter Gourd', 'Okra'],
        'risk_level': ['Low', 'Medium', 'High', 'High', 'Low', 'Medium', 'High', 'Low', 'High', 'Low', 'High', 'Medium', 'Low', 'Medium', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Medium', 'Medium', 'Medium', 'Low', 'Medium', 'Low', 'Low', 'Low']
    }
    
    df = pd.DataFrame(data)
    
    # Encode Crop
    crop_encoder = LabelEncoder()
    df['crop_encoded'] = crop_encoder.fit_transform(df['crop_history'])
    
    # Features
    X = df[['rainfall', 'groundwater', 'crop_encoded']]
    y = df['risk_level']
    
    # Train
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    print("✅ ML Model Trained Successfully")

# Initialize Model
train_model()

def get_schemes(risk_level):
    """Returns relevant government schemes based on risk level."""
    all_schemes = [
        {
            "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "description": "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
            "link": "https://pmfby.gov.in/",
            "tags": ["Insurance", "High Priority"]
        },
        {
            "name": "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
            "description": "Focuses on extending the coverage of irrigation and improving water use efficiency.",
            "link": "https://pmksy.gov.in/",
            "tags": ["Irrigation", "Water"]
        },
        {
            "name": "Soil Health Card Scheme",
            "description": "Helps farmers adjust the amount of fertilizer they use for their crops (Soil Test Based).",
            "link": "https://soilhealth.dac.gov.in/",
            "tags": ["Soil Health", "Fertilizer"]
        },
        {
            "name": "Kisan Credit Card (KCC)",
            "description": "Provides farmers with timely access to credit (loans) for agricultural purposes.",
            "link": "https://www.myscheme.gov.in/schemes/kcc",
            "tags": ["Credit", "Loan"]
        }
    ]
    
    if risk_level == "High":
        return [all_schemes[0], all_schemes[1], all_schemes[3]] # PMFBY, PMKSY, KCC
    elif risk_level == "Medium":
        return [all_schemes[1], all_schemes[2], all_schemes[0]] # PMKSY, Soil, PMFBY
    else:
        return [all_schemes[2], all_schemes[3]] # Soil, KCC


@app.get("/")
def read_root():
    return {"status": "active", "message": "AI Water Scarcity API (Port 8001)"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/predict")
def predict_risk(data: CropData):
    global model, crop_encoder
    
    if not model:
        return {"error": "Model not initialized"}
        
    try:
        # Encode Crop (Handle unknown)
        if data.crop_history in crop_encoder.classes_:
            crop_val = crop_encoder.transform([data.crop_history])[0]
        else:
            crop_val = 0 # Default fallback
            
        # Create Feature Vector
        features = pd.DataFrame([[data.rainfall, data.groundwater, crop_val]], 
                              columns=['rainfall', 'groundwater', 'crop_encoded'])
        
        # Predict
        risk_level = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        class_probs = dict(zip(model.classes_, probabilities))
        
        # Calculate failure probability
        fail_prob = (class_probs.get('High', 0) * 1.0 + class_probs.get('Medium', 0) * 0.5) * 100
        
        # Generate Suggestions
        suggestions = []
        if risk_level == "High":
            suggestions = ["Switch to Millets", "Install Drip Irrigation", "Apply for Crop Insurance"]
        elif risk_level == "Medium":
            suggestions = ["Monitor Moisture", "Apply Mulching", "Use Drought-Resistant Seeds"]
        else:
            suggestions = ["Conditions Favorable", "Continue Standard Cycle", "Optimize Fertilizers"]

        return {
            "risk_level": risk_level,
            "probability_of_failure": round(fail_prob, 1),
            "suggestions": suggestions,
            "schemes": get_schemes(risk_level)
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e), "risk_level": "Unknown", "probability_of_failure": 0, "suggestions": []}

if __name__ == "__main__":
    print("🚀 Starting Server on Port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)

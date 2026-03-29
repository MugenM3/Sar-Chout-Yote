"""
diseases.py
-----------
Complete PlantVillage disease database.
Contains all 38 disease classes with symptoms, solutions, prevention, and severity.
"""

# Full disease database — keys match PlantVillage folder names / class indices
DISEASE_DATABASE = {
    "Apple___Apple_scab": {
        "disease_name": "Apple Scab",
        "affected_crop": "Apple",
        "symptoms": "Olive-green to brown scab-like spots on leaves and fruit. Leaves may yellow and drop early.",
        "solution": "Apply fungicides (Captan, Mancozeb) at bud break. Remove and destroy infected leaves.",
        "prevention": "Plant resistant varieties. Rake and destroy fallen leaves. Prune for good air circulation.",
        "severity": "Medium"
    },
    "Apple___Black_rot": {
        "disease_name": "Apple Black Rot",
        "affected_crop": "Apple",
        "symptoms": "Purple spots on leaves, brown/black rotting rings on fruit, cankers on branches.",
        "solution": "Remove infected fruit. Apply copper-based fungicides. Prune dead/cankered branches.",
        "prevention": "Remove mummified fruit. Maintain proper fertilization. Prune for air flow.",
        "severity": "High"
    },
    "Apple___Cedar_apple_rust": {
        "disease_name": "Cedar Apple Rust",
        "affected_crop": "Apple",
        "symptoms": "Bright orange-yellow spots on upper leaf surfaces, tube-like structures on undersides.",
        "solution": "Apply fungicides (Myclobutanil) during bloom. Remove nearby Eastern red cedar trees if possible.",
        "prevention": "Plant rust-resistant apple varieties. Remove galls from cedar trees in spring.",
        "severity": "Medium"
    },
    "Apple___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Apple",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "solution": "No treatment required. Continue regular maintenance.",
        "prevention": "Maintain balanced fertilization, proper irrigation, and regular scouting.",
        "severity": "None"
    },
    "Blueberry___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Blueberry",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "solution": "No treatment required.",
        "prevention": "Maintain soil pH 4.5–5.5, ensure proper drainage, and scout regularly.",
        "severity": "None"
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "disease_name": "Cherry Powdery Mildew",
        "affected_crop": "Cherry",
        "symptoms": "White powdery coating on young leaves, shoots, and fruit. Leaves curl and distort.",
        "solution": "Apply sulfur-based or systemic fungicides (Myclobutanil). Remove infected shoots.",
        "prevention": "Plant in sunny, well-ventilated areas. Avoid excess nitrogen fertilization.",
        "severity": "Medium"
    },
    "Cherry_(including_sour)___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Cherry",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Regular pruning, balanced irrigation, and disease scouting.",
        "severity": "None"
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "disease_name": "Corn Gray Leaf Spot",
        "affected_crop": "Corn (Maize)",
        "symptoms": "Rectangular gray or tan lesions between leaf veins. Lesions run parallel to veins.",
        "solution": "Apply strobilurin or triazole fungicides. Plant resistant hybrids.",
        "prevention": "Rotate crops. Bury or incorporate residue. Choose resistant varieties.",
        "severity": "High"
    },
    "Corn_(maize)___Common_rust_": {
        "disease_name": "Corn Common Rust",
        "affected_crop": "Corn (Maize)",
        "symptoms": "Small, powdery, brick-red pustules on both leaf surfaces. Pustules turn dark with age.",
        "solution": "Apply fungicides (Propiconazole) at VT stage. Use resistant hybrids.",
        "prevention": "Plant resistant varieties. Early planting to avoid peak rust spore periods.",
        "severity": "Medium"
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "disease_name": "Corn Northern Leaf Blight",
        "affected_crop": "Corn (Maize)",
        "symptoms": "Long, cigar-shaped gray-green lesions (1–6 inches) on leaves. Lesions turn tan/brown.",
        "solution": "Apply foliar fungicides at silking. Use resistant hybrids.",
        "prevention": "Crop rotation, bury residue, plant resistant varieties.",
        "severity": "High"
    },
    "Corn_(maize)___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Corn (Maize)",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Scout regularly, rotate crops, maintain fertility balance.",
        "severity": "None"
    },
    "Grape___Black_rot": {
        "disease_name": "Grape Black Rot",
        "affected_crop": "Grape",
        "symptoms": "Brown circular lesions on leaves with black borders; fruit shrivels into black mummies.",
        "solution": "Apply Mancozeb or Myclobutanil fungicides from early spring. Remove mummified berries.",
        "prevention": "Prune to improve air circulation. Remove fallen debris. Scout from bud break.",
        "severity": "High"
    },
    "Grape___Esca_(Black_Measles)": {
        "disease_name": "Grape Esca (Black Measles)",
        "affected_crop": "Grape",
        "symptoms": "Tiger-stripe chlorosis on leaves, dark discoloration in wood cross-section, fruit with dark spots.",
        "solution": "No curative fungicide available. Prune and remove infected wood. Apply pruning wound sealants.",
        "prevention": "Use disease-free planting material. Prune during dry weather. Protect pruning wounds.",
        "severity": "High"
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "disease_name": "Grape Leaf Blight",
        "affected_crop": "Grape",
        "symptoms": "Irregular brown spots with yellow halos on leaves; leaves dry out and fall prematurely.",
        "solution": "Apply copper-based fungicides. Remove and destroy infected leaves.",
        "prevention": "Improve air circulation through training and pruning. Avoid overhead irrigation.",
        "severity": "Medium"
    },
    "Grape___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Grape",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Regular pruning, canopy management, and scheduled scouting.",
        "severity": "None"
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "disease_name": "Citrus Greening (HLB)",
        "affected_crop": "Orange / Citrus",
        "symptoms": "Mottled yellow leaves (asymmetric), small lopsided fruit, bitter taste, twig dieback.",
        "solution": "No cure. Remove infected trees to prevent spread. Control Asian citrus psyllid vector.",
        "prevention": "Use certified disease-free nursery stock. Apply insecticides to control psyllid. Scout regularly.",
        "severity": "High"
    },
    "Peach___Bacterial_spot": {
        "disease_name": "Peach Bacterial Spot",
        "affected_crop": "Peach",
        "symptoms": "Water-soaked spots on leaves that turn brown with yellow halos; cankers on twigs; fruit scabs.",
        "solution": "Apply copper-based bactericides in spring. Prune infected branches.",
        "prevention": "Plant resistant varieties. Avoid overhead irrigation. Prune for air circulation.",
        "severity": "Medium"
    },
    "Peach___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Peach",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Annual pruning, balanced fertilization, and regular scouting.",
        "severity": "None"
    },
    "Pepper,_bell___Bacterial_spot": {
        "disease_name": "Bell Pepper Bacterial Spot",
        "affected_crop": "Bell Pepper",
        "symptoms": "Small water-soaked lesions on leaves/fruit that turn brown with yellow margins. Defoliation possible.",
        "solution": "Apply copper-based sprays. Remove infected plant material. Avoid working when plants are wet.",
        "prevention": "Use disease-free seed/transplants. Rotate crops. Drip irrigate instead of overhead.",
        "severity": "Medium"
    },
    "Pepper,_bell___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Bell Pepper",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Crop rotation, use certified seed, balance irrigation.",
        "severity": "None"
    },
    "Potato___Early_blight": {
        "disease_name": "Potato Early Blight",
        "affected_crop": "Potato",
        "symptoms": "Dark brown concentric ring spots (target-board pattern) on older leaves. Stems may also be affected.",
        "solution": "Apply chlorothalonil or Mancozeb fungicides. Remove heavily infected leaves.",
        "prevention": "Crop rotation, use certified seed potatoes, avoid overhead watering, maintain plant vigor.",
        "severity": "Medium"
    },
    "Potato___Late_blight": {
        "disease_name": "Potato Late Blight",
        "affected_crop": "Potato",
        "symptoms": "Water-soaked gray-green lesions on leaves turning brown-black. White mold on undersides in humid conditions.",
        "solution": "Apply phosphonate or Mancozeb fungicides immediately. Destroy infected plants.",
        "prevention": "Plant certified disease-free seed. Apply protectant fungicides preventively in wet seasons.",
        "severity": "High"
    },
    "Potato___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Potato",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Use certified seed potatoes, scout regularly, practice crop rotation.",
        "severity": "None"
    },
    "Raspberry___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Raspberry",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Annual cane removal after fruiting, proper spacing, avoid overwatering.",
        "severity": "None"
    },
    "Soybean___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Soybean",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Rotate with non-legume crops, use certified seed, scout from V3 stage.",
        "severity": "None"
    },
    "Squash___Powdery_mildew": {
        "disease_name": "Squash Powdery Mildew",
        "affected_crop": "Squash",
        "symptoms": "White powdery spots on upper and lower leaf surfaces. Leaves yellow and die prematurely.",
        "solution": "Apply sulfur, potassium bicarbonate, or neem oil sprays. Remove infected foliage.",
        "prevention": "Plant resistant varieties. Space plants for good air circulation. Avoid excess nitrogen.",
        "severity": "Medium"
    },
    "Strawberry___Leaf_scorch": {
        "disease_name": "Strawberry Leaf Scorch",
        "affected_crop": "Strawberry",
        "symptoms": "Small purple-red spots on upper leaf surface; centers become tan with purple borders.",
        "solution": "Apply Captan fungicide. Remove old leaves after harvest. Avoid overhead irrigation.",
        "prevention": "Plant resistant varieties. Renovate beds after harvest. Remove infected leaves.",
        "severity": "Low"
    },
    "Strawberry___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Strawberry",
        "symptoms": "No disease symptoms detected.",
        "solution": "No treatment required.",
        "prevention": "Renovate beds annually, use drip irrigation, remove old leaves.",
        "severity": "None"
    },
    "Tomato___Bacterial_spot": {
        "disease_name": "Tomato Bacterial Spot",
        "affected_crop": "Tomato",
        "symptoms": "Small dark water-soaked spots on leaves/fruit with yellow halos. Leaves defoliate.",
        "solution": "Apply copper bactericides. Remove infected plant parts. Avoid overhead irrigation.",
        "prevention": "Use disease-free transplants, drip irrigation, crop rotation, resistant varieties.",
        "severity": "Medium"
    },
    "Tomato___Early_blight": {
        "disease_name": "Tomato Early Blight",
        "affected_crop": "Tomato",
        "symptoms": "Dark concentric ring (bullseye) spots on older leaves. Yellowing around lesions.",
        "solution": "Apply chlorothalonil or copper fungicides. Remove infected lower leaves.",
        "prevention": "Mulch soil, stake plants, rotate crops, avoid overhead watering.",
        "severity": "Medium"
    },
    "Tomato___Late_blight": {
        "disease_name": "Tomato Late Blight",
        "affected_crop": "Tomato",
        "symptoms": "Greasy gray-green spots on leaves, white fuzzy mold on undersides, brown fruit rot.",
        "solution": "Apply Mancozeb or copper fungicides immediately. Remove and destroy infected plants.",
        "prevention": "Avoid planting near potatoes, use resistant varieties, apply preventive fungicides in wet weather.",
        "severity": "High"
    },
    "Tomato___Leaf_Mold": {
        "disease_name": "Tomato Leaf Mold",
        "affected_crop": "Tomato",
        "symptoms": "Yellow patches on upper leaf surface; olive-green to gray fuzzy mold on lower surface.",
        "solution": "Apply fungicides (chlorothalonil, Mancozeb). Reduce humidity. Prune for air flow.",
        "prevention": "Reduce greenhouse humidity, space plants, avoid overhead watering, plant resistant varieties.",
        "severity": "Medium"
    },
    "Tomato___Septoria_leaf_spot": {
        "disease_name": "Tomato Septoria Leaf Spot",
        "affected_crop": "Tomato",
        "symptoms": "Circular spots with gray centers and dark edges; small black dots (pycnidia) visible.",
        "solution": "Apply chlorothalonil or copper fungicide. Remove lower infected leaves.",
        "prevention": "Mulch to prevent rain splash, crop rotation, stake plants, avoid overhead watering.",
        "severity": "Medium"
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "disease_name": "Tomato Spider Mites",
        "affected_crop": "Tomato",
        "symptoms": "Fine yellow stippling on leaves, webbing on underside, leaves turn bronze/brown and drop.",
        "solution": "Apply miticides (Abamectin, Bifenazate) or insecticidal soap. Remove heavily infested leaves.",
        "prevention": "Avoid drought stress, use reflective mulches, encourage natural predators.",
        "severity": "Medium"
    },
    "Tomato___Target_Spot": {
        "disease_name": "Tomato Target Spot",
        "affected_crop": "Tomato",
        "symptoms": "Circular dark brown lesions with concentric rings on leaves, stems, and fruit.",
        "solution": "Apply chlorothalonil or azoxystrobin fungicides. Remove infected plant parts.",
        "prevention": "Crop rotation, reduce leaf wetness, improve air circulation, stake plants.",
        "severity": "Medium"
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "disease_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "affected_crop": "Tomato",
        "symptoms": "Upward leaf curling, yellowing margins, stunted growth, flower drop.",
        "solution": "No cure. Remove infected plants immediately. Control whitefly vector with insecticides.",
        "prevention": "Plant resistant varieties, use reflective mulches, apply systemic insecticides at transplant.",
        "severity": "High"
    },
    "Tomato___Tomato_mosaic_virus": {
        "disease_name": "Tomato Mosaic Virus (ToMV)",
        "affected_crop": "Tomato",
        "symptoms": "Light and dark green mosaic pattern on leaves, distorted/fern-like leaves, reduced fruit set.",
        "solution": "No chemical cure. Remove infected plants. Disinfect tools with bleach solution.",
        "prevention": "Use resistant varieties, disinfect tools, avoid tobacco products near plants, control aphids.",
        "severity": "High"
    },
    "Tomato___healthy": {
        "disease_name": "Healthy",
        "affected_crop": "Tomato",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "solution": "No treatment required. Continue regular maintenance.",
        "prevention": "Regular scouting, balanced fertilization, proper irrigation, crop rotation.",
        "severity": "None"
    }
}

# Ordered list of class names (matches model output indices 0–37)
CLASS_NAMES = list(DISEASE_DATABASE.keys())

def get_disease_info(class_name: str) -> dict:
    """Return disease info dict for a given class name."""
    return DISEASE_DATABASE.get(class_name, {
        "disease_name": "Unknown",
        "affected_crop": "Unknown",
        "symptoms": "Could not identify the disease.",
        "solution": "Please consult an agricultural expert.",
        "prevention": "Maintain good crop hygiene and regular scouting.",
        "severity": "Unknown"
    })

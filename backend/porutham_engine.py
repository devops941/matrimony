# Python implementation of Tamil Comprehensive Porutham Astrological Matcher Engine
# Includes 10 traditional Poruthams + additional compatibility factors
from db import db
from datetime import datetime
import re

NAKSHATRAS = [
  { "index": 1, "name": "Ashwini", "tamilName": "அஸ்வினி", "gana": "Deva", "rajju": "Pada", "yoni": "Horse", "defaultRasi": "Aries" },
  { "index": 2, "name": "Bharani", "tamilName": "பரணி", "gana": "Manusha", "rajju": "Uru", "yoni": "Elephant", "defaultRasi": "Aries" },
  { "index": 3, "name": "Krittika", "tamilName": "கார்த்திகை", "gana": "Rakshasa", "rajju": "Udara", "yoni": "Sheep", "defaultRasi": "Taurus" },
  { "index": 4, "name": "Rohini", "tamilName": "ரோகிணி", "gana": "Manusha", "rajju": "Kanda", "yoni": "Serpent", "defaultRasi": "Taurus" },
  { "index": 5, "name": "Mrigashira", "tamilName": "மிருகசீரிடம்", "gana": "Deva", "rajju": "Siro", "yoni": "Serpent", "defaultRasi": "Gemini" },
  { "index": 6, "name": "Ardra", "tamilName": "திருவாதிரை", "gana": "Manusha", "rajju": "Kanda", "yoni": "Dog", "defaultRasi": "Gemini" },
  { "index": 7, "name": "Punarvasu", "tamilName": "புனர்பூசம்", "gana": "Deva", "rajju": "Udara", "yoni": "Cat", "defaultRasi": "Cancer" },
  { "index": 8, "name": "Pushya", "tamilName": "பூசம்", "gana": "Deva", "rajju": "Uru", "yoni": "Sheep", "defaultRasi": "Cancer" },
  { "index": 9, "name": "Ashlesha", "tamilName": "ஆயில்யம்", "gana": "Rakshasa", "rajju": "Pada", "yoni": "Cat", "defaultRasi": "Cancer" },
  { "index": 10, "name": "Magha", "tamilName": "மகம்", "gana": "Rakshasa", "rajju": "Pada", "yoni": "Rat", "defaultRasi": "Leo" },
  { "index": 11, "name": "Purva Phalguni", "tamilName": "பூரம்", "gana": "Manusha", "rajju": "Uru", "yoni": "Rat", "defaultRasi": "Leo" },
  { "index": 12, "name": "Uttara Phalguni", "tamilName": "உத்திரம்", "gana": "Manusha", "rajju": "Udara", "yoni": "Cow", "defaultRasi": "Virgo" },
  { "index": 13, "name": "Hasta", "tamilName": "அஸ்தம்", "gana": "Deva", "rajju": "Kanda", "yoni": "Buffalo", "defaultRasi": "Virgo" },
  { "index": 14, "name": "Chitra", "tamilName": "சித்திரை", "gana": "Rakshasa", "rajju": "Siro", "yoni": "Tiger", "defaultRasi": "Libra" },
  { "index": 15, "name": "Swati", "tamilName": "சுவாதி", "gana": "Rakshasa", "rajju": "Kanda", "yoni": "Buffalo", "defaultRasi": "Libra" },
  { "index": 16, "name": "Vishakha", "tamilName": "விசாகம்", "gana": "Rakshasa", "rajju": "Udara", "yoni": "Tiger", "defaultRasi": "Scorpio" },
  { "index": 17, "name": "Anuradha", "tamilName": "அனுஷம்", "gana": "Deva", "rajju": "Uru", "yoni": "Deer", "defaultRasi": "Scorpio" },
  { "index": 18, "name": "Jyeshtha", "tamilName": "கேட்டை", "gana": "Rakshasa", "rajju": "Pada", "yoni": "Deer", "defaultRasi": "Scorpio" },
  { "index": 19, "name": "Mula", "tamilName": "மூலம்", "gana": "Rakshasa", "rajju": "Pada", "yoni": "Dog", "defaultRasi": "Sagittarius" },
  { "index": 20, "name": "Purva Ashadha", "tamilName": "பூராடம்", "gana": "Manusha", "rajju": "Uru", "yoni": "Monkey", "defaultRasi": "Sagittarius" },
  { "index": 21, "name": "Uttara Ashadha", "tamilName": "உத்திராடம்", "gana": "Manusha", "rajju": "Udara", "yoni": "Mongoose", "defaultRasi": "Capricorn" },
  { "index": 22, "name": "Shravana", "tamilName": "திருவோணம்", "gana": "Deva", "rajju": "Kanda", "yoni": "Monkey", "defaultRasi": "Capricorn" },
  { "index": 23, "name": "Dhanishta", "tamilName": "அவிட்டம்", "gana": "Rakshasa", "rajju": "Siro", "yoni": "Lion", "defaultRasi": "Aquarius" },
  { "index": 24, "name": "Shatabhisha", "tamilName": "சதயம்", "gana": "Manusha", "rajju": "Kanda", "yoni": "Horse", "defaultRasi": "Aquarius" },
  { "index": 25, "name": "Purva Bhadrapada", "tamilName": "பூரட்டாதி", "gana": "Manusha", "rajju": "Udara", "yoni": "Lion", "defaultRasi": "Pisces" },
  { "index": 26, "name": "Uttara Bhadrapada", "tamilName": "உத்திரட்டாதி", "gana": "Deva", "rajju": "Uru", "yoni": "Cow", "defaultRasi": "Pisces" },
  { "index": 27, "name": "Revati", "tamilName": "ரேவதி", "gana": "Deva", "rajju": "Pada", "yoni": "Elephant", "defaultRasi": "Pisces" }
]

RASIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

RASI_LORDS = {
  "Aries": "Mars",
  "Taurus": "Venus",
  "Gemini": "Mercury",
  "Cancer": "Moon",
  "Leo": "Sun",
  "Virgo": "Mercury",
  "Libra": "Venus",
  "Scorpio": "Mars",
  "Sagittarius": "Jupiter",
  "Capricorn": "Saturn",
  "Aquarius": "Saturn",
  "Pisces": "Jupiter"
}

LORD_FRIENDSHIP = {
  "Sun": { "Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 0.5, "Jupiter": 1, "Venus": 0, "Saturn": 0 },
  "Moon": { "Sun": 1, "Moon": 1, "Mars": 0.5, "Mercury": 1, "Jupiter": 0.5, "Venus": 0.5, "Saturn": 0.5 },
  "Mars": { "Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 0, "Jupiter": 1, "Venus": 0.5, "Saturn": 0.5 },
  "Mercury": { "Sun": 0.5, "Moon": 0, "Mars": 0.5, "Mercury": 1, "Jupiter": 0.5, "Venus": 1, "Saturn": 1 },
  "Jupiter": { "Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 0, "Jupiter": 1, "Venus": 0.5, "Saturn": 0.5 },
  "Venus": { "Sun": 0, "Moon": 0, "Mars": 0.5, "Mercury": 1, "Jupiter": 0.5, "Venus": 1, "Saturn": 1 },
  "Saturn": { "Sun": 0, "Moon": 0, "Mars": 0, "Mercury": 1, "Jupiter": 0.5, "Venus": 1, "Saturn": 1 }
}

YONI_HOSTILITY = {
  "Horse": "Buffalo",
  "Buffalo": "Horse",
  "Elephant": "Lion",
  "Lion": "Elephant",
  "Serpent": "Mongoose",
  "Mongoose": "Serpent",
  "Cow": "Tiger",
  "Tiger": "Cow",
  "Cat": "Rat",
  "Rat": "Cat",
  "Dog": "Deer",
  "Deer": "Dog",
  "Monkey": "Sheep",
  "Sheep": "Monkey"
}

VEDHA_PAIRS = {
  1: 18, 18: 1,
  2: 17, 17: 2,
  3: 16, 16: 3,
  4: 15, 15: 4,
  6: 22, 22: 6,
  7: 21, 21: 7,
  8: 20, 20: 8,
  9: 19, 19: 9,
  10: 27, 27: 10,
  11: 26, 26: 11,
  12: 25, 25: 12,
  13: 24, 24: 13,
  14: 23, 23: 14
}

VASYA_MAP = {
  "Aries": ["Leo", "Scorpio"],
  "Taurus": ["Gemini", "Cancer"],
  "Gemini": ["Virgo"],
  "Cancer": ["Scorpio", "Sagittarius"],
  "Leo": ["Libra", "Virgo"],
  "Virgo": ["Pisces", "Taurus"],
  "Libra": ["Capricorn", "Virgo"],
  "Scorpio": ["Cancer", "Taurus"],
  "Sagittarius": ["Pisces"],
  "Capricorn": ["Aquarius", "Aries"],
  "Aquarius": ["Aries"],
  "Pisces": ["Capricorn"]
}

# Nadi (Physiological Constitution) Mapping for Nadi Porutham
NADI_MAP = {
  1: "Adi", 2: "Madhya", 3: "Antya", 4: "Adi", 5: "Madhya", 6: "Antya",
  7: "Adi", 8: "Madhya", 9: "Antya", 10: "Adi", 11: "Madhya", 12: "Antya",
  13: "Adi", 14: "Madhya", 15: "Antya", 16: "Adi", 17: "Madhya", 18: "Antya",
  19: "Adi", 20: "Madhya", 21: "Antya", 22: "Adi", 23: "Madhya", 24: "Antya",
  25: "Adi", 26: "Madhya", 27: "Antya"
}

# Varna (Social Compatibility) Mapping
VARNA_MAP = {
  1: "Brahmin", 2: "Kshatriya", 3: "Vaishya", 4: "Brahmin", 5: "Kshatriya",
  6: "Vaishya", 7: "Shudra", 8: "Brahmin", 9: "Kshatriya", 10: "Vaishya",
  11: "Shudra", 12: "Brahmin", 13: "Kshatriya", 14: "Vaishya", 15: "Shudra",
  16: "Brahmin", 17: "Kshatriya", 18: "Vaishya", 19: "Shudra", 20: "Brahmin",
  21: "Kshatriya", 22: "Vaishya", 23: "Shudra", 24: "Brahmin", 25: "Kshatriya",
  26: "Vaishya", 27: "Shudra"
}

# Kuja/Chevvai Dosham (Manglik) Houses - Mars placement that causes dosham
KUJA_DOSHAM_HOUSES = [1, 2, 4, 7, 8, 12]

async def resolve_nakshatra(star_name: str):
    if not star_name:
        return NAKSHATRAS[0]
        
    star_name_clean = star_name.strip().lower()
    
    # Try finding standard 27 stars
    for n in NAKSHATRAS:
        if n["name"].lower() == star_name_clean or n["tamilName"].lower() == star_name_clean:
            return n
            
    # Map Tamil star name variants to standard English names
    tamil_mappings = {
        "அசுவினி": "Ashwini", "அஸ்வினி": "Ashwini",
        "பரணி": "Bharani",
        "கார்த்திகை": "Krittika", "கார்த்திகை 1": "Krittika", "கார்த்திகை 2,3,4": "Krittika",
        "ரோகிணி": "Rohini", "ரோஹிணி": "Rohini",
        "மிருகசீரிடம்": "Mrigashira", "மிருகசீரிடம் 1,2": "Mrigashira", "மிருகசீரிடம் 3,4": "Mrigashira",
        "திருவாதிரை": "Ardra",
        "புனர்பூசம்": "Punarvasu", "புனர்பூசம் 1,2,3": "Punarvasu", "புனர்பூசம் 4": "Punarvasu",
        "பூசம்": "Pushya",
        "ஆயில்யம்": "Ashlesha",
        "மகம்": "Magha",
        "பூரம்": "Purva Phalguni",
        "உத்திரம்": "Uttara Phalguni", "உத்திரம் 1": "Uttara Phalguni", "உத்திரம் 2,3,4": "Uttara Phalguni",
        "அஸ்தம்": "Hasta",
        "சித்திரை": "Chitra", "சித்திரை 1,2": "Chitra", "சித்திரை 3,4": "Chitra",
        "சுவாதி": "Swati",
        "விசாகம்": "Vishakha", "விசாகம் 1,2,3": "Vishakha", "விசாகம் 4": "Vishakha",
        "அனுஷம்": "Anuradha",
        "கேட்டை": "Jyeshtha",
        "மூலம்": "Mula",
        "பூராடம்": "Purva Ashadha",
        "உத்திராடம்": "Uttara Ashadha", "உத்திராடம் 1": "Uttara Ashadha", "உத்திராடம் 2,3,4": "Uttara Ashadha",
        "திருவோணம்": "Shravana",
        "அவிட்டம்": "Dhanishta", "அவிட்டம் 1,2": "Dhanishta", "அவிட்டம் 3,4": "Dhanishta",
        "சதயம்": "Shatabhisha",
        "பூரட்டாதி": "Purva Bhadrapada", "பூரட்டாதி 1,2,3": "Purva Bhadrapada", "பூரட்டாதி 4": "Purva Bhadrapada",
        "உத்திரட்டாதி": "Uttara Bhadrapada",
        "ரேவதி": "Revati"
    }
    
    for k, v in tamil_mappings.items():
        if k in star_name_clean or star_name_clean in k:
            for n in NAKSHATRAS:
                if n["name"].lower() == v.lower():
                    return n

    # Fallback default
    return NAKSHATRAS[0]

def get_matrix_index(nakshatra: str, rasi: str) -> int:
    nakshatra = nakshatra.lower().strip()
    rasi = rasi.lower().strip()
    
    if nakshatra == "ashwini": return 0
    if nakshatra == "bharani": return 1
    if nakshatra == "krittika":
        return 2 if rasi == "aries" else 3
    if nakshatra == "rohini": return 4
    if nakshatra == "mrigashira":
        return 5 if rasi == "taurus" else 6
    if nakshatra == "ardra": return 7
    if nakshatra == "punarvasu":
        return 8 if rasi == "gemini" else 9
    if nakshatra == "pushya": return 10
    if nakshatra == "ashlesha": return 11
    if nakshatra == "magha": return 12
    if nakshatra in ["purva phalguni", "purvaphalguni", "pooram"]: return 13
    if nakshatra in ["uttara phalguni", "uttaraphalguni", "uthiram"]:
        return 14 if rasi == "leo" else 15
    if nakshatra == "hasta": return 16
    if nakshatra == "chitra":
        return 17 if rasi == "virgo" else 18
    if nakshatra == "swati": return 19
    if nakshatra == "vishakha":
        return 20 if rasi == "libra" else 21
    if nakshatra == "anuradha": return 22
    if nakshatra == "jyeshtha": return 23
    if nakshatra == "mula": return 24
    if nakshatra in ["purva ashadha", "purvaashadha", "pooradam"]: return 25
    if nakshatra in ["uttara ashadha", "uttaraashadha", "uthiradam"]:
        return 26 if rasi == "sagittarius" else 27
    if nakshatra in ["shravana", "thiruonam"]: return 28
    if nakshatra in ["dhanishta", "avittam"]:
        return 29 if rasi == "capricorn" else 30
    if nakshatra in ["shatabhisha", "sadayam"]: return 31
    if nakshatra in ["purva bhadrapada", "purvabhadrapada", "poorattadhi"]:
        return 32 if rasi == "aquarius" else 33
    if nakshatra in ["uttara bhadrapada", "uttarabhadrapada", "uthirattadhi"]: return 34
    if nakshatra == "revati": return 35
    
    return 0

ASTRO_CACHE = {}

def clear_astro_cache():
    global ASTRO_CACHE
    ASTRO_CACHE.clear()
    print("🧹 Astrological matching cache cleared.")

def calculate_age_from_birth_date(birth_date_str: str) -> int:
    """Calculate age from birth date string (YYYY-MM-DD format)"""
    try:
        birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
        today = datetime.now()
        age = today.year - birth_date.year
        if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
            age -= 1
        return age
    except:
        return 0

def check_chevvai_dosham_from_rasi(rasi: str) -> tuple:
    """
    Simplified Chevvai/Kuja Dosham detection based on Rasi
    Returns: (has_dosham: bool, severity: str, description: str)
    
    In actual practice, this requires full birth chart with Mars house placement.
    This is a simplified approximation based on Rasi.
    """
    # Rasis where Mars is generally strong (own signs or exalted)
    mars_favorable = ["Aries", "Scorpio", "Capricorn"]
    # Rasis where Mars may cause more friction
    mars_challenging = ["Cancer", "Libra", "Taurus"]
    
    if rasi in mars_favorable:
        return (False, "None", f"Mars is strong in {rasi}. No Chevvai Dosham indicated.")
    elif rasi in mars_challenging:
        return (True, "Mild", f"Mars may have  mild influence in {rasi}. Consultation recommended.")
    else:
        return (False, "Uncertain", f"Chevvai Dosham status uncertain for {rasi}. Full chart needed for accuracy.")

def calculate_nadi_porutham(bride_nakshatra_index: int, groom_nakshatra_index: int) -> tuple:
    """
    Nadi Porutham - Physiological compatibility and hereditary factors
    Same Nadi is inauspicious (may affect children's health)
    Different Nadi is favorable
    """
    bride_nadi = NADI_MAP.get(bride_nakshatra_index, "Adi")
    groom_nadi = NADI_MAP.get(groom_nakshatra_index, "Adi")
    
    if bride_nadi == groom_nadi:
        return ("Adhamam", 0.0, f"Same Nadi ({bride_nadi}). May affect progeny health. Dosha present - remedies advised.")
    else:
        return ("Uthamam", 1.0, f"Different Nadis ({bride_nadi} & {groom_nadi}). Excellent physiological compatibility and healthy progeny indicated.")

def calculate_varna_porutham(bride_nakshatra_index: int, groom_nakshatra_index: int) -> tuple:
    """
    Varna Porutham - Social compatibility
    Groom's Varna should be equal or higher than bride's
    """
    bride_varna = VARNA_MAP.get(bride_nakshatra_index, "Shudra")
    groom_varna = VARNA_MAP.get(groom_nakshatra_index, "Shudra")
    
    varna_order = {"Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1}
    bride_rank = varna_order.get(bride_varna, 1)
    groom_rank = varna_order.get(groom_varna, 1)
    
    if groom_rank >= bride_rank:
        return ("Uthamam", 1.0, f"Favorable Varna match ({bride_varna} & {groom_varna}). Social harmony and respect assured.")
    elif groom_rank == bride_rank - 1:
        return ("Madhyamam", 0.5, f"Acceptable Varna match ({bride_varna} & {groom_varna}). Manageable with mutual respect.")
    else:
        return ("Adhamam", 0.0, f"Varna mismatch ({bride_varna} & {groom_varna}). May face social adjustment challenges.")

def calculate_ayul_porutham(star_distance: int) -> tuple:
    """
    Ayul (Longevity) Porutham - Life expectancy compatibility
    Based on star count distance
    """
    ayul_remainder = star_distance % 8
    
    if ayul_remainder in [3, 5, 7]:
        return ("Uthamam", 1.0, f"Excellent Ayul Porutham. Long life together and mutual support in old age indicated.")
    elif ayul_remainder in [2, 4, 6]:
        return ("Madhyamam", 0.5, f"Moderate longevity match. Normal lifespan expectations with good health practices.")
    else:
        return ("Adhamam", 0.0, f"Ayul mismatch detected. Extra attention to health and wellness advised.")

def calculate_virutcha_porutham(bride_nakshatra_index: int, groom_nakshatra_index: int) -> tuple:
    """
    Virutcha/Virudcham Porutham - Family tree continuation
    Checks if stars are from different groups
    """
    # Group nakshatras by tree/vegetation types (simplified)
    tree_groups = {
        "Kshira": [1, 4, 6, 10, 13, 15, 17, 22, 27],  # Milk-giving trees
        "Madhya": [2, 5, 7, 11, 14, 16, 21, 24],      # Middle category
        "Vishama": [3, 8, 9, 12, 18, 19, 20, 23, 25, 26]  # Varied
    }
    
    bride_group = "Vishama"
    groom_group = "Vishama"
    
    for group_name, indices in tree_groups.items():
        if bride_nakshatra_index in indices:
            bride_group = group_name
        if groom_nakshatra_index in indices:
            groom_group = group_name
    
    if bride_group != groom_group:
        return ("Uthamam", 1.0, f"Different Virutcha groups ({bride_group} & {groom_group}). Family prosperity and lineage continuation favored.")
    else:
        return ("Madhyamam", 0.5, f"Same Virutcha group ({bride_group}). Neutral influence on family growth.")

def calculate_practical_compatibility(bride_profile, groom_profile) -> dict:
    """
    Calculate practical non-astrological compatibility factors
    Based on age, education, income, location, diet, etc.
    """
    results = []
    
    # 1. Age Compatibility
    age_diff = abs(bride_profile.age - groom_profile.age)
    age_status = "Adhamam"
    age_score = 0.0
    age_desc = ""
    
    if age_diff <= 5:
        age_status = "Uthamam"
        age_score = 1.0
        age_desc = f"Ideal age difference ({age_diff} years). Excellent life stage compatibility and mutual understanding."
    elif age_diff <= 10:
        age_status = "Madhyamam"
        age_score = 0.5
        age_desc = f"Acceptable age gap ({age_diff} years). May require understanding of different life perspectives."
    else:
        age_status = "Adhamam"
        age_score = 0.0
        age_desc = f"Significant age difference ({age_diff} years). May face generational gap challenges."
    
    results.append({
        "name": "Age",
        "label": "Age Compatibility",
        "status": age_status,
        "score": age_score,
        "description": age_desc,
        "category": "practical"
    })
    
    # 2. Education Level Compatibility
    edu_status = "Madhyamam"
    edu_score = 0.5
    edu_desc = f"Both have good educational backgrounds: {bride_profile.education} & {groom_profile.education}."
    
    # Check if education levels are similar
    if any(word in bride_profile.education.lower() for word in ['b.e', 'b.tech', 'mba', 'm.tech', 'mbbs']) and \
       any(word in groom_profile.education.lower() for word in ['b.e', 'b.tech', 'mba', 'm.tech', 'mbbs']):
        edu_status = "Uthamam"
        edu_score = 1.0
        edu_desc = "Similar professional education levels. Excellent intellectual compatibility and career understanding."
    
    results.append({
        "name": "Education",
        "label": "Educational Compatibility",
        "status": edu_status,
        "score": edu_score,
        "description": edu_desc,
        "category": "practical"
    })
    
    # 3. Income Compatibility
    income_ratio = groom_profile.annualIncomeLakhs / max(bride_profile.annualIncomeLakhs, 1)
    income_status = "Madhyamam"
    income_score = 0.5
    income_desc = f"Combined family income: ₹{bride_profile.annualIncomeLakhs + groom_profile.annualIncomeLakhs} Lakhs/year."
    
    if 0.7 <= income_ratio <= 1.5:
        income_status = "Uthamam"
        income_score = 1.0
        income_desc = f"Balanced income levels (Bride: ₹{bride_profile.annualIncomeLakhs}L, Groom: ₹{groom_profile.annualIncomeLakhs}L). Financial equality and mutual respect."
    elif income_ratio < 0.5 or income_ratio > 2.0:
        income_status = "Adhamam"
        income_score = 0.0
        income_desc = f"Significant income disparity. May require clear financial planning and mutual understanding."
    
    results.append({
        "name": "Income",
        "label": "Financial Compatibility",
        "status": income_status,
        "score": income_score,
        "description": income_desc,
        "category": "practical"
    })
    
    # 4. Location Preference
    location_status = "Madhyamam"
    location_score = 0.5
    location_desc = f"Currently in {bride_profile.location} and {groom_profile.location}."
    
    if bride_profile.location.lower() == groom_profile.location.lower():
        location_status = "Uthamam"
        location_score = 1.0
        location_desc = f"Both from {bride_profile.location}. Excellent local support system and family proximity."
    elif any(loc.lower() == groom_profile.location.lower() for loc in bride_profile.expAcceptedLocations):
        location_status = "Uthamam"
        location_score = 1.0
        location_desc = f"Groom's location ({groom_profile.location}) matches bride's preferences. Good geographical compatibility."
    
    results.append({
        "name": "Location",
        "label": "Geographic Compatibility",
        "status": location_status,
        "score": location_score,
        "description": location_desc,
        "category": "practical"
    })
    
    # 5. Diet Compatibility
    bride_diet = getattr(bride_profile, 'diet', 'Vegetarian')
    groom_diet = getattr(groom_profile, 'diet', 'Vegetarian')
    diet_status = "Madhyamam"
    diet_score = 0.5
    diet_desc = f"Different dietary preferences: {bride_diet} & {groom_diet}. Requires kitchen adjustments."
    
    if bride_diet == groom_diet:
        diet_status = "Uthamam"
        diet_score = 1.0
        diet_desc = f"Both prefer {bride_diet} diet. Perfect lifestyle and cultural alignment."
    
    results.append({
        "name": "Diet",
        "label": "Dietary Compatibility",
        "status": diet_status,
        "score": diet_score,
        "description": diet_desc,
        "category": "practical"
    })
    
    # 6. Family Expectations Match
    family_status = "Madhyamam"
    family_score = 0.5
    family_desc = "Standard family expectations alignment."
    
    # Check if groom meets bride's minimum expectations
    if groom_profile.age >= bride_profile.expMinAge and \
       groom_profile.age <= bride_profile.expMaxAge and \
       groom_profile.annualIncomeLakhs >= bride_profile.expMinAnnualIncomeLakhs:
        family_status = "Uthamam"
        family_score = 1.0
        family_desc = "Groom meets all bride's family expectations (age, income). High family approval likelihood."
    
    results.append({
        "name": "FamilyExpectations",
        "label": "Family Expectations Match",
        "status": family_status,
        "score": family_score,
        "description": family_desc,
        "category": "practical"
    })
    
    return results

async def calculate_porutham(bride_star_name: str, groom_star_name: str, bride_profile=None, groom_profile=None) -> dict:
    bride = await resolve_nakshatra(bride_star_name)
    groom = await resolve_nakshatra(groom_star_name)

    # Check cache for precalculated match
    cache_key = (bride["index"], bride["defaultRasi"], groom["index"], groom["defaultRasi"])
    if cache_key in ASTRO_CACHE:
        return ASTRO_CACHE[cache_key]

    # Load porutham configuration status (enabled/disabled) from MongoDB
    configs = await db.porutham.find_many()
    enabled_map = {c.key: c.isEnabled for c in configs}

    results = []

    # 1. Dina Porutham
    star_distance = ((groom["index"] - bride["index"] + 27) % 27) + 1
    dina_remainder = star_distance % 9

    dina_status = 'Adhamam'
    dina_score = 0.0
    dina_desc = ""

    if dina_remainder in [2, 4, 6, 8, 0]:
        dina_status = 'Uthamam'
        dina_score = 1.0
        dina_desc = "Favorable. Indicates robust health, active immunity, and long life for the couple."
    elif dina_remainder in [3, 5, 7]:
        dina_status = 'Adhamam'
        dina_score = 0.0
        dina_desc = "Inauspicious. Indicates occasional minor health setbacks or arguments."
    else: # remainder is 1
        if star_distance == 1:
            dina_status = 'Adhamam'
            dina_score = 0.0
            dina_desc = "Janma Nakshatra match. Not recommended due to potential mental stress."
        else:
            dina_status = 'Madhyamam'
            dina_score = 0.5
            dina_desc = "Neutral combination. Moderate stability in general health."

    results.append({
        "name": "Dina",
        "label": "Dina Porutham (Longevity & Health)",
        "status": dina_status,
        "score": dina_score if enabled_map.get("Dina", True) else 0.0,
        "description": dina_desc
    })

    # 2. Gana Porutham
    gana_status = 'Adhamam'
    gana_score = 0.0
    gana_desc = ""

    if bride["gana"] == groom["gana"]:
        gana_status = 'Uthamam'
        gana_score = 1.0
        gana_desc = f"Both are {bride['gana']} Gana. Excellent tuning, identical perspectives, and solid mental chemistry."
    elif bride["gana"] == "Deva" and groom["gana"] == "Manusha":
        gana_status = 'Uthamam'
        gana_score = 1.0
        gana_desc = "Deva bride with Manusha groom. High mental understanding and harmonious living."
    elif bride["gana"] == "Manusha" and groom["gana"] == "Deva":
        gana_status = 'Uthamam'
        gana_score = 1.0
        gana_desc = "Manusha bride with Deva groom. Balanced temperament and mutual respect."
    elif bride["gana"] == "Deva" and groom["gana"] == "Rakshasa":
        gana_status = 'Madhyamam'
        gana_score = 0.5
        gana_desc = "Deva bride with Rakshasa groom. Substantial adjustment is required; medium match."
    else:
        gana_status = 'Adhamam'
        gana_score = 0.0
        gana_desc = f"Incompatible temperament ({bride['gana']} vs {groom['gana']}). Leads to occasional conflicts."

    results.append({
        "name": "Gana",
        "label": "Gana Porutham (Temperament Matching)",
        "status": gana_status,
        "score": gana_score if enabled_map.get("Gana", True) else 0.0,
        "description": gana_desc
    })

    # 3. Mahendra Porutham
    mahendra_status = 'Adhamam'
    mahendra_score = 0.0
    mahendra_desc = ""
    mahendra_list = [4, 7, 10, 13, 16, 19, 22, 25]

    if star_distance in mahendra_list:
        mahendra_status = 'Uthamam'
        mahendra_score = 1.0
        mahendra_desc = "Excellent Mahendra matching. Assures healthy children, family legacy, and stable prosperity."
    else:
        mahendra_status = 'Adhamam'
        mahendra_score = 0.0
        mahendra_desc = "Average alignment. May require remedies or focus on physical health."

    results.append({
        "name": "Mahendra",
        "label": "Mahendra Porutham (Progeny Growth)",
        "status": mahendra_status,
        "score": mahendra_score if enabled_map.get("Mahendra", True) else 0.0,
        "description": mahendra_desc
    })

    # 4. Stree Deerga Porutham
    stree_status = 'Adhamam'
    stree_score = 0.0
    stree_desc = ""

    if star_distance > 13:
        stree_status = 'Uthamam'
        stree_score = 1.0
        stree_desc = f"Favorable distance of {star_distance} stars. Guarantees safety, happiness, and prolonged wealth for the bride."
    elif 9 <= star_distance <= 13:
        stree_status = 'Madhyamam'
        stree_score = 0.5
        stree_desc = f"Moderate star distance of {star_distance}. Favorable environment but requires normal adjustments."
    else:
        stree_status = 'Adhamam'
        stree_score = 0.0
        stree_desc = "Star distance is close. Normal expectations; bride requires support from husband's family."

    results.append({
        "name": "StreeDeerga",
        "label": "Stree Deerga Porutham (Bride Prosperity)",
        "status": stree_status,
        "score": stree_score if enabled_map.get("StreeDeerga", True) else 0.0,
        "description": stree_desc
    })

    # 5. Yoni Porutham
    yoni_status = 'Adhamam'
    yoni_score = 0.0
    yoni_desc = ""

    if bride["yoni"] == groom["yoni"]:
        yoni_status = 'Uthamam'
        yoni_score = 1.0
        yoni_desc = f"Perfect physical fit! Same animal archetype ({bride['yoni']}). Supreme intimate alignment and satisfaction."
    elif YONI_HOSTILITY.get(bride["yoni"]) == groom["yoni"]:
        yoni_status = 'Adhamam'
        yoni_score = 0.0
        yoni_desc = f"Hostile Yoni match ({bride['yoni']} vs {groom['yoni']}). Natural instinctual mismatch; may lead to tension."
    else:
        yoni_status = 'Madhyamam'
        yoni_score = 0.5
        yoni_desc = f"Harmonious blend of different animals ({bride['yoni']} and {groom['yoni']}). Peaceful physical relationship."

    results.append({
        "name": "Yoni",
        "label": "Yoni Porutham (Physical Attraction)",
        "status": yoni_status,
        "score": yoni_score if enabled_map.get("Yoni", True) else 0.0,
        "description": yoni_desc
    })

    # 6. Rasi Porutham
    bride_rasi_idx = RASIS.index(bride["defaultRasi"]) + 1
    groom_rasi_idx = RASIS.index(groom["defaultRasi"]) + 1
    rasi_diff = ((groom_rasi_idx - bride_rasi_idx + 12) % 12) + 1

    rasi_status = 'Adhamam'
    rasi_score = 0.0
    rasi_desc = ""
    has_rasi_dosham = False

    if rasi_diff == 1:
        rasi_status = 'Madhyamam'
        rasi_score = 0.5
        rasi_desc = "Same Rasi. Acceptable alignment with occasional dynamic arguments."
    elif rasi_diff == 7:
        rasi_status = 'Uthamam'
        rasi_score = 1.0
        rasi_desc = "Samasapthama (1-7 axis) match. Highly auspicious, perfect mirror harmony."
    elif rasi_diff in [2, 6, 8, 12]:
        rasi_status = 'Adhamam'
        rasi_score = 0.0
        has_rasi_dosham = True
        if rasi_diff in [6, 8]:
            rasi_desc = "Shashtashtaga (6-8) relationship. Extreme astrological friction. Caution is strongly advised."
        else:
            rasi_desc = f"Dwirdwadasa ({rasi_diff}) relationship. Points to potential extra expenditure or traveling."
    else:
        rasi_status = 'Uthamam'
        rasi_score = 1.0
        rasi_desc = f"Favorable Rasi placement ({rasi_diff} houses apart). Enhances mutual mental progress."

    results.append({
        "name": "Rasi",
        "label": "Rasi Porutham (Zodiac Match)",
        "status": rasi_status,
        "score": rasi_score if enabled_map.get("Rasi", True) else 0.0,
        "description": rasi_desc
    })

    # 7. Rasi Athipathi Porutham
    bride_lord = RASI_LORDS[bride["defaultRasi"]]
    groom_lord = RASI_LORDS[groom["defaultRasi"]]
    friendship_val1 = LORD_FRIENDSHIP.get(bride_lord, {}).get(groom_lord, 0.5)
    friendship_val2 = LORD_FRIENDSHIP.get(groom_lord, {}).get(bride_lord, 0.5)
    final_friendship = (friendship_val1 + friendship_val2) / 2.0

    lord_status = 'Adhamam'
    lord_score = 0.0
    lord_desc = ""

    if final_friendship >= 0.8:
        lord_status = 'Uthamam'
        lord_score = 1.0
        lord_desc = f"Planetary Lords are close friends ({bride_lord} & {groom_lord}). Harmonious relationship with extended families."
    elif final_friendship >= 0.5:
        lord_status = 'Madhyamam'
        lord_score = 0.5
        lord_desc = f"Neutral Planetary Lords relationship. Standard respect and peaceful coexistence."
    else:
        lord_status = 'Adhamam'
        lord_score = 0.0
        lord_desc = f"Conflicting Planetary Lords ({bride_lord} & {groom_lord}). Leads to minor dispute points."

    results.append({
        "name": "RasiAthipathi",
        "label": "Rasi Athipathi Porutham (Lord Harmony)",
        "status": lord_status,
        "score": lord_score if enabled_map.get("RasiAthipathi", True) else 0.0,
        "description": lord_desc
    })

    # 8. Vasya Porutham
    vasya_status = 'Adhamam'
    vasya_score = 0.0
    vasya_desc = ""
    bride_attracts = VASYA_MAP.get(bride["defaultRasi"], [])
    groom_attracts = VASYA_MAP.get(groom["defaultRasi"], [])

    if groom["defaultRasi"] in bride_attracts or bride["defaultRasi"] in groom_attracts:
        vasya_status = 'Uthamam'
        vasya_score = 1.0
        vasya_desc = "Auspicious Vasya alignment. Deep romantic magnetism and unbreakable lifetime bonding."
    else:
        vasya_status = 'Adhamam'
        vasya_score = 0.0
        vasya_desc = "Ordinary compatibility level. Mutual love develops with time and maturity."

    results.append({
        "name": "Vasya",
        "label": "Vasya Porutham (Vibrational Attraction)",
        "status": vasya_status,
        "score": vasya_score if enabled_map.get("Vasya", True) else 0.0,
        "description": vasya_desc
    })

    # 9. Rajju Porutham
    rajju_status = 'Adhamam'
    rajju_score = 0.0
    rajju_desc = ""
    has_rajju_dosham = False

    if bride["rajju"] == groom["rajju"]:
        rajju_status = 'Adhamam'
        rajju_score = 0.0
        has_rajju_dosham = True
        rajju_desc = f"Rajju Dosham is Present! Both belong to {bride['rajju']} Rajju. High astrological risk. Match not advised."
    else:
        rajju_status = 'Uthamam'
        rajju_score = 1.0
        rajju_desc = f"Sufficient Rajju protection. Bride belongs to {bride['rajju']} Rajju and Groom belongs to {groom['rajju']} Rajju. Safe match."

    results.append({
        "name": "Rajju",
        "label": "Rajju Porutham (Vital Life-Thread Protection)",
        "status": rajju_status,
        "score": rajju_score if enabled_map.get("Rajju", True) else 0.0,
        "description": rajju_desc
    })

    # 10. Vedha Porutham
    vedha_status = 'Adhamam'
    vedha_score = 0.0
    vedha_desc = ""
    has_vedha_dosham = False

    if VEDHA_PAIRS.get(bride["index"]) == groom["index"]:
        vedha_status = 'Adhamam'
        vedha_score = 0.0
        has_vedha_dosham = True
        vedha_desc = "Vedha affliction is present. Mutual conflict or distress warning."
    else:
        vedha_status = 'Uthamam'
        vedha_score = 1.0
        vedha_desc = "No Vedha affliction. Beautiful harmony and peace in day-to-day decisions."

    results.append({
        "name": "Vedha",
        "label": "Vedha Porutham (Affliction Avoidance)",
        "status": vedha_status,
        "score": vedha_score if enabled_map.get("Vedha", True) else 0.0,
        "description": vedha_desc
    })

    # 11. Nadi Porutham (NEW)
    nadi_status, nadi_score, nadi_desc = calculate_nadi_porutham(bride["index"], groom["index"])
    results.append({
        "name": "Nadi",
        "label": "Nadi Porutham (Physiological Compatibility)",
        "status": nadi_status,
        "score": nadi_score if enabled_map.get("Nadi", True) else 0.0,
        "description": nadi_desc
    })
    
    # 12. Varna Porutham (NEW)
    varna_status, varna_score, varna_desc = calculate_varna_porutham(bride["index"], groom["index"])
    results.append({
        "name": "Varna",
        "label": "Varna Porutham (Social Compatibility)",
        "status": varna_status,
        "score": varna_score if enabled_map.get("Varna", True) else 0.0,
        "description": varna_desc
    })
    
    # 13. Ayul Porutham (NEW)
    ayul_status, ayul_score, ayul_desc = calculate_ayul_porutham(star_distance)
    results.append({
        "name": "Ayul",
        "label": "Ayul Porutham (Longevity Match)",
        "status": ayul_status,
        "score": ayul_score if enabled_map.get("Ayul", True) else 0.0,
        "description": ayul_desc
    })
    
    # 14. Virutcha Porutham (NEW)
    virutcha_status, virutcha_score, virutcha_desc = calculate_virutcha_porutham(bride["index"], groom["index"])
    results.append({
        "name": "Virutcha",
        "label": "Virutcha Porutham (Family Tree Continuation)",
        "status": virutcha_status,
        "score": virutcha_score if enabled_map.get("Virutcha", True) else 0.0,
        "description": virutcha_desc
    })
    
    # Add practical compatibility checks if profiles are provided
    practical_results = []
    if bride_profile and groom_profile:
        practical_results = calculate_practical_compatibility(bride_profile, groom_profile)
        results.extend(practical_results)
    
    # Check Chevvai/Kuja Dosham for both
    bride_chevvai_status, bride_chevvai_severity, bride_chevvai_desc = check_chevvai_dosham_from_rasi(bride["defaultRasi"])
    groom_chevvai_status, groom_chevvai_severity, groom_chevvai_desc = check_chevvai_dosham_from_rasi(groom["defaultRasi"])
    
    has_chevvai_dosham = bride_chevvai_status or groom_chevvai_status
    chevvai_compatibility = "Compatible"
    
    # If both have dosham, it cancels out (astrological principle)
    if bride_chevvai_status and groom_chevvai_status:
        chevvai_compatibility = "Both have Chevvai Dosham - Dosham cancelled. Match acceptable."
        has_chevvai_dosham = False
    elif bride_chevvai_status:
        chevvai_compatibility = f"Bride has {bride_chevvai_severity} Chevvai Dosham. {bride_chevvai_desc}"
    elif groom_chevvai_status:
        chevvai_compatibility = f"Groom has {groom_chevvai_severity} Chevvai Dosham. {groom_chevvai_desc}"
    else:
        chevvai_compatibility = "No Chevvai Dosham detected in either chart. Excellent Mars placement."

    # Query custom NakshatraMatrix from MongoDB to override overall compatibility
    matrix_record = await db.nakshatramatrix.find_first()
    matrix_data = None
    if matrix_record and matrix_record.matrix:
        matrix_data = matrix_record.matrix
    
    if not matrix_data:
        from data.nakshatra_default import DEFAULT_REAL_MATRIX
        matrix_data = DEFAULT_REAL_MATRIX

    # Look up calculated compatibility score (0-36)
    bride_idx = get_matrix_index(bride["name"], bride["defaultRasi"])
    groom_idx = get_matrix_index(groom["name"], groom["defaultRasi"])
    
    if 0 <= bride_idx < 36 and 0 <= groom_idx < 36:
        matrix_score = float(matrix_data[bride_idx][groom_idx])
    else:
        matrix_score = 18.0

    percentage = int(round((matrix_score / 36.0) * 100))
    total_score = round((matrix_score / 36.0) * 10.0, 1)

    rating = 'Low'
    if matrix_score >= 27.0 and not has_rajju_dosham:
        rating = 'Excellent'
        verdict = "Highly Recommended Match! Superb physical, mental, and physical affinity with zero major doshams."
    elif matrix_score >= 20.0 and not has_rajju_dosham:
        rating = 'Good'
        verdict = "Recommended Match. Good compatibility in emotional and family values with solid protection."
    elif matrix_score >= 13.0 and not has_rajju_dosham:
        rating = 'Average'
        verdict = "Average compatibility. Can proceed if individual horoscopes (Chevvai/Mars/Dasa) are well balanced."
    else:
        rating = 'Low'
        if has_rajju_dosham:
            verdict = "Not Recommended. Rajju Dosham is present which may invite stress or progeny delays."
        else:
            verdict = "Low compatibility. Multiple critical parameters like Gana or Rasi are mismatching."

    res = {
        "poruthamScores": results,
        "totalScore": total_score,
        "percentage": percentage,
        "rating": rating,
        "hasRajjuDosham": has_rajju_dosham,
        "hasVedhaDosham": has_vedha_dosham,
        "hasRasiDosham": has_rasi_dosham,
        "hasChevvaiDosham": has_chevvai_dosham,
        "chevvaiCompatibility": chevvai_compatibility,
        "verdict": verdict,
        "practicalFactorsCount": len(practical_results)
    }
    ASTRO_CACHE[cache_key] = res
    return res

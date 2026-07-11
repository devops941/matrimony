// Porutham Matching Engine based on Tamil South Indian Astrology principles.

export interface NakshatraInfo {
  index: number; // 1-27
  name: string;
  tamilName: string;
  gana: 'Deva' | 'Manusha' | 'Rakshasa';
  rajju: 'Siro' | 'Kanda' | 'Udara' | 'Uru' | 'Pada';
  yoni: string; // animal
  defaultRasi: string;
}

export interface PoruthamResult {
  name: string;
  label: string; // e.g. "Dina Porutham"
  status: 'Uthamam' | 'Madhyamam' | 'Adhamam';
  score: number; // 0, 0.5, or 1
  description: string;
}

export interface MatchingResult {
  poruthamScores: PoruthamResult[];
  totalScore: number; // sum of scores, max 10
  percentage: number; // percentage match
  rating: 'Excellent' | 'Good' | 'Average' | 'Low';
  hasRajjuDosham: boolean;
  hasVedhaDosham: boolean;
  hasRasiDosham: boolean;
  verdict: string;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 1, name: "Ashwini", tamilName: "அஸ்வினி", gana: "Deva", rajju: "Pada", yoni: "Horse", defaultRasi: "Aries" },
  { index: 2, name: "Bharani", tamilName: "பரணி", gana: "Manusha", rajju: "Uru", yoni: "Elephant", defaultRasi: "Aries" },
  { index: 3, name: "Krittika", tamilName: "கார்த்திகை", gana: "Rakshasa", rajju: "Udara", yoni: "Sheep", defaultRasi: "Taurus" },
  { index: 4, name: "Rohini", tamilName: "ரோகிணி", gana: "Manusha", rajju: "Kanda", yoni: "Serpent", defaultRasi: "Taurus" },
  { index: 5, name: "Mrigashira", tamilName: "மிருகசீரிடம்", gana: "Deva", rajju: "Siro", yoni: "Serpent", defaultRasi: "Gemini" },
  { index: 6, name: "Ardra", tamilName: "திருவாதிரை", gana: "Manusha", rajju: "Kanda", yoni: "Dog", defaultRasi: "Gemini" },
  { index: 7, name: "Punarvasu", tamilName: "புனர்பூசம்", gana: "Deva", rajju: "Udara", yoni: "Cat", defaultRasi: "Cancer" },
  { index: 8, name: "Pushya", tamilName: "பூசம்", gana: "Deva", rajju: "Uru", yoni: "Sheep", defaultRasi: "Cancer" },
  { index: 9, name: "Ashlesha", tamilName: "ஆயில்யம்", gana: "Rakshasa", rajju: "Pada", yoni: "Cat", defaultRasi: "Cancer" },
  { index: 10, name: "Magha", tamilName: "மகம்", gana: "Rakshasa", rajju: "Pada", yoni: "Rat", defaultRasi: "Leo" },
  { index: 11, name: "Purva Phalguni", tamilName: "பூரம்", gana: "Manusha", rajju: "Uru", yoni: "Rat", defaultRasi: "Leo" },
  { index: 12, name: "Uttara Phalguni", tamilName: "உத்திரம்", gana: "Manusha", rajju: "Udara", yoni: "Cow", defaultRasi: "Virgo" },
  { index: 13, name: "Hasta", tamilName: "அஸ்தம்", gana: "Deva", rajju: "Kanda", yoni: "Buffalo", defaultRasi: "Virgo" },
  { index: 14, name: "Chitra", tamilName: "சித்திரை", gana: "Rakshasa", rajju: "Siro", yoni: "Tiger", defaultRasi: "Libra" },
  { index: 15, name: "Swati", tamilName: "சுவாதி", gana: "Rakshasa", rajju: "Kanda", yoni: "Buffalo", defaultRasi: "Libra" },
  { index: 16, name: "Vishakha", tamilName: "விசாகம்", gana: "Rakshasa", rajju: "Udara", yoni: "Tiger", defaultRasi: "Scorpio" },
  { index: 17, name: "Anuradha", tamilName: "அனுஷம்", gana: "Deva", rajju: "Uru", yoni: "Deer", defaultRasi: "Scorpio" },
  { index: 18, name: "Jyeshtha", tamilName: "கேட்டை", gana: "Rakshasa", rajju: "Pada", yoni: "Deer", defaultRasi: "Scorpio" },
  { index: 19, name: "Mula", tamilName: "மூலம்", gana: "Rakshasa", rajju: "Pada", yoni: "Dog", defaultRasi: "Sagittarius" },
  { index: 20, name: "Purva Ashadha", tamilName: "பூராடம்", gana: "Manusha", rajju: "Uru", yoni: "Monkey", defaultRasi: "Sagittarius" },
  { index: 21, name: "Uttara Ashadha", tamilName: "உத்திராடம்", gana: "Manusha", rajju: "Udara", yoni: "Mongoose", defaultRasi: "Capricorn" },
  { index: 22, name: "Shravana", tamilName: "திருவோணம்", gana: "Deva", rajju: "Kanda", yoni: "Monkey", defaultRasi: "Capricorn" },
  { index: 23, name: "Dhanishta", tamilName: "அவிட்டம்", gana: "Rakshasa", rajju: "Siro", yoni: "Lion", defaultRasi: "Aquarius" },
  { index: 24, name: "Shatabhisha", tamilName: "சதயம்", gana: "Manusha", rajju: "Kanda", yoni: "Horse", defaultRasi: "Aquarius" },
  { index: 25, name: "Purva Bhadrapada", tamilName: "பூரட்டாதி", gana: "Manusha", rajju: "Udara", yoni: "Lion", defaultRasi: "Pisces" },
  { index: 26, name: "Uttara Bhadrapada", tamilName: "உத்திரட்டாதி", gana: "Deva", rajju: "Uru", yoni: "Cow", defaultRasi: "Pisces" },
  { index: 27, name: "Revati", tamilName: "ரேவதி", gana: "Deva", rajju: "Pada", yoni: "Elephant", defaultRasi: "Pisces" }
];

export const RASIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const RASI_TAMIL: Record<string, string> = {
  "Aries": "மேஷம் (Mesham)",
  "Taurus": "ரிஷபம் (Rishabham)",
  "Gemini": "மிதுனம் (Mithunam)",
  "Cancer": "கடகம் (Kadagam)",
  "Leo": "சிம்மம் (Simmam)",
  "Virgo": "கன்னி (Kanni)",
  "Libra": "துலாம் (Thulam)",
  "Scorpio": "விருச்சிகம் (Viruchigam)",
  "Sagittarius": "தனுசு (Dhanusu)",
  "Capricorn": "மகரம் (Magaram)",
  "Aquarius": "கும்பம் (Kumbam)",
  "Pisces": "மீனம் (Meenam)"
};

// Lord mapping for Rasi Athipathi Porutham
export const RASI_LORDS: Record<string, string> = {
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
};

// Friendship matrix for Rasi Athipathi Porutham
// 1 = Friend (Uthamam), 0.5 = Neutral (Madhyamam), 0 = Enemy (Adhamam)
const LORD_FRIENDSHIP: Record<string, Record<string, number>> = {
  "Sun": { "Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 0.5, "Jupiter": 1, "Venus": 0, "Saturn": 0 },
  "Moon": { "Sun": 1, "Moon": 1, "Mars": 0.5, "Mercury": 1, "Jupiter": 0.5, "Venus": 0.5, "Saturn": 0.5 },
  "Mars": { "Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 0, "Jupiter": 1, "Venus": 0.5, "Saturn": 0.5 },
  "Mercury": { "Sun": 0.5, "Moon": 0, "Mars": 0.5, "Mercury": 1, "Jupiter": 0.5, "Venus": 1, "Saturn": 1 },
  "Jupiter": { "Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 0, "Jupiter": 1, "Venus": 0.5, "Saturn": 0.5 },
  "Venus": { "Sun": 0, "Moon": 0, "Mars": 0.5, "Mercury": 1, "Jupiter": 0.5, "Venus": 1, "Saturn": 1 },
  "Saturn": { "Sun": 0, "Moon": 0, "Mars": 0, "Mercury": 1, "Jupiter": 0.5, "Venus": 1, "Saturn": 1 }
};

// Hostile/Incompatible Yoni Pairs
const YONI_HOSTILITY: Record<string, string> = {
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
};

// Vedha mutual hostile star pairs
const VEDHA_PAIRS: Record<number, number> = {
  1: 18, 18: 1,   // Ashwini - Jyeshtha
  2: 17, 17: 2,   // Bharani - Anuradha
  3: 16, 16: 3,   // Krittika - Vishakha
  4: 15, 15: 4,   // Rohini - Swati
  6: 22, 22: 6,   // Ardra - Shravana
  7: 21, 21: 7,   // Punarvasu - Uttarashadha
  8: 20, 20: 8,   // Pushya - Purvashadha
  9: 19, 19: 9,   // Ashlesha - Mula
  10: 27, 27: 10, // Magha - Revati
  11: 26, 26: 11, // Purva Phalguni - Uttara Bhadrapada
  12: 25, 25: 12, // Uttara Phalguni - Purva Bhadrapada
  13: 24, 24: 13, // Hasta - Shatabhisha
  14: 23, 23: 14  // Chitra - Dhanishta
};

// Vasya compatible maps
const VASYA_MAP: Record<string, string[]> = {
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
};

export function calculatePorutham(brideStarName: string, groomStarName: string): MatchingResult {
  const bride = NAKSHATRAS.find(n => n.name === brideStarName) || NAKSHATRAS[0];
  const groom = NAKSHATRAS.find(n => n.name === groomStarName) || NAKSHATRAS[1];

  const results: PoruthamResult[] = [];

  // 1. Dina Porutham (Health and General Welfare)
  // Distance from bride star to groom star
  const starDistance = ((groom.index - bride.index + 27) % 27) + 1;
  const dinaRemainder = starDistance % 9;
  
  let dinaStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let dinaScore = 0;
  let dinaDesc = "";

  if ([2, 4, 6, 8, 0].includes(dinaRemainder)) {
    dinaStatus = 'Uthamam';
    dinaScore = 1;
    dinaDesc = "Favorable. Indicates robust health, active immunity, and long life for the couple.";
  } else if ([3, 5, 7].includes(dinaRemainder)) {
    dinaStatus = 'Adhamam';
    dinaScore = 0;
    dinaDesc = "Inauspicious. Indicates occasional minor health setbacks or arguments.";
  } else {
    // remainder is 1 (Janma Nakshatra distance)
    if (starDistance === 1) {
      dinaStatus = 'Adhamam';
      dinaScore = 0;
      dinaDesc = "Janma Nakshatra match. Not recommended due to potential mental stress.";
    } else {
      dinaStatus = 'Madhyamam';
      dinaScore = 0.5;
      dinaDesc = "Neutral combination. Moderate stability in general health.";
    }
  }
  results.push({ name: 'Dina', label: 'Dina Porutham (Longevity & Health)', status: dinaStatus, score: dinaScore, description: dinaDesc });

  // 2. Gana Porutham (Mental Compatibility / Temperament)
  let ganaStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let ganaScore = 0;
  let ganaDesc = "";

  if (bride.gana === groom.gana) {
    ganaStatus = 'Uthamam';
    ganaScore = 1;
    ganaDesc = `Both are ${bride.gana} Gana. Excellent tuning, identical perspectives, and solid mental chemistry.`;
  } else if (bride.gana === "Deva" && groom.gana === "Manusha") {
    ganaStatus = 'Uthamam';
    ganaScore = 1;
    ganaDesc = "Deva bride with Manusha groom. High mental understanding and harmonious living.";
  } else if (bride.gana === "Manusha" && groom.gana === "Deva") {
    ganaStatus = 'Uthamam';
    ganaScore = 1;
    ganaDesc = "Manusha bride with Deva groom. Balanced temperament and mutual respect.";
  } else if (bride.gana === "Deva" && groom.gana === "Rakshasa") {
    ganaStatus = 'Madhyamam';
    ganaScore = 0.5;
    ganaDesc = "Deva bride with Rakshasa groom. Substantial adjustment is required; medium match.";
  } else {
    ganaStatus = 'Adhamam';
    ganaScore = 0;
    ganaDesc = `Incompatible temperament (${bride.gana} vs ${groom.gana}). Leads to occasional conflicts.`;
  }
  results.push({ name: 'Gana', label: 'Gana Porutham (Temperament Matching)', status: ganaStatus, score: ganaScore, description: ganaDesc });

  // 3. Mahendra Porutham (Progeny / Children and Family growth)
  let mahendraStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let mahendraScore = 0;
  let mahendraDesc = "";

  const mahendraList = [4, 7, 10, 13, 16, 19, 22, 25];
  if (mahendraList.includes(starDistance)) {
    mahendraStatus = 'Uthamam';
    mahendraScore = 1;
    mahendraDesc = "Excellent Mahendra matching. Assures healthy children, family legacy, and stable prosperity.";
  } else {
    mahendraStatus = 'Adhamam';
    mahendraScore = 0;
    mahendraDesc = "Average alignment. May require remedies or focus on physical health.";
  }
  results.push({ name: 'Mahendra', label: 'Mahendra Porutham (Progeny Growth)', status: mahendraStatus, score: mahendraScore, description: mahendraDesc });

  // 4. Stree Deerga Porutham (Well-being of the Bride)
  let streeStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let streeScore = 0;
  let streeDesc = "";

  if (starDistance > 13) {
    streeStatus = 'Uthamam';
    streeScore = 1;
    streeDesc = `Favorable distance of ${starDistance} stars. Guarantees safety, happiness, and prolonged wealth for the bride.`;
  } else if (starDistance >= 9 && starDistance <= 13) {
    streeStatus = 'Madhyamam';
    streeScore = 0.5;
    streeDesc = `Moderate star distance of ${starDistance}. Favorable environment but requires normal adjustments.`;
  } else {
    streeStatus = 'Adhamam';
    streeScore = 0;
    streeDesc = "Star distance is close. Normal expectations; bride requires support from husband's family.";
  }
  results.push({ name: 'StreeDeerga', label: 'Stree Deerga Porutham (Bride Prosperity)', status: streeStatus, score: streeScore, description: streeDesc });

  // 5. Yoni Porutham (Sexual & Physical Affinity)
  let yoniStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let yoniScore = 0;
  let yoniDesc = "";

  if (bride.yoni === groom.yoni) {
    yoniStatus = 'Uthamam';
    yoniScore = 1;
    yoniDesc = `Perfect physical fit! Same animal archetype (${bride.yoni}). Supreme intimate alignment and satisfaction.`;
  } else if (YONI_HOSTILITY[bride.yoni] === groom.yoni) {
    yoniStatus = 'Adhamam';
    yoniScore = 0;
    yoniDesc = `Hostile Yoni match (${bride.yoni} vs ${groom.yoni}). Natural instinctual mismatch; may lead to tension.`;
  } else {
    yoniStatus = 'Madhyamam';
    yoniScore = 0.5;
    yoniDesc = `Harmonious blend of different animals (${bride.yoni} and ${groom.yoni}). Peaceful physical relationship.`;
  }
  results.push({ name: 'Yoni', label: 'Yoni Porutham (Physical Attraction)', status: yoniStatus, score: yoniScore, description: yoniDesc });

  // 6. Rasi Porutham (Zodiac compatibility)
  const brideRasiIdx = RASIS.indexOf(bride.defaultRasi) + 1;
  const groomRasiIdx = RASIS.indexOf(groom.defaultRasi) + 1;
  const rasiDiff = ((groomRasiIdx - brideRasiIdx + 12) % 12) + 1;

  let rasiStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let rasiScore = 0;
  let rasiDesc = "";
  let hasRasiDosham = false;

  if (rasiDiff === 1) {
    rasiStatus = 'Madhyamam';
    rasiScore = 0.5;
    rasiDesc = "Same Rasi. Acceptable alignment with occasional dynamic arguments.";
  } else if (rasiDiff === 7) {
    rasiStatus = 'Uthamam';
    rasiScore = 1;
    rasiDesc = "Samasapthama (1-7 axis) match. Highly auspicious, perfect mirror harmony.";
  } else if ([2, 6, 8, 12].includes(rasiDiff)) {
    rasiStatus = 'Adhamam';
    rasiScore = 0;
    hasRasiDosham = true;
    if (rasiDiff === 6 || rasiDiff === 8) {
      rasiDesc = "Shashtashtaga (6-8) relationship. Extreme astrological friction. Caution is strongly advised.";
    } else {
      rasiDesc = `Dwirdwadasa (${rasiDiff}) relationship. Points to potential extra expenditure or traveling.`;
    }
  } else {
    rasiStatus = 'Uthamam';
    rasiScore = 1;
    rasiDesc = `Favorable Rasi placement (${rasiDiff} houses apart). Enhances mutual mental progress.`;
  }
  results.push({ name: 'Rasi', label: 'Rasi Porutham (Zodiac Match)', status: rasiStatus, score: rasiScore, description: rasiDesc });

  // 7. Rasi Athipathi Porutham (Ruling Lord Friendship)
  const brideLord = RASI_LORDS[bride.defaultRasi];
  const groomLord = RASI_LORDS[groom.defaultRasi];
  const friendshipVal1 = LORD_FRIENDSHIP[brideLord]?.[groomLord] ?? 0.5;
  const friendshipVal2 = LORD_FRIENDSHIP[groomLord]?.[brideLord] ?? 0.5;
  const finalFriendship = (friendshipVal1 + friendshipVal2) / 2;

  let lordStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let lordScore = 0;
  let lordDesc = "";

  if (finalFriendship >= 0.8) {
    lordStatus = 'Uthamam';
    lordScore = 1;
    lordDesc = `Planetary Lords are close friends (${brideLord} & ${groomLord}). Harmonious relationship with extended families.`;
  } else if (finalFriendship >= 0.5) {
    lordStatus = 'Madhyamam';
    lordScore = 0.5;
    lordDesc = `Neutral Planetary Lords relationship. Standard respect and peaceful coexistence.`;
  } else {
    lordStatus = 'Adhamam';
    lordScore = 0;
    lordDesc = `Conflicting Planetary Lords (${brideLord} & ${groomLord}). Leads to minor dispute points.`;
  }
  results.push({ name: 'RasiAthipathi', label: 'Rasi Athipathi Porutham (Lord Harmony)', status: lordStatus, score: lordScore, description: lordDesc });

  // 8. Vasya Porutham (Magnetism / Mutual Attraction)
  let vasyaStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let vasyaScore = 0;
  let vasyaDesc = "";

  const brideAttracts = VASYA_MAP[bride.defaultRasi] || [];
  const groomAttracts = VASYA_MAP[groom.defaultRasi] || [];

  if (brideAttracts.includes(groom.defaultRasi) || groomAttracts.includes(bride.defaultRasi)) {
    vasyaStatus = 'Uthamam';
    vasyaScore = 1;
    vasyaDesc = "Auspicious Vasya alignment. Deep romantic magnetism and unbreakable lifetime bonding.";
  } else {
    vasyaStatus = 'Adhamam';
    vasyaScore = 0;
    vasyaDesc = "Ordinary compatibility level. Mutual love develops with time and maturity.";
  }
  results.push({ name: 'Vasya', label: 'Vasya Porutham (Vibrational Attraction)', status: vasyaStatus, score: vasyaScore, description: vasyaDesc });

  // 9. Rajju Porutham (Critical life-thread / No Rajju Dosham)
  let rajjuStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let rajjuScore = 0;
  let rajjuDesc = "";
  let hasRajjuDosham = false;

  if (bride.rajju === groom.rajju) {
    rajjuStatus = 'Adhamam';
    rajjuScore = 0;
    hasRajjuDosham = true;
    rajjuDesc = `Rajju Dosham is Present! Both belong to ${bride.rajju} Rajju. High astrological risk. Match not advised.`;
  } else {
    rajjuStatus = 'Uthamam';
    rajjuScore = 1;
    rajjuDesc = `Sufficient Rajju protection. Bride belongs to ${bride.rajju} Rajju and Groom belongs to ${groom.rajju} Rajju. Safe match.`;
  }
  results.push({ name: 'Rajju', label: 'Rajju Porutham (Vital Life-Thread Protection)', status: rajjuStatus, score: rajjuScore, description: rajjuDesc });

  // 10. Vedha Porutham (Affliction Avoidance)
  let vedhaStatus: 'Uthamam' | 'Madhyamam' | 'Adhamam' = 'Adhamam';
  let vedhaScore = 0;
  let vedhaDesc = "";
  let hasVedhaDosham = false;

  if (VEDHA_PAIRS[bride.index] === groom.index) {
    vedhaStatus = 'Adhamam';
    vedhaScore = 0;
    hasVedhaDosham = true;
    vedhaDesc = "Vedha affliction is present. Mutual conflict or distress warning.";
  } else {
    vedhaStatus = 'Uthamam';
    vedhaScore = 1;
    vedhaDesc = "No Vedha affliction. Beautiful harmony and peace in day-to-day decisions.";
  }
  results.push({ name: 'Vedha', label: 'Vedha Porutham (Affliction Avoidance)', status: vedhaStatus, score: vedhaScore, description: vedhaDesc });

  // Compute Total and classification
  const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
  const percentage = Math.round((totalScore / 10) * 100);

  let rating: 'Excellent' | 'Good' | 'Average' | 'Low' = 'Low';
  let verdict = "Low compatibility. Star matchmaking indicates high friction points.";

  if (totalScore >= 7.5 && !hasRajjuDosham) {
    rating = 'Excellent';
    verdict = "Highly Recommended Match! Superb physical, mental, and physical affinity with zero major doshams.";
  } else if (totalScore >= 5.5 && !hasRajjuDosham) {
    rating = 'Good';
    verdict = "Recommended Match. Good compatibility in emotional and family values with solid protection.";
  } else if (totalScore >= 3.5 && !hasRajjuDosham) {
    rating = 'Average';
    verdict = "Average compatibility. Can proceed if individual horoscopes (Chevvai/Mars/Dasa) are well balanced.";
  } else {
    rating = 'Low';
    if (hasRajjuDosham) {
      verdict = "Not Recommended. Rajju Dosham is present which may invite stress or progeny delays.";
    } else {
      verdict = "Low compatibility. Multiple critical parameters like Gana or Rasi are mismatching.";
    }
  }

  return {
    poruthamScores: results,
    totalScore,
    percentage,
    rating,
    hasRajjuDosham,
    hasVedhaDosham,
    hasRasiDosham,
    verdict
  };
}

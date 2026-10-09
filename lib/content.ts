// Bilingual (Marathi / English) static content for the public site (Home, Announcements).
// Edit text here — components never hard-code copy.
export type Lang = "mr" | "en";
export type Bi = { mr: string; en: string };

export const journey: { y: string; tag: Bi; d: Bi }[] = [
  { y: "2026", tag: { mr: "मोजमाप (MEASURE)", en: "MEASURE" }, d: { mr: "Learning चे मोजमाप सुरू करू आणि योग्य Benchmarks निश्चित करू.", en: "Begin measuring learning and establish meaningful benchmarks." } },
  { y: "2027", tag: { mr: "सुधारणा (IMPROVE)", en: "IMPROVE" }, d: { mr: "मिळालेल्या माहितीचा वापर करून Learning Practices मध्ये सातत्याने सुधारणा करू.", en: "Use what we learn to continuously improve learning practices." } },
  { y: "2028", tag: { mr: "उत्कृष्टता (EXCEL)", en: "EXCEL" }, d: { mr: "Learning मधील उत्कृष्टतेचा गौरव आणि उत्सव साजरा करू.", en: "Celebrate and recognise excellence in learning." } },
];

export const leaderboardChips: Bi[] = [
  { mr: "ALC", en: "ALC" },
  { mr: "जिल्हा (District)", en: "District" },
  { mr: "Recognition Level", en: "Recognition Level" },
  { mr: "कामगिरी (Performance)", en: "Performance" },
  { mr: "वाढ (Growth)", en: "Growth" },
];

export const progressChips: Bi[] = [
  { mr: "सद्यस्थिती गुण (Current Score)", en: "Current Score" },
  { mr: "Recognition Level", en: "Recognition Level" },
  { mr: "Index-निहाय कामगिरी", en: "Index-wise Performance" },
  { mr: "Target Achievement", en: "Target Achievement" },
  { mr: "वाढ (Growth)", en: "Growth" },
  { mr: "Learning Excellence", en: "Learning Excellence" },
  { mr: "Bonus / Credits", en: "Bonus / Credits" },
  { mr: "पुढील Level कडे वाटचाल", en: "Progress towards the next level" },
];

/* ---- Index 1: Business Growth ---- */
export const businessGrowthUrban = [
  { param: { mr: "MS-CIT Admissions", en: "MS-CIT Admissions" }, target: 425, points: 200 },
  { param: { mr: "KLiC Admissions", en: "KLiC Admissions" }, target: 250, points: 100 },
  { param: { mr: "CCTP Admissions", en: "CCTP Admissions" }, target: 150, points: 50 },
];
export const businessGrowthRural = [
  { param: { mr: "MS-CIT Admissions", en: "MS-CIT Admissions" }, target: 250, points: 200 },
  { param: { mr: "KLiC Admissions", en: "KLiC Admissions" }, target: 125, points: 100 },
  { param: { mr: "CCTP Admissions", en: "CCTP Admissions" }, target: 75, points: 50 },
];

/* ---- Index 2: Ecosystem Participation ---- */
export const ecosystemRows = [
  { init: { mr: "MoM", en: "MoM" }, measure: { mr: "District Target साध्य (Dashboard)", en: "District target achieved (Dashboard)" }, target: 100, points: 50 },
  { init: { mr: "AI Masterclass", en: "AI Masterclass" }, measure: { mr: "Target साध्य (Dashboard)", en: "Target achieved (Dashboard)" }, target: 250, points: 60 },
  { init: { mr: "SSC / HSC", en: "SSC / HSC" }, measure: { mr: "आयोजित. SOLAR वर DCUs verify व Confirm करतील", en: "Conducted. SOLAR, DCUs to verify & Confirm" }, target: 250, points: 60 },
  { init: { mr: "ODOT 1", en: "ODOT 1" }, measure: { mr: "सहभाग नोंदवला", en: "Participated" }, target: null, points: 15 },
  { init: { mr: "ODOT 2", en: "ODOT 2" }, measure: { mr: "सहभाग नोंदवला", en: "Participated" }, target: null, points: 15 },
];

/* ---- Index 3: Learning Excellence — MS-CIT ---- */
export const learningMSCIT = [
  { m: { mr: "वेळेत शिक्षणाची सुरुवात", en: "Timely Learning Start" }, d: { mr: "Admission Confirmation नंतर अपेक्षित कालावधीत Learner ने ERA वरील शिक्षणास प्रारंभ केला का?", en: "Did the learner start learning on ERA within the expected period after admission confirmation?" }, points: 20 },
  { m: { mr: "सातत्यपूर्ण शिक्षण", en: "Learning Consistency" }, d: { mr: "Learner ने ERA वर नियमित व सातत्यपूर्ण पद्धतीने शिक्षण घेतले, की शेवटच्या टप्प्यात एकत्रित (Bunched) शिक्षण पूर्ण केले?", en: "Did the learner study on ERA regularly and consistently, or complete it in a last-minute bunch?" }, points: 20 },
  { m: { mr: "अभ्यासक्रम पूर्णता", en: "Course Completion" }, d: { mr: "निर्धारित Learning Sessions व Course पूर्ण करण्यासाठी आवश्यक अनिवार्य बाबी यशस्वीरीत्या पूर्ण केल्या का?", en: "Were all required learning sessions and mandatory course-completion elements finished?" }, points: 20 },
  { m: { mr: "बायोमेट्रिक उपस्थिती", en: "Biometric Attendance" }, d: { mr: "Learner ने ALC मध्ये नियमित प्रत्यक्ष उपस्थिती राखली का?", en: "Did the learner maintain regular physical attendance at the ALC?" }, points: 20 },
  { m: { mr: "Learner App वापर", en: "Learner App Usage" }, d: { mr: "Learner ने Learner App Download करून Activate केले व वापरास सुरुवात केली का?", en: "Did the learner download, activate and start using the Learner App?" }, points: 20 },
  { m: { mr: "यशस्वी प्रमाणपत्र प्राप्ती", en: "Certification Success" }, d: { mr: "Learner ने संपूर्ण प्रवास पूर्ण करून परीक्षा दिली व प्रमाणपत्र (Certification) प्राप्त केले का?", en: "Did the learner complete the journey, take the exam, and earn certification?" }, points: 20 },
];

export const learningKLiC = [
  { m: { mr: "वेळेत शिक्षणाची सुरुवात", en: "Timely Learning Start" }, d: { mr: "Learning Access मिळाल्यानंतर अपेक्षित कालावधीत ERA वरील शिक्षणास प्रारंभ केला का?", en: "Did the learner start ERA learning within the expected period after access was granted?" }, points: 20 },
  { m: { mr: "सातत्यपूर्ण शिक्षण", en: "Learning Consistency" }, d: { mr: "ERA वर नियमित व सातत्यपूर्ण पद्धतीने शिक्षण घेतले, की शेवटच्या टप्प्यात एकत्रित शिक्षण पूर्ण केले?", en: "Was learning regular and consistent, or bunched at the end?" }, points: 20 },
  { m: { mr: "अभ्यासक्रम पूर्णता", en: "Course Completion" }, d: { mr: "निर्धारित Sessions व अनिवार्य बाबी यशस्वीरीत्या पूर्ण केल्या का?", en: "Were required sessions and mandatory elements completed successfully?" }, points: 20 },
  { m: { mr: "यशस्वी प्रमाणपत्र प्राप्ती", en: "Certification Success" }, d: { mr: "परीक्षा देऊन प्रमाणपत्र यशस्वीरीत्या प्राप्त केले का?", en: "Was the exam taken and certification successfully earned?" }, points: 20 },
];

/* ---- Index 4: Professional Excellence ---- */
export const professionalRows = [
  { param: { mr: "Meeting Attendance", en: "Meeting Attendance" }, measure: { mr: "उपस्थिती % — DCU कडून", en: "Attendance %: from DCU" }, evidence: { mr: "Attendance Register", en: "Attendance Register" }, points: 25 },
  { param: { mr: "Examination Compliance (CCTV)", en: "Examination Compliance (CCTV)" }, measure: { mr: "DCU", en: "DCU" }, evidence: { mr: "Audit Report", en: "Audit Report" }, points: 25 },
  { param: { mr: "Social Media Presence", en: "Social Media Presence" }, measure: { mr: "DCU Approved", en: "DCU Approved" }, evidence: { mr: "Link", en: "link" }, points: 25 },
  { param: { mr: "Month-wise Enrolment Consistency", en: "Month-wise Enrolment Consistency" }, measure: { mr: "प्रत्येक महिन्यात Admissions", en: "Admissions in every month" }, evidence: { mr: "SOLAR", en: "SOLAR" }, points: 25 },
];

/* ---- Glance / Contents table ---- */
export const glanceRows = [
  { n: 1, idx: { mr: "Business Growth Index", en: "Business Growth Index" }, max: 350, min: 88, bonus: { mr: "खालील तक्त्याप्रमाणे", en: "As per table below" } },
  { n: 2, idx: { mr: "Ecosystem Participation Index", en: "Ecosystem Participation Index" }, max: 200, min: 50, bonus: { mr: "खालील तक्त्याप्रमाणे", en: "As per table below" } },
  { n: 3, idx: { mr: "Learning Excellence Index", en: "Learning Excellence Index" }, max: 200, min: 30, bonus: { mr: "मर्यादा नाही (NO LIMIT)", en: "NO LIMIT" } },
  { n: 4, idx: { mr: "Professional Excellence Index", en: "Professional Excellence Index" }, max: 100, min: 25, bonus: { mr: "खालील तक्त्याप्रमाणे", en: "As per table below" } },
];

export const awardLevels = [
  { level: { mr: "Platinum", en: "Platinum" }, pct: "90% & above", score: "765+" },
  { level: { mr: "Gold", en: "Gold" }, pct: "75% – 89.9%", score: "637 – 764" },
  { level: { mr: "Silver", en: "Silver" }, pct: "60% – 74.9%", score: "510 – 636" },
  { level: { mr: "Bronze", en: "Bronze" }, pct: "50% – 59.9%", score: "425 – 509" },
];

export const bonusSlabs = [
  { range: { mr: "Target पेक्षा 10% पर्यंत जास्त", en: "Till 10% beyond the target" }, rate: { mr: "काहीही नाही", en: "None" } },
  { range: { mr: "10.1% ते 40%", en: "Between 10.1% to 40%" }, rate: { mr: "Max. Points च्या 35%", en: "35% of the Max. Points" } },
  { range: { mr: "40.1% ते 80%", en: "Between 40.1% to 80%" }, rate: { mr: "Max. Points च्या 75%", en: "75% of the Max. Points" } },
  { range: { mr: "80.1% ते 100%", en: "Between 80.1% to 100%" }, rate: { mr: "Max. Points च्या 100%", en: "100% of the Max. Points" } },
  { range: { mr: "Target च्या पलीकडे (100% हून अधिक)", en: "Beyond 100% of the target" }, rate: { mr: "Max. Points च्या 120%", en: "120% of the Max. Points" } },
];

export const contestNorms: Bi[] = [
  { mr: "Contest ची अंतिम तारीख: 30 नोव्हेंबर 2026.", en: "Last date of contest: 30 November 2026." },
  { mr: "1 जानेवारी 2026 ते 30 नोव्हेंबर 2026 दरम्यान झालेल्या सर्व Admissions गणल्या जातील.", en: "All admissions done from Jan 1, 2026 till 30th Nov. 2026 will be counted." },
  { mr: "Course च्या तासांचा विचार न करता प्रत्येक Admission ही ONE म्हणूनच गणली जाईल.", en: "Every admission is counted as ONE, irrespective of course hours." },
  { mr: "Eligibility Floor: प्रत्येक Index मध्ये सहभाग असणे आवश्यक आहे.", en: "Eligibility Floor: Participation in every Index is required." },
  { mr: "Excellence Bonus स्वतंत्र, Uncapped आणि Accelerating आहे — Target च्या पलीकडे मिळणाऱ्या प्रत्येक गुणासाठी Slab-निहाय दराने Bonus मिळतो.", en: "Excellence Bonus is separate, uncapped, and accelerating — every point beyond target earns a bonus, applied slab by slab." },
  { mr: "Growth Bonus हा 850 गुणांमध्ये जोडला जात नाही व Recognition Level बदलत नाही — तो फक्त एकाच Level मधील ALCs ना खऱ्या वाढीनुसार क्रमवारी देण्यासाठी वापरला जातो.", en: "The Growth Bonus is not added to the 850 and does not change the recognition level — it only ranks centres within the same level by real growth." },
  { mr: "Bonus ची गणना प्रत्येक Index साठी आणि Index मधील प्रत्येक Parameter साठी स्वतंत्रपणे केली जाते.", en: "The bonus is computed separately for every index and for every parameter within the index." },
];

export const recognitionSentence: Bi[] = [
  { mr: "Business वाढवा.", en: "Grow the business." },
  { mr: "प्रत्येक Learner ला पुढे घेऊन जा.", en: "Progress every learner." },
  { mr: "MKCL Ecosystem आपलेसे करा.", en: "Embrace the MKCL ecosystem." },
  { mr: "Learning Excellence घडवा.", en: "Build learning excellence." },
  { mr: "व्यावसायिकतेने कार्य करा.", en: "Operate professionally." },
  { mr: "जिल्ह्याचे रूपांतर घडवा.", en: "Transform the district." },
];

/* ---------------- Announcements (edit this list to publish new updates) ---------------- */
export type Announcement = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  tag: "launch" | "deadline" | "rule" | "update";
  pinned?: boolean;
  title: Bi;
  body: Bi;
};

export const announcements: Announcement[] = [
  {
    id: "contest-launch",
    date: "2026-01-01",
    tag: "launch",
    pinned: true,
    title: { mr: "Vidarbha East Race to Recognition 2026-27 सुरू", en: "Vidarbha East Race to Recognition 2026-27 is live" },
    body: {
      mr: "Business Growth, Ecosystem Participation, Learning Excellence आणि Professional Excellence — चार Indices, एकूण 850 गुण. आपल्या ALC ची स्थिती Dashboard वर पहा.",
      en: "Business Growth, Ecosystem Participation, Learning Excellence and Professional Excellence — four indices, 850 points in total. Check your ALC's position on the Dashboard.",
    },
  },
  {
    id: "contest-deadline",
    date: "2026-11-30",
    tag: "deadline",
    pinned: true,
    title: { mr: "Contest ची अंतिम तारीख: 30 नोव्हेंबर 2026", en: "Contest last date: 30 November 2026" },
    body: {
      mr: "1 जानेवारी 2026 ते 30 नोव्हेंबर 2026 दरम्यान झालेल्या सर्व Admissions गणल्या जातील. प्रत्येक Admission ONE म्हणून गणली जाते.",
      en: "All admissions done between 1 January 2026 and 30 November 2026 will be counted. Every admission counts as ONE.",
    },
  },
  {
    id: "eligibility-floor",
    date: "2026-01-01",
    tag: "rule",
    title: { mr: "Eligibility Floor — प्रत्येक Index मध्ये सहभाग आवश्यक", en: "Eligibility Floor — participate in every Index" },
    body: {
      mr: "Recognition Level मिळवण्यासाठी प्रत्येक Index मध्ये किमान गुण आवश्यक: Index 1 ≥ 88, Index 2 ≥ 50, Index 3 ≥ 30, Index 4 ≥ 25.",
      en: "To earn a Recognition Level you must clear the minimum in every Index: Index 1 ≥ 88, Index 2 ≥ 50, Index 3 ≥ 30, Index 4 ≥ 25.",
    },
  },
  {
    id: "dashboard-colours",
    date: "2026-01-01",
    tag: "update",
    title: { mr: "Home Dashboard — हिरवे व लाल गुण", en: "Home Dashboard — green and red points" },
    body: {
      mr: "हिरवे म्हणजे Eligible, लाल म्हणजे Not Eligible. Dashboard दर काही सेकंदांनी आपोआप अद्यतनित होतो.",
      en: "Green means Eligible and red means Not Eligible. The Dashboard refreshes automatically every few seconds.",
    },
  },
];

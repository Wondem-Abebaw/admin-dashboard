export const regions = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "SNNP",
  "Tigray",
];

export const Title = ["Ato", "Dr", "Prof", "Mr", "Mrs", "Miss", "Ms"];
const ArchiveReason: string[] = [
  "No Longer Needed",
  "Completed or Finalized",
  "Duplicate Entry",
  "Historical Reference",
  "Legal or Compliance Requirement",
  "Data Quality Issue",
  "Business Rule Change",
  "User Requested",
  "Inactive or Dormant",
  "It is incorrect and can't update it",
];

export const Constants = {
  ArchiveReason: [...ArchiveReason],

  UserArchiveReason: [
    ...ArchiveReason,
    "User has been terminated",
    "User has resigned",
  ],
};
const commonEducationLevel: string[] = [
  "Phd",
  "Masters",
  "Degree",
  "Diploma",
  "Higher Education",
];
export const educationLevel = {
  tutorEducationLevel: [
    ...commonEducationLevel,
    "High School",
    "Elementary School",
  ],
};

export const daysOfWeek: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const minutesOfHour: string[] = ["00", "15", "30", "45"];
export const gradeLevels: string[] = ["KG(1 - 3)", "1 - 6", "7 - 12"];
export const religions: string[] = [
  "Orthodox",
  "Muslim",
  "Protestant",
  "Catholic",
  "Other",
];
export const languages: string[] = [
  "English",
  "Amharic",
  "Afaan Oromo",
  "Tigrinya",
  "Somalia",
  "Sidama",
  "Gurage",
  "Wolayta",
  "Afar",
  "Hadiya",
  "Gamo",
  "Arabic",
  "Other",
];

export const specificLocationsList = [
  { value: "Megenagna", label: "Megenagna" },
  { value: "Bole", label: "Bole" },
  { value: "Piassa", label: "Piassa" },
  { value: "Arat Kilo", label: "Arat Kilo" },
  { value: "Kirkos", label: "Kirkos" },
  { value: "Mexico", label: "Mexico" },
  { value: "Sarbet", label: "Sarbet" },
  { value: "Gullele", label: "Gullele" },
  { value: "Kasanchis", label: "Kasanchis" },
  { value: "Lideta", label: "Lideta" },
  { value: "Sidist Kilo", label: "Sidist Kilo" },
  { value: "Bole Michael", label: "Bole Michael" },
  { value: "Yeka", label: "Yeka" },
  { value: "Kera", label: "Kera" },
  // Add more locations as needed
];
export const ethiopianCities = [
  { label: "Addis Ababa", value: "Addis Ababa" },
  { value: "Adama", label: "Adama" },
  { label: "Bahir Dar", value: "Bahir Dar" },
  { label: "Hawassa", value: "Hawassa" },
  { label: "Assosa", value: "Assosa" },
  { label: "Mojo", value: "Mojo" },
  { label: "Jimma", value: "Jimma" },
  { label: "Jijiga", value: "Jijiga" },
  { label: "Ziway", value: "Ziway" },
  { label: "Yirga Alem", value: "Yirga Alem" },
  { label: "Bishoftu", value: "Bishoftu" },
  { label: "Debre Tabor", value: "Debre Tabor" },
  { label: "Debre Markos", value: "Debre Markos" },
  { label: "Debre Birhan", value: "Debre Birhan" },
  { label: "Yabelo", value: "Yabelo" },
  { label: "Werota", value: "Werota" },
  { label: "Wenji", value: "Wenji" },
  { label: "Shashemene", value: "Shashemene" },
  { label: "Shambu", value: "Shambu" },
  { label: "Shakiso", value: "Shakiso" },
  { label: "Sebeta", value: "Sebeta" },
  { label: "Robit", value: "Robit" },
  { label: "Nejo", value: "Nejo" },
  { label: "Metu", value: "Metu" },
  { label: "Metahara", value: "Metahara" },
  { label: "Mek'ele", value: "Mek'ele" },
  { label: "Maychew", value: "Maychew" },
  { label: "Korem", value: "Korem" },
  { label: "Kibre Mengist", value: "Kibre Mengist" },
  { label: "Kemise", value: "Kemise" },
  { label: "Kombolcha", value: "Kombolcha" },
  { label: "Jinka", value: "Jinka" },
  { label: "Inda Silase", value: "Inda Silase" },
  { label: "Hosaaina", value: "Hosaaina" },
  { label: "Harar", value: "Harar" },
  { label: "Hagere Hiywet", value: "Hagere Hiywet" },
  { label: "El Bahay", value: "El Bahay" },
  { label: "Gondar", value: "Gondar" },
  { label: "Goba", value: "Goba" },
  { label: "Waliso", value: "Waliso" },
  { label: "Ginir", value: "Ginir" },
  { label: "Gimbi", value: "Gimbi" },
  { label: "Raqo", value: "Raqo" },
  { label: "Genet", value: "Genet" },
  { label: "Gelemso", value: "Gelemso" },
  { label: "Gebre Guracha", value: "Gebre Guracha" },
  { label: "Gambela", value: "Gambela" },
  { label: "Finote Selam", value: "Finote Selam" },
  { label: "Fiche", value: "Fiche" },
  { label: "Felege Neway", value: "Felege Neway" },
  { label: "Golwayn", value: "Golwayn" },
  { label: "Dubti", value: "Dubti" },
  { label: "Dodola", value: "Dodola" },
  { label: "Dire Dawa", value: "Dire Dawa" },
  { label: "Dilla", value: "Dilla" },
  { label: "Dessie", value: "Dessie" },
  { label: "Dembi Dolo", value: "Dembi Dolo" },
  { label: "Debark", value: "Debark" },
  { label: "Butajira", value: "Butajira" },
  { label: "Bure", value: "Bure" },
  { label: "Bonga", value: "Bonga" },
  { label: "Boditi", value: "Boditi" },
  { label: "Bichena", value: "Bichena" },
  { label: "Bedesa", value: "Bedesa" },
  { label: "Bedele", value: "Bedele" },
  { label: "Bata", value: "Bata" },
  { label: "Bako", value: "Bako" },
  { label: "Assbe Tefera", value: "Assbe Tefera" },
  { label: "Asaita", value: "Asaita" },
  { label: "Assosa", value: "Assosa" },
  { label: "Ä€reka", value: "Ä€reka" },
  { label: "Arba Minch", value: "Arba Minch" },
  { label: "Axum", value: "Axum" },
  { label: "Hagere Maryam", value: "Hagere Maryam" },
  { label: "Agaro", value: "Agaro" },
  { label: "Addis Zemen", value: "Addis Zemen" },
  { label: "Adigrat", value: "Adigrat" },
  { label: "Adet", value: "Adet" },
  { label: "Abomsa", value: "Abomsa" },
  { label: "Qorof", value: "Qorof" },
  { label: "Kahandhale", value: "Kahandhale" },
  { label: "Lasoano", value: "Lasoano" },
  { label: "Neefkuceliye", value: "Neefkuceliye" },
  { label: "Yamarugley", value: "Yamarugley" },
  { label: "Sodo", value: "Sodo" },
  { label: "Digih Habar Es", value: "Digih Habar Es" },
  { label: "Waal", value: "Waal" },
  { label: "Fadhigaradle", value: "Fadhigaradle" },
];
export const addisAbabaSubCities = [
  { label: "Addis Ketema", value: "Addis Ketema" },
  { label: "Akaky Kaliti", value: "Akaky Kaliti" },
  { label: "Arada", value: "Arada" },
  { label: "Bole", value: "Bole" },
  { label: "Gullele", value: "Gullele" },
  { label: "Kirkos", value: "Kirkos" },
  { label: "Kolfe Keranio", value: "Kolfe Keranio" },
  { label: "Lideta", value: "Lideta" },
  { label: "Nifas Silk-Lafto", value: "Nifas Silk-Lafto" },
  { label: "Yeka", value: "Yeka" },
  { label: "Lemi Kura", value: "Lemi Kura" },
];

export const ethiopianRegions = [
  { value: "Addis Ababa", label: "Addis Ababa" },
  { value: "Afar", label: "Afar" },
  { value: "Amhara", label: "Amhara" },
  { value: "Benishangul-Gumuz", label: "Benishangul-Gumuz" },
  { value: "Dire Dawa", label: "Dire Dawa" },
  { value: "Gambela", label: "Gambela" },
  { value: "Harari", label: "Harari" },
  { value: "Oromia", label: "Oromia" },
  { value: "Sidama", label: "Sidama" },
  { value: "Somali", label: "Somali" },
  { value: "SNNP", label: "SNNP" },
  { value: "Tigray", label: "Tigray" },
];
export const decodeMonth = (month: string) => {
  switch (month) {
    case "01":
      return "January";
    case "02":
      return "February";
    case "03":
      return "March";
    case "04":
      return "April";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "August";
    case "09":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    default:
      return "December";
  }
};

const statesData = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
    "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey",
    "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang",
    "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley",
    "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara",
    "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan",
    "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli",
    "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar",
    "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga",
    "Purnia", "Begusarai", "Katihar", "Munger", "Chhapra",
    "Arrah", "Bettiah", "Saharsa", "Sasaram", "Hajipur",
    "Motihari", "Nawada", "Jamui", "Buxar", "Kishanganj",
    "Sitamarhi", "Madhubani", "Samastipur", "Siwan", "Gopalganj",
    "Vaishali", "Banka", "Aurangabad", "Jehanabad", "Lakhisarai",
    "Sheikhpura", "Supaul", "Araria", "Kaimur", "Khagaria",
    "Madhepura", "Saran", "Sheohar", "West Champaran"
  ],
  "Chhattisgarh": [
    "Raipur", "Bilaspur", "Durg", "Korba", "Bastar",
    "Rajnandgaon", "Raigarh", "Janjgir-Champa", "Surguja", "Kanker",
    "Dhamtari", "Mahasamund", "Kawardha", "Koriya", "Jashpur",
    "Dantewada", "Kabirdham", "Balod", "Baloda Bazar", "Balrampur",
    "Bemetara", "Bijapur", "Gariaband", "Gaurela-Pendra-Marwahi",
    "Mungeli", "Narayanpur", "Sukma", "Surajpur"
  ],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
    "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Kheda",
    "Bharuch", "Mehsana", "Patan", "Sabarkantha", "Banaskantha",
    "Kutch", "Navsari", "Valsad", "Dahod", "Panchmahal",
    "Amreli", "Botad", "Porbandar", "Surendranagar", "Morbi",
    "Aravalli", "Mahisagar", "Chhota Udaipur", "Tapi", "Narmada",
    "Devbhoomi Dwarka", "Gir Somnath"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad",
    "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal",
    "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal",
    "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa",
    "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur",
    "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur",
    "Solan", "Una"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar",
    "Hazaribagh", "Giridih", "Koderma", "Chatra", "Gumla",
    "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh",
    "Sahibganj", "Simdega", "Singhbhum", "East Singhbhum", "West Singhbhum",
    "Garhwa", "Godda", "Jamtara", "Khunti", "Saraikela Kharsawan"
  ],
  "Karnataka": [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru",
    "Hubli-Dharwad", "Belagavi", "Kalaburagi", "Davanagere",
    "Ballari", "Vijayapura", "Shivamogga", "Tumakuru",
    "Raichur", "Bidar", "Hassan", "Mandya", "Udupi",
    "Chikkamagaluru", "Kodagu", "Chitradurga", "Kolar",
    "Bagalkot", "Gadag", "Haveri", "Koppal",
    "Yadgir", "Ramanagara", "Chamarajanagar", "Dakshina Kannada", "Uttara Kannada"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain",
    "Sagar", "Rewa", "Satna", "Ratlam", "Dewas",
    "Vidisha", "Chhindwara", "Shivpuri", "Damoh", "Mandsaur",
    "Khargone", "Neemuch", "Hoshangabad", "Sehore", "Betul",
    "Raisen", "Katni", "Singrauli", "Shahdol", "Balaghat",
    "Chhatarpur", "Tikamgarh", "Panna", "Datia", "Guna",
    "Ashoknagar", "Morena"
  ],
  "Maharashtra": [
    "Mumbai City", "Mumbai Suburban", "Thane", "Pune", "Nashik",
    "Nagpur", "Aurangabad", "Solapur", "Kolhapur", "Satara",
    "Sangli", "Ahmednagar", "Jalgaon", "Akola", "Amravati",
    "Latur", "Nanded", "Raigad", "Ratnagiri", "Sindhudurg",
    "Wardha", "Yavatmal", "Buldhana", "Chandrapur", "Gondia",
    "Bhandara", "Gadchiroli", "Hingoli", "Jalna", "Parbhani",
    "Beed", "Osmanabad", "Washim", "Dhule", "Nandurbar", "Palghar"
  ],
  "Manipur": [
    "Imphal East", "Imphal West", "Bishnupur", "Thoubal",
    "Kakching", "Kangpokpi", "Churachandpur", "Chandel",
    "Senapati", "Tamenglong", "Ukhrul", "Jiribam", "Noney",
    "Pherzawl", "Tengnoupal", "Kamjong"
  ],
  "Meghalaya": [
    "East Khasi Hills", "West Khasi Hills", "South West Khasi Hills",
    "Ri Bhoi", "East Jaintia Hills", "West Jaintia Hills",
    "East Garo Hills", "West Garo Hills", "South Garo Hills",
    "North Garo Hills", "South West Garo Hills"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai", "Mamit", "Kolasib",
    "Serchhip", "Lawngtlai", "Saiha", "Hnahthial", "Khawzawl",
    "Saitual"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha",
    "Zunheboto", "Phek", "Mon", "Longleng", "Kiphire",
    "Peren", "Noklak"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Puri", "Sambalpur", "Rourkela",
    "Berhampur", "Balasore", "Bargarh", "Bhadrak", "Boudh",
    "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur",
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar",
    "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur",
    "Nayagarh", "Nuapada", "Rayagada", "Subarnapur", "Sundargarh",
    "Angul", "Deogarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
    "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
    "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar",
    "Pathankot", "Patiala", "Rupnagar", "Sangrur", "SAS Nagar",
    "Shaheed Bhagat Singh Nagar", "Tarn Taran"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner",
    "Ajmer", "Alwar", "Bharatpur", "Bhilwara", "Chittorgarh",
    "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh",
    "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Karauli",
    "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur",
    "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Banswara",
    "Baran", "Barmer", "Bundi"
  ],
  "Sikkim": ["East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim"],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul",
    "Thanjavur", "Ranipet", "Sivaganga", "Karur", "Namakkal",
    "Krishnagiri", "Dharmapuri", "Cuddalore", "Villupuram", "Kanchipuram",
    "Tiruvallur", "Nagapattinam", "Pudukkottai", "Ramanathapuram",
    "Theni", "Virudhunagar", "Tiruvannamalai", "Nilgiris", "Ariyalur",
    "Perambalur", "Tiruppur", "Kallakurichi"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
    "Mahbubnagar", "Nalgonda", "Adilabad", "Medak", "Rangareddy",
    "Suryapet", "Siddipet", "Sangareddy", "Jagtial", "Mancherial",
    "Nirmal", "Peddapalli", "Jangaon", "Bhupalpally", "Kamareddy"
  ],
  "Tripura": [
    "West Tripura", "South Tripura", "North Tripura", "Dhalai",
    "Khowai", "Gomati", "Sepahijala", "Unakoti"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut",
    "Allahabad", "Ghaziabad", "Noida", "Bareilly", "Aligarh",
    "Moradabad", "Saharanpur", "Gorakhpur", "Faizabad", "Jhansi",
    "Mathura", "Firozabad", "Muzaffarnagar", "Rampur", "Shahjahanpur",
    "Sitapur", "Hardoi", "Unnao", "Raebareli", "Sultanpur",
    "Fatehpur", "Pratapgarh", "Kaushambi", "Banda", "Hamirpur",
    "Mahoba", "Jalaun", "Etah"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar",
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Pauri Garhwal",
    "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Uttarkashi"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas",
    "Hooghly", "Nadia", "Murshidabad", "Birbhum", "Bardhaman",
    "Malda", "North Dinajpur", "South Dinajpur", "Jalpaiguri",
    "Darjeeling", "Cooch Behar", "Alipurduar", "Purulia",
    "Bankura", "Paschim Medinipur", "Purba Medinipur", "Jhargram",
    "Kalimpong"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
    "North East Delhi", "North West Delhi", "Shahdara",
    "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Budgam",
    "Bandipora", "Kupwara", "Pulwama", "Shopian", "Kulgam",
    "Ganderbal", "Udhampur", "Kathua", "Samba", "Rajouri",
    "Poonch", "Doda", "Ramban", "Kishtwar", "Reasi"
  ],
  "Ladakh": ["Leh", "Kargil"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

export default statesData;

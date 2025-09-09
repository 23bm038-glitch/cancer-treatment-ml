document.getElementById("patientForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevent page reload

  // Get form data
  const formData = new FormData(event.target);
  const cancerType = formData.get("cancerType"); // "breast", "lung", "colon"
  const cancerStage = formData.get("cancerStage"); // I, II, III, IV
  const tumorGrade = formData.get("tumorGrade"); // low, intermediate, high

  // GitHub raw URLs for JSON files
  const treatmentUrl = `https://raw.githubusercontent.com/23bm038-glitch/cancer-treatment-ml/main/treatments/${cancerType}_cancer.json`;
  const hospitalUrl = `https://raw.githubusercontent.com/23bm038-glitch/cancer-treatment-ml/main/hospitals.json`;

  try {
    // Fetch the treatment JSON dynamically
    const treatmentResp = await fetch(treatmentUrl);
    const treatmentData = await treatmentResp.json();

    // Fetch hospital JSON
    const hospitalResp = await fetch(hospitalUrl);
    const hospitals = await hospitalResp.json();

    // Get treatments for the selected stage and tumor grade
    const suggestedTreatments = treatmentData.stages[cancerStage]?.[tumorGrade] || ["Consult specialist"];

    // Get top 3 hospitals for this cancer type
    const relevantHospitals = hospitals
      .filter(h => h.specialties.includes(cancerType))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    // Display results
    document.getElementById("result").innerHTML = `
      <h2>Treatment Suggestions:</h2>
      <ul>${suggestedTreatments.map(t => `<li>${t}</li>`).join('')}</ul>
      <h2>Recommended Hospitals:</h2>
      <ul>${relevantHospitals.map(h => `<li>${h.name} (${h.location}) - Rating: ${h.rating}</li>`).join('')}</ul>
    `;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("result").textContent = "Error loading data. Please try again.";
  }
});


   

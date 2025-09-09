document.getElementById("patientForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const cancerType = formData.get("cancerType");
  const cancerStage = formData.get("cancerStage");
  const tumorGrade = formData.get("tumorGrade");

  // Replace 'yourusername' with your GitHub username
  const treatmentUrl = `https://raw.githubusercontent.com/yourusername/cancer-treatment-data/main/treatments/${cancerType}_cancer.json`;
  const hospitalUrl = `https://raw.githubusercontent.com/yourusername/cancer-treatment-data/main/hospitals.json`;

  try {
    const treatmentResp = await fetch(treatmentUrl);
    const treatmentData = await treatmentResp.json();

    const hospitalResp = await fetch(hospitalUrl);
    const hospitals = await hospitalResp.json();

    // Get treatment plan
    const suggestedTreatments = treatmentData.stages[cancerStage]?.[tumorGrade] || ["Consult specialist"];

    // Get top hospitals
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
    console.error(error);
    document.getElementById("result").textContent = "Error loading data. Please try again.";
  }
});

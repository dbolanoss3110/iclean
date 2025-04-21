// Initialize EmailJS with your user ID
emailjs.init("HKiIThGpeT7T6eLPK");

// Shows an error SweetAlert
function showError(title, html) {
  Swal.fire({ icon: "error", title, html });
}

// Returns a list of missing fields
function getMissingFields() {
  const fields = [
    { id: "fullName", name: "Nombre" },
    { id: "phone", name: "Teléfono" },
    { id: "email", name: "Correo" },
  ];
  const missing = fields
    .filter((f) => !document.getElementById(f.id).value.trim())
    .map((f) => f.name);

  // Check each rating group
  if (!document.querySelector('input[name="limpieza"]:checked'))
    missing.push("Calificación limpieza");
  if (!document.querySelector('input[name="trato"]:checked')) missing.push("Calificación trato");
  if (!document.querySelector('input[name="comunicacion"]:checked'))
    missing.push("Calificación comunicación");

  return missing;
}

// Basic email format validation
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Collects all form values into an object
function collectParams() {
  return {
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    limpieza: document.querySelector('input[name="limpieza"]:checked').value,
    trato: document.querySelector('input[name="trato"]:checked').value,
    comunicacion: document.querySelector('input[name="comunicacion"]:checked').value,
    observacion: document.getElementById("observacion").value.trim(),
  };
}

// Populates and shows the confirmation modal
function showConfirmation(params) {
  document.getElementById("confirmBody").innerHTML = `
    <p><strong>Nombre:</strong> ${params.fullName}</p>
    <p><strong>Teléfono:</strong> ${params.phone}</p>
    <p><strong>Correo:</strong> ${params.email}</p>
    <p><strong>Limpieza:</strong> ${params.limpieza}</p>
    <p><strong>Trato del asesor:</strong> ${params.trato}</p>
    <p><strong>Comunicación:</strong> ${params.comunicacion}</p>
    <p><strong>Observación:</strong> ${params.observacion || "<em>Ninguna</em>"}</p>
  `;
  new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

// Sends the email via EmailJS
function sendEmail(params) {
  // replace with your own service/template IDs if son distintos
  return emailjs.send('service_blppxsc', 'template_02ckosv', params, 'HKiIThGpeT7T6eLPK');
}

// Main handler for form submit
document.getElementById("surveyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 1) Check missing fields
  const missing = getMissingFields();
  if (missing.length) {
    const list = missing.map((m) => `<li>${m}</li>`).join("");
    showError("Campos faltantes", `<ul>${list}</ul>`);
    return;
  }

  // 2) Validate email
  const email = document.getElementById("email").value.trim();
  if (!isEmailValid(email)) {
    showError("Correo inválido", "Ingrese un correo válido.");
    return;
  }

  // 3) Collect params and show confirmation
  const templateParams = collectParams();
  showConfirmation(templateParams);
});

// Handler para el botón de confirmar y enviar
document.getElementById("confirmSend").addEventListener("click", async () => {
  const params = collectParams();
  try {
    const res = await sendEmail(params);
    // success message
    Swal.fire({
      icon: "success",
      title: "¡Gracias!",
      text: "Tu encuesta ha sido enviada exitosamente.",
    });
    // reset the form
    document.getElementById("surveyForm").reset();
    // hide modal
    bootstrap.Modal.getInstance(document.getElementById("confirmModal")).hide();
  } catch (err) {
    console.error("EmailJS Error:", err);
    showError("Error al enviar", "Por favor intenta de nuevo más tarde.");
  }
});

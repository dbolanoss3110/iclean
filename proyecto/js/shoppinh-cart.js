
emailjs.init("HKiIThGpeT7T6eLPK");


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


const plans = [
  { name: "Plan Básico", price: 50 },
  { name: "Plan Estándar", price: 100 },
  { name: "Plan Premium", price: 150 }
];


function updatePrice() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  const priceElement = document.getElementById("planPrice"); 
  const discountCode = document.getElementById("discountCode").value; 

  if (selectedPlan) {
    const plan = plans.find(p => p.name === selectedPlan.value);
    let price = plan.price;

   
    price = getDiscountedPrice(price, discountCode);

 
    priceElement.textContent = `Precio: $${price.toFixed(2)}`;
  }
}


document.querySelectorAll('input[name="plan"]').forEach(input => {
  input.addEventListener("change", updatePrice);  
});

document.getElementById("discountCode").addEventListener("input", updatePrice);


function getDiscountedPrice(price, discountCode) {
  const condo = condominios.find(c => c.discountCode === discountCode);
  if (condo) {
  
    return price * (1 - condo.discountPercentage / 100);
  }
  return price; 
}


function showError(title, html) {
  Swal.fire({ icon: "error", title, html });
}


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


function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function isCardValid(num) {
  return num.replace(/\D/g, "").length === 16;
}


function isExpired(year, month) {
  const now = new Date();
  const exp = new Date(year, month - 1);
  return exp < new Date(now.getFullYear(), now.getMonth());
}

function collectParams() {
  const form = document.getElementById("serviceForm");
  const rawCard = form.cardNumber.value;
  const discountCode = form.discountCode.value;  
  let price = 0;

 
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  if (selectedPlan) {
    const plan = plans.find(p => p.name === selectedPlan.value);
    price = plan.price;
  }

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
    province: form.province.value,     
    address: form.address.value,  
    price: price  
  };
}


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


function sendEmail(params) {
  return emailjs.send("service_blppxsc", "template_d9ghdqa", params, "HKiIThGpeT7T6eLPK");
}


let currentParams = null;

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

  currentParams = collectParams();
  showConfirmation(currentParams);
});

function clearForm() {
  const form = document.getElementById("serviceForm");

  form.reset();

  const priceElement = document.getElementById("planPrice");
  priceElement.textContent = "Precio: $0.00"; 

  const radios = form.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => radio.checked = false);

  
  const discountCodeField = document.getElementById("discountCode");
  discountCodeField.value = "";


  const selects = form.querySelectorAll('select');
  selects.forEach(select => select.selectedIndex = 0);  
  document.getElementById("province").selectedIndex = 0;
  document.getElementById("address").value = "";
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => checkbox.checked = false);
}

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



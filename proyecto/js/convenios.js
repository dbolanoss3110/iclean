
// Open the Modal
function openModal() {
    document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    captionText.innerHTML = dots[slideIndex - 1].alt;
}

const condoList = document.getElementById('condominiumList');

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

// Cargar el dropdown con los nombres de los condominios
condominios.forEach(condo => {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.textContent = condo.name;
    li.setAttribute('data-condo', JSON.stringify(condo));  // Guardar los datos del condominio en un atributo data
    condoList.appendChild(li);
});

// Mostrar el card con los detalles del condominio cuando se hace clic
const condoDetailsCard = document.getElementById('condoDetailsCard');
const condoName = document.getElementById('condoName');
const condoDiscountCode = document.getElementById('condoDiscountCode');
const condoDiscountPercentage = document.getElementById('condoDiscountPercentage');
const provinceButton = document.getElementById('dropdownMenuButton');

condoList.addEventListener('click', function (event) {
    if (event.target.classList.contains('dropdown-item')) {
        const selectedCondo = JSON.parse(event.target.getAttribute('data-condo')); // Obtener los datos del condominio

        // Actualizar el contenido del card
        condoName.textContent = selectedCondo.name;
        condoDiscountCode.textContent = `Código de descuento: ${selectedCondo.discountCode}`;
        condoDiscountPercentage.textContent = `Descuento: ${selectedCondo.discountPercentage}%`;

        // Actualizar el texto del botón con el nombre del condominio seleccionado
        provinceButton.textContent = selectedCondo.name;

        // Mostrar el card
        condoDetailsCard.style.display = 'block';
    }
});
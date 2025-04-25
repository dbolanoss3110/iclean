
function showErrorAlert(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}


function clearFormFields() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';

    const provinceButton = document.getElementById('provinceButton');
    provinceButton.textContent = 'Selecciona una provincia';

    const provinceInput = document.getElementById('province');
    provinceInput.value = '';

}

(function () {
    'use strict'

    // Obtén el formulario
    var form = document.getElementById('contactForm')

    // Escucha el evento de envío del formulario
    form.addEventListener('submit', function (event) {
        
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;


        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const provinceButton = document.getElementById('provinceButton');

        if (firstName.value.trim() === '') {
            showErrorAlert('El nombre es obligatorio.');
            isValid = false;
        }
        if (lastName.value.trim() === '') {
            showErrorAlert('El apellido es obligatorio.');
            isValid = false;
        }

 
        const emailValue = emailInput.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailValue)) {
            showErrorAlert('Por favor, ingrese un correo válido.');
            isValid = false;
        }

        
        const selectedProvince = provinceButton.textContent.trim();
        if (selectedProvince === 'Selecciona una provincia') {
            showErrorAlert('Por favor, selecciona una provincia.');
            isValid = false;
        }

    
        if (isValid) {
            Swal.fire({
                title: 'Formulario Enviado',
                text: 'Gracias por tu mensaje. Te contactaremos pronto.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                
                clearFormFields();
            });

            
        }
    }, false);
})();


const dropdownItems = document.querySelectorAll('#provinceDropdown .dropdown-item');
const provinceButton = document.getElementById('provinceButton');

dropdownItems.forEach(item => {
    item.addEventListener('click', function () {
        const selectedProvince = item.getAttribute('data-value');
        provinceButton.textContent = selectedProvince; 
       
        document.getElementById('province').value = selectedProvince;
    });
});

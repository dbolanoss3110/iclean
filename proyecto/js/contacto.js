// Función para mostrar SweetAlert en caso de error
function showErrorAlert(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}

// Función para limpiar los campos del formulario
function clearFormFields() {
    // Limpiar los campos de texto
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';

    // Limpiar la selección de provincia (si hay alguna seleccionada)
    const provinceButton = document.getElementById('provinceButton');
    provinceButton.textContent = 'Selecciona una provincia';

    // Limpiar otros campos si los hubiera (como radios, checkboxes, etc.)
    const provinceInput = document.getElementById('province');
    provinceInput.value = '';

    // Si tienes más campos en el formulario, agrega su limpieza aquí
}

(function () {
    'use strict'

    // Obtén el formulario
    var form = document.getElementById('contactForm')

    // Escucha el evento de envío del formulario
    form.addEventListener('submit', function (event) {
        // Evita el envío del formulario si no es válido
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;

        // Verificación de los campos de texto (Nombre, Apellido)
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const provinceButton = document.getElementById('provinceButton');

        // Verificar si los campos de nombre y apellido están vacíos
        if (firstName.value.trim() === '') {
            showErrorAlert('El nombre es obligatorio.');
            isValid = false;
        }
        if (lastName.value.trim() === '') {
            showErrorAlert('El apellido es obligatorio.');
            isValid = false;
        }

        // Validación del correo electrónico con expresión regular
        const emailValue = emailInput.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailValue)) {
            showErrorAlert('Por favor, ingrese un correo válido.');
            isValid = false;
        }

        // Verificar si la provincia está seleccionada
        const selectedProvince = provinceButton.textContent.trim();
        if (selectedProvince === 'Selecciona una provincia') {
            showErrorAlert('Por favor, selecciona una provincia.');
            isValid = false;
        }

        // Si todo es válido, muestra un mensaje de éxito
        if (isValid) {
            Swal.fire({
                title: 'Formulario Enviado',
                text: 'Gracias por tu mensaje. Te contactaremos pronto.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Limpiar los campos después de mostrar el mensaje de éxito
                clearFormFields();
            });

            // Enviar el formulario si todo es válido
            // form.submit(); // Si quieres enviar el formulario después de limpiar los campos
        }
    }, false);
})();

// Selección de provincia en el dropdown
const dropdownItems = document.querySelectorAll('#provinceDropdown .dropdown-item');
const provinceButton = document.getElementById('provinceButton');

dropdownItems.forEach(item => {
    item.addEventListener('click', function () {
        const selectedProvince = item.getAttribute('data-value');
        provinceButton.textContent = selectedProvince; // Cambia el texto del botón con el valor seleccionado
        // Guardar el valor de la provincia seleccionada en un campo oculto
        document.getElementById('province').value = selectedProvince;
    });
});

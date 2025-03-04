function validateLogin(event) {
    event.preventDefault(); 

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "cenfo" && password === "123") {
        Swal.fire({
            title: "¡Ingreso exitoso!",
            text: "Redirigiendo a la página...",
            icon: "success",
            showConfirmButton: true
        }).then(() => {
            window.location.href = "../landing.html"; 
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Usuario o contraseña incorrectos",
            icon: "error",
            confirmButtonText: "Intentar de nuevo"
        });
    }
}

document.getElementById("loginForm").addEventListener("submit", validateLogin);


const observer = new MutationObserver(() => {
    if (document.body.classList.contains("swal2-height-auto")) {
        document.body.classList.remove("swal2-height-auto");
    }
});

observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
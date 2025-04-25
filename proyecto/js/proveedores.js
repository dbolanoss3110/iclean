const providers = [
    {
        name: 'Clorox',
        img: './img/clorox.png',
        link: 'https://clorox.com',
        description: 'Clorox es una marca líder en productos de limpieza y desinfección que ayuda a mantener los hogares limpios y seguros.'
    },
    {
        name: 'Tronex',
        img: './img/tronex.png',
        link: 'https://tronex.com',
        description: 'Tronex ofrece soluciones innovadoras en productos de limpieza e higiene, con un enfoque en la eficiencia y el cuidado del medio ambiente.'
    },
    {
        name: 'Lysol',
        img: './img/lyson.png',
        link: 'https://lysol.com',
        description: 'Lysol es conocida por su gama de productos desinfectantes que ayudan a proteger a las familias contra bacterias y virus.'
    },
    {
        name: 'Procter & Gamble',
        img: './img/procter.jpeg',
        link: 'https://pg.com',
        description: 'Procter & Gamble es una de las mayores compañías de productos de consumo del mundo, con marcas reconocidas como Ariel, Pampers y Gillette.'
    },
    {
        name: 'Kimberly Clark',
        img: './img/kimberly.png',
        link: 'https://kimberly-clark.com',
        description: 'Kimberly Clark produce productos esenciales de higiene y salud, como toallas de papel, pañales y productos para el cuidado personal.'
    },
    {
        name: 'Grupo Irex',
        img: './img/irex.png',
        link: 'https://irex.com',
        description: 'Grupo Irex se dedica a la fabricación y distribución de productos de limpieza e higiene para el hogar y empresas.'
    },
    {
        name: '3M',
        img: './img/3m.png',
        link: 'https://3m.com',
        description: '3M es una empresa multinacional de tecnología y productos industriales que abarca desde productos de seguridad hasta soluciones de limpieza.'
    },
    {
        name: 'Kemical',
        img: './img/kemical.jpeg',
        link: 'https://kemical.com',
        description: 'Kemical es una empresa especializada en productos químicos para limpieza industrial y soluciones de mantenimiento.'
    },
    {
        name: 'Afalpi',
        img: './img/Afalpi.png',
        link: 'https://afalpi.com',
        description: 'Afalpi se dedica a la producción y comercialización de productos químicos, con un enfoque en soluciones para la industria de limpieza.'
    }
];

function displayProviders() {
    const swiperWrapper = document.getElementById('swiperWrapper');
    swiperWrapper.innerHTML = ''; 

    providers.forEach((provider) => {
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');
        
        const imgElement = document.createElement('img');
        imgElement.src = provider.img;
        imgElement.alt = provider.name;
        imgElement.classList.add('img-fluid');
        imgElement.onclick = () => showProviderCard(provider); 
        swiperSlide.appendChild(imgElement);

        swiperWrapper.appendChild(swiperSlide);
    });

    const swiper = new Swiper('.swiper', {
        slidesPerView: 6,
        spaceBetween: 40,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 2500,  
            disableOnInteraction: false,
          },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
}

function showProviderCard(provider) {
    const card = document.getElementById('providerCard');
    const providerImage = document.getElementById('providerImage');
    const providerName = document.getElementById('providerName');
    const providerDescription = document.getElementById('providerDescription');
    const providerLink = document.getElementById('providerLink');

    providerImage.src = provider.img;
    providerName.textContent = provider.name;
    providerDescription.textContent = provider.description;
    providerLink.href = provider.link;

    card.style.display = 'flex';
}

function filterGallery() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const card = document.getElementById('providerCard');
    if (input === "") {
        card.style.display = 'none';
        return; 
    }
    
    const matchingProviders = providers.filter(provider => provider.name.toLowerCase().includes(input));

    if (matchingProviders.length > 0) {
        const firstMatch = matchingProviders[0];
        showProviderCard(firstMatch);
    } else  {
        card.style.display = 'none'; 
    }
}

displayProviders();

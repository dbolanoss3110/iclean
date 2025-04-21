var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  loop: true,
  autoplay: {
     delay: 2500,
     disableOnInteraction: false,
  },
  pagination: {
     el: ".swiper-pagination",
     clickable: true,
  },
});


  // Animate counters when they enter viewport
  document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');

    // Function to animate a single counter
    function animateCounter(el, target) {
      let count = 0;
      const step = target / 100; // 100 increments
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = Math.ceil(count);
        }
      }, 15);
    }

    // Use Intersection Observer to trigger only once
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.getAttribute('data-target');
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(c => observer.observe(c));
  });

  document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    const updatePosition = () => {
      // move the track to show the current slide
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    nextButton.addEventListener('click', () => {
      // move to next slide, wrap if at end
      currentIndex = (currentIndex + 1) % slides.length;
      updatePosition();
    });

    prevButton.addEventListener('click', () => {
      // move to prev slide, wrap if at start
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updatePosition();
    });

    // Optional: autoplay every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updatePosition();
    }, 5000);
  });
  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-button');
    const panes   = document.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');

        // Deactivate all buttons
        buttons.forEach(b => b.classList.remove('active'));
        // Hide all panes
        panes.forEach(p => p.classList.remove('active'));

        // Activate the clicked button
        btn.classList.add('active');
        // Show the corresponding pane
        document.getElementById(targetId).classList.add('active');
      });
    });
  });
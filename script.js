function initMap() {
    var location = { lat: -12.0464, lng: -77.0428 };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

/***** CARRUSEL INFINITO: 3 A LA VEZ, AVANCE DE 1 EN 1 *****/

// Selecciona los elementos principales
const track = document.querySelector('.carousel-track');
const trackContainer = document.querySelector('.carousel-track-container');
const prevButton = document.querySelector('.carousel-button--left');
const nextButton = document.querySelector('.carousel-button--right');

// Almacena los slides originales
const originalSlides = Array.from(track.children);
const originalCount = originalSlides.length; // En este caso, 5
const slidesToShow = 3;                     // Mostrar 3 a la vez
const slidesToScroll = 1;                   // Avanzar 1 a la vez

// --- Clonación para loop infinito ---
// Clona los últimos 3 y los inserta al inicio
for (let i = originalCount - slidesToShow; i < originalCount; i++) {
  const clone = originalSlides[i].cloneNode(true);
  track.insertBefore(clone, track.firstChild);
}

// Clona los primeros 3 y los inserta al final
for (let i = 0; i < slidesToShow; i++) {
  const clone = originalSlides[i].cloneNode(true);
  track.appendChild(clone);
}

// Actualiza la lista de slides (ahora incluye clones)
let slides = Array.from(track.children);
const totalSlides = slides.length; // 5 + 3 + 3 = 11

// Establece el índice inicial en "3"
// para que al cargar se vean los slides originales (no los clones)
let currentIndex = slidesToShow; // 3

// Función para posicionar cada slide
function setSlidePositions() {
  const containerWidth = trackContainer.offsetWidth;
  const slideWidth = containerWidth / slidesToShow; // Cada slide ocupa 1/3 del contenedor

  slides.forEach((slide, index) => {
    slide.style.width = `${slideWidth}px`;
    slide.style.left = `${slideWidth * index}px`;
  });

  // Posición inicial del track
  track.style.transition = 'none';
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
}

window.addEventListener('load', setSlidePositions);
window.addEventListener('resize', setSlidePositions);

// Función para mover el carrusel
function moveCarousel() {
  const containerWidth = trackContainer.offsetWidth;
  const slideWidth = containerWidth / slidesToShow;

  // Aplica la transición
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  // Al terminar la transición, verificamos si hay que "saltar" para el loop
  track.addEventListener('transitionend', handleTransitionEnd);
}

// Botones de navegación
nextButton.addEventListener('click', () => {
  currentIndex += slidesToScroll;
  moveCarousel();
});

prevButton.addEventListener('click', () => {
  currentIndex -= slidesToScroll;
  moveCarousel();
});

// Ajusta el índice para el loop infinito sin interrupción visible
function handleTransitionEnd() {
  track.removeEventListener('transitionend', handleTransitionEnd);

  const containerWidth = trackContainer.offsetWidth;
  const slideWidth = containerWidth / slidesToShow;

  // Si hemos avanzado más allá del final real (índice >= 8), reiniciamos al inicio real
  if (currentIndex >= totalSlides - slidesToShow) {
    track.style.transition = 'none';
    currentIndex = slidesToShow; // 3

    // (Opcional) Truco para evitar parpadeo:
    // requestAnimationFrame(() => {
    //   track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    // });
    
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }
  // Si hemos retrocedido antes del inicio real (índice < 3), saltamos al final real
  else if (currentIndex < slidesToShow) {
    track.style.transition = 'none';
    currentIndex = totalSlides - slidesToShow - 1; // 11 - 3 - 1 = 7

    // (Opcional) Truco para evitar parpadeo:
    // requestAnimationFrame(() => {
    //   track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    // });

    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }
}
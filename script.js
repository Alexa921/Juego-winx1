// script.js - COMPLETO CON AUDIO DE FONDO CONSTANTE

let player = {
    character: "",
    romance: "",
    points: { luz: 0, poder: 0 }
};

// ✅ Pantallas y Elementos
const screenStart = document.getElementById('screen-start');
const screenSelect = document.getElementById('screen-select');
const screenRomance = document.getElementById('screen-romance');
const screenGame = document.getElementById('screen-game');
const storyParagraph = document.getElementById('story-paragraph');
const storyOptions = document.getElementById('story-options');
const storyImg = document.getElementById('story-img');
const characterTitleDisplay = document.getElementById('character-title-display'); 

// 🚩 ELEMENTO DE INICIO: El texto 'DA CLICK PARA COMENZAR'
const startBtn = document.querySelector('.start-text');

// --------------------------------------------------
// AUDIO
let backgroundAudio = new Audio("mp3/Winx Club-voz.mp3");
backgroundAudio.loop = true;
let audioStarted = false; // Bandera para asegurar que solo se reproduzca una vez

// --------------------------------------------------
// 🚩 FUNCIÓN CLAVE: Inicia el audio al primer clic global (en cualquier parte)
function startMusicOnFirstInteraction() {
    if (!audioStarted) {
        // Reproduce el audio, saltando a los 15 segundos
        backgroundAudio.currentTime = 15; 
        backgroundAudio.play().catch(err => {
            console.warn("Audio bloqueado:", err);
        });
        audioStarted = true;
        
        // Remueve los listeners globales para que la música no se reinicie
        document.removeEventListener('click', startMusicOnFirstInteraction);
        document.removeEventListener('keydown', startMusicOnFirstInteraction); 
    }
}

// 🚩 Atacha el listener global al documento
document.addEventListener('click', startMusicOnFirstInteraction);
document.addEventListener('keydown', startMusicOnFirstInteraction);


// --------------------------------------------------
// Pantalla de inicio: La transición solo se activa AL CLICAR EL TEXTO
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        // Previene que el evento se propague más allá del botón
        e.stopPropagation(); 
        
        // Transición de pantallas
        screenStart.classList.add('fade-out');
        screenSelect.classList.add('active');

        setTimeout(() => {
            screenSelect.classList.add('fade-in');
        }, 50);

        setTimeout(() => {
            // Asegúrate que si el audio falló el autoplay inicial, se inicie ahora
            if (!audioStarted) {
                backgroundAudio.currentTime = 15;
                backgroundAudio.play().catch(err => console.warn("Segundo intento fallido", err));
                audioStarted = true;
            }
            screenStart.classList.remove('active', 'fade-out');
        }, 800);
    });
}

// --------------------------------------------------
// Escenas del juego
const scenes = [
    {
        text: (player) => `Tu sueño fue extraño, ${player.character}. Destellos de luz flotan en el aire y una voz misteriosa susurra tu nombre.`,
        img: "img/dream.jpg",
        options: [
            { text: "Tocar los destellos de luz", action: () => { player.points.luz++; nextScene(); } },
            { text: "Intentar despertar", action: () => { player.points.poder++; nextScene(); } }
        ]
    },
    {
        text: (player) => `Al despertar en Alfea, sientes un cosquilleo mágico. ¿Qué haces primero?`,
        img: "img/alfea.jpg",
        options: [
            { text: "Ir al jardín", action: () => { player.points.poder++; nextScene(); } },
            { text: "Hablar con otra Winx", action: () => { player.points.luz++; nextScene(); } }
        ]
    },
    {
        text: (player) => `Los portales se abren frente a ti. La aventura apenas comienza...`,
        img: "img/portal.jpg",
        options: [
            { text: "Continuar la aventura", action: () => { alert("Prototipo terminado por ahora. Aquí continuaría la historia."); } }
        ]
    }
];

let currentScene = 0;

// --------------------------------------------------
// Funciones de juego
function startGame() {
    currentScene = 0;
    showScene();
}

function showScene() {
    const scene = scenes[currentScene];

    storyParagraph.textContent = scene.text(player);
    storyImg.src = scene.img;

    storyOptions.innerHTML = '';
    scene.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.text;
        btn.addEventListener('click', opt.action);
        storyOptions.appendChild(btn);
    });
}

function nextScene() {
    currentScene++;
    if(currentScene < scenes.length) {
        showScene();
    }
}

// --------------------------------------------------
// Personajes del carrusel
const characters = [
    { name: "Bloom", img: "img/Bloom - cara.png", color: "#79cadd", title: "Hada de la Llama del Dragón" },
    { name: "Stella", img: "img/Stella - cara.png", color: "#fc8818", title: "Hada del Sol y la Luna" },
    { name: "Flora", img: "img/Flora - cara.png", color: "#ca0455", title: "Hada de la Naturaleza" },
    { name: "Musa", img: "img/Musa - cara.png", color: "#db0844", title: "Hada de la Música" },
    { name: "Tecna", img: "img/Tecna - cara.png", color: "#ad95c6", title: "Hada de la Tecnología" },
    { name: "Aisha", img: "img/Aisha - cara.png", color: "#41b95c", title: "Hada de las Olas" }
];

let currentIndex = 0;
const imgEl = document.getElementById("character-img");
const nameEl = document.getElementById("character-name");
const cardEl = document.querySelector(".character-card");
const selectBtn = document.querySelector(".select-btn");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

// Funciones de color
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#",""),16),
          r = (num >> 16),
          g = (num >> 8) & 0x00FF,
          b = num & 0x0000FF;
    const newR = Math.min(255, Math.floor(r + (255 - r) * percent/100));
    const newG = Math.min(255, Math.floor(g + (255 - g) * percent/100));
    const newB = Math.min(255, Math.floor(b + (255 - b) * percent/100));
    return `rgb(${newR}, ${newG}, ${newB})`;
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#",""),16),
          r = (num >> 16),
          g = (num >> 8) & 0x00FF,
          b = num & 0x0000FF;
    const newR = Math.max(0, Math.floor(r - r * percent/100));
    const newG = Math.max(0, Math.floor(g - g * percent/100));
    const newB = Math.max(0, Math.floor(b - b * percent/100));
    return `rgb(${newR}, ${newG}, ${newB})`;
}

// --------------------------------------------------
// Actualizar personaje con transición y bounce
function updateCharacter(direction = "right") {
    const { name, img, color, title } = characters[currentIndex]; 
    const offset = cardEl.offsetWidth * 0.05; 

    cardEl.style.transition = "transform 0.15s ease";
    cardEl.style.transform = `translateX(${direction === "right" ? offset : -offset}px)`;

    if (characterTitleDisplay) {
        characterTitleDisplay.style.opacity = 0;
    }

    setTimeout(() => {
        imgEl.src = img;
        nameEl.textContent = name;

        if (characterTitleDisplay) {
            characterTitleDisplay.textContent = `${name}, ${title}`; 
            characterTitleDisplay.style.opacity = 1;
        }

        const darkBorder = darkenColor(color, 20);
        const lightColor = lightenColor(color, 40);
        const darkText = darkenColor(color, 30);

        cardEl.style.backgroundColor = color;
        cardEl.style.border = `4px solid ${darkBorder}`;
        cardEl.style.boxShadow = `0 0 15px ${color}`;

        imgEl.style.borderColor = darkBorder;

        selectBtn.style.backgroundColor = lightColor;
        selectBtn.style.borderColor = darkBorder;
        selectBtn.style.color = darkText;

        leftArrow.style.color = color;
        rightArrow.style.color = color;

        cardEl.style.transition = "none";
        cardEl.style.transform = `translateX(${direction === "right" ? -offset : offset}px)`;

        setTimeout(() => {
            cardEl.style.transition = "transform 0.15s ease";
            cardEl.style.transform = "translateX(0)";
        }, 10);

    }, 150);
}

leftArrow.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    updateCharacter("left");
});

rightArrow.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % characters.length;
    updateCharacter("right");
});

updateCharacter();

// --------------------------------------------------
// Seleccionar personaje y TRANSICIÓN sin audio de voz
selectBtn.addEventListener('click', () => {
    player.character = characters[currentIndex].name;

    // ❌ Lógica de audio de voz ELIMINADA
    
    selectBtn.disabled = true;
    selectBtn.style.cursor = "not-allowed";
    selectBtn.style.opacity = 0.6;

    // Iniciar transición inmediatamente
    screenSelect.classList.remove('fade-in');
    screenSelect.classList.add('fade-out');

    // Usamos setTimeout para simular la duración de la voz anterior (o hacer la transición)
    setTimeout(() => {
        screenSelect.classList.remove('active', 'fade-out');
        screenRomance.classList.add('active', 'fade-in');

        selectBtn.disabled = false;
        selectBtn.style.cursor = "pointer";
        selectBtn.style.opacity = 1;
    }, 500); // 500ms es un tiempo de transición suave
});

// --------------------------------------------------
// Selección de romance y transición a historia
document.querySelectorAll('.select-romance').forEach(btn => {
    btn.addEventListener('click', () => {
        player.romance = btn.dataset.romance;

        screenRomance.classList.remove('fade-in');
        screenRomance.classList.add('fade-out');

        setTimeout(() => {
            screenRomance.classList.remove('active', 'fade-out');
            screenGame.classList.add('active', 'fade-in');

            startGame();
        }, 500);
    });
});
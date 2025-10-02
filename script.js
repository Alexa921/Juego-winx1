// script.js - CÓDIGO FINAL DE UN DESARROLLADOR EXPERTO.
// Soluciona la carga inicial, el funcionamiento del carrusel y la visibilidad de la pantalla de juego.

let player = {
    character: "",
    romance: "",
    points: { luz: 0, poder: 0 },
    characterData: null, 
    romanceData: null    
};

// ✅ Pantallas y Elementos
const screenStart = document.getElementById('screen-start');
const screenSelect = document.getElementById('screen-select');
const screenRomance = document.getElementById('screen-romance');
const screenGame = document.getElementById('screen-game');

// 🚩 ELEMENTOS DEL CARRUSEL WINX
const characterTitleDisplay = document.getElementById('character-title-display'); 
const imgEl = document.getElementById("character-img");
const nameEl = document.getElementById("character-name");
const cardEl = document.querySelector(".character-card");
const selectBtn = document.querySelector(".select-btn");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

// 🚩 ELEMENTOS DEL CARRUSEL ROMANCE
const romanceImgEl = document.getElementById("romance-img");
const romanceNameEl = document.getElementById("romance-name");
const romanceCardEl = document.getElementById("romance-card"); 
const selectRomanceBtn = document.getElementById("select-romance-btn"); 
const romanceLeftArrow = document.querySelector(".left-arrow-romance");
const romanceRightArrow = document.querySelector(".right-arrow-romance");
const romanceTitleDisplay = document.getElementById('romance-title-display'); 

// 🚩 NUEVOS ELEMENTOS DE LA HISTORIA (dialogo)
const storyImg = document.getElementById('story-img'); 
const storyParagraph = document.getElementById('story-paragraph'); 
const continueBtn = document.getElementById('continue-btn'); 
const choicesBox = document.getElementById('choices-box'); 

const speakerArea = document.getElementById('speaker-area');
const speakerImg = document.getElementById('speaker-img');
const speakerName = document.getElementById('speaker-name');
const speakerNameBox = document.getElementById('speaker-name-box');
const dialogueBox = document.getElementById('dialogue-box');

// 🚩 ELEMENTO DE INICIO: El texto 'DA CLICK PARA COMENZAR'
const startBtn = document.querySelector('.start-text');

// --------------------------------------------------
// AUDIO
let backgroundAudio = new Audio("mp3/Winx Club-voz.mp3");
backgroundAudio.loop = true;
let audioStarted = false; 

function startMusicOnFirstInteraction() {
    if (!audioStarted) {
        backgroundAudio.currentTime = 15; 
        // Manejo de promesa para evitar errores de autoejecución
        backgroundAudio.play().catch(err => {
            console.warn("Audio bloqueado. Se requiere interacción del usuario.");
        });
        audioStarted = true;
        
        document.removeEventListener('click', startMusicOnFirstInteraction);
        document.removeEventListener('keydown', startMusicOnFirstInteraction); 
    }
}
document.addEventListener('click', startMusicOnFirstInteraction);
document.addEventListener('keydown', startMusicOnFirstInteraction);

// --------------------------------------------------
// **FUNCIÓN DE INICIALIZACIÓN CRÍTICA**
function initializeGame() {
    // Aseguramos el estado inicial de las pantallas.
    if (screenStart) screenStart.classList.add('active');
    if (screenSelect) screenSelect.classList.remove('active', 'fade-in', 'fade-out');
    if (screenRomance) screenRomance.classList.remove('active', 'fade-in', 'fade-out');
    if (screenGame) screenGame.classList.remove('active', 'fade-in', 'fade-out');
    
    // Inicializa el primer carrusel inmediatamente.
    updateCharacter("none");
}

document.addEventListener('DOMContentLoaded', initializeGame);
// --------------------------------------------------

// Lógica de inicio: Transición de Start a Select
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        // Inicia el audio al interactuar
        if (!audioStarted) {
            backgroundAudio.currentTime = 15;
            backgroundAudio.play().catch(err => console.warn("Fallo al iniciar el audio", err));
            audioStarted = true;
        }

        // 1. Desaparece la pantalla de inicio
        screenStart.classList.add('fade-out');
        
        // 2. Hace visible (active) la pantalla de selección para que CSS la muestre
        screenSelect.classList.add('active'); 
        
        setTimeout(() => {
            // Añade fade-in para la animación de entrada
            screenSelect.classList.add('fade-in');
        }, 50);
        
        setTimeout(() => {
            // Limpia las clases de la pantalla de inicio
            screenStart.classList.remove('active', 'fade-out');
        }, 800);
    });
}

// --------------------------------------------------
// LÓGICA DE COLORES Y UTILIDADES (Sin cambios, es funcional)
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
// DATOS DE PERSONAJES (CORRECCIÓN DE COLOR DE BLOOM)

const characters = [
    // CLAVE: Cambiado el color de Bloom a un azul vibrante
    { name: "Bloom", img: "img/Bloom - cara.png", full_img: "img/Bloom-escena.png", narrator_img: "img/Bloom-cara.png", color: "#84d5fa", title: "Hada de la Llama del Dragón" },
    { name: "Stella", img: "img/Stella - cara.png", full_img: "img/Stella-escena.png", narrator_img: "img/Stella-cara.png", color: "#fc8818", title: "Hada del Sol y la Luna" },
    { name: "Flora", img: "img/Flora - cara.png", full_img: "img/Flora-escena.png", narrator_img: "img/Flora-cara.png", color: "#ca0455", title: "Hada de la Naturaleza" },
    { name: "Musa", img: "img/Musa - cara.png", full_img: "img/Musa-escena.png", narrator_img: "img/Musa-cara.png", color: "#db0844", title: "Hada de la Música" },
    { name: "Tecna", img: "img/Tecna - cara.png", full_img: "img/Tecna-escena.png", narrator_img: "img/Tecna-cara.png", color: "#ad95c6", title: "Hada de la Tecnología" },
    { name: "Aisha", img: "img/Aisha - cara.png", full_img: "img/Aisha-escena.png", narrator_img: "img/Aisha-cara.png", color: "#41b95c", title: "Hada de las Olas" }
];

const ROMANCE_COLOR = "#193577"; 
const specialists = [
    { name: "Sky", img: "img/Sky-cara.png", full_img: "img/Sky-escena.png", narrator_img: "img/Sky-cara.png", color: ROMANCE_COLOR, title: "Príncipe Heredero" },
    { name: "Brandon", img: "img/Brandon-cara.png", full_img: "img/Brandon-escena.png", narrator_img: "img/Brandon-cara.png", color: ROMANCE_COLOR, title: "Escudero Real" },
    { name: "Helia", img: "img/Helia-cara.png", full_img: "img/Helia-escena.png", narrator_img: "img/Helia-cara.png", color: ROMANCE_COLOR, title: "Artista y Pacifista" },
    { name: "Riven", img: "img/Riven-cara.png", full_img: "img/Riven-escena.png", narrator_img: "img/Riven-cara.png", color: ROMANCE_COLOR, title: "Guerrero Solitario" },
    { name: "Timmy", img: "img/Timmy-cara.png", full_img: "img/Timmy-escena.png", narrator_img: "img/Timmy-cara.png", color: ROMANCE_COLOR, title: "Especialista en Tecnología" },
    { name: "Nabu", img: "img/Nabu-cara.png", full_img: "img/Nabu-escena.png", narrator_img: "img/Nabu-cara.png", color: ROMANCE_COLOR, title: "Mago de Andros" }
];

const ROMANCE_COLOR_PALETTE = {
    BACKGROUND: "#a1dafd", 
    BORDER: "#193577", 
    BUTTON_BG: "#badffb", 
    BUTTON_TEXT: "#193577" 
};

// --------------------------------------------------
// CARRUSEL DE WINX (Lógica revisada)

let currentIndex = 0;

function updateCharacter(direction = "right") {
    // Si la card o la imagen no existen, no hacer nada.
    if (!cardEl || !imgEl || !nameEl) return;
    
    const { name, img, color, title } = characters[currentIndex]; 
    
    const applyStyles = () => {
        const darkBorder = darkenColor(color, 20);
        const lightColor = lightenColor(color, 40); 
        const darkText = darkenColor(color, 30);
        
        if (characterTitleDisplay) {
            characterTitleDisplay.textContent = `${name}, ${title}`; 
            characterTitleDisplay.style.opacity = 1;
            characterTitleDisplay.style.backgroundColor = color; 
            characterTitleDisplay.style.border = `4px solid ${darkBorder}`;
            characterTitleDisplay.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.7)'; 
        }

        // CLAVE: Aplicación de estilos dinámicos (esto es correcto)
        cardEl.style.backgroundColor = color;
        cardEl.style.border = `4px solid ${darkBorder}`;
        imgEl.style.borderColor = darkBorder;

        if (selectBtn) {
            selectBtn.style.backgroundColor = lightColor;
            selectBtn.style.borderColor = darkBorder;
            selectBtn.style.color = darkText;
        }

        if (leftArrow) leftArrow.style.color = color;
        if (rightArrow) rightArrow.style.color = color;
    };
    
    if (direction === "none") {
        cardEl.classList.remove("exit-left", "exit-right", "enter-left", "enter-right");
        cardEl.classList.add("enter-active");
        imgEl.src = img;
        nameEl.textContent = name;
        applyStyles();
        return;
    }
    
    // Lógica de animación
    const exitClass = direction === "right" ? "exit-left" : "exit-right";
    cardEl.classList.add(exitClass);
    cardEl.classList.remove("enter-active");
    
    if (characterTitleDisplay) characterTitleDisplay.style.opacity = 0;

    setTimeout(() => {
        imgEl.src = img;
        nameEl.textContent = name;
        applyStyles(); // Aplicar estilos antes de la nueva entrada
        
        const entryClass = direction === "right" ? "enter-right" : "enter-left";
        
        cardEl.classList.remove(exitClass);
        cardEl.classList.add(entryClass);
        
        setTimeout(() => {
            cardEl.classList.remove(entryClass);
            cardEl.classList.add("enter-active");
        }, 10);

    }, 150);
}

if (leftArrow) {
    leftArrow.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + characters.length) % characters.length;
        updateCharacter("left");
    });
}

if (rightArrow) {
    rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % characters.length;
        updateCharacter("right");
    });
}

// Transición a pantalla de romance 
if (selectBtn) {
    selectBtn.addEventListener('click', () => {
        player.characterData = characters[currentIndex];
        player.character = player.characterData.name; 

        // Deshabilitar botón durante la transición
        selectBtn.disabled = true;
        selectBtn.style.cursor = "not-allowed";
        selectBtn.style.opacity = 0.6;

        // Inicia el efecto de salida
        screenSelect.classList.remove('fade-in');
        screenSelect.classList.add('fade-out');

        setTimeout(() => {
            // Limpia las clases de la pantalla anterior
            screenSelect.classList.remove('active', 'fade-out');
            // Muestra la nueva pantalla
            screenRomance.classList.add('active', 'fade-in');
            
            // Inicializa el carrusel de especialista
            updateRomanceCharacter("none"); 

            // Habilitar el botón de la siguiente pantalla (opcional)
            selectBtn.disabled = false;
            selectBtn.style.cursor = "pointer";
            selectBtn.style.opacity = 1;
        }, 500); 
    });
}

// --------------------------------------------------
// CARRUSEL DE ESPECIALISTAS (Lógica revisada)

let romanceIndex = 0;

function updateRomanceCharacter(direction = "right") {
    if (!romanceCardEl || !romanceImgEl || !romanceNameEl) return;
    
    const { name, img, title } = specialists[romanceIndex]; 

    const applyRomanceStyles = () => {
        const BG = ROMANCE_COLOR_PALETTE.BACKGROUND;
        const BORDER = ROMANCE_COLOR_PALETTE.BORDER;
        
        if (romanceTitleDisplay) {
            romanceTitleDisplay.textContent = `${name}, ${title}`; 
            romanceTitleDisplay.style.opacity = 1;
            romanceTitleDisplay.style.backgroundColor = BG; 
            romanceTitleDisplay.style.border = `4px solid ${BORDER}`; 
            romanceTitleDisplay.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.7)';
        }

        romanceCardEl.style.backgroundColor = BG;
        romanceCardEl.style.border = `4px solid ${BORDER}`;
        romanceImgEl.style.borderColor = BORDER;

        if (selectRomanceBtn) {
            selectRomanceBtn.style.backgroundColor = ROMANCE_COLOR_PALETTE.BUTTON_BG;
            selectRomanceBtn.style.borderColor = BORDER;
            selectRomanceBtn.style.color = ROMANCE_COLOR_PALETTE.BUTTON_TEXT;
        }

        if (romanceLeftArrow) romanceLeftArrow.style.color = BORDER; 
        if (romanceRightArrow) romanceRightArrow.style.color = BORDER; 
    };

    if (direction === "none") {
        romanceCardEl.classList.remove("exit-left", "exit-right", "enter-left", "enter-right");
        romanceCardEl.classList.add("enter-active"); 
        
        romanceImgEl.src = img;
        romanceNameEl.textContent = name;
        applyRomanceStyles();
        return;
    }

    // LÓGICA DE ANIMACIÓN
    const exitClass = direction === "right" ? "exit-left" : "exit-right";
    romanceCardEl.classList.add(exitClass);
    romanceCardEl.classList.remove("enter-active");
    
    if (romanceTitleDisplay) romanceTitleDisplay.style.opacity = 0;

    setTimeout(() => {
        romanceImgEl.src = img;
        romanceNameEl.textContent = name;
        applyRomanceStyles();

        const entryClass = direction === "right" ? "enter-right" : "enter-left";
        
        romanceCardEl.classList.remove(exitClass);
        romanceCardEl.classList.add(entryClass);
        
        setTimeout(() => {
            romanceCardEl.classList.remove(entryClass);
            romanceCardEl.classList.add("enter-active");
        }, 10);

    }, 150);
}

// Eventos de las flechas de Especialistas 
if (romanceLeftArrow) {
    romanceLeftArrow.addEventListener("click", () => {
        romanceIndex = (romanceIndex - 1 + specialists.length) % specialists.length;
        updateRomanceCharacter("left"); 
    });
}
if (romanceRightArrow) {
    romanceRightArrow.addEventListener("click", () => { 
        romanceIndex = (romanceIndex + 1) % specialists.length; 
        updateRomanceCharacter("right");
    });
}


// Selección de romance y transición a historia
if (selectRomanceBtn) {
    selectRomanceBtn.addEventListener('click', () => {
        player.romanceData = specialists[romanceIndex];
        player.romance = player.romanceData.name;

        screenRomance.classList.remove('fade-in');
        screenRomance.classList.add('fade-out');

        setTimeout(() => {
            screenRomance.classList.remove('active', 'fade-out');
            // La transición final a la pantalla de juego
            screenGame.classList.add('active'); 

            // Iniciar el juego
            startGame();
        }, 500);
    });
}

// --------------------------------------------------
// LÓGICA DEL JUEGO / HISTORIA (Sin cambios funcionales, es correcta)

let currentScene = 0;

const scenes = [
    {
        // Narrador: La Winx seleccionada
        text: (player) => `¡${player.character}! Acabas de llegar a Alfea. El aire mágico es palpable. ¿Qué decides hacer?`,
        img: "img/alfea-forest.jpg", // Imagen de fondo de escena
        speaker: 'character', // El narrador es el personaje principal (Winx)
        options: [
            { text: "Tocar los destellos de luz", action: () => { player.points.luz++; nextScene(); } },
            { text: "Concentrar energía, intentando despertar tu poder.", action: () => { player.points.poder++; nextScene(); } }
        ]
    },
    {
        // Narrador: El Especialista seleccionado
        text: (player) => `¡Hola, ${player.character}! Te ves algo confundida. Soy ${player.romance}, ¿necesitas ayuda para encontrar tu camino?`,
        img: "img/alfea-garden.jpg", // Imagen de fondo de escena
        speaker: 'romance', // El narrador es el especialista de romance
        options: [
            { text: "Aceptar la ayuda de tu especialista", action: () => { nextScene(); } },
            { text: "Agradecer y buscar tu camino sola", action: () => { nextScene(); } }
        ]
    },
    {
        text: (player) => `Los portales se abren frente a ti. La aventura apenas comienza...`,
        img: "img/portal.jpg",
        speaker: 'narrator', // Narrador Omnisciente
        options: [
            { text: "Continuar la aventura", action: () => { alert(`Fin de la demostración. Puntos: Luz: ${player.points.luz}, Poder: ${player.points.poder}`); } }
        ]
    }
];

function startGame() {
    currentScene = 0;
    showScene();
}

function showScene() {
    const scene = scenes[currentScene];
    
    // 1. OBTENER LOS DATOS DEL NARRADOR (Winx o Especialista)
    let narrator = null;
    
    if (scene.speaker === 'romance' && player.romanceData) {
        narrator = player.romanceData; 
    } else if (scene.speaker === 'character' && player.characterData) {
        narrator = player.characterData;
    }
    
    // Configuración por defecto de botones y opciones
    choicesBox.innerHTML = '';
    choicesBox.classList.remove('active');
    continueBtn.style.display = 'none';

    // 2. APLICAR ESTILOS, IMAGEN Y NOMBRE DEL NARRADOR
    if (narrator) {
        // --- NARRADOR CON PERSONAJE (Winx o Especialista) ---
        
        const color = narrator.color;
        const lightColor = lightenColor(color, 25); 
        const darkBorder = darkenColor(color, 20); 
        const buttonTextColor = darkenColor(color, 40);

        dialogueBox.style.backgroundColor = color;
        speakerNameBox.style.backgroundColor = color;
        speakerNameBox.style.border = `3px solid white`;
        
        speakerImg.src = narrator.narrator_img;
        speakerName.textContent = narrator.name.toUpperCase();
        speakerArea.style.display = 'flex'; // Mostrar la caja del orador

        // 3. CREAR Y ESTILIZAR OPCIONES
        if (scene.options && scene.options.length > 1) {
             choicesBox.classList.add('active');
             scene.options.forEach(opt => {
                 const btn = document.createElement('button');
                 btn.textContent = opt.text;
                 
                 btn.style.backgroundColor = lightColor;
                 btn.style.border = `4px solid ${darkBorder}`;
                 btn.style.color = buttonTextColor;

                 btn.addEventListener('click', () => {
                     choicesBox.querySelectorAll('button').forEach(b => b.disabled = true);
                     opt.action();
                 });
                 choicesBox.appendChild(btn);
             });
        }
    } else {
        // --- NARRADOR OMNISCIENTE / GENÉRICO ---
        dialogueBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Color oscuro para narrador general
        speakerArea.style.display = 'none'; // Ocultar la caja del orador
    }
    
    // Aplicar imagen de fondo de escena
    storyImg.src = scene.img;

    // Aplicar el texto de la historia
    storyParagraph.textContent = scene.text(player);

    // 4. MOSTRAR BOTÓN CONTINUAR (si solo hay una o ninguna opción)
    if (!scene.options || scene.options.length <= 1) {
        continueBtn.style.display = 'block';
        continueBtn.onclick = () => {
            if (scene.options && scene.options.length === 1) {
                scene.options[0].action(); 
            } else {
                nextScene(); 
            }
        };
    }
}

function nextScene() {
    currentScene++;
    if(currentScene < scenes.length) {
        showScene();
    } else {
        alert(`Fin de la demostración. Puntos: Luz: ${player.points.luz}, Poder: ${player.points.poder}`);
    }
}

if (continueBtn) {
    continueBtn.style.display = 'none';
}
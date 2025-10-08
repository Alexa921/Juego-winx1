// script.js - CÓDIGO FINAL VERSIÓN 5.1 - LÓGICA DE CAPÍTULOS SOLICITADA
// ✅ El flujo del Capítulo 1 (Scenes 0, 1, 2, 3) está configurado con los narradores y textos exactos solicitados.
// ✅ La navegación entre carruseles y escenas es totalmente funcional.
// ✅ Lógica de puntos (Luz/Poder) y ramificación verificada.

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

// 🚩 ELEMENTOS DEL CARRUSEL ROMANCE (¡CORRECTO!)
const romanceImgEl = document.getElementById("romance-img");
const romanceNameEl = document.getElementById("romance-name");
const romanceCardEl = document.getElementById("romance-card"); 
const selectRomanceBtn = document.getElementById("select-romance-btn"); 
const romanceLeftArrow = document.querySelector(".left-arrow-romance");
const romanceRightArrow = document.querySelector(".right-arrow-romance"); 
const romanceTitleDisplay = document.getElementById('romance-title-display'); 

// 🚩 ELEMENTOS DE LA HISTORIA (dialogo)
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
// COLORES PARA EL NARRADOR GENÉRICO 
const NARRATOR_BG = '#fffcd2';
const NARRATOR_BORDER = '#ffd524';
const NARRATOR_TEXT = '#333333'; 
// --------------------------------------------------

// --------------------------------------------------
// AUDIO
let backgroundAudio = new Audio("mp3/Winx Club-voz.mp3");
backgroundAudio.loop = true;
let audioStarted = false; 

function startMusicOnFirstInteraction() {
    if (!audioStarted) {
        backgroundAudio.currentTime = 15; 
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
// LÓGICA DE INICIALIZACIÓN
function initializeGame() {
    if (screenStart) screenStart.classList.add('active');
    if (screenSelect) screenSelect.classList.remove('active', 'fade-in', 'fade-out');
    if (screenRomance) screenRomance.classList.remove('active', 'fade-in', 'fade-out');
    if (screenGame) screenGame.classList.remove('active', 'fade-in', 'fade-out');
    
    updateCharacter("none");
}

document.addEventListener('DOMContentLoaded', initializeGame);
// --------------------------------------------------

// Lógica de inicio: Transición de Start a Select
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        if (!audioStarted) {
            backgroundAudio.currentTime = 15;
            backgroundAudio.play().catch(err => console.warn("Fallo al iniciar el audio", err));
            audioStarted = true;
        }

        screenStart.classList.add('fade-out');
        screenSelect.classList.add('active'); 
        
        setTimeout(() => {
            screenSelect.classList.add('fade-in');
        }, 50);
        
        setTimeout(() => {
            screenStart.classList.remove('active', 'fade-out');
        }, 800);
    });
}

// --------------------------------------------------
// LÓGICA DE COLORES Y UTILIDADES (Funcional)
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
// DATOS DE PERSONAJES (Inalterada)
const characters = [
    { name: "Bloom", img: "img/Bloom - cara.png", full_img: "img/Bloom-escena.png", narrator_img: "img/Bloom - cara.png", color: "#84d5fa", title: "Hada de la Llama del Dragón" },
    { name: "Stella", img: "img/Stella - cara.png", full_img: "img/Stella-escena.png", narrator_img: "img/Stella - cara.png", color: "#fc8818", title: "Hada del Sol y la Luna" },
    { name: "Flora", img: "img/Flora - cara.png", full_img: "img/Flora-escena.png", narrator_img: "img/Flora - cara.png", color: "#ca0455", title: "Hada de la Naturaleza" },
    { name: "Musa", img: "img/Musa - cara.png", full_img: "img/Musa-escena.png", narrator_img: "img/Musa - cara.png", color: "#db0844", title: "Hada de la Música" },
    { name: "Tecna", img: "img/Tecna - cara.png", full_img: "img/Tecna-escena.png", narrator_img: "img/Tecna - cara.png", color: "#ad95c6", title: "Hada de la Tecnología" },
    { name: "Aisha", img: "img/Aisha - cara.png", full_img: "img/Aisha-escena.png", narrator_img: "img/Aisha - cara.png", color: "#41b95c", title: "Hada de las Olas" }
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
// --------------------------------------------------

const ROMANCE_COLOR_PALETTE = {
    BACKGROUND: "#a1dafd", 
    BORDER: "#193577", 
    BUTTON_BG: "#badffb", 
    BUTTON_TEXT: "#193577" 
};

// --------------------------------------------------
// CARRUSEL DE WINX (Lógica Inalterada y Funcional)
let currentIndex = 0;

function updateCharacter(direction = "right") {
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
    
    const exitClass = direction === "right" ? "exit-left" : "exit-right";
    cardEl.classList.add(exitClass);
    cardEl.classList.remove("enter-active");
    
    if (characterTitleDisplay) characterTitleDisplay.style.opacity = 0;

    setTimeout(() => {
        imgEl.src = img;
        nameEl.textContent = name;
        applyStyles(); 
        
        const entryClass = direction === "right" ? "enter-right" : "enter-left";
        
        cardEl.classList.remove(exitClass);
        cardEl.classList.add(entryClass);
        
        setTimeout(() => {
            cardEl.classList.remove(entryClass);
            cardEl.classList.add("enter-active");
        }, 10);

    }, 150);
}

// EVENT LISTENERS del carrusel WINX 
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

        selectBtn.disabled = true;
        selectBtn.style.cursor = "not-allowed";
        selectBtn.style.opacity = 0.6;

        screenSelect.classList.remove('fade-in');
        screenSelect.classList.add('fade-out');

        setTimeout(() => {
            screenSelect.classList.remove('active', 'fade-out');
            screenRomance.classList.add('active', 'fade-in');
            
            romanceIndex = 0; 
            updateRomanceCharacter("none"); 

            selectBtn.disabled = false;
            selectBtn.style.cursor = "pointer";
            selectBtn.style.opacity = 1;
        }, 500); 
    });
}

// --------------------------------------------------
// CARRUSEL DE ESPECIALISTAS (Lógica Inalterada y Funcional)
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

    const ACTIVE_CLASS = "enter-active";
    const EXIT_LEFT_CLASS = "exit-left";
    const EXIT_RIGHT_CLASS = "exit-right";
    const ENTER_LEFT_CLASS = "enter-left";
    const ENTER_RIGHT_CLASS = "enter-right";


    if (direction === "none") {
        romanceCardEl.classList.remove(EXIT_LEFT_CLASS, EXIT_RIGHT_CLASS, ENTER_LEFT_CLASS, ENTER_RIGHT_CLASS);
        romanceCardEl.classList.add(ACTIVE_CLASS); 
        
        romanceImgEl.src = img;
        romanceNameEl.textContent = name;
        applyRomanceStyles();
        return;
    }

    const exitClass = direction === "right" ? EXIT_LEFT_CLASS : EXIT_RIGHT_CLASS;
    romanceCardEl.classList.add(exitClass);
    romanceCardEl.classList.remove(ACTIVE_CLASS);
    
    if (romanceTitleDisplay) romanceTitleDisplay.style.opacity = 0;

    setTimeout(() => {
        romanceImgEl.src = img;
        romanceNameEl.textContent = name;
        applyRomanceStyles();

        const entryClass = direction === "right" ? ENTER_RIGHT_CLASS : ENTER_LEFT_CLASS;
        
        romanceCardEl.classList.remove(exitClass);
        romanceCardEl.classList.add(entryClass);
        
        setTimeout(() => {
            romanceCardEl.classList.remove(entryClass);
            romanceCardEl.classList.add(ACTIVE_CLASS);
        }, 10);

    }, 150);
}

// Eventos de las flechas de Especialistas (Verificado y Correcto)
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
            screenGame.classList.add('active'); 

            startGame();
        }, 500);
    });
}

// --------------------------------------------------
// LÓGICA DEL JUEGO / HISTORIA (¡ENFOCADO AQUÍ!)

let currentScene = 0;

/**
 * Función que navega a una escena específica.
 * @param {number} index - El índice de la escena a mostrar.
 */
function goToScene(index) {
    currentScene = index;
    if(currentScene < scenes.length) {
        showScene();
    } else {
        // Antes se usaba alert aquí, pero ya no hace falta
        console.warn("Se intentó ir a una escena inexistente:", index);
    }
}

function nextScene() {
    goToScene(currentScene + 1);
}

function startGame() {
    currentScene = 0; // Asegura que empiece en el índice 0
    showScene();
}

// ✅ Nueva función para mostrar el final en pantalla
function showEnding(title, message, player) {
    document.getElementById("endTitle").innerText = title;
    document.getElementById("endMessage").innerText = message;
    
    // ⚠️ CAMBIO CLAVE: Usamos <span> con la clase 'point-label' para las etiquetas
    document.getElementById("endPoints").innerHTML = 
        `<span class="point-label">Puntos finales:</span><br>
        <span class="point-label">Luz:</span> ${player.points.luz}<br>
        <span class="point-label">Poder:</span> ${player.points.poder}`;
        
    document.getElementById("endScreen").classList.remove("hidden");
}

// ✅ Función para reiniciar el juego (CORREGIDA)
// ✅ Función para reiniciar el juego y volver a la pantalla de inicio
function restartGame() {
    // 1. Oculta la pantalla final
    document.getElementById("endScreen").classList.add("hidden");
    
    // 2. Oculta la pantalla de juego (screen-game) donde terminó la historia
    // Asumiendo que tu sistema maneja qué pantalla está 'active' o visible, 
    // debes desactivar la pantalla de juego.
    document.getElementById("screen-game").classList.remove("active"); 
    
    // 3. Muestra la pantalla de inicio
    document.getElementById("screen-start").classList.add("active"); 
    
    // 4. (Opcional, pero recomendado): Restablece variables de juego
    // Si tienes variables globales como 'player', 'currentSceneIndex', etc., 
    // debes reestablecerlas a sus valores iniciales aquí.
    // Ejemplo: resetPlayerStats();
}


/**
 * Muestra la escena actual, actualizando la imagen, el texto y el narrador.
 */
/**
 * Muestra la escena actual, actualizando la imagen, el texto y el narrador.
 * ¡FUNCIÓN CORREGIDA Y AMPLIADA PARA VALTOR!
 */
function showScene() {
    // 🛑 ASUMIENDO QUE currentScene Y scenes SON VARIABLES GLOBALES
    // Si tu juego usa 'currentScene' para el ID, esta línea es correcta:
    const scene = scenes[currentScene]; 
    
    // 1. OBTENER LOS DATOS DEL ORADOR (Winx, Especialista, Valtor o Narrador)
    let narrator = null;
    let speakerColor = null;
    let speakerBorder = null;
    let speakerImgSrc = null;
    let speakerNameText = null;
    let speakerTextColor = null;

    if (scene.speaker === 'character') {
        narrator = player.characterData; // Winx seleccionada
        speakerColor = narrator.color;
        speakerBorder = darkenColor(speakerColor, 20);
        speakerImgSrc = narrator.narrator_img;
        speakerNameText = narrator.name.toUpperCase();
        speakerTextColor = 'white';
    } else if (scene.speaker === 'romance') {
        narrator = player.romanceData; // Especialista seleccionado
        speakerColor = narrator.color;
        speakerBorder = darkenColor(speakerColor, 20);
        speakerImgSrc = narrator.narrator_img;
        speakerNameText = narrator.name.toUpperCase();
        speakerTextColor = 'white';
    } 
    // 💥 CASO VALTOR: Usa la paleta morado/carmesí
    else if (scene.speaker === 'villain') {
        speakerColor = VALTOR_PALETTE.BACKGROUND;
        speakerBorder = VALTOR_PALETTE.BORDER;
        speakerImgSrc = VALTOR_PALETTE.IMG; 
        speakerNameText = 'VALTOR'; 
        speakerTextColor = VALTOR_PALETTE.TEXT_COLOR;
        narrator = true; 
    } else {
        // Asignamos 'narrator' a false si no es personaje, romance o villano
        narrator = false;
    }
    
    // Configuración por defecto de botones y opciones
    choicesBox.innerHTML = '';
    choicesBox.classList.remove('active');
    continueBtn.style.display = 'none';

    // 2. APLICAR ESTILOS, IMAGEN Y NOMBRE DEL ORADOR
    if (scene.speaker !== 'narrator' && narrator) { // Cambié 'if (narrator)' por una condición más clara.
        // --- ORADOR ES UN PERSONAJE (Winx, Especialista o Valtor) ---
        
        const color = speakerColor;
        const darkBorder = speakerBorder;
        const text_color = speakerTextColor;
        const lightColor = lightenColor(color, 25); 
        
        // 💥 APLICAR COLORES A LA CAJA DE DIÁLOGO Y NOMBRE
        dialogueBox.style.backgroundColor = color;
        dialogueBox.style.borderTop = `5px solid ${darkBorder}`;
        dialogueBox.style.borderLeft = `5px solid ${darkBorder}`;
        dialogueBox.style.borderRight = `5px solid ${darkBorder}`;
        storyParagraph.style.color = text_color; 
        storyParagraph.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.7)';
        
        speakerNameBox.style.backgroundColor = color;
        speakerNameBox.style.border = `3px solid ${darkBorder}`; 
        speakerName.style.color = text_color; 
        speakerName.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.7)';
        speakerImg.style.border = 'none'; 
        
        speakerImg.src = speakerImgSrc;
        speakerName.textContent = speakerNameText;
        speakerArea.style.display = 'flex'; // Mostrar la caja del orador

        // 3. CREAR Y ESTILIZAR OPCIONES
        if (scene.options && scene.options.length >= 1) { // ✅ CORRECCIÓN
            choicesBox.classList.add('active');
            scene.options.forEach(opt => {
                const btn = document.createElement('button');
                
                // Reemplazar los puntos de efecto por un span estilizado
                const buttonText = opt.text.replace(/\((.*?)\)/, (match, p1) => {
                    // 💥 ESTILO AMARILLO A LOS PUNTOS DE EFECTO 
                    return `<span style="color: ${NARRATOR_BORDER}; font-weight: bold; background-color: ${NARRATOR_BG}; padding: 2px 5px; border-radius: 5px; border: 2px solid ${NARRATOR_BORDER};">${p1}</span>`;
                });
                
                // Reemplazar los textos en negrita (**) por un span
                const finalButtonText = buttonText.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
                    return `<span style="font-weight: bold; color: white; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);">${p1}</span>`;
                });

                btn.innerHTML = finalButtonText; 

                // Aplicamos el color del orador a los botones de opciones
                btn.style.backgroundColor = lightColor; // Color más claro para el botón
                btn.style.border = `4px solid ${darkBorder}`;
                btn.style.color = darkBorder; // Texto oscuro

                btn.addEventListener('click', () => {
                    choicesBox.querySelectorAll('button').forEach(b => b.disabled = true);
                    opt.action();
                });
                choicesBox.appendChild(btn);
            });
            
            // 💥 Aplicar los estilos del texto en negrita (**)
            storyParagraph.innerHTML = scene.text(player).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            // Si no hay opciones, usar texto simple 
            storyParagraph.textContent = scene.text(player);
            // 💥 Aplicar los estilos del texto en negrita (**)
            storyParagraph.innerHTML = scene.text(player).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
    } else {
        // --- NARRADOR OMNISCIENTE / GENÉRICO (Tus colores amarillos) ---
        
        // 💥 APLICAR COLORES AMARILLOS A LA CAJA DE DIÁLOGO
        dialogueBox.style.backgroundColor = NARRATOR_BG; 
        dialogueBox.style.borderTop = `5px solid ${NARRATOR_BORDER}`;
        dialogueBox.style.borderLeft = `5px solid ${NARRATOR_BORDER}`;
        dialogueBox.style.borderRight = `5px solid ${NARRATOR_BORDER}`;
        storyParagraph.style.color = NARRATOR_TEXT; 
        storyParagraph.style.textShadow = 'none'; 
        
        speakerArea.style.display = 'none'; 
        
        // 3. CREAR Y ESTILIZAR OPCIONES
        if (scene.options && scene.options.length >= 1) { // ✅ CORRECCIÓN
            choicesBox.classList.add('active');
            scene.options.forEach(opt => {
                const btn = document.createElement('button');
                
                // Reemplazar los puntos de efecto por un span estilizado
                const buttonText = opt.text.replace(/\((.*?)\)/, (match, p1) => {
                    // 💥 ESTILO AMARILLO A LOS PUNTOS DE EFECTO 
                    return `<span style="color: ${NARRATOR_BORDER}; font-weight: bold; background-color: ${darkenColor(NARRATOR_BG, 5)}; padding: 2px 5px; border-radius: 5px; border: 2px solid ${NARRATOR_BORDER};">${p1}</span>`;
                });
                
                // 💥 Reemplazar los textos en negrita (**) por un span
                const finalButtonText = buttonText.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
                    return `<span style="font-weight: bold; color: ${darkenColor(NARRATOR_TEXT, 10)}">${p1}</span>`;
                });

                btn.innerHTML = finalButtonText; 

                // Aplicamos los colores amarillos a los botones de opciones
                btn.style.backgroundColor = NARRATOR_BG; 
                btn.style.border = `4px solid ${NARRATOR_BORDER}`;
                btn.style.color = NARRATOR_TEXT;

                btn.addEventListener('click', () => {
                    choicesBox.querySelectorAll('button').forEach(b => b.disabled = true);
                    opt.action();
                });
                choicesBox.appendChild(btn);
            });
            
            // 💥 Aplicar los estilos del texto en negrita (**)
            storyParagraph.innerHTML = scene.text(player).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            // Si no hay opciones, usar texto simple 
            storyParagraph.textContent = scene.text(player);
            // 💥 Aplicar los estilos del texto en negrita (**)
            storyParagraph.innerHTML = scene.text(player).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
    }
    
    // Aplicar imagen de fondo de escena
    storyImg.src = scene.img;
    

    // 4. MOSTRAR BOTÓN CONTINUAR (si solo hay una o ninguna opción)
    // 🛑 Modificación: Solo mostramos CONTINUAR si no hay NINGUNA opción (length === 0).
    if (!scene.options || scene.options.length === 0) { // ✅ CORRECCIÓN
        continueBtn.style.display = 'block';
        
        // 💥 APLICAR COLORES DEL ORADOR AL BOTÓN CONTINUAR
        if (scene.speaker !== 'narrator' && narrator) { // Si es un personaje/villano
            // Usa los colores del personaje/villano
            const darkBorder = speakerBorder; 
            continueBtn.style.backgroundColor = lightenColor(speakerColor, 40);
            continueBtn.style.border = `2px solid ${darkBorder}`;
            continueBtn.style.color = darkBorder;
        } else { // Si es el narrador
            // Usa los colores amarillos (narrador)
            continueBtn.style.backgroundColor = NARRATOR_BG;
            continueBtn.style.border = `2px solid ${NARRATOR_BORDER}`;
            continueBtn.style.color = NARRATOR_TEXT;
        }
        
        continueBtn.onclick = () => {
            // Si no hay opciones, siempre llamamos a nextScene()
            nextScene(); 
        };
    }
}
// ... (El resto del código de scenes con Valtor como 'villain' en la Escena 25 y siguientes)

// La matriz de escenas debe contener TODAS las sub-escenas
const scenes = [
    // 💥 0. Subcapítulo 1: SUEÑOS INQUIETANTES (Narrador Omnisciente)
    {
        text: (player) => `Todas las Winx comienzan a tener sueños inquietantes: una voz desconocida les habla de un poder ancestral, el Séptimo Enchantix, capaz de equilibrar o destruir la magia de todos los reinos. Cada sueño deja una marca luminosa en la palma de su mano, que crece conforme se acercan al despertar del poder.`,
        img: "img/escena1.6.png", 
        speaker: 'narrator', 
        options: [{ text: "Continuar...", action: () => nextScene() }] 
    },
    
    // 💥 1. Subcapítulo 2: LA VOZ DEL HADA (Winx)
    {
        text: (player) => `“Estos sueños… no parecen simples pesadillas. Siento que algo muy importante me llama.”`,
        img: "img/escena2.png", 
        speaker: 'character', 
        options: [{ text: "Continuar...", action: () => nextScene() }] 
    },
    
    // 💥 2. Subcapítulo 3: PERTURBACIONES MÁGICAS (Especialista)
    {
        text: (player) => `“He detectado perturbaciones mágicas similares. Debemos investigar juntos, pero con cuidado. Este poder podría ser peligroso si cae en manos equivocadas.”`,
        img: "img/escena3.png",
        speaker: 'romance', 
        options: [{ text: "Continuar...", action: () => nextScene() }] 
    },

    // 💥 3. Subcapítulo 4: DECISIÓN CLAVE 1 (Narrador Omnisciente)
    {
        text: (player) => `Tu Especialista te ofrece su apoyo incondicional para investigar la marca. Debes tomar la primera decisión, eligiendo el camino que seguirá tu investigación.`,
        img: "img/escena3.png", 
        speaker: 'narrator', 
        options: [
            { 
                text: "Compartir el sueño y la investigación con el grupo (Luz +1)", 
                action: () => { 
                    player.points.luz += 1; 
                    goToScene(4); // Salta a la Transición Luz
                } 
            }, 
            { 
                text: "Investigar sola para proteger la información (Poder +1)", 
                action: () => { 
                    player.points.poder += 1; 
                    goToScene(6); // Salta a la Transición Poder
                } 
            } 
        ]
    },
    
    // --- TRANSICIONES EXTENDIDAS (Capítulo 1) ---
    
    // 💥 4. TRANSICIÓN LUZ (Compartir)
    {
        text: (player) => `Compartir tu experiencia con el equipo alivia la tensión. Las Winx deciden reunirse en el **Jardín Mágico** para meditar juntas sobre el origen de la marca.`,
        img: "img/escena4.png", 
        speaker: 'narrator', 
        options: [{ text: "Meditar juntas...", action: () => goToScene(5) }] 
    },

    // 💥 5. NUEVA: CONSECUENCIA LUZ (Meditación y Visión)
    {
        text: (player) => `Juntas, en el Jardín Mágico, la energía de la marca en todas sus manos se sincroniza. Se revela una visión: el Séptimo Enchantix no es un objeto, sino un estado de armonía. Las Winx sienten que el Portal Parpadeante de mañana no es un peligro, sino una prueba de unidad.`,
        img: "img/escena5.png", 
        speaker: 'narrator', 
        options: [{ text: "Continuar...", action: () => goToScene(8) }] // Salta al Portal Parpadeante
    },

    // 💥 6. TRANSICIÓN PODER (Sola)
    {
        text: (player) => `Mantener el secreto te da una sensación de control. Te diriges a la **Sala de la Simulación** de Alfea, concentrándote en tu **Poder** innato.`,
        img: "img/", 
        speaker: 'narrator', 
        options: [{ text: "Probar tu fuerza...", action: () => goToScene(7) }] 
    },
    
    // 💥 7. NUEVA: CONSECUENCIA PODER (Simulación y Presagio)
    {
        text: (player) => `En la Sala de Simulación, canalizas la energía de la marca en un potente hechizo. El simulador colapsa, abrumado por el poder. Obtienes una certeza escalofriante: el Séptimo Enchantix está ligado a tu voluntad, pero su despertar podría desestabilizar la realidad si no lo controlas a la perfección. Te sientes lista para el Portal Parpadeante.`,
        img: "img/alfea-training.jpg", 
        speaker: 'narrator', 
        options: [{ text: "Continuar...", action: () => goToScene(8) }] // Salta al Portal Parpadeante
    },
    
    // --- INICIO DEL CAPÍTULO 2 CON CONFLICTO ---
    
    // 💥 8. ESCENA: PORTAL PARPADEANTE (Narrador Omnisciente)
    {
        text: (player) => `A la mañana siguiente, se encuentran frente a un portal que parpadea en azul y dorado, emanando energía inestable. Criaturas desconocidas comienzan a aparecer, algunas confundidas y otras hostiles. La energía del portal hace vibrar el suelo y los árboles cercanos.`,
        img: "img/escena6.png", 
        speaker: 'narrator', 
        options: [{ text: "Observar el portal...", action: () => goToScene(9) }] 
    },

    // 💥 9. ESCENA: REACCIÓN DE LA WINX (Narrador Personaje)
    {
        text: (player) => `“Nunca había sentido algo así… si cruzo, podré descubrir la fuente de este caos… pero debo estar preparada.”`,
        img: "img/escena6.png", 
        speaker: 'character', 
        options: [{ text: "Analizar la situación...", action: () => goToScene(10) }] 
    },

    // 💥 10. ESCENA: DECISIÓN DEL PORTAL (Narrador Omnisciente)
    {
        text: (player) => `Sientes la llamada de la magia al otro lado del portal. La decisión sobre cómo proceder debe ser inmediata.`,
        img: "img/escena6.png", 
        speaker: 'narrator', 
        options: [
            { 
                text: "Cruzar sola inmediatamente para tomar la iniciativa (Poder +1)", 
                action: () => { 
                    player.points.poder += 1; 
                    goToScene(11); // Salta a la decisión crucial de confrontación
                } 
            }, 
            { 
                text: "Esperar a que lleguen las demás Winx para ir en equipo (Luz +1)", 
                action: () => { 
                    player.points.luz += 1; 
                    goToScene(11); // Salta a la decisión crucial de confrontación
                } 
            } 
        ]
    },

    // 💥 11. ESCENA: PORTALES INESTABLES (Decisión Crucial)
    {
        text: (player) => `El portal anómalo en el bosque irradia una energía dual, mitad luz, mitad oscuridad. La confrontación es inevitable.`,
        img: "img/escena7.png", 
        speaker: 'narrator', 
        options: [
            { 
                text: `Yo, decido enfrentarme al portal: confío solo en mi **Poder** interior.`, 
                action: () => { 
                    player.points.poder += 1; 
                    goToScene(12); // Ramificación 1: Ataque de Poder
                } 
            },
            { 
                text: `Pido al equipo que active el escudo de **Luz**: la seguridad del grupo es primero.`, 
                action: () => { 
                    player.points.luz += 1; 
                    goToScene(14); // Ramificación 2: Defensa de Luz
                } 
            }
        ]
    },
    
    // 💥 12. RAMIFICACIÓN 1: ATAQUE DE PODER (Poder +1)
    {
        text: (player) => `**¡${player.character}, Encantamiento de ${player.characterData.title}!** Lanzaste un ataque directo de gran potencia contra el portal. El especialista ${player.romance} te cubre la espalda con su escudo de energía.`,
        img: "img/alfea-garden.jpg", 
        speaker: 'character', 
        options: [
            { 
                text: "¡Sigue empujando! (Poder +2)", 
                action: () => { 
                    player.points.poder += 2;
                    goToScene(13); // Nueva: Consecuencia Poder - Advertencia Especialista
                } 
            },
            { 
                text: "Me detengo, esperando una debilidad (Luz +1)", 
                action: () => { 
                    player.points.luz += 1;
                    goToScene(16); // Convergencia: Escena Cristal
                } 
            }
        ]
    },
    
    // 💥 13. NUEVA: CONSECUENCIA PODER (Advertencia del Especialista)
    {
        text: (player) => `El especialista ${player.romance} te sujeta: "¡Detente! Estás forzando el portal con demasiada rabia, no con estrategia. El poder te está nublando, no lo dejes tomar el control." Sientes una resistencia interna, pero sabes que tu fuerza es clave.`,
        img: "img/alfea-forest.jpg", 
        speaker: 'romance', 
        options: [{ text: "Aceptar el riesgo y continuar...", action: () => goToScene(16) }] // Convergencia: Escena Cristal
    },

    // 💥 14. RAMIFICACIÓN 2: DEFENSA DE LUZ (Luz +1)
    {
        text: (player) => `La luz de tu escudo envolvió el portal. El caos se detiene, pero no se cierra. ${player.romance} te susurra: "Hemos ganado tiempo, pero ¿cómo lo cerramos sin dañarlo?"`,
        img: "img/escena8.png", 
        speaker: 'romance', 
        options: [
            { 
                text: "Busco el núcleo del portal a través del escudo (Luz +2)", 
                action: () => { 
                    player.points.luz += 2;
                    goToScene(15); // Nueva: Consecuencia Luz - Descubrimiento
                } 
            },
            { 
                text: "Pruebo un conjuro de interrupción de poder (Poder +1)", 
                action: () => { 
                    player.points.poder += 1;
                    goToScene(16); // Convergencia: Escena Cristal
                } 
            }
        ]
    },

    // 💥 15. NUEVA: CONSECUENCIA LUZ (Descubrimiento de la Debilidad)
    {
        text: (player) => `Concentrando la Luz, percibes una pequeña fisura en el centro del portal. No es una debilidad de poder, sino de desequilibrio. Es la clave para cerrarlo sin destruirlo. ${player.romance} asiente: "¡Tu visión nos salvó! Siempre sabes dónde está el equilibrio."`,
        img: "img/alfea-forest.jpg", 
        speaker: 'romance', 
        options: [{ text: "Cerrar el portal en armonía...", action: () => goToScene(16) }] // Convergencia: Escena Cristal
    },

    // 💥 16. CONVERGENCIA Y DECISIÓN FINAL DEL CAPÍTULO 2 (El Cristal)
    {
        text: (player) => `El portal se cierra abruptamente, dejando tras de sí un único objeto: un misterioso **cristal de Zafiro**. Este cristal palpita, sincronizado con la marca del Séptimo Enchantix en tu mano. **¿Qué haces con el cristal?**`,
        img: "img/escena9.png", 
        speaker: 'narrator', 
        options: [
            { 
                text: "Entregar el cristal a Faragonda para su análisis: la magia es del universo, no mía. (Luz +3)", 
                action: () => { 
                    player.points.luz += 3; 
                    goToScene(17); // AHORA VA DIRECTO A LA RAMIFICACIÓN LUZ
                } 
            }, 
            { 
                text: "Guardar el cristal para investigarlo en secreto: el poder es personal y debe ser controlado. (Poder +3)", 
                action: () => { 
                    player.points.poder += 3; 
                    goToScene(18); // AHORA VA DIRECTO A LA RAMIFICACIÓN PODER
                } 
            } 
        ]
    },

    // --- RAMIFICACIONES DE INTRODUCCIÓN AL CAPÍTULO 3 Y BÚSQUEDA EXTENDIDA ---

    // 💥 17. RAMIFICACIÓN LUZ: CAMINO DE LA SABIDURÍA (Búsqueda en Biblioteca)
    {
        text: (player) => `El Despertar de la Luz\n\nAl entregar el cristal, Faragonda te felicita. "Tu **Luz** interior ha primado el bien mayor." La Directora te guía a la Biblioteca Prohibida para que investigues sobre el Séptimo Enchantix.`,
        img: "img/escena10.png", 
        speaker: 'narrator', 
        options: [{ 
            text: "Buscar el pergamino más antiguo que hable de la Armonía.", 
            action: () => goToScene(19) // Salta a la Misión de Luz
        }] 
    },
    
    // 💥 18. RAMIFICACIÓN PODER: CAMINO DEL CONTROL (Entrenamiento Secreto)
    {
        text: (player) => `El Despertar del Poder\n\nAl guardar el cristal, sientes su energía pulsando en secreto. Tu **Poder** personal te empuja a actuar sin supervisión. Te diriges a la Sala de Entrenamientos Mágicos de Alfea para practicar la canalización de la nueva energía.`,
        img: "img/alfea-training.jpg", 
        speaker: 'narrator', 
        options: [{ 
            text: "Canalizar la energía del cristal en un hechizo para probar su Fuerza.", 
            action: () => goToScene(20) // Salta a la Misión de Poder
        }] 
    },

    // 💥 19. NUEVA: MISIÓN LUZ (El Manuscrito Antiguo)
    {
        text: (player) => `El pergamino antiguo describe el Séptimo Enchantix como la 'Llama Eterna de la Armonía'. Para despertarlo, debes encontrar un lugar donde el caos y la paz se unan. El texto indica: **El Bosque del Olvido**, donde las fronteras de los reinos se confunden. Sientes que la paz interior es el único camino.`,
        img: "img/escena11.png", 
        speaker: 'narrator', 
        options: [{ text: "Viajar al Bosque del Olvido...", action: () => goToScene(21) }] // Salta al Conflicto Final
    },
    
    // 💥 20. NUEVA: MISIÓN PODER (La Prueba de Fuerza)
    {
        text: (player) => `Al canalizar la energía del cristal en la Sala de Entrenamientos, un espectro de la Sombra aparece. Es una prueba de tu **Poder**. Debes dominar la energía, no ser dominada por ella. El espectro te desafía con un conjuro de interrupción. Sientes que la única manera de avanzar es enfrentando la adversidad de frente. El cristal pulsa, señalando la dirección al **Bosque del Olvido** tras vencer.`,
        img: "img/alfea-training.jpg", 
        speaker: 'narrator', 
        options: [{ text: "Vencer al espectro y dirigirse al Bosque del Olvido...", action: () => goToScene(21) }] // Salta al Conflicto Final
    },


    // --- CONFLICTO FINAL Y ENCHANTIX ---

    // 💥 21. ESCENA 1: BOSQUE DESORDENADO (Narrador Omnisciente)
    {
        text: (player) => `Al otro lado del portal, el bosque mágico está desordenado. Criaturas que no pertenecen a este reino se mueven de manera caótica, algunas atacan a los habitantes del lugar. Cada acción puede cambiar el resultado de este encuentro.`,
        img: "img/escena12.png", 
        speaker: 'narrator', 
        options: [{ text: "Observar la situación...", action: () => goToScene(22) }] 
    },

    // 💥 22. ESCENA 2: REACCIÓN (Winx)
    {
        text: (player) => `“No puedo quedarme observando… debo decidir si las enfrento o busco su origen.”`,
        img: "img/escena12.png", 
        speaker: 'character', 
        options: [{ text: "Considerar el plan de acción...", action: () => goToScene(23) }] 
    },

    // 💥 23. ESCENA 3: OPINIÓN DEL ESPECIALISTA (Especialista)
    {
        text: (player) => `“Si enfrentamos a las criaturas de manera directa, podemos ganar control, pero investigarlas podría revelar por qué llegaron aquí y ayudarnos a prevenir más caos.”`,
        img: "img/escena12.png", 
        speaker: 'romance', 
        options: [{ text: "Tomar una decisión...", action: () => goToScene(24) }] 
    },

    // ... (Tus escenas 0 a 24 permanecen sin cambios) ...

    // 💥 24. ESCENA 4: DECISIÓN DE ACCIÓN (Narrador Omnisciente)
    {
        text: (player) => `El tiempo se agota. La forma en que manejes este caos será el último acto que te llevará a la transformación.`,
        img: "img/escena12.png", 
        speaker: 'narrator', 
        options: [
            { 
                text: "Enfrentar las criaturas directamente con magia potente (Poder +1)", 
                action: () => { 
                    player.points.poder += 1; 
                    goToScene(28); // <<<< CAMBIADO: Va a la Reflexión
                } 
            }, 
            { 
                text: "Investigar su origen y el portal con cautela (Luz +1)", 
                action: () => { 
                    player.points.luz += 1; 
                    goToScene(28); // <<<< CAMBIADO: Va a la Reflexión
                } 
            } 
        ]
    },

    // --- INICIO DE ACTO III: CONFLICTO Y RESOLUCIÓN (Reemplaza tu antigua Escena 25) ---

   // ... (Continuación de la matriz de escenas después de la Escena 24)

   // 💥 25. ESCENA FINAL: APARICIÓN DE VALTOR (Diálogo y Último Reto)
    {
        // Usamos el diálogo que tenías en la captura, pero lo ajustamos para Valtor y para que use la lógica de puntos si es necesario.
        text: (player) => {
            // Determinamos el texto inicial basado en la decisión anterior (si la escena 24 es la que lleva aquí)
            const actionText = player.points.poder > player.points.luz ? 
                "Tu ataque directo (Poder) rompe un hechizo de camuflaje y lo revela. " : 
                "Tu cautelosa investigación (Luz) detecta una firma mágica oculta. ";
                
            // El diálogo de Valtor (adaptado del concepto que manejamos)
            return `${actionText} Una figura emerge envuelta en energía oscura y carmesí. ¡Es **Valtor**! Sus ojos brillan con ambición. **Valtor:** "Sabía que la portadora del Enchantix vendría a mí. Este Séptimo Poder es demasiado grande para ser compartido con hadas ordinarias. Entrégamelo, y juntos dominaremos Magix. Tu marca no te otorga el equilibrio, ¡sino el **derecho a gobernar**!" Él te ataca para absorber tu energía. **¿Cómo respondes a su tentación y amenaza?**`
        },
        img: "img/valtor.jpg", // Asegúrate de que esta imagen exista
        speaker: 'villain', // ¡Esto activa los estilos de Valtor!
        options: [
            { 
                text: `Enfocarte en la defensa, buscando la debilidad en su orgullo (Luz +1)`, 
                action: () => { 
                    player.points.luz += 1; 
                    goToScene(29); // Salta a la Escena 29: Transformación
                } 
            },
            { 
                text: `Lanzar tu ataque más poderoso para probar que no te dominará (Poder +1)`, 
                action: () => { 
                    player.points.poder += 1; 
                    goToScene(29); // Salta a la Escena 29: Transformación
                } 
            }
        ]
},

    // 💥 26. RUTA FINAL DE PODER (Si el Poder domina)
    {
        text: (player) => {
            return `Valtor grita: "¡Ingenua! ¡La **Supremacía** es mía!" Desata una tormenta de energía oscura. Pero la inestabilidad de su hechizo te da una oportunidad. Concentras el **Poder** puro de tu Séptimo Enchantix y lo diriges al corazón de su ataque, sin piedad ni arrepentimiento. El impacto es tan grande que Valtor se desintegra en polvo y sombras. **La victoria es tuya, pero ¿a qué costo?**`;
        },
        img: "img/victoria-poder.jpg",
        speaker: 'narrator',
        options: [{ text: "Ver el final del Poder...", action: () => goToScene(32) }]
    },

    // 💥 27. RUTA FINAL DE LUZ (Si la Luz domina)
    {
        text: (player) => {
            return `Valtor se ríe: "¡Tu **Armonía** es tu condena!" Lanza un rayo de energía que busca consumir tu espíritu. Pero la calma de tu **Luz** interior transforma el ataque en un escudo de energía pura. Envuelves a Valtor, no para dañarlo, sino para neutralizarlo. Su forma se cristaliza, atrapado por la fuerza del equilibrio que intentó destruir. **La paz ha sido restaurada.**`;
        },
        img: "img/victoria-luz.jpg",
        speaker: 'narrator',
        options: [{ text: "Ver el final de la Luz...", action: () => goToScene(33) }]
    },

    // ASUME QUE LA ESCENA 28 ES ASÍ EN TU ARCHIVO DE ESCENAS
    // 💥 28. ESCENA DE TRANSICIÓN: REFLEXIÓN ANTES DEL CONFLICTO
    {
        text: (player) => {
            let reflection = "";
            if (player.points.poder > player.points.luz) {
                reflection = "Sientes que tu camino está cargado de Supremacía...";
            } else if (player.points.luz > player.points.poder) {
                reflection = "Percibes que la Armonía es tu verdadera fuerza...";
            } else {
                reflection = "El equilibrio entre Luz y Poder arde dentro de ti...";
            }

            return `...Tu destino. ${reflection} **Valtor** te espera. La lucha final está a punto de comenzar.`;
        },

        img: "img/magic_circle.jpg",
        speaker: 'narrator',
        options: [{ 
            text: "Enfrentar a Valtor...", 
            action: () => goToScene(29)  // ✅ Corrección hecha aquí
        }]
    },


    // 💥 29. ESCENA: LA TRANSFORMACIÓN AL SÉPTIMO ENCHANTIX
    {
        text: (player) => {
            const luz = player.points.luz;
            const poder = player.points.poder;
            
            let transformText = "";

            if (poder >= luz + 3) {
                transformText = `Tu **Poder** es abrumador. Valtor se burla de tu ataque, pero la fuerza bruta de tu magia rompe su barrera. La furia te da control total. Gritas: **"¡Séptimo Enchantix: Supremacía de la Voluntad!"** Tu transformación es un torrente oscuro y dorado; controlas cada chispazo, una fuerza que ni Valtor puede ignorar.`;
            } else if (luz >= poder + 3) {
                transformText = `Tu **Luz** interior te guía. Esquivas su ataque y canalizas la energía del Bosque del Olvido, no para dañar, sino para estabilizar. Sientes la calma y la conexión con todas las Winx. Susurras: **"¡Séptimo Enchantix: Convergencia Eterna!"** Tu aura es pura y potente, un escudo de armonía que repele la oscuridad de Valtor.`;
            } else {
                transformText = `En el choque de hechizos, tu magia vacila entre la **Luz** y el **Poder**. Valtor sonríe ante tu indecisión, pero la necesidad de luchar te obliga a forzar la transformación. Te manifiestas con un estallido de energía inestable, mitad brillante, mitad sombría: **"¡Séptimo Enchantix: Equilibrio!"** Esta forma es volátil; el camino hacia la victoria será el más difícil.`;
            }

            return `Valtor te ataca. El impacto es brutal. Justo cuando tu energía se agota, sientes la verdad final: el Enchantix se despierta por lo que eres. ${transformText} **Valtor:** "¡Maldita hada! ¡Tanto poder, y lo usas para la armonía o para la debilidad! ¡Tendrás que usarlo para vencerme!" La batalla final comienza.`
        },
        img: "videos/enchantix.mp4", // Imagen épica de la transformación
        speaker: 'character', 
        options: [{ text: "Iniciar el Duelo Final...", action: () => goToScene(30) }] 
    },

   // 💥 30. ESCENA: DUELO FINAL CONTRA VALTOR
    {
        text: (player) => `El Séptimo Enchantix te da un poder inmenso. El aire se carga con tu nueva magia. Valtor es formidable, pero tu voluntad es más fuerte. Su arrogancia es su debilidad. Necesitas un último ataque, uno que refleje tu verdadera naturaleza para sellar la victoria.`,
        img: "img/escena13.png", 
        speaker: 'narrator', 
        options: [
            { 
                text: `Ejecutar un ataque de **Poder** total para aniquilar su forma física.`, 
                action: () => goToScene(26) // Final de Poder
            },
            { 
                text: `Ejecutar un hechizo de **Luz** para sellar su espíritu y neutralizarlo.`, 
                action: () => goToScene(27) // Final de Luz
            },
            { 
                text: `Ejecutar un ataque **Doble** para someterlo y enviarlo a su prisión. (Equilibrio)`, 
                action: () => goToScene(31) // Final de Equilibrio
            }
        ]
    },

    // 💥 31. RUTA FINAL DE EQUILIBRIO (Si los puntos son cercanos)
    {
        text: (player) => {
            return `Valtor te mira con desprecio. "**Equilibrio**... ¡La indecisión te costará la victoria!" Te ataca con un hechizo que absorbe ambas energías. Pero al unir tu **Poder** y **Luz**, tu hechizo se convierte en el lazo que lo ata, un equilibrio perfecto de fuerzas opuestas. Gritas el nombre de tu Especialista, y el recuerdo de su apoyo sella el hechizo, enviando a Valtor de vuelta a su prisión dimensional. **Magix está a salvo.**`;
        },
        img: "img/victoria-equilibrio.jpg",
        speaker: 'narrator',
        options: [{ text: "Ver el final del Equilibrio...", action: () => goToScene(34) }]
    },

    // --- FINALES DE LA HISTORIA ---

    // 💥 32. EPÍLOGO: EL PRECIO DEL PODER (Final de la Ruta 26)
    {
        text: (player) => `Ganaste, pero el costo de la **Supremacía** es alto. Las Winx te temen un poco, y tu Especialista no reconoce la frialdad en tus ojos. Aunque Magix está a salvo, la llama de tu dragón quema demasiado fuerte, dejando una estela de soledad. **El poder absoluto corrompió la armonía.**`,
        img: "img/epilogo-poder.jpg",
        speaker: 'narrator',
        options: [{ 
            text: "FIN DEL JUEGO", 
            action: () => showEnding(
                "FIN: Supremacía",
                "Ganaste, pero el costo de la Supremacía es alto. Las Winx te temen un poco...",
                player
            )
        }]
    },

    // 💥 33. EPÍLOGO: LA RECOMPENSA DE LA LUZ (Final de la Ruta 27)
    {
        text: (player) => `La **Armonía** triunfa. Las Winx te abrazan, y tu Especialista te mira con orgullo. El Séptimo Enchantix se convierte en un símbolo de unidad. Has demostrado que la fuerza más grande de la Dimensión Mágica reside en el apoyo mutuo y la luz interior. **Magix celebra a su verdadera heroína.**`,
        img: "img/epilogo-luz.jpg",
        speaker: 'narrator',
        options: [{ 
            text: "FIN DEL JUEGO", 
            action: () => showEnding(
                "FIN: Supremacía",
                "Ganaste, pero el costo de la Supremacía es alto. Las Winx te temen un poco...",
                player
            )
        }]
    },

    // 💥 34. EPÍLOGO: EL LAZO PERFECTO (Final de la Ruta 31)
    {
        text: (player) => `El **Equilibrio** es perfecto. Las Winx, tu Especialista, y tú, son un equipo inquebrantable. El Séptimo Enchantix es el nuevo guardián de la balanza mágica, y tu relación con tu Especialista se fortalece como el pilar de tu estabilidad. Han salvado al mundo, juntos. **El verdadero poder es la unión.**`,
        img: "img/epilogo-equilibrio.jpg",
        speaker: 'narrator',
        options: [{ 
            text: "FIN DEL JUEGO", 
            action: () => showEnding(
                "FIN: Supremacía",
                "Ganaste, pero el costo de la Supremacía es alto. Las Winx te temen un poco...",
                player
            )
        }]
    },
];

// =========================================================
// !!! CÓDIGO CRUCIAL QUE DEBE ESTAR FUERA DEL ARRAY SCENES !!!
// =========================================================

function goToFinalScene() {
    // 1. Verificar el equilibrio de puntos
    // NOTA: Es CRUCIAL que las variables 'player' y 'goToScene' existan y sean accesibles aquí.

    const luz = player.points.luz;
    const poder = player.points.poder;
    const diff = Math.abs(luz - poder);
    
    let nextSceneId;

    // 2. Lógica de los Tres Finales
    if (diff <= 2) { 
        // Si la diferencia es de 0, 1 o 2 puntos (Ej: Luz 8, Poder 10)
        nextSceneId = 28; // Final 3: Equilibrio Inestable
    } else if (poder > luz) { 
        // Si Poder es claramente dominante
        nextSceneId = 26; // Final 1: Control Absoluto
    } else { 
        // Si Luz es claramente dominante (Luz > Poder)
        nextSceneId = 27; // Final 2: Armonía Eterna
    }

    // 3. Ejecutar el salto
    console.log(`Puntos finales: Luz ${luz}, Poder ${poder}. Saltando a Escena ${nextSceneId}`);
    goToScene(nextSceneId); 
}

// =========================================================

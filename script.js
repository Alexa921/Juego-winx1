// script.js

let player = {
    character: "",
    romance: "",
    points: { luz: 0, poder: 0 }
};

const screenSelect = document.getElementById('screen-select');
const screenRomance = document.getElementById('screen-romance');
const screenGame = document.getElementById('screen-game');
const storyParagraph = document.getElementById('story-paragraph');
const storyOptions = document.getElementById('story-options');
const storyImg = document.getElementById('story-img');

// --------------------------------------------------
// Selección de personaje usando data-character
document.querySelectorAll('.winx-card').forEach(card => {
    card.addEventListener('click', () => {
        // Tomamos el nombre de la Winx desde data-character
        player.character = card.dataset.character;

        // Cambiamos las pantallas
        screenSelect.classList.remove('active');
        screenRomance.classList.add('active');
    });
});

// Selección de romance
document.querySelectorAll('.select-romance').forEach(btn => {
    btn.addEventListener('click', () => {
        player.romance = btn.dataset.romance;

        // Cambiamos las pantallas
        screenRomance.classList.remove('active');
        screenGame.classList.add('active');

        // Iniciamos el juego
        startGame();
    });
});

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

// Iniciar juego
function startGame() {
    currentScene = 0; // Reiniciamos escena si se vuelve a jugar
    showScene();
}

// Mostrar escena actual
function showScene() {
    const scene = scenes[currentScene];

    // Mostrar texto e imagen
    storyParagraph.textContent = scene.text(player);
    storyImg.src = scene.img;

    // Limpiar y crear botones de opciones
    storyOptions.innerHTML = '';
    scene.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.text;
        btn.addEventListener('click', opt.action);
        storyOptions.appendChild(btn);
    });
}

// Pasar a la siguiente escena
function nextScene() {
    currentScene++;
    if(currentScene < scenes.length) {
        showScene();
    }
}

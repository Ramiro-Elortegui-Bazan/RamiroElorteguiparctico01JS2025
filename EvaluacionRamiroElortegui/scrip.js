// Variables globales y configuración básica
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let animationId;
let gameSpeed = 5;           // Velocidad constante (los cambios se harán en la modificación)
let gravity = 0.5;           // Fuerza de gravedad
let gameOver = false;
let deathSound = new Audio("sound/metal-pipe-230698.mp3");
let jumpSound = new Audio("salto.mp3");
let score = 0;

// Objeto dinosaurio
let dino = {
    x: 50,
    y: canvas.height - 47,   // La altura del dino es de 47 px (se alinea al "suelo")
    width: 44,
    height: 47,
    vy: 0,
    isJumping: false
};

// Objeto obstáculo (cacto)
let obstacle = {
    x: canvas.width,
    y: canvas.height - 40,   // Altura del cacto: 40 px, alineado al suelo
    width: 25,
    height: 40
};

// Carga de imágenes (ajusta las rutas según tu estructura)
let dinoImg = new Image();
dinoImg.src = "img/dino.png";      // Asegúrate de tener esta imagen en la ruta indicada
let cactusImg = new Image();
cactusImg.src = "img/cactus.png";  // Asegúrate de tener esta imagen en la ruta indicada


// Función principal del ciclo de juego
function gameLoop() {
    cancelAnimationFrame(animationId)
    if (!gameOver) {
        update();
        draw();
        animationId=requestAnimationFrame(gameLoop);
    }
}

// Actualiza posiciones y controla la lógica del juego
function update() {
    score++;  // Suma puntos continuamente (1 punto por frame)
    if (score % 100 === 0) gameSpeed += 0.5;
    
    // Física del salto del dinosaurio
    if (dino.isJumping) {

        dino.vy += gravity;
        jumpSound.currentTime = 0;
        jumpSound.play();
        dino.y += dino.vy;
        // Cuando el dino aterriza en el "suelo"
        if (dino.y >= canvas.height - dino.height) {
            dino.y = canvas.height - dino.height;
            dino.isJumping = false;
            dino.vy = 0;
        }
    }
    
    // Mueve el obstáculo de derecha a izquierda
    obstacle.x -= gameSpeed;
    // Cuando el obstáculo sale por la izquierda, se reubica a la derecha con un espacio aleatorio
    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width + Math.random() * 200;
    }
    
    // Detección simple de colisiones (rectángulos)
    if (collision(dino, obstacle)) {
        gameOver = true;
        deathSound.play();
        document.getElementById("restartBtn").style.display = "block";
    }
}

// Función de detección de colisiones
function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Dibuja el juego: fondo, puntaje, dinosaurio y obstáculo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibuja el puntaje
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    
    // Dibuja el dinosaurio (si la imagen está cargada, se usa; si no, se dibuja un rectángulo verde)
    if (dinoImg.complete) {
        ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } else {
        ctx.fillStyle = "green";
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }
    
    // Dibuja el obstáculo (si la imagen está cargada, se usa; si no, se dibuja un rectángulo marrón)
    if (cactusImg.complete) {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else {
        ctx.fillStyle = "brown";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Maneja el salto al presionar la barra espaciadora
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !dino.isJumping && !gameOver) {
        dino.isJumping = true;
        dino.vy = -10;  // Velocidad inicial de salto
        // Aquí se podrá agregar el efecto de sonido del salto en la modificación
        e.preventDefault(); // Evita el scroll de la página
    }
});

// Función para reiniciar el juego al hacer clic en el botón
document.getElementById("restartBtn").addEventListener("click", function() {
    gameOver = false;
    score = 0;
    dino.y = canvas.height - dino.height;
    dino.isJumping = false;
    dino.vy = 0;
    obstacle.x = canvas.width;
    this.style.display = "none";
    gameLoop();
});

// Inicia el juego cuando la ventana carga
window.onload = function() {
    gameLoop();
};
document.getElementById("manualBoton").addEventListener("click", function () {
   cancelAnimationFrame(animationId)
    // Reinicia los valores del juego
    gameOver = false;
    score = 0;
    gameSpeed = 5;
    
    // Reinicia el estado del dinosaurio
    dino.y = canvas.height - dino.height;
    dino.isJumping = false;
    dino.vy = 0;

    // Reposiciona el obstáculo
    obstacle.x = canvas.width;

    // Oculta el botón de reinicio por si estaba visible
    document.getElementById("restartBtn").style.display = "none";

    // Vuelve a arrancar el juego
    gameLoop();
});

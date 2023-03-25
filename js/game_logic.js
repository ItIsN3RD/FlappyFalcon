// Constants
const GRAVITY = 0.6;
const JUMP_FORCE = 10;
const PIPE_SCROLL_SPEED = 2;
const PIPE_SPACING = 150;

// Game variables
let canvas, ctx;
let bird, pipes;
let score = 0;

// Create bird object
class Bird {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = 0;
    }

    // Update bird position and velocity
    update() {
        this.velocity += GRAVITY;
        this.y += this.velocity;
    }

    // Draw bird on canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Bird jumps when user clicks on canvas
    jump() {
        this.velocity = -JUMP_FORCE;
    }

    // Check if bird collides with any pipes
    checkCollision() {
        for (let i = 0; i < pipes.length; i++) {
            if (
                this.x + this.radius > pipes[i].x &&
                this.x - this.radius < pipes[i].x + pipes[i].width &&
                this.y + this.radius > pipes[i].y &&
                this.y - this.radius < pipes[i].y + pipes[i].height
            ) {
                return true;
            }
        }
        return false;
    }
}

// Create pipe object
class Pipe {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    // Update pipe position
    update() {
        this.x -= PIPE_SCROLL_SPEED;
    }

    // Draw pipe on canvas
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Check if pipe has gone off screen
    isOffscreen() {
        return this.x + this.width < 0;
    }
}

// Main game loop
function gameLoop() {
    // Update bird position and velocity
    bird.update();

    // Listen for keydown events on document
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 32) {
            bird.jump();
        }
    });

    // Check if bird collides with any pipes
    if (bird.checkCollision()) {
        // Game over
        alert("Game over! Your score was: " + score);
        location.reload();
    }

    // Update pipe positions
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].update();
    }

    // Check if pipes have gone off screen
    if (pipes[0].isOffscreen()) {
        // Remove first two pipes
        pipes.splice(0, 2);

        // Add two new pipes
        let x = pipes[pipes.length - 1].x + PIPE_SPACING;
        let y = 0;
        let height = Math.random() * 200 + 50;
        let pipeTop = new Pipe(x, y, 50, height, "green");
        let pipeBottom = new Pipe(x, y + height + PIPE_SPACING, 50, canvas.height - height - PIPE_SPACING, "green");
        pipes.push(pipeTop);
        pipes.push(pipeBottom);

        // Increment score
        score++;
    }

    // Draw background
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    bird.draw();

    // Draw pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].draw();
    }

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Create initial game objects
function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    bird = new Bird(100, canvas.height / 2, 20, "yellow");

    pipes = [];
    for (let i = 0; i < 3; i++) {
        let x = canvas.width + i * PIPE_SPACING;
        let y = 0;
        let height = Math.random() * 200 + 50;
        let pipeTop = new Pipe(x, y, 50, height, "green");
        let pipeBottom = new Pipe(x, y + height + PIPE_SPACING, 50, canvas.height - height - PIPE_SPACING, "green");
        pipes.push(pipeTop);
        pipes.push(pipeBottom);
    }

    // Start game loop
    setInterval(gameLoop, 1000 / 60);
}

// Start game
init();

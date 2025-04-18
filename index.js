const startEl = document.getElementById("start");
const stopEl = document.getElementById("stop");
const resetEl = document.getElementById("reset");
const skipEl = document.getElementById("skip");
const timerEl = document.getElementById("timer");
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");
const taskInput = document.getElementById("taskInput");
const sessionCountEl = document.getElementById("sessionCount");
const butterflyCountEl = document.getElementById("butterflyCount");
const timerTypeEl = document.getElementById("timerType");
const autoBreakEl = document.getElementById("autoBreak");
const soundEnabledEl = document.getElementById("soundEnabled");
const newSessionEl = document.getElementById("newSession");

let interval = null;
let timeLeft = 1500; // 25 minutes
let treeHeight = 30; 
let maxTreeHeight = 0;
let butterflyX = null;
let butterflyY = null;
let growing = false;
let sessionCount = 0;
let butterflyCount = 0;
let isBreakTime = false;


function updateMaxTreeHeight() {
    maxTreeHeight = canvas.height * 0.7; 
    treeHeight = Math.min(treeHeight, maxTreeHeight);
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    updateMaxTreeHeight();
    drawTree();
}


resizeCanvas();

window.addEventListener('resize', resizeCanvas);


function drawTree() {
    updateMaxTreeHeight(); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw trunk with gradient
    const trunkGradient = ctx.createLinearGradient(
        canvas.width / 2 - 10,
        canvas.height,
        canvas.width / 2 + 10,
        canvas.height - treeHeight
    );
    trunkGradient.addColorStop(0, '#4B2810');
    trunkGradient.addColorStop(1, '#8B4513');
    
    ctx.fillStyle = trunkGradient;
    ctx.fillRect(canvas.width / 2 - 10, canvas.height - treeHeight, 20, treeHeight);
    const leafGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height - treeHeight,
        0,
        canvas.width / 2,
        canvas.height - treeHeight,
        treeHeight / 1.5
    );
    leafGradient.addColorStop(0, '#90EE90');
    leafGradient.addColorStop(0.6, '#228B22');
    leafGradient.addColorStop(1, '#006400');



    
    if (butterflyX !== null && butterflyY !== null) {
        drawButterfly(butterflyX, butterflyY);
    }
}

let butterflyWing = 0;

function drawButterfly(x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    // Create wing animation
    const wingFlap = Math.sin(butterflyWing) * 0.5;
    butterflyWing += 0.2;

    // Create gradient for wings
    const gradient = ctx.createLinearGradient(-20, 0, 20, 0);
    gradient.addColorStop(0, '#FF69B4');  // Pink
    gradient.addColorStop(0.3, '#FFB6C1'); // Light pink
    gradient.addColorStop(0.5, '#FFC0CB'); // Lighter pink
    gradient.addColorStop(0.7, '#FFB6C1'); // Light pink
    gradient.addColorStop(1, '#FF69B4');   // Pink

    ctx.fillStyle = gradient;

    // Draw left wing
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, -15, -10, -5);
    ctx.bezierCurveTo(-20, -20, -15, -25, 0, -15);
    ctx.closePath();
    ctx.fill();

    // Draw right wing
    ctx.save();
    ctx.rotate(wingFlap);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(10, -10, 20, -15, 10, -5);
    ctx.bezierCurveTo(20, -20, 15, -25, 0, -15);
    ctx.closePath();
    ctx.fill();



    // Draw body
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();


function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.innerHTML = `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;

    if (growing && timeLeft % 300 === 0 && timeLeft > 0) { 
        
        drawTree();
    }
}


function startTimer() {
    if (interval !== null) return;

    newSessionEl.classList.add('hidden');
    growing = true;
    updateMaxTreeHeight();
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft === 0) {
            clearInterval(interval);
            interval = null;
            growing = false;

            if (!isBreakTime) { 
                
                sessionCount++;
                butterflyCount++;
                sessionCountEl = `Sessions: ${sessionCount}`;
                butterflyCountEl. = `Butterflies: ${butterflyCount}`;
                
                animateButterfly();
            }

           
            isBreakTime = !isBreakTime;
            timeLeft = isBreakTime ? 300 : 1500; // 5 min break or 25 min work
            timerTypeEl.textContent = isBreakTime ? 'Break Time' : 'Work Time';

            if (autoBreakEl.checked) {
                startTimer();
            } else {
                updateTimer();
            }
        }
    }, 1000);
}

// Stop Timer
function stopTimer() {
    clearInterval(interval);
    interval = null;
}

// Reset Timer and Tree
function resetTimer() {
    clearInterval(interval);
    interval = null;
    timeLeft = 1500;
    treeHeight = 30;
    butterflyX = null;
    butterflyY = null;
    isBreakTime = false;
    sessionCount = 0;
    butterflyCount = 0;
    sessionCountEl.textContent = 'Sessions: 0';
    butterflyCountEl.textContent = 'Butterflies: 0';
    timerTypeEl.textContent = 'Work Time';
    newSessionEl.classList.add('hidden');
    updateMaxTreeHeight();
    updateTimer();
    drawTree();
}


function animateButterfly() {
    let startX = canvas.width;
    let startY = canvas.height - treeHeight - 20;
    let progress = 0;
    let flightDuration = 3000; // 3 seconds
    let startTime = Date.now();

    
    if (!isBreakTime) {
        sessionCount++;
        butterflyCount++;
        sessionCountEl.textContent = `Sessions: ${sessionCount}`;
        butterflyCountEl.textContent = `Butterflies: ${butterflyCount}`;
    }

    function animate() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / flightDuration, 1);

       
        butterflyX = startX + (canvas.width/2 - startX) * progress;
        butterflyY = startY + Math.sin(progress * Math.PI * 4) * 30;

        drawTree();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            butterflyX = null;
            butterflyY = null;
            drawTree();
        }
    }

    butterflyX = startX;
    butterflyY = startY;
    animate();
}


function skipTime() {
    const wasWorkTime = !isBreakTime;
    
    if (timeLeft > 300) {
        timeLeft -= 300;
    } else {
        timeLeft = 0;
        clearInterval(interval);
        interval = null;
        growing = false;
        
        if (wasWorkTime) { 
            sessionCount++;
            butterflyCount++;
            sessionCountEl.textContent = `Sessions: ${sessionCount}`;
            butterflyCountEl.textContent = `Butterflies: ${butterflyCount}`;
            newSessionEl.classList.remove('hidden');
            animateButterfly();
        }
        
        
        isBreakTime = !isBreakTime;
        timeLeft = isBreakTime ? 300 : 1500;
        timerTypeEl.textContent = isBreakTime ? 'Break Time' : 'Work Time';
    }
    
    updateTimer();
}


startEl.addEventListener("click", startTimer);
stopEl.addEventListener("click", stopTimer);
resetEl.addEventListener("click", resetTimer);
skipEl.addEventListener("click", skipTime);


newSessionEl.addEventListener("click", () => {
    isBreakTime = false;
    timeLeft = 1500; 
    timerTypeEl.textContent = 'Work Time';
    updateTimer();
    newSessionEl.classList.add('hidden');
    startTimer();
}); 


updateTimer();
drawTree();

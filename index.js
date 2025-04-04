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
let notificationSound = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2ooVFYAIAEAGAIAGBARULHABwANBcGRaCZmQCAZERZQVABQA+QAAADl/d8A9AKqAQAAAKACigHeBQAA');


function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    updateMaxTreeHeight();
    drawTree();
}

// Initial canvas setup
resizeCanvas();

// Update canvas size when window resizes
window.addEventListener('resize', resizeCanvas);


function drawTree() {
    updateMaxTreeHeight(); // Ensure tree size is correct
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

    // Draw leaves with multiple layers and gradients
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

    // Draw multiple leaf layers
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = leafGradient;
        ctx.beginPath();
        ctx.arc(
            canvas.width / 2,
            canvas.height - treeHeight + i * 10,
            treeHeight / (1.8 + i * 0.2),
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Add some decorative leaves
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = canvas.width / 2 + Math.cos(angle) * (treeHeight / 3);
        const y = canvas.height - treeHeight + Math.sin(angle) * (treeHeight / 3);
        
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(x, y, 10, 5, angle, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw butterfly if present
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

    // Add wing details
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.quadraticCurveTo(-15, -15, -7, -12);
    ctx.stroke();
    ctx.restore();

    // Draw right wing
    ctx.save();
    ctx.rotate(wingFlap);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(10, -10, 20, -15, 10, -5);
    ctx.bezierCurveTo(20, -20, 15, -25, 0, -15);
    ctx.closePath();
    ctx.fill();

    // Add wing details
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(5, -5);
    ctx.quadraticCurveTo(15, -15, 7, -12);
    ctx.stroke();
    ctx.restore();

    // Draw body
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw antennae
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.quadraticCurveTo(-5, -12, -3, -15);
    ctx.moveTo(0, -4);
    ctx.quadraticCurveTo(5, -12, 3, -15);
    ctx.stroke();

    ctx.restore();
}


function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.innerHTML = `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;

    if (growing && timeLeft % 300 === 0 && timeLeft > 0) { 
        treeHeight = Math.min(treeHeight + 10, maxTreeHeight);
        drawTree();
    }
}

// Start Timer and Tree Growth
function startTimer() {
    if (interval !== null) return;

    newSessionEl.classList.add('hidden');
    growing = true;
    updateMaxTreeHeight();
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();

        // Grow tree every 5 minutes
        if (timeLeft % 300 === 0 && timeLeft > 0) {
            treeHeight = Math.min(treeHeight + 15, maxTreeHeight);
            drawTree();
        }

        if (timeLeft === 0) {
            clearInterval(interval);
            interval = null;
            growing = false;

            if (!isBreakTime) { 
                
                sessionCount++;
                butterflyCount++;
                sessionCountEl.textContent = `Sessions: ${sessionCount}`;
                butterflyCountEl.textContent = `Butterflies: ${butterflyCount}`;
                newSessionEl.classList.remove('hidden'); // Show new session button before animation
                animateButterfly();
            }

            if (soundEnabledEl.checked) {
                notificationSound.play();
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
        
        if (wasWorkTime) { // Work session completed by skipping
            // Increment counts and animate butterfly
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

document.addEventListener("DOMContentLoaded", () => {
// 1. Generar luciérnagas doradas flotantes
const firefliesContainer = document.getElementById("fireflies-container");
const fireflyCount = 28;

for (let i = 0; i < fireflyCount; i++) {
const firefly = document.createElement("span");
firefly.classList.add("firefly");
firefly.style.left = `${Math.random() * 100}%`;
firefly.style.top = `${Math.random() * 100}%`;
const size = 4 + Math.random() * 4;
firefly.style.width = `${size}px`;
firefly.style.height = `${size}px`;
firefly.style.animationDuration = `${6 + Math.random() * 8}s`;
firefly.style.animationDelay = `${Math.random() * 6}s`;
firefliesContainer.appendChild(firefly);
}

// 2. Cuenta regresiva al 26 de diciembre de 2026 a las 7:00 PM
const eventDate = new Date("December 26, 2026 19:00:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
const now = new Date().getTime();
const distance = eventDate - now;

if (distance <= 0) {
daysEl.textContent = "00";
hoursEl.textContent = "00";
minutesEl.textContent = "00";
secondsEl.textContent = "00";
return;
}

const days = Math.floor(distance / (1000 * 60 * 60 * 24));
const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((distance % (1000 * 60)) / 1000);

daysEl.textContent = String(days).padStart(2, "0");
hoursEl.textContent = String(hours).padStart(2, "0");
minutesEl.textContent = String(minutes).padStart(2, "0");
secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// 3. Reproductor de Vals romántico con acompañamiento en 3/4 (Web Audio API)
const musicToggleBtn = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const musicLabel = document.getElementById("music-label");

let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let beatTimer = null;
let barIndex = 0;

// Cada compás (3/4) tiene:
// - bass: bajo suave en tiempo 1
// - chord: dos notas de acompañamiento suave en tiempos 2 y 3
// - notes: melodía lírica expresiva con tiempos de inicio (en pulsos de negra) y duración
const waltzBars = [
{
bass: 164.81, // E3
chord: [246.94, 329.63], // B3, E4
notes: [
{ freq: 659.25, offset: 0.0, dur: 1.35 }, // E5
{ freq: 587.33, offset: 1.35, dur: 0.65 }, // D5
{ freq: 493.88, offset: 2.0, dur: 1.0 } // B4
]
},
{
bass: 164.81, // E3
chord: [246.94, 329.63],
notes: [
{ freq: 523.25, offset: 0.0, dur: 1.0 }, // C5
{ freq: 493.88, offset: 1.0, dur: 1.0 }, // B4
{ freq: 440.00, offset: 2.0, dur: 1.0 } // A4
]
},
{
bass: 146.83, // D3
chord: [220.00, 293.66], // A3, D4
notes: [
{ freq: 587.33, offset: 0.0, dur: 1.4 }, // D5
{ freq: 493.88, offset: 1.4, dur: 0.6 }, // B4
{ freq: 392.00, offset: 2.0, dur: 1.0 } // G4
]
},
{
bass: 123.47, // B2
chord: [196.00, 246.94], // G3, B3
notes: [
{ freq: 440.00, offset: 0.0, dur: 1.0 }, // A4
{ freq: 392.00, offset: 1.0, dur: 1.0 }, // G4
{ freq: 369.99, offset: 2.0, dur: 1.0 } // F#4
]
},
{
bass: 130.81, // C3
chord: [196.00, 261.63], // G3, C4
notes: [
{ freq: 523.25, offset: 0.0, dur: 1.35 }, // C5
{ freq: 659.25, offset: 1.35, dur: 0.65 }, // E5
{ freq: 587.33, offset: 2.0, dur: 1.0 } // D5
]
},
{
bass: 110.00, // A2
chord: [164.81, 220.00], // E3, A3
notes: [
{ freq: 493.88, offset: 0.0, dur: 1.0 }, // B4
{ freq: 440.00, offset: 1.0, dur: 1.0 }, // A4
{ freq: 392.00, offset: 2.0, dur: 1.0 } // G4
]
},
{
bass: 146.83, // D3
chord: [220.00, 293.66], // A3, D4
notes: [
{ freq: 440.00, offset: 0.0, dur: 1.2 }, // A4
{ freq: 493.88, offset: 1.2, dur: 0.8 }, // B4
{ freq: 587.33, offset: 2.0, dur: 1.0 } // D5
]
},
{
bass: 123.47, // B2
chord: [185.00, 246.94], // F#3, B3
notes: [
{ freq: 493.88, offset: 0.0, dur: 1.5 }, // B4
{ freq: 440.00, offset: 1.5, dur: 1.5 } // A4
]
}
];

// Duración de un pulso de negra en segundos (vals lento ~82 BPM)
const beatSec = 60 / 82;

function triggerTone(freq, startTime, duration, peakGain, waveType = "sine") {
if (!audioCtx || !masterGain) return;

const osc = audioCtx.createOscillator();
const filter = audioCtx.createBiquadFilter();
const gain = audioCtx.createGain();

osc.type = waveType;
osc.frequency.setValueAtTime(freq, startTime);

filter.type = "lowpass";
filter.frequency.setValueAtTime(1950, startTime);

const attack = Math.min(0.08, duration * 0.25);
gain.gain.setValueAtTime(0.0001, startTime);
gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

osc.connect(filter);
filter.connect(gain);
gain.connect(masterGain);

osc.start(startTime);
osc.stop(startTime + duration + 0.04);
}

function scheduleWaltzBar() {
if (!isPlaying || !audioCtx) return;

const bar = waltzBars[barIndex];
const barStart = audioCtx.currentTime + 0.04;

// Tiempo 1: Bajo suave
triggerTone(bar.bass, barStart, beatSec * 1.4, 0.09, "sine");

// Tiempos 2 y 3: Acompañamiento suave de vals
bar.chord.forEach((chordFreq) => {
triggerTone(chordFreq, barStart + beatSec, beatSec * 0.85, 0.032, "triangle");
triggerTone(chordFreq, barStart + beatSec * 2, beatSec * 0.85, 0.03, "triangle");
});

// Melodía principal con doble voz suave para calidez
bar.notes.forEach((n) => {
const nStart = barStart + n.offset * beatSec;
const nDur = n.dur * beatSec;
triggerTone(n.freq, nStart, nDur, 0.095, "sine");
triggerTone(n.freq, nStart + 0.012, nDur * 0.92, 0.032, "triangle");
});

barIndex = (barIndex + 1) % waltzBars.length;
beatTimer = setTimeout(scheduleWaltzBar, beatSec * 3 * 1000);
}

musicToggleBtn.addEventListener("click", async () => {
if (!audioCtx) {
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
audioCtx = new AudioContextClass();
masterGain = audioCtx.createGain();
masterGain.gain.setValueAtTime(0.9, audioCtx.currentTime);
masterGain.connect(audioCtx.destination);
}

if (audioCtx.state === "suspended") {
await audioCtx.resume();
}

if (!isPlaying) {
isPlaying = true;
musicToggleBtn.classList.add("playing");
musicIcon.textContent = "❚❚";
musicLabel.textContent = "Pausar Vals";
scheduleWaltzBar();
} else {
isPlaying = false;
clearTimeout(beatTimer);
musicToggleBtn.classList.remove("playing");
musicIcon.textContent = "♫";
musicLabel.textContent = "Escuchar Vals";
}
});
});
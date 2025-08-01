// make glow follow mouse
const mouseGlow = document.querySelector("#mouse-glow");
let mouseX = 0;
let mouseY = 0;
let glowX = mouseX;
let glowY = mouseY;
let visible = false; // check if mouse is in viewport
let currentOpacity = 0;

window.addEventListener('mousemove', (e) => { // mouse event for mouse moving
    mouseX = e.clientX;
    mouseY = e.clientY;

    // teleport glow to cursor if this is the first move after being hidden
    if (!visible) {
        glowX = mouseX;
        glowY = mouseY;
        mouseGlow.style.left = glowX + 'px';
        mouseGlow.style.top = glowY + 'px';
    }

    visible = true;
});

// when mouse leaves the window
window.addEventListener('mouseout', (e) => {
    // e.relatedTarget is the element that the mouse is entering
    // in this case, only hide the mouse if the mouse leaves the whole window aka is null
    if (!e.relatedTarget) { 
        visible = false;
    }
});

function AnimateMouseGlow() {
    if (visible) {
        // move mouse glow smoothly
        glowX += (mouseX - glowX) * 0.4;
        glowY += (mouseY - glowY) * 0.4;

        currentOpacity += (1 - currentOpacity) * 0.1; // fade in effect
    }
    else {
        // if not visible, then hide glow
        currentOpacity -= currentOpacity * 0.1; // fade out effect
    }

    mouseGlow.style.left = glowX + 'px';
    mouseGlow.style.top  = glowY + 'px';
    mouseGlow.style.opacity = currentOpacity;

    requestAnimationFrame(AnimateMouseGlow);
}

AnimateMouseGlow();

// // enable user inputs & scroll after landing page anim finishes
// const header = document.querySelector("header");
// header.classList.add("hidden");

// document.body.classList.add('disable-scroll');
// // auto remove blocker
// setTimeout(() => {
//     document.body.classList.remove('disable-scroll');
//     document.querySelector("#input-blocker")?.remove();
//     header.classList.remove("hidden");
// }, 11000);

// target all elements to save to constants
const topicButtons = [
    document.querySelector("#topic1btn"),
    document.querySelector("#topic2btn"),
    document.querySelector("#topic3btn")
];
const topicSections = [
    document.querySelector("#topic1"),
    document.querySelector("#topic2"),
    document.querySelector("#topic3")
];
var allpages = document.querySelectorAll(".page"); // select all subtopic pages
const selectAudio = new Audio("audio/select.mp3");

// function to hide all pages
function hidePages() {
    // go through all subtopic pages
    for(let page of allpages) {
        page.style.display = "none";
    }
}

// function to show selected page no
function showPage(pgno) {
    hidePages();
    
    // select the page based on the parameter passed in
    let page = document.querySelector("#topic" + pgno);
    page.style.display = "block";
    selectAudio.play();
}

// Listen for clicks on the buttons, assign anonymous eventhandler functions to call show function
const dropdownNav = document.querySelector("#dropdown-nav");
for (let i = 0; i < topicButtons.length; i++) {
    topicButtons[i].addEventListener("click", () => {
        showPage(i + 1);
        topicSections[i].scrollIntoView({behavior: "smooth"}); // scroll to corresponding section smoothly
        dropdownNav.classList.remove("open-nav");

        burgerSprite.classList.remove('hidden');
        burgerSprite.classList.remove('active');
    });
}

hidePages();
showPage(1);

// get documentElement (<html>) to display the page in fullscreen
const elem = document.documentElement;
const fullscreenBtn = document.querySelector("#changescreen-icon");
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        openFullscreen();
        fullscreenBtn.src = 'images/exitfullscreen-icon.png';
    }
    else {
        closeFullscreen();
        fullscreenBtn.src = 'images/fullscreen-icon.png';
    }
})
// exit fullscreen when 'ESC' is pressed
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.src = 'images/exitfullscreen-icon.png';
    } else {
        fullscreenBtn.src = 'images/fullscreen-icon.png';
    }
});

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE11
        elem.msRequestFullscreen();
    }
}
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
    }
}

// reload screen
const refreshBtn = document.querySelector('#refresh-icon');
refreshBtn.addEventListener('click', () => {
    location.reload();
});

// display current time on clock on the top right
const clock = document.querySelector("#clock");

function updateClock() {
    const currentTime = new Date();
    const time = {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short', // shows GMT offset (e.g GMT+8)
        hour12: false
    };
    
    const timeString = currentTime.toLocaleTimeString('en-US', time);
    clock.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// reveal nav menu when burger is clicked
const menuBtn = document.querySelector(".burger");
const burgerSprite = document.querySelector('.burger span');
const navAudio = new Audio("audio/nav.mp3");

menuBtn.addEventListener('click', () => {
    burgerSprite.classList.toggle('hidden');
    burgerSprite.classList.toggle('active');
    
    // toggle nav
    dropdownNav.classList.toggle("open-nav");
    navAudio.play();
});

// tab management for topic1
function setupTabs(sectionTabId) {
    const sectionTab = document.getElementById(sectionTabId);
    const tabs = sectionTab.querySelectorAll('.tab-box button');
    const tabs_content = sectionTab.querySelectorAll('.content-box article');
    const line = sectionTab.querySelector('.tab-line');

    // set line width to the first tab at the start
    activateTab(0);

    // loop through all tabs to add event listener to each of them
    tabs.forEach((tab, index)=> { // tab, index are function parameters [tab is current button, index is its position]
        // listen for user click and selects the tab accordingly
        tab.addEventListener('click', ()=> {
            activateTab(index);
        });
    });

    function activateTab(index) {
        // remove active from all tabs so only one will be active at a time
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        tabs_content.forEach(content => {
            content.classList.remove('active');
        });

        // make current tab active
        tabs[index].classList.add('active'); 
        tabs_content[index].classList.add('active');

        moveTabLine(tabs[index]);
    }

    function moveTabLine(tab) {
        // move line according to which tab is active
        line.style.width = tab.offsetWidth + 'px';
        line.style.left = tab.offsetLeft + 'px';
    }
}

setupTabs('cosmic-tabs');
setupTabs('earth-tabs');

// allow mobile tap instead of hover for underlined text
const tooltips = document.querySelectorAll('.tooltip');
tooltips.forEach(tooltip => {
    tooltip.addEventListener('click', () => {
        // check if the user device supports hover or not      
        if (window.matchMedia("(hover: none)").matches) {
            tooltip.classList.add('visible');
        }
    });
});

document.addEventListener('click', (e) => {
    if (window.matchMedia("(hover: none)").matches) {
        tooltips.forEach(tooltip => {
            // if the clicked target is not inside the tooltip then hide the text
            if (!tooltip.contains(e.target)) {
                tooltip.classList.remove('visible');
            }
        });
    }
});

// 3d carousell
const banner = document.querySelector(".banner");
const slider = document.querySelector(".slider");
const planets = document.querySelectorAll(".planet");
let isDragging = false;
let startX = 0; // track where drag started (x position)
let currentRotateY = 0;
let currentRotateX = -10;
let currentPerspective = 1000;
let wasDragging = false;
let dragThreshold = 1; // drag must be >dragThreshold to count as a drag

// vars for inertia on scroll effect
let velocity = 0;
let lastX = 0;
let animationFrameId = null;

// set total no. of planets
const quantity = planets.length;
banner.style.setProperty('--quantity', quantity); // custom CSS properties

// for inspecting planets
let isInspecting = false;
// store all planet data
const planetData = [
    {
        name: "Mars",
        description: "Closest Planet to Earth. The Red Planet.",
        pros: [
            {text: "Close to Earth (~6-9 months travel)", top: "19%", left: "76%"},
            {text: "Similar day length (24.6 hours)", top: "73%", left: "67%"},
            {text: "Evidence of water ice in polar regions", top: "46%", left: "13%"},
            {text: "Thin atmosphere might allow gradual terraforming", top: "50%", left: "56%"},
            {text: "Surface gravity (0.38g) suitable for human adaptation", top: "27%", left: "17%"}
        ],
        cons: [
            {text: "No breathable atmosphere (mostly CO₂)", top: "84%", left: "34%"},
            {text: "No magnetic field → radiation risk", top: "10%", left: "45%"},
            {text: "Extremely cold (avg -63°C)", top: "44%", left: "83%"},
            {text: "Dust storms and low atmospheric pressure", top: "30%", left: "39%"}
        ]
    },
    {
        name: "Proxima b",
        description: "Closest known exoplanet in a habitable zone.",
        pros: [
            {text: "Closest known exoplanet (~4.2 light-years)", top: "27%", left: "17%"},
            {text: "Earth-sized and within habitable zone", top: "19%", left: "76%"},
            {text: "Possibly rocky", top: "73%", left: "67%"}
        ],
        cons: [
            {text: "Host star is very active → frequent stellar flares", top: "46%", left: "13%"},
            {text: "Possibly tidally locked → one half of planet very hot, other half very cold", top: "50%", left: "56%"},
            {text: "Unknown atmosphere", top: "84%", left: "34%"},
            {text: "No current tech to reach it", top: "10%", left: "45%"}
        ]
    },
    {
        name: "Kepler-452b",
        description: "Super-Earth in a Sun-like star system.",
        pros: [
            {text: "Orbits a Sun-like star", top: "44%", left: "83%"},
            {text: "Located in the habitable zone", top: "30%", left: "39%"},
            {text: "Long orbital period (385 days, Earth-like year)", top: "27%", left: "17%"}
        ],
        cons: [
            {text: "Very far away (~1,400 light-years)", top: "19%", left: "76%"},
            {text: "Likely has higher gravity (1.6x Earth's radius)", top: "73%", left: "67%"},
            {text: "Little is known about its atmosphere or surface", top: "46%", left: "13%"}
        ]
    },
    {
        name: "Europa",
        description: "Moon of Jupiter; may contain a subsurface ocean.",
        pros: [
            {text: "Likely has a subsurface liquid water ocean", top: "50%", left: "56%"},
            {text: "Warmed by tidal heating from Jupiter", top: "84%", left: "34%"},
            {text: "Target of NASA's Europa Clipper mission", top: "10%", left: "45%"}
        ],
        cons: [
            {text: "No atmosphere", top: "44%", left: "83%"},
            {text: "Thick icy crust (~10-30 km deep)", top: "30%", left: "39%"},
            {text: "Intense radiation from Jupiter's magnetosphere", top: "27%", left: "17%"},
            {text: "Extremely cold (~ -160°C)", top: "19%", left: "76%"}
        ]
    },
    {
        name: "Titan",
        description: "Moon of Saturn with a dense atmosphere.",
        pros: [
            {text: "Thick nitrogen-rich atmosphere", top: "73%", left: "67%"},
            {text: "Surface pressure similar to Earth's (1.5x)", top: "46%", left: "13%"},
            {text: "Presence of lakes/seas (methane/ethane)", top: "50%", left: "56%"},
            {text: "Rich in organic chemistry (potential precursors to life)", top: "84%", left: "34%"}
        ],
        cons: [
            {text: "Very cold (~ -179°C)", top: "10%", left: "45%"},
            {text: "No oxygen", top: "44%", left: "83%"},
            {text: "Liquid on surface is not water", top: "30%", left: "39%"},
            {text: "Far from Earth (~7 years travel)", top: "27%", left: "17%"}
        ]
    }
];
const tooltip = document.querySelector("#planet-tooltip");
const planetInfo = document.querySelector("#planet-info");
const planetName = document.querySelector(".planet-name");
const planetDesc = document.querySelector(".planet-desc");
const closeBtn = document.querySelector("#close-inspect");
let currentInspectedPlanet = null;
const travelAudio = new Audio("audio/travel-space.mp3");

closeBtn.addEventListener("click", () => {
    planetInfo.style.display = "none";
    closeBtn.style.display = "none";
    isInspecting = false;
    banner.style.cursor = ''; // allow JS to take over cursor
    console.log("current rotate: " + currentRotateY);
    console.log("inspecting planet: " + getRotateY(currentInspectedPlanet));

    animateSnap(2000, currentRotateY, -10, 1000);

    console.log("current rotate: " + currentRotateY);
    console.log("inspecting planet: " + getRotateY(currentInspectedPlanet));
    // remove all hoverpoints
    currentInspectedPlanet.querySelectorAll(".hoverpoint").forEach(point => {point.remove()});
    currentInspectedPlanet = null;
});

// assign each planet their position
planets.forEach((planet, index) => {
    planet.style.setProperty('--position', index + 1);

    // assign dataset properties from planetData
    const data = planetData[index];
    planet.dataset.name = data.name;
    planet.dataset.description = data.description;
    planet.dataset.pros = JSON.stringify(data.pros);
    planet.dataset.cons = JSON.stringify(data.cons);

    // assign event listener to hear when user clicks on each planet to inspect
    planet.addEventListener('click', () => {
        if (wasDragging || isInspecting) return; // dont inspect if was dragging or currently inspecting
        // snap carousel to this planet's rotation
        animateSnap(2000, getRotateY(planet), -5, 900, () => {
            inspectPlanet(planet);
        });
    });
}); 

function assignHoverPoints(planet, pros, cons) {
    // remove existing hoverpoints

    function createHoverPoint(data, type) {
        // dynamically create hoverpoint
        const point = document.createElement('div');
        point.className = `hoverpoint ${type}`;
        point.style.top = data.top;
        point.style.left = data.left;
        point.dataset.tip = data.text;

        if (isHoverableDevice()) {
            // desktop
            point.addEventListener("pointerover", (e) => {
                showTooltip(data.text, e.clientX, e.clientY);
            });
            point.addEventListener("pointermove", (e) => {
                showTooltip(data.text, e.clientX, e.clientY); // follow the mouse
            });
            point.addEventListener("pointerout", hideTooltip);
        }
        else {
            // for mobile/tablet
            point.addEventListener("click", (e) => {
                e.stopPropagation(); // avoid closing tooltip immediately
                const rect = point.getBoundingClientRect();

                const tooltipX = rect.left + rect.width / 2;
                const tooltipY = rect.top - 10;

                showTooltip(data.text, tooltipX, tooltipY);
            });
        }

        planet.appendChild(point);
    }

    pros.forEach(p => createHoverPoint(p, "pro"));
    cons.forEach(c => createHoverPoint(c, "con"));
}

function showTooltip(text, left, top) {
    tooltip.textContent = text;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top - 100}px`;
    tooltip.style.display = "block";
}

function hideTooltip() {
    tooltip.style.display = "none";
}

function inspectPlanet(planet) {
    isInspecting = true;
    currentInspectedPlanet = planet;

    planetName.textContent = planet.dataset.name;
    planetDesc.textContent = planet.dataset.description;
    planetInfo.style.display = "block";
    closeBtn.style.display = "block";

    const pros = JSON.parse(planet.dataset.pros);
    const cons = JSON.parse(planet.dataset.cons);

    banner.style.cursor = 'default';
    assignHoverPoints(planet, pros, cons);
}

function getRotateY(element) {
    const anglePerElement = 360 / quantity;
    const position = parseInt(element.style.getPropertyValue('--position'));
    const targetRotation = (position - 1) * anglePerElement; // convert to 0 based position to calc angle
    return -targetRotation; // return negative to rotate right
}

// scroll images
banner.addEventListener('mousedown', handleMouseDown);
banner.addEventListener('mouseup', handleMouseUp);
banner.addEventListener('mouseleave', handleMouseUp); // if mouse leaves the element, stop dragging
banner.addEventListener('mousemove', handleMouseMove);

function handleMouseDown(e) {
    if (isInspecting) return; // dont rotate carousel if inspecting
    e.preventDefault(); // prevent text/image selection
    isDragging = true;
    startX = e.clientX;
    lastX = e.clientX;
    wasDragging = false;
    velocity = 0;
    cancelMomentum();
    banner.style.cursor = 'grabbing';
}
function handleMouseUp() {
    if (!isDragging || isInspecting) return;
    isDragging = false;
    banner.style.cursor = 'grab';
    startMomentum(); // start momentum when release mouse
}

function handleMouseMove(e) {
    if (!isDragging) return;

    let deltaX = e.clientX - lastX; // calc movement since last event
    if (Math.abs(deltaX) > dragThreshold) { 
        wasDragging = true;
    }

    velocity = deltaX;
    currentRotateY += deltaX * 0.1; // rotate slider based on drag movement
    lastX = e.clientX; // update lastX for next move

    updateSlider(); // apply CSS transform to slider
}

function updateSlider(perspective = currentPerspective, rotateX = currentRotateX, rotateY = currentRotateY) {
    currentPerspective = perspective;
    currentRotateX = rotateX;
    currentRotateY = rotateY;
    slider.style.transform = `perspective(${currentPerspective}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
}

function updateSliderScroll(perspective = currentPerspective, rotateX = currentRotateX, rotateY = currentRotateY) {
    currentPerspective = perspective;
    currentRotateX = rotateX;
    currentRotateY = rotateY;
    // invert rotateY only for scrolling (dragging)
    slider.style.transform = `perspective(${currentPerspective}px) rotateX(${currentRotateX}deg) rotateY(${-currentRotateY}deg)`;
}

// start momentum effect -> slider continues rotating after mouse release
function startMomentum() {
    const friction = 0.95;

    function momentumLoop() {
        velocity *= friction; // apply friction to the vel

        // stop momentum if vel is close to 0
        if (Math.abs(velocity) < 0.2) {
            cancelMomentum();

            // after momentum stops, snap to nearest planet
            const anglePerPlanet = 360 / quantity;
            let nearestPlanetIndex = Math.round(-currentRotateY / anglePerPlanet);
            console.log(nearestPlanetIndex);
            if (nearestPlanetIndex === quantity) nearestPlanetIndex = 0;
            const targetRotationY = -nearestPlanetIndex * anglePerPlanet;
            console.log(targetRotationY);
            animateSnap(500, targetRotationY);

            return;
        }

        currentRotateY += velocity * 0.05; // rotate based on velocity
        updateSlider();

        animationFrameId = requestAnimationFrame(momentumLoop); // loop
    }
    momentumLoop(); // start animation
}

// cancel any momentum
function cancelMomentum() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// animate snapping to nearest planet
// accounts for perspective, rotateX and rotateY
function animateSnap(duration, targetY, targetX = -10, targetPerspective = 1000, onComplete) {
    const startTime = performance.now(); // time when animation started
    const startY = currentRotateY;
    const startX = currentRotateX;
    const startPerspective = currentPerspective;

    // normalize angle to ensure shortest direction -> prevents multiple ocillations
    let delta = targetY - startY;

    travelAudio.play();
    // use lerp to animate
    function animate(time) {
        const elaspedTime = time - startTime;
        const t = Math.min(elaspedTime / duration, 1); // normalise between 0 to 1

        // apply easing -> start fast, slows down smoothly towards end
        // similar to cubic ease-out, last num: lower = gentler
        const easing = 1 - Math.pow(1 - t, 3); 
        
        // lerp between current and target rotation
        // formula: a * (1 - t) + b * t
        const newY = startY + delta * easing; // simplified lerp
        const newX = startX * (1 - easing) + targetX * easing;
        const newPerspective = startPerspective * (1 - easing) + targetPerspective * easing;

        updateSlider(newPerspective, newX, newY);

        // keep animating if not at end of lerp yet
        if (t < 1) {
            requestAnimationFrame(animate);
        }
        else {
            wasDragging = false;
            currentRotateY = newY;
            currentRotateX = newX;
            currentPerspective = newPerspective;

            if (onComplete) onComplete();  // call the callback here
        }
    }

    requestAnimationFrame(animate);
}

let touchStartTime = 0; // to differ from a tap and a drag
// setup touch events for mobile/tablet
banner.addEventListener('touchstart', (e) => {
    if (isInspecting) return;
    e.preventDefault(); // prevent mobile scrolling
    isDragging = true;
    wasDragging = false;
    startX = e.touches[0].clientX; // get the first touch that the user made
    lastX = startX;
    velocity = 0;
    touchStartTime = Date.now();
    cancelMomentum();
});
banner.addEventListener('touchmove', (e) => {
    if (!isDragging || isInspecting) return;
    
    let currentX = e.touches[0].clientX;

    if (Math.abs(currentX - startX) > dragThreshold) {
        wasDragging = true;
    }

    let deltaX = currentX - lastX;
    velocity = deltaX;
    currentRotateY += deltaX * 0.2;
    lastX = currentX;

    updateSlider();
});
banner.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const touchDuration = Date.now() - touchStartTime;

    // check if its a tap or drag
    if (!wasDragging && touchDuration < 200) {
        // find element that user taps on
        const touchedElement = document.elementFromPoint(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
        );

        // check if touched planet
        if (touchedElement && touchedElement.closest('.planet')) {
            touchedElement.closest('.planet').click();
        }
    } 
    else {
        startMomentum();
    }
});

// check if device supports hover or not
function isHoverableDevice() {
  return !window.matchMedia("(hover: none)").matches;
}

// Quiz
const questions = [
    {
        question: "Which factor allows Earth to maintain liquid water and moderate temperatures?", 
        answers: [
            {text: "High axial tilt", correct: "false"},
            {text: "Proximity to Jupiter", correct: "false"},
            {text: "Location in the Goldilocks zone", correct: "true"},
            {text: "Strong lunar gravity", correct: "false"}
        ]
    },
    {
        question: "What type of star is the Sun classified as?",
        answers: [
            {text: "Red Giant", correct: "false"},
            {text: "G-type main-sequence star", correct: "true"},
            {text: "Blue Dwarf", correct: "false"},
            {text: "White Dwarf", correct: "false"}
        ]
    },
        {
        question: "How does Jupiter help protect Earth?",
        answers: [
            {text: "It blocks solar radiation", correct: "false"},
            {text: "Its gravity deflects or pulls in asteroids and comets", correct: "true"},
            {text: "It shares its magnetic field with Earth", correct: "false"},
            {text: "It absorbs solar flares from the Sun", correct: "false"}
        ]
    },
        {
        question: "What is one major function of Earth's magnetic field?",
        answers: [
            {text: "Keeping the ozone layer intact", correct: "false"},
            {text: "Warming the surface", correct: "false"},
            {text: "Deflecting solar wind and cosmic rays", correct: "true"},
            {text: "Stabilizing ocean tides", correct: "false"}
        ]
    },
        {
        question: "Which planet or moon is believed to have a subsurface ocean heated by tidal forces?",
        answers: [
            {text: "Europa", correct: "true"},
            {text: "Titan", correct: "false"},
            {text: "Proxima b", correct: "false"},
            {text: "Kepler-452b", correct: "false"}
        ]
    },
        {
        question: "What is a major drawback of Proxima b as a candidate for life?",
        answers: [
            {text: "It lacks a rocky surface", correct: "false"},
            {text: "It has no liquid water", correct: "false"},
            {text: "Its star emits frequent stellar flares", correct: "true"},
            {text: "It’s larger than Jupiter", correct: "false"}
        ]
    },
        {
        question: "Why is muscle and bone loss a concern for astronauts on Mars?",
        answers: [
            {text: "Mars' gravity is only 0.38g of Earth's", correct: "true"},
            {text: "Mars has no oxygen", correct: "false"},
            {text: "Mars is farther from the Sun", correct: "false"},
            {text: "The atmosphere is too thick", correct: "false"}
        ]
    },
        {
        question: "What ethical issue is raised by terraforming other planets like Mars?",
        answers: [
            {text: "Expense of the process", correct: "false"},
            {text: "Lack of technology", correct: "false"},
            {text: "Radiation from the Sun", correct: "false"},
            {text: "Potential disruption of microbial life", correct: "true"}
        ]
    },
]
const qnElement = document.querySelector("#question");
const answerBtns = document.querySelector("#answer-buttons");
const nextBtn = document.querySelector("#next-btn");
const userForm = document.querySelector("#user-form");

let currentQnIndex = 0;
let score = 0;
let isScoreShowed = false;

function startQuiz() {
    currentQnIndex = 0;
    score = 0;
    nextBtn.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQn = questions[currentQnIndex];
    let qnNo = currentQnIndex + 1;
    qnElement.innerHTML = qnNo + ". " + currentQn.question;

    // set all answers for question
    currentQn.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerBtns.appendChild(button); // append these answers to the answer-buttons id div
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })
}

// reset qn
function resetState() {
    nextBtn.style.display = "none";

    // remove all prev answers
    while (answerBtns.firstChild) {
        answerBtns.removeChild(answerBtns.firstChild);
    }
}

// when user clicks an answer
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    }
    else {
        selectedBtn.classList.add("incorrect");
    }

    // loop through all btns, if correct then highlight as green, and disable click on all btns
    Array.from(answerBtns.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function askForInput() {
    resetState();
    qnElement.style.display = "none";
    nextBtn.innerHTML = "Submit";
    nextBtn.style.display = "block";
    userForm.style.display = "block";
}

function showScore() {
    const name = document.querySelector("username");
    alert(`Thanks ${name}! Your feedback was submitted.`);
    userForm.style.display = "none";
    qnElement.style.display = "block";
    qnElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextBtn.innerHTML = "Play Again";
    nextBtn.style.display = "block";
    isScoreShowed = true;
}

function handleNextBtn() {
    currentQnIndex++;
    if (currentQnIndex < questions.length) {
        showQuestion();
    }
    else {
        askForInput();
    }
}

nextBtn.addEventListener("click", () => {
    if (currentQnIndex < questions.length) {
        handleNextBtn();
    }
    else if (isScoreShowed) {
        startQuiz();
    }
    else {
        showScore();
    }
});

startQuiz();

// drag and drop game
const zones = document.querySelector("#zones");
const popup = document.querySelector("#popup");
const feedback = document.querySelector(".popup-inner p");
const dropZones = document.querySelectorAll(".drop-zone");
const closePopupBtn = document.querySelector("#close-popup");
let draggedPlanet = null;
let errorCount = 0; // track no of times user placed incorrectly
let maxErrors = 3;
let correctCount = 0;
const totalNumOfPlanets = 8;
const correctAudio = new Audio("audio/correctAns.mp3");
const wrongAudio = new Audio("audio/wrongAns.mp3");

// event delegation -> drop handler on the parent containers
zones.addEventListener("dragover", (e) => {
    e.preventDefault(); // to allow dropping
});

zones.addEventListener("drop", (e) => {
    e.preventDefault(); // to allow dropping

    const planetName = draggedPlanet.dataset.name;
    const correctZone = draggedPlanet.dataset.zone;

    // get actual drop zone
    const dropZone = e.target.closest(".drop-zone");
    if (!dropZone) return;

    const targetZone = dropZone.dataset.zone;
    closePopupBtn.innerHTML = "Close";

    if (correctZone === targetZone) {
        correctAudio.play();
        popup.classList.add("open");
        feedback.textContent = `✅ ${planetName} is correctly placed in the ${targetZone} zone!`

        // add large image of planet to the zone
        const img = document.createElement("img");
        img.src = `images/${planetName.toLowerCase()}.png`
        img.alt = planetName;
        img.style.padding = "10px";

        dropZone.appendChild(img);

        draggedPlanet.remove();
        draggedPlanet = null; // remove the draggable planet

        correctCount++;
        if (correctCount === totalNumOfPlanets) {
            winGame();
        }
    }
    else {
        wrongAudio.play();
        popup.classList.add("open");
        feedback.textContent = `❌ ${planetName} does not belong in the ${targetZone} zone.`;
        errorCount++;
        if (errorCount >= maxErrors) {
            failGame();
        }
    }
});

closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("open");
})

function failGame() {
    popup.classList.add("open");
    feedback.textContent = `💥 You've made 3 incorrect attempts. Game Over!`;

    closePopupBtn.innerHTML = "Restart Game";
    closePopupBtn.onclick = startGame;
}

function winGame() {
    popup.classList.add("open");
    feedback.textContent = `🎉 Congrats! You've won the game! 🏆`;

    closePopupBtn.innerHTML = "Play Again";
    closePopupBtn.onclick = startGame;
}

function startGame() {
    closePopupBtn.onclick = "none";
    errorCount = 0;
    feedback.textContent = "";

    // reset dropzones
    dropZones.forEach(zone => {
        // remove any imgs
        const images = zone.querySelectorAll("img");
        images.forEach(img => img.remove());
    });

    // place draggable planets
    const gamePlanets = document.getElementById("game-planets");

    const planets = [
        { name: "Mercury", zone: "hot" },
        { name: "Venus", zone: "hot" },
        { name: "Earth", zone: "habitable" },
        { name: "Mars", zone: "cold" },
        { name: "Jupiter", zone: "cold" },
        { name: "Saturn", zone: "cold" },
        { name: "Uranus", zone: "cold" },
        { name: "Neptune", zone: "cold" }
    ];

    gamePlanets.innerHTML = ""; // clear existing planets

    // each planet has data-name and data-zone, and CSS sprite background
    planets.forEach(planet => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("game-planet-wrapper");
        wrapper.setAttribute("draggable", "true");
        wrapper.dataset.name = planet.name;
        wrapper.dataset.zone = planet.zone;

        const label = document.createElement("p");
        label.textContent = planet.name;

        const sprite = document.createElement("div");
        sprite.classList.add("game-planet", planet.name.toLowerCase());

        wrapper.appendChild(label);
        wrapper.appendChild(sprite);
        gamePlanets.appendChild(wrapper);
    });

    // attach dragstart and touch event listeners
    bindDragAndTouchEvents();
}

function bindDragAndTouchEvents() {
    const planetIcons = document.querySelectorAll(".game-planet-wrapper");
    // drag events for desktops
    // set up drag start on each planet wrapper
    planetIcons.forEach(icon => {
        icon.setAttribute("draggable", "true"); // make icons draggable

        icon.addEventListener("dragstart", (e) => {
            draggedPlanet = icon;
        });
    });

    // mobile/tablet
    planetIcons.forEach(icon => {
        icon.addEventListener("touchstart", (e) => {
            // keep track of current draggedPlanet
            draggedPlanet = icon;
        });

        icon.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY); // gets planet based on where user touches
            const dropZone = element.closest(".drop-zone"); // finds nearest parent element/itself that contains this class

            if (!dropZone) return;

            const planetName = draggedPlanet.dataset.name;
            const correctZone = draggedPlanet.dataset.zone;
            const targetZone = dropZone.dataset.zone;
            closePopupBtn.innerHTML = "Close";

            // compare the zones data to decide if user is correct
            if (targetZone === correctZone) {
                correctAudio.play();
                popup.classList.add("open");
                feedback.textContent = `✅ ${planetName} is correctly placed in the ${targetZone} zone!`;

                const img = document.createElement("img");
                img.src = `images/${planetName.toLowerCase()}.png`;
                img.alt = planetName;
                img.style.padding = "10px";
                dropZone.appendChild(img);

                draggedPlanet.remove();
                draggedPlanet = null;

                correctCount++;
                if (correctCount === totalNumOfPlanets) {
                    winGame();
                }
            } 
            else {
                wrongAudio.play();
                popup.classList.add("open");
                feedback.textContent = `❌ ${planetName} doesn't belong in the ${targetZone} zone.`;
                errorCount++;
                if (errorCount >= maxErrors) {
                    failGame();
                }
            }
        });
    });
}

startGame();
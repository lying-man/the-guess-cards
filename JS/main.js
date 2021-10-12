
"use strict";

//modal
const messageModal = document.querySelector(".modal-message");
const btnCloseModal = document.querySelector(".btn-close-modal");
const overlay = document.querySelector(".overlay");
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");
const modalImage = document.querySelector(".modal-emoji-item");

const imagesModal = ["Images/smiley__cool.svg", "Images/smile__sad.svg"];

const cardImages = document.querySelectorAll(".card-image");
const cardBackItem = document.querySelectorAll(".card-item-back");
const blockCards = document.querySelector(".block-cards");
const cardItems = document.querySelectorAll(".card-item");

//timer
const timerBlock = document.querySelector(".timer-block");
const timerLine = document.querySelector(".timer-line");
const timerImage = document.querySelector(".timer-image");

//restart
const btnRestart = document.querySelector(".button-restart");
btnRestart.style.display = "none";

//stat
const stat = document.querySelector(".stat");
const statItem = document.querySelector(".stat-item");
const closeStat = document.querySelector(".close-stat");
const openStat = document.querySelector(".open-stat");

let stopTimer = false;
let timeAtGame = 12000; //0
let restTime = timeAtGame;
let time;

if (localStorage.length !== 0) {
    statItem.textContent = localStorage.getItem("score");
}

function timer() {

    time = Date.now();

    let id = setInterval( function timerTrack() {

        if (stopTimer === true) { 
            clearInterval(id);
            let result = Date.now() - time;
            result = (Number((result / 1000).toFixed(2)) / 60).toFixed(2);
            result = result + " seconds";

            if (localStorage.length === 0) {
                localStorage.setItem("score", result);
                statItem.textContent = localStorage.getItem("score");
            } else {

                if (parseFloat(result) < parseFloat(localStorage.getItem("score"))) {
                    localStorage.clear();
                    localStorage.setItem("score", result);
                    statItem.textContent = localStorage.getItem("score");
                }

            }

        }

        restTime = restTime - 1000;

        if ((restTime / timeAtGame * 100) < 20) {
            timerImage.classList.add("timer-image-warm");
        } else {
            timerImage.classList.remove("timer-image-warm");
        }

        timerLine.style.width = restTime / timeAtGame * 100 + "%";

        if (restTime <= 0) {
            modalImage.src = imagesModal[1];
            modalTitle.textContent = "Проигрыш";
            modalText.textContent = "Капец, как так то, ты ведь мог выиграть...";
            overlay.classList.add("overlay-active");
            messageModal.classList.add("modal-message-active");
            timerImage.classList.remove("timer-image-warm");
            clearInterval(id);
        }

    }, 1000 );
}

const imagesAll = document.querySelectorAll("img");

for (let elem of imagesAll) {
    elem.ondragstart = () => false;
}

const arrCardItems = Array.from(cardItems);

const imagesArray = [
    "Images/apple.svg",
    "Images/avocado.svg",
    "Images/bananas.svg",
    "Images/blueberry.svg",
    "Images/orange.svg",
    "Images/pineapple.svg",
    "Images/strawberry.svg",
    "Images/watermelon.svg",
    "Images/apple.svg",
    "Images/avocado.svg",
    "Images/bananas.svg",
    "Images/blueberry.svg",
    "Images/orange.svg",
    "Images/pineapple.svg",
    "Images/strawberry.svg",
    "Images/watermelon.svg",
];

const arrayClases = [
    "apple",
    "avocado",
    "bananas",
    "blueberry",
    "orange",
    "pineapple",
    "strawberry",
    "watermelon",
    "apple",
    "avocado",
    "bananas",
    "blueberry",
    "orange",
    "pineapple",
    "strawberry",
    "watermelon",
];

randomizeImages();

function randomizeImages() {

    for (let i = 0; i < cardItems.length; i++) {

        let randomIndex = Math.floor(Math.random() * cardItems.length);
        let parentBlock = cardImages[randomIndex].closest(".card-item");

        if (parentBlock.className !== "card-item") {

            while (true) {
                
                randomIndex = Math.floor(Math.random() * cardItems.length);
                parentBlock = cardImages[randomIndex].closest(".card-item");

                if (parentBlock.className !== "card-item") continue;

                break;

            }

        }

        cardImages[randomIndex].src = imagesArray[i];
        parentBlock.classList.add(arrayClases[i]);

    }

}

blockCards.addEventListener("click", getClick);

let lastTargetClass = null;
let lastTargetElem = null;

let duration = parseFloat(getComputedStyle(cardItems[0]).transitionDuration) * 1000;

let firstCall = true;

function getClick(event) {
    let target = event.target;

    let newTarget = target.closest(".card-item");

    if (newTarget) {

        if (firstCall === true) timer();

        firstCall = false;

        if (newTarget.classList.contains("done")) return;

        if (lastTargetElem === newTarget) return;

        if (lastTargetClass === null) {

            lastTargetClass = newTarget.className;
            lastTargetElem = newTarget;

            let targetElems = newTarget.children;
    
            targetElems[0].classList.add("item-front-active");
            targetElems[1].classList.add("item-back-active");
            return;

        }

        if (lastTargetClass !== newTarget.className) {

            let targetElems = newTarget.children;
            let lastTargetElems = lastTargetElem.children;

            targetElems[0].classList.add("item-front-active");
            targetElems[1].classList.add("item-back-active");

            setTimeout( () => {

                targetElems[0].classList.remove("item-front-active");
                targetElems[1].classList.remove("item-back-active");
    
                lastTargetElems[0].classList.remove("item-front-active");
                lastTargetElems[1].classList.remove("item-back-active");

            }, duration * 2 );
    
            lastTargetClass = null;
            lastTargetElem = null;

        } else {

            let targetElems = newTarget.children;
    
            targetElems[0].classList.add("item-front-active");
            targetElems[1].classList.add("item-back-active");

            lastTargetElem.classList.add("done");
            newTarget.classList.add("done");

            lastTargetClass = null;
            lastTargetElem = null;

        }

    }

    //be winner
    let checkWin = arrCardItems.every(function (elem, index, arr) {

        if (elem.classList.contains("done")) return true;
    
    });
    
    if (checkWin) {

        modalImage.src = imagesModal[0];
        modalTitle.textContent = "Победа";
        modalText.textContent = "Ура, вы победили, вы молодец!";
        overlay.classList.add("overlay-active");
        messageModal.classList.add("modal-message-active");

        timerImage.classList.remove("timer-image-warm");
        stopTimer = true;
    }

}

btnCloseModal.addEventListener("click", () => {

    messageModal.classList.remove("modal-message-active");
    
    setTimeout(() => {
        btnRestart.style.display = "";
    }, 300);

});

btnRestart.addEventListener("click", restart);

function restart() {
    firstCall = true;
    stopTimer = false;

    for (let elem of cardItems) {

        let child = elem.children;

        for (let elem of child) {
            elem.classList.remove("item-front-active");
            elem.classList.remove("item-back-active");
        }

        elem.className = "card-item";
    }

    randomizeImages();
    timerLine.style.width = "100%";
    restTime = timeAtGame;

    setTimeout( () => {
        overlay.classList.remove("overlay-active");
        btnRestart.style.display = "none";
    }, 300 );

}

openStat.addEventListener("click", openStatistic);
closeStat.addEventListener("click", closeStatistic);

function openStatistic() {
    overlay.classList.add("overlay-active");
    stat.classList.add("stat-active");
}

function closeStatistic() {
    overlay.classList.remove("overlay-active");
    stat.classList.remove("stat-active");
}






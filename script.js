/* =====================================================
   SHAWN
   CINEMATIC HORIZONTAL NAVIGATION
   + BACKGROUND MUSIC
   + SMOOTH AUDIO FADE
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const slider =
    document.querySelector(".slider");


const pages =
    document.querySelectorAll(".page");


const navButtons =
    document.querySelectorAll(
        ".nav-links button"
    );


const currentNumber =
    document.querySelector("#current");


const progress =
    document.querySelector("#line-progress");


const backgroundMusic =
    document.querySelector(
        "#background-music"
    );


const musicControl =
    document.querySelector(
        "#music-control"
    );


const musicLabel =
    document.querySelector(
        "#music-label"
    );



/* =====================================================
   SETTINGS
===================================================== */

let currentPage = 0;

let moving = false;


/*
    Maximum music volume.

    0.35 = 35% volume.

    Change this if you want the music louder.
*/

const MUSIC_VOLUME = 0.35;


/*
    How quickly music fades.

    1000 = 1 second.
    2000 = 2 seconds.
*/

const FADE_DURATION = 1800;



/* =====================================================
   MUSIC STATE
===================================================== */

let musicPlaying = false;

let fadeTimer = null;



/* =====================================================
   MUSIC FADE IN
===================================================== */

function fadeMusicIn() {

    if (!backgroundMusic) {
        return;
    }


    /*
        Clear any previous fade.
    */

    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;
    }


    /*
        Start at zero volume.
    */

    backgroundMusic.volume = 0;


    /*
        Start playing.
    */

    const playPromise =
        backgroundMusic.play();


    /*
        Some browsers return a Promise.
    */

    if (
        playPromise !== undefined
    ) {

        playPromise
            .then(() => {

                musicPlaying = true;

                updateMusicButton();


                const steps = 30;

                const stepTime =
                    FADE_DURATION /
                    steps;

                let step = 0;


                fadeTimer =
                    setInterval(
                        () => {

                            step++;


                            const volume =
                                (
                                    step /
                                    steps
                                ) *
                                MUSIC_VOLUME;


                            backgroundMusic.volume =
                                Math.min(
                                    volume,
                                    MUSIC_VOLUME
                                );


                            if (
                                step >= steps
                            ) {

                                clearInterval(
                                    fadeTimer
                                );

                                fadeTimer =
                                    null;

                                backgroundMusic.volume =
                                    MUSIC_VOLUME;
                            }

                        },
                        stepTime
                    );

            })
            .catch(() => {

                /*
                    Browser blocked autoplay.

                    Music will start after
                    the visitor interacts.
                */

                musicPlaying = false;

                updateMusicButton();

            });

    }

}



/* =====================================================
   MUSIC FADE OUT
===================================================== */

function fadeMusicOut() {

    if (!backgroundMusic) {
        return;
    }


    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;
    }


    const startVolume =
        backgroundMusic.volume;


    const steps = 30;

    const stepTime =
        FADE_DURATION /
        steps;

    let step = 0;


    fadeTimer =
        setInterval(
            () => {

                step++;


                const volume =
                    startVolume *
                    (
                        1 -
                        step / steps
                    );


                backgroundMusic.volume =
                    Math.max(
                        volume,
                        0
                    );


                if (
                    step >= steps
                ) {

                    clearInterval(
                        fadeTimer
                    );

                    fadeTimer =
                        null;


                    backgroundMusic.pause();

                    backgroundMusic.currentTime =
                        backgroundMusic.currentTime;


                    musicPlaying = false;

                    backgroundMusic.volume = 0;

                    updateMusicButton();

                }

            },
            stepTime
        );

}



/* =====================================================
   START MUSIC
===================================================== */

function startMusic() {

    if (!backgroundMusic) {
        return;
    }


    /*
        Don't restart if already playing.
    */

    if (musicPlaying) {
        return;
    }


    fadeMusicIn();

}



/* =====================================================
   STOP MUSIC
===================================================== */

function stopMusic() {

    if (!backgroundMusic) {
        return;
    }


    if (!musicPlaying) {
        return;
    }


    fadeMusicOut();

}



/* =====================================================
   TOGGLE MUSIC
===================================================== */

function toggleMusic() {

    if (musicPlaying) {

        fadeMusicOut();

    } else {

        fadeMusicIn();

    }

}



/* =====================================================
   MUSIC BUTTON
===================================================== */

function updateMusicButton() {

    if (!musicControl) {
        return;
    }


    if (musicPlaying) {

        musicControl.classList.add(
            "playing"
        );

        musicLabel.textContent =
            "SOUND ON";

        musicControl.setAttribute(
            "aria-label",
            "Turn music off"
        );

    } else {

        musicControl.classList.remove(
            "playing"
        );

        musicLabel.textContent =
            "SOUND OFF";

        musicControl.setAttribute(
            "aria-label",
            "Turn music on"
        );

    }

}


musicControl.addEventListener(
    "click",
    function() {

        toggleMusic();

    }
);



/* =====================================================
   FIRST USER INTERACTION
===================================================== */

/*
    Browsers normally prevent automatic
    audio playback.

    The first click / scroll / key press
    starts the music.
*/


let firstInteraction = false;


function handleFirstInteraction() {

    if (firstInteraction) {
        return;
    }


    firstInteraction = true;

    startMusic();

}


document.addEventListener(
    "click",
    handleFirstInteraction,
    {
        passive: true
    }
);


document.addEventListener(
    "keydown",
    handleFirstInteraction,
    {
        passive: true
    }
);


document.addEventListener(
    "wheel",
    handleFirstInteraction,
    {
        passive: true
    }
);


document.addEventListener(
    "touchstart",
    handleFirstInteraction,
    {
        passive: true
    }
);



/* =====================================================
   CHANGE PAGE
===================================================== */

function goToPage(index) {

    /*
        Mobile uses normal vertical scrolling.
    */

    if (
        window.innerWidth <= 800
    ) {

        return;

    }


    /*
        Keep index inside range.
    */

    if (index < 0) {

        index = 0;

    }


    if (
        index >= pages.length
    ) {

        index =
            pages.length - 1;

    }


    /*
        Don't interrupt animation.
    */

    if (
        index === currentPage &&
        moving
    ) {

        return;

    }


    currentPage = index;

    moving = true;



    /* =================================================
       MOVE WEBSITE
    ================================================= */

    slider.style.transform =
        `translateX(-${index * 100}vw)`;



    /* =================================================
       ACTIVATE PAGE
    ================================================= */

    pages.forEach(
        (page, i) => {

            page.classList.toggle(
                "active",
                i === index
            );

        }
    );



    /* =================================================
       NAVIGATION
    ================================================= */

    navButtons.forEach(
        (button, i) => {

            button.classList.toggle(
                "active",
                i === index
            );

        }
    );



    /* =================================================
       PAGE NUMBER
    ================================================= */

    currentNumber.textContent =
        String(index + 1)
        .padStart(2, "0");



    /* =================================================
       PROGRESS BAR
    ================================================= */

    const percentage =
        (
            (index + 1) /
            pages.length
        ) * 100;


    progress.style.width =
        `${percentage}%`;



    /* =================================================
       UNLOCK
    ================================================= */

    setTimeout(
        () => {

            moving = false;

        },
        1300
    );

}



/* =====================================================
   MOUSE / TRACKPAD
===================================================== */

window.addEventListener(
    "wheel",
    function(event) {

        if (
            window.innerWidth <= 800
        ) {

            return;

        }


        if (moving) {

            return;

        }


        if (
            Math.abs(
                event.deltaY
            ) < 5
        ) {

            return;

        }


        if (
            event.deltaY > 0
        ) {

            goToPage(
                currentPage + 1
            );

        } else {

            goToPage(
                currentPage - 1
            );

        }

    },
    {
        passive: true
    }
);



/* =====================================================
   KEYBOARD
===================================================== */

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "ArrowRight"
        ) {

            startMusic();

            goToPage(
                currentPage + 1
            );

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            startMusic();

            goToPage(
                currentPage - 1
            );

        }

    }
);



/* =====================================================
   NAVIGATION BUTTONS
===================================================== */

navButtons.forEach(
    (button, index) => {

        button.addEventListener(
            "click",
            function() {

                startMusic();

                goToPage(index);

            }
        );

    }
);



/* =====================================================
   LOGO → HOME
===================================================== */

document
    .querySelector(".logo")
    .addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            startMusic();

            goToPage(0);

        }
    );



/* =====================================================
   START WEBSITE
===================================================== */

goToPage(0);


/*
    Set initial music state.
*/

backgroundMusic.volume = 0;

updateMusicButton();
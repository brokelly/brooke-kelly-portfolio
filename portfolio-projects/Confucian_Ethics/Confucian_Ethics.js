"use strict";

let confettiInterval = null;

/*
    Show or hide the detail paragraph for a virtue card.
*/
function toggleDetails(id) {
    const details = document.getElementById(id);

    if (!details) {
        return;
    }

    const isVisible = details.style.display === "block";

    details.style.display = isVisible ? "none" : "block";
}

/*
    Check all three quiz questions and display feedback.
*/
function checkQuiz() {
    const questions = [
        {
            name: "q1",
            correct: "ren",
            feedbackId: "feedback-q1",
            correctText:
                "Correct! Ren, or humaneness, is the central virtue.",
            incorrectText:
                "Incorrect. The correct answer is Ren."
        },
        {
            name: "q2",
            correct: "grocery",
            feedbackId: "feedback-q2",
            correctText:
                "Correct! Helping someone without being asked shows Ren in action.",
            incorrectText:
                "Not quite. Helping someone carry heavy groceries is the best example of Ren."
        },
        {
            name: "q3",
            correct: "shu",
            feedbackId: "feedback-q3",
            correctText:
                "Correct! Shu focuses on empathy and reciprocity.",
            incorrectText:
                "Not quite. Shu is the virtue most closely connected to empathy."
        }
    ];

    let allAnswered = true;
    let correctCount = 0;

    questions.forEach(function (question) {
        const selectedOption = document.querySelector(
            `input[name="${question.name}"]:checked`
        );

        const feedback = document.getElementById(
            question.feedbackId
        );

        if (!feedback) {
            return;
        }

        if (!selectedOption) {
            feedback.textContent = "Please select an answer.";
            feedback.className = "quiz-feedback";
            allAnswered = false;
            return;
        }

        if (selectedOption.value === question.correct) {
            feedback.textContent = question.correctText;
            feedback.className = "quiz-feedback correct";
            correctCount++;
        } else {
            feedback.textContent = question.incorrectText;
            feedback.className = "quiz-feedback incorrect";
        }
    });

    if (!allAnswered) {
        hideCelebration();
        hideTryAgain();
        return;
    }

    if (correctCount === questions.length) {
        hideTryAgain();
        showCelebration();
    } else {
        hideCelebration();
        showTryAgain();
    }
}

/*
    Open the celebration overlay and start the confetti.
*/
function showCelebration() {
    const overlay = document.getElementById(
        "quiz-celebration"
    );

    if (!overlay) {
        return;
    }

    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");

    stopConfetti();

    createConfetti(60);

    confettiInterval = window.setInterval(function () {
        createConfetti(35);
    }, 600);
}

/*
    Close the celebration overlay and clear the confetti.
*/
function hideCelebration() {
    const overlay = document.getElementById(
        "quiz-celebration"
    );

    if (!overlay) {
        return;
    }

    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");

    const confettiPieces =
        overlay.querySelectorAll(".confetti");

    confettiPieces.forEach(function (piece) {
        piece.remove();
    });

    stopConfetti();
}

/*
    Stop the repeating confetti bursts.
*/
function stopConfetti() {
    if (confettiInterval !== null) {
        window.clearInterval(confettiInterval);
        confettiInterval = null;
    }
}

/*
    Open the try-again overlay.
*/
function showTryAgain() {
    const overlay = document.getElementById(
        "quiz-try-again"
    );

    if (!overlay) {
        return;
    }

    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
}

/*
    Close the try-again overlay.
*/
function hideTryAgain() {
    const overlay = document.getElementById(
        "quiz-try-again"
    );

    if (!overlay) {
        return;
    }

    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
}

/*
    Generate animated confetti pieces.
*/
function createConfetti(count) {
    const overlay = document.getElementById(
        "quiz-celebration"
    );

    if (!overlay) {
        return;
    }

    const colors = [
        "#f4b400",
        "#0f9d58",
        "#db4437",
        "#4285f4",
        "#ff6f61",
        "#c19a3f"
    ];

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");

        piece.classList.add("confetti");

        const startX = Math.random() * 100;
        const horizontalDistance =
            (Math.random() - 0.5) * 70;
        const verticalDistance =
            -(25 + Math.random() * 70);

        piece.style.setProperty(
            "--x",
            `${startX}vw`
        );

        piece.style.setProperty(
            "--dx",
            `${horizontalDistance}vw`
        );

        piece.style.setProperty(
            "--dy",
            `${verticalDistance}vh`
        );

        piece.style.backgroundColor =
            colors[
                Math.floor(Math.random() * colors.length)
            ];

        piece.style.animationDelay =
            `${Math.random() * 0.2}s`;

        overlay.appendChild(piece);

        piece.addEventListener(
            "animationend",
            function () {
                piece.remove();
            },
            { once: true }
        );
    }
}

/*
    Open one scroll section and close all others.
*/
function showScrollSection(id) {
    const sections =
        document.querySelectorAll(".scroll-section");

    sections.forEach(function (section) {
        section.classList.toggle(
            "open",
            section.id === id
        );
    });
}

/*
    Initialize navigation and overlay controls.
*/
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const menuButtons =
            document.querySelectorAll(
                ".top-menu button[data-target]"
            );

        menuButtons.forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    const targetId =
                        button.getAttribute(
                            "data-target"
                        );

                    if (targetId) {
                        showScrollSection(targetId);
                    }
                }
            );
        });

        const closeCelebrationButton =
            document.getElementById(
                "close-celebration"
            );

        if (closeCelebrationButton) {
            closeCelebrationButton.addEventListener(
                "click",
                hideCelebration
            );
        }

        const closeTryAgainButton =
            document.getElementById(
                "close-try-again"
            );

        if (closeTryAgainButton) {
            closeTryAgainButton.addEventListener(
                "click",
                hideTryAgain
            );
        }

        const celebrationOverlay =
            document.getElementById(
                "quiz-celebration"
            );

        if (celebrationOverlay) {
            celebrationOverlay.addEventListener(
                "click",
                function (event) {
                    if (
                        event.target ===
                        celebrationOverlay
                    ) {
                        hideCelebration();
                    }
                }
            );
        }

        const tryAgainOverlay =
            document.getElementById(
                "quiz-try-again"
            );

        if (tryAgainOverlay) {
            tryAgainOverlay.addEventListener(
                "click",
                function (event) {
                    if (
                        event.target ===
                        tryAgainOverlay
                    ) {
                        hideTryAgain();
                    }
                }
            );
        }

        document.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Escape") {
                    hideCelebration();
                    hideTryAgain();
                }
            }
        );

        showScrollSection("intro");
    }
);

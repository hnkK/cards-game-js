
/* Start new game */

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new eightiescards(80, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}


/* Audio */

class AudioController {
  constructor() {
        this.bgMusic = new Audio('sounds/music.mp3');
        this.flipSound = new Audio('sounds/flip.wav');
        this.matchSound = new Audio('sounds/ohyeah.mp3');
        this.victorySound = new Audio('sounds/victory.wav');
        this.gameOverSound = new Audio('sounds/gameover.mp3');
        this.bgMusic.volume = 0.9;
        this.bgMusic.loop = true;

  }
    startMusic() {
        this.bgMusic.play();
        this.bgMusic.volume = 0.9;
        this.matchSound.volume = 1;
}
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;

    }

    flip() {
        this.flipSound.play();
    }

    match() {
        this.matchSound.play();
    }

    victory() {
        this.matchSound.volume = 0;
        this.bgMusic.volume = 0.3;
        this.victorySound.play();
    }

    gameOver() {
        this.matchSound.volume = 0;
        this.bgMusic.volume = 0.3;
        this.gameOverSound.play();
    }
}

class eightiescards {

    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeLeft = totalTime;
        this.timer = document.getElementById('time-left')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();

    }

    startGame() {
        this.totalClicks = 0;
        this.timeLeft = this.totalTime;
        this.cardToCheck = null;
        this.sameCards = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false; }, 500)

        this.hideCards();
        this.timer.innerText = this.timeLeft;
        this.ticker.innerText = this.totalClicks;
    }

    startCountdown() {
        return setInterval(() => {
            this.timeLeft--;
            this.timer.innerText = this.timeLeft;
            if(this.timeLeft === 0)
                this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('same');
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.sameCards.push(card1);
        this.sameCards.push(card2);
        card1.classList.add('same');
        card2.classList.add('same');
        this.audioController.match();
        if(this.sameCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[randIndex]] = [cardsArray[randIndex], cardsArray[i]];
        }
        cardsArray = cardsArray.map((card, index) => {
            card.style.order = index;
        });
    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    canFlipCard(card) {
        return !this.busy && !this.sameCards.includes(card) && card !== this.cardToCheck;
    }
}

/* Check */

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

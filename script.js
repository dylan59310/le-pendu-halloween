
let mots = [];
let motADeviner = "";
let motAffiche = "";
let erreursCommises = 0;
let lettresDisponibles = "abcdefghijklmnopqrstuvwxyz";
let partieTerminee = false;
let etapePendu = 1; 

async function chargerMots() {
    try {
        const response = await fetch("mots.json");
        const data = await response.json();
        mots = data.mots;
    } catch (error) {
        console.error("Erreur de chargement du fichier JSON :", error);
    }
}


function demarrerPartie() {
    chargerMots().then(() => {
        motADeviner = mots[Math.floor(Math.random() * mots.length)];
        if (motADeviner) {
            motAffiche = "-".repeat(motADeviner.length);
            erreursCommises = 0;
            lettresDisponibles = "abcdefghijklmnopqrstuvwxyz";
            partieTerminee = false;
            etapePendu = 1;

            document.getElementById("result").textContent = "";

            
            const imagesPendu = document.querySelectorAll(".etape");
            imagesPendu.forEach((etape) => {
                etape.style.display = "none";
            });

           
            document.querySelector(".etape1").style.display = "block";

            mettreAJourAffichage();
            creerBoutonsLettres();
            creerClavierVirtuel();

       
            document.getElementById("new-game-button").style.display = "none";
        } else {
            console.error("Aucun mot à deviner n'a été chargé.");
        }
    });
}


function mettreAJourAffichage() {
    document.getElementById("word-display").textContent = motAffiche;
    document.getElementById("error").textContent = 5 - erreursCommises;

    if (motAffiche === motADeviner || erreursCommises >= 5) {
        document.getElementById("result").textContent = "Vous avez gagné ! Le mot était '" + motADeviner + "'.";
        partieTerminee = true;
      
        document.getElementById("new-game-button").style.display = "block";
    }

    if (erreursCommises >= 5) {
        document.getElementById("result").textContent = "Vous avez perdu. Le mot était '" + motADeviner + "'.";
        afficherMotSecret();
        partieTerminee = true;
      
        document.getElementById("new-game-button").style.display = "block";
    }
}


function creerBoutonsLettres() {
    const conteneurBouton = document.getElementById("button-container");
    conteneurBouton.innerHTML = "";

    for (let i = 0; i < lettresDisponibles.length; i++) {
        const lettre = lettresDisponibles[i];
        const bouton = document.createElement("button");
        bouton.textContent = lettre;
        bouton.addEventListener("click", () => devinerLettre(lettre, bouton));
        conteneurBouton.appendChild(bouton);
    }
}

function creerClavierVirtuel() {
    document.addEventListener("keydown", (event) => {
        const lettre = event.key.toLowerCase();
        if (lettresDisponibles.includes(lettre) && !partieTerminee) {
            devinerLettre(lettre);
        }
    });
}

function devinerLettre(lettre, bouton) {
    if (motAffiche.includes(lettre) || partieTerminee) {
        return;
    }

    if (motADeviner.includes(lettre)) {
        for (let i = 0; i < motADeviner.length; i++) {
            if (motADeviner[i] === lettre) {
                motAffiche = setCharAt(motAffiche, i, lettre);
            }
        }
    } else {
        erreursCommises++;
        etapePendu++;

        if (etapePendu <= 6) {
            
            const imagesPendu = document.querySelectorAll(".etape");
            imagesPendu.forEach((etape) => {
                etape.style.display = "none";
            });

            
            document.querySelector(".etape" + etapePendu).style.display = "block";
        }
    }

    lettresDisponibles = lettresDisponibles.replace(lettre, '');

    mettreAJourAffichage();
    bouton.classList.add("button-selected");
    bouton.disabled = true;

    if (motAffiche === motADeviner) {
        document.getElementById("result").textContent = "Vous avez gagné ! Le mot était '" + motADeviner + "'.";
        partieTerminee = true;
        
        document.getElementById("new-game-button").style.display = "block";
    }
}


function afficherMotSecret() {
    document.getElementById("word-display").textContent = motADeviner;
}


function setCharAt(str, index, char) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + char + str.substr(index + 1);
}


document.getElementById("new-game-button").addEventListener("click", () => {
    demarrerPartie();
});


demarrerPartie();

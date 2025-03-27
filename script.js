class Puissance4 {
    constructor() {
        this.joueurs = ['rouge', 'jaune'];
        this.joueurActuel = 0;
        this.grille = Array.from({ length: 6 }, () => Array(7).fill(null));
        this.partieEnCours = true;
        this.pseudos = ['', ''];
    }

    jouer(colonne) {
        if (!this.partieEnCours) return;
        const ligne = this.ajouterJeton(colonne);
        if (ligne === -1) return;
        this.afficherJeton(ligne, colonne);

        if (this.verifierVictoire()) this.finDePartie(`${this.getPseudoActuel()} a gagné !`, "#00b30f");
        else if (this.grille.every(l => l.every(c => c))) this.finDePartie("Match nul !", "#FF0000");
        else this.changerJoueur();
    }

    ajouterJeton(colonne) {
        for (let i = 5; i >= 0; i--) {
            if (!this.grille[i][colonne]) return (this.grille[i][colonne] = this.joueurs[this.joueurActuel]), i;
        }
        return -1;
    }

    verifierVictoire() {
        return this.grille.some((l, i) => l.some((_, j) =>
            this.grille[i][j] === this.joueurs[this.joueurActuel] &&
            [[1, 0], [0, 1], [1, 1], [1, -1]].some(([dx, dy]) =>
                [...Array(4)].every((_, k) => this.grille[i + k * dx]?.[j + k * dy] === this.joueurs[this.joueurActuel])
            )
        ));
    }

    changerJoueur() {
        this.joueurActuel = 1 - this.joueurActuel;
        document.querySelector('#message').textContent = `C'est au tour de ${this.getPseudoActuel()}`;
    }

    afficherJeton(l, c) {
        document.querySelector(`#cell-${l}-${c}`).classList.add(this.joueurs[this.joueurActuel]);
    }

    initialiserJeu() {
        this.pseudos = [document.querySelector('#pseudoJoueur1').value, document.querySelector('#pseudoJoueur2').value];
        if (this.pseudos.includes('')) return alert("Veuillez entrer les pseudos des deux joueurs !");
        document.querySelector('#form-container').style.display = 'none';
        document.querySelector('#grille-container').style.display = 'flex';
        this.reinitialiserJeu();
    }

    reinitialiserJeu() {
        this.grille = Array.from({ length: 6 }, () => Array(7).fill(null));
        this.joueurActuel = 0;
        this.partieEnCours = true;
        document.querySelector('#grille').innerHTML = '';
        this.afficherGrille();
        document.querySelector('#message').textContent = `C'est au tour de ${this.getPseudoActuel()}`;
        document.body.style.backgroundColor = "#f7f7f7";
        document.querySelector('#recommencer-btn').style.display = 'none';
    }

    afficherGrille() {
        document.querySelector('#grille').innerHTML = this.grille.map((l, i) => l.map((_, j) =>
            `<div class='cell' id='cell-${i}-${j}' onclick='jeu.jouer(${j})'></div>`
        ).join('')).join('');
    }

    getPseudoActuel() {
        return this.pseudos[this.joueurActuel];
    }

    finDePartie(msg, couleur) {
        document.querySelector('#message').textContent = msg;
        document.body.style.backgroundColor = couleur;
        this.partieEnCours = false;
        document.querySelector('#recommencer-btn').style.display = 'block';
    }
}

const jeu = new Puissance4();
document.querySelector('#start-btn').addEventListener('click', () => jeu.initialiserJeu());
document.querySelector('#recommencer-btn').addEventListener('click', () => jeu.reinitialiserJeu());

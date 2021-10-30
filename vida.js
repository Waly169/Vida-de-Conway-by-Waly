class Celula {
    constructor(estado, i, j, size) {
        this.estado = estado;
        this.i = i;
        this.j = j;
        this.size = size;
        this.x0 = this.i * size;
        this.y0 = this.j * size;
        this.siguienteEstado = 0;
    }

    // Visualiza la celula actual
    visualizar() {
        this.estado = this.siguienteEstado;

        if (this.estado == 0) {
            fill('white');
        } else {
            fill('black');
        }
        rect(this.x0, this.y0, this.size, this.size);
    }

    // Calcula si la celula estara viva o muerta en la siguiente iteracion
    calcular(nVecinosVivos) {
        if (this.estado == 0 && nVecinosVivos == 3) {
            this.siguienteEstado = 1;
        } else if (this.estado == 1 && (nVecinosVivos > 3 || nVecinosVivos < 2)) {
            this.siguienteEstado = 0;
        } else {
            this.siguienteEstado = this.estado;
        }
    }

    // Invierte el estado (vivo -> muerto, muerto -> vivo)
    invertirEstado() {
        this.siguienteEstado = this.estado == 0 ? 1 : 0;
    }
}

class Cultivo {
    constructor(m, n, cellSize) {
        this.m = m;
        this.n = n;
        this. cellSize = cellSize;
        
        this.cultivo = new Array(m).fill(0).map(x => Array(n).fill(0));

        for (let i=0; i<this.m; i++) {
            for (let j=0; j<this.n; j++) {
                this.cultivo[i][j] = new Celula(0, i, j, cellSize);
            }
        }
    }

    visualizar() {
        for (let i=0; i<this.m; i++) {
            for (let j=0; j<this.n; j++) {
                this.cultivo[i][j].visualizar();
            }
        }
    }

    invertirEstadoCelula(x, y) {
        // i y j son enteros (usamos el gusanillo para convertir)
        let i = ~~(x/this.cellSize);
        let j = ~~(y/this.cellSize);

        // si nos salimos de la cuadricula, no hacemos nada
        if (i > m-1 || j > n-1) return;

        // invertimos el estado de la celula i,j
        this.cultivo[i][j].invertirEstado();
        this.cultivo[i][j].visualizar();
    }

    nVecinosVivos(i, j) {
        let nVecinosVivos = 0;
        let i_vecinoInicial = i > 0 ? i-1 : 0;
        let i_vecinoFinal = i < this.m-1 ? i+1 : this.m-1;
        let j_vecinoInicial = j > 0 ? j-1 : 0;
        let j_vecinoFinal = j < this.n-1 ? j+1 : this.n-1;

        for (let i_vecino=i_vecinoInicial; i_vecino<=i_vecinoFinal; i_vecino++) {
            for (let j_vecino=j_vecinoInicial; j_vecino<=j_vecinoFinal; j_vecino++) {
                // No contamos a la celula actual
                if (i == i_vecino && j == j_vecino) {
                    continue;
                }
                nVecinosVivos += this.cultivo[i_vecino][j_vecino].estado;
            }    
        }

        return nVecinosVivos;
    }

    calcular() {
        // Calcular para cada celula
        for (let i=0; i<this.m; i++) {
            for (let j=0; j<this.n; j++) {
                let nVecinosVivos = this.nVecinosVivos(i,j);
                this.cultivo[i][j].calcular(nVecinosVivos);
            }
        }
    }
}

// Configuracion
let m = 20;
let n = 20;
let cellSize = 20;
let fr = 30; //FPS
let frameRateDeseado = 1; //FPS
let playing = false;

// Cultivo de celulas (matriz)
cultivo = new Cultivo(m, n, cellSize);

let playPauseButton;
function setup () {
    frameRate(fr);
    stroke('grey');
    createCanvas(m*cellSize, n*cellSize);
    playPauseButton = createButton('Play');
    playPauseButton.mousePressed(playPause);
}

let calcular = 0;
function draw () {
    // Ajustar el framerate sin perder responsiveness
    if (calcular++ == ~~(fr/frameRateDeseado)) {
        calcular = 0;
        
        if (playing) {
            cultivo.calcular();
            cultivo.visualizar();
        }
    }
}

function mouseClicked() {
    cultivo.invertirEstadoCelula(mouseX, mouseY);

    // Prevent default
    return false;
}

function playPause() {
    // Invertimos el valor logico de playing
    if (playing) {
        playPauseButton.html('Play');
        playing = false;
    } else {
        playPauseButton.html('Pause');
        playing = true;
    }
}
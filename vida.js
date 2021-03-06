class Celula {
    #size;

    constructor(estado, i, j, size) {
        this.estado = estado;
        this.i = i;
        this.j = j;
        this.#size = size;
        this.x0 = this.i * this.#size;
        this.y0 = this.j * this.#size;
        this.siguienteEstado = 0;
    }

    set size(newSize) {
        this.#size = newSize;
        this.x0 = this.i * this.#size;
        this.y0 = this.j * this.#size;
    }

    // Visualiza la celula actual
    visualizar(forzar = false) {
        if (forzar || this.estado != this.siguienteEstado){
            this.estado = this.siguienteEstado;
    
            if (this.estado == 0) {
                fill('white');
            } else {
                fill('black');
            }
            rect(this.x0, this.y0, this.#size, this.#size);
        }
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
    #cellSize;

    constructor(m, n, cellSize) {
        this.m = m;
        this.n = n;
        this.#cellSize = cellSize;
        
        this.cultivo = new Array(m).fill(0).map(x => Array(n).fill(0));

        for (let i=0; i<this.m; i++) {
            for (let j=0; j<this.n; j++) {
                this.cultivo[i][j] = new Celula(0, i, j, cellSize);
            }
        }
        this.visualizar(true);
    }

    visualizar(forzar = false) {
        for (let i=0; i<this.m; i++) {
            for (let j=0; j<this.n; j++) {
                this.cultivo[i][j].visualizar(forzar);
            }
        }
    }

    invertirEstadoCelula(x, y) {
        // i y j son enteros (usamos el gusanillo para convertir)
        let i = ~~(x/this.#cellSize);
        let j = ~~(y/this.#cellSize);

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
                nVecinosVivos += this.cultivo[i_vecino][j_vecino].estado;
            }    
        }

        // No contamos a la celula actual
        nVecinosVivos -= this.cultivo[i][j].estado;

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

    set cellSize(newSize) {
        this.#cellSize = newSize;
        for (let i=0; i<this.m; i++) {
            for (let j=0; j<this.n; j++) {
                this.cultivo[i][j].size = newSize;
            }
        }
        this.visualizar(true);
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
let cultivo;

// UI
let playPause_button;
let frameRate_slider;
let m_input;
let n_input;
let redimensionar_button;
let cellSize_slider;

function setup () {
    frameRate(fr);
    stroke('grey');
    createCanvas(m*cellSize, n*cellSize);
    cultivo = new Cultivo(m, n, cellSize);

    // UI
    playPause_button = createButton('Play');
    playPause_button.mousePressed(playPause);
    frameRate_slider = createSlider(1, 30, 10);
    m_input = createInput(m.toString());
    n_input = createInput(n.toString());
    redimensionar_button = createButton('Redimensionar');
    redimensionar_button.mousePressed(redimensionar);
    cellSize_slider = createSlider(3, 30, cellSize);
    cellSize_slider.mouseClicked(actualizarCellSize);
}

let calcular = 0;
function draw () {
    // Ajustar el framerate sin perder responsiveness
    frameRateDeseado = frameRate_slider.value();
    if (calcular++ >= ~~(fr/frameRateDeseado)) {
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
        playPause_button.html('Play');
        playing = false;
    } else {
        playPause_button.html('Pause');
        playing = true;
    }
}

function redimensionar() {
    playPause_button.html('Play');
    playing = false;
    if (confirm("Atencion, su cultivo se destruira!")) {
        delete cultivo;
        m = ~~m_input.value();
        n = ~~n_input.value();
        resizeCanvas(m*cellSize, n*cellSize);
        cultivo = new Cultivo(m, n, cellSize);
    }
}

// Ajusta el tamanio de las celulas
function actualizarCellSize() {
    cellSize = ~~cellSize_slider.value();
    strokeWeight(cellSize/10);
    stroke('grey');
    resizeCanvas(m*cellSize, n*cellSize);
    cultivo.cellSize = cellSize;
}
class Celula {
    constructor(estado, i, j, size) {
        this.estado = estado;
        this.i = i;
        this.j = j;
        this.size = size;
        this.x0 = this.i * size;
        this.x1 = (this.i + 1) * size;
        this.y0 = this.j * size;
        this.y1 = (this.j + 1) * size;
    }

    // Visualiza la celula actual
    visualizar() {
        if (this.estado == 0) {
            fill('white');
        } else {
            fill('black');
        }
        rect(this.x0, this.y0, this.size, this.size);
    }

    // Calcula si la celula estara viva o muerta en la siguiente iteracion
    calcular() {

    }

    // Invierte el estado (vivo -> muerto, muerto -> vivo)
    invertirEstado() {
        this.estado = this.estado == 0 ? 1 : 0;
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
        // invertimos el estado de la celula i,j
        this.cultivo[i][j].invertirEstado();
        this.cultivo[i][j].visualizar();
    }
}

// Configuracion
let m = 20;
let n = 20;
let cellSize = 20;
let fr = 2; //FPS

// Cultivo de celulas (matriz)
cultivo = new Cultivo(m, n, cellSize);

function setup () {
    frameRate(fr);
    stroke('grey');
    createCanvas(m*cellSize, n*cellSize);
}

function draw (){
    cultivo.visualizar();
}

function mouseClicked() {
    cultivo.invertirEstadoCelula(mouseX, mouseY);

    // Prevent default
    return false;
}
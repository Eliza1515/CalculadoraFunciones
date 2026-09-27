const grado = document.getElementById("grado");

const botonGenerar =
    document.getElementById("generar");

const botonCalcular =
    document.getElementById("calcular");

const contenedor =
    document.getElementById("coeficientes");


// Generar los campos de coeficientes

botonGenerar.addEventListener(
    "click",
    generarCoeficientes
);


function generarCoeficientes() {

    const g = parseInt(grado.value);

    contenedor.innerHTML = "";

    botonCalcular.style.display = "none";


    let titulo = document.createElement("h3");

    titulo.textContent =
        "Ingrese los coeficientes:";

    contenedor.appendChild(titulo);


    for (let i = g; i >= 0; i--) {

        const grupo =
            document.createElement("div");

        grupo.className = "coef-input";


        const etiqueta =
            document.createElement("label");


        if (i === 0) {

            etiqueta.textContent =
                "Término independiente:";

        }

        else {

            etiqueta.textContent =
                `Coeficiente de x^${i}:`;

        }


        const entrada =
            document.createElement("input");

        entrada.type = "number";

        entrada.className =
            "coeficiente";

        entrada.dataset.potencia = i;


        // El coeficiente principal empieza en 1

        if (i === g) {

            entrada.value = 1;

        }

        else {

            entrada.value = 0;

        }


        grupo.appendChild(etiqueta);

        grupo.appendChild(entrada);

        contenedor.appendChild(grupo);

    }


    botonCalcular.style.display =
        "block";

}



// Calcular el polinomio

botonCalcular.addEventListener(
    "click",
    calcularPolinomio
);


function calcularPolinomio() {

    const entradas =
        document.querySelectorAll(
            ".coeficiente"
        );


    const coeficientes = {};


    entradas.forEach(entrada => {

        const potencia =
            parseInt(
                entrada.dataset.potencia
            );


        const valor =
            parseFloat(entrada.value);


        coeficientes[potencia] =
            Number.isFinite(valor)
                ? valor
                : 0;

    });


    const g =
        parseInt(grado.value);


    // El coeficiente principal no puede ser cero

    if (coeficientes[g] === 0) {

        document.getElementById(
            "resultado"
        ).innerHTML = `

            <p>
                <strong>Error:</strong>
                El coeficiente principal no
                puede ser cero.
            </p>

        `;

        return;

    }


    const funcion =
        construirFuncion(
            coeficientes,
            g
        );


    const interceptoY =
        coeficientes[0] || 0;


    const raices =
        encontrarRaices(
            coeficientes
        );


    let texto = `

        <p>
            <strong>Función:</strong>
            ${funcion}
        </p>

        <p>
            <strong>Grado:</strong>
            ${g}
        </p>

        <p>
            <strong>Intercepto en Y:</strong>
            (0, ${formatear(interceptoY)})
        </p>

    `;


    if (raices.length > 0) {

        texto += `

            <p>
                <strong>Raíces reales:</strong>
            </p>

            <ul>

        `;


        raices.forEach(raiz => {

            texto += `

                <li>
                    x ≈ ${formatear(raiz)}
                </li>

            `;

        });


        texto += "</ul>";

    }

    else {

        texto += `

            <p>
                <strong>Raíces reales:</strong>
                No se encontraron.
            </p>

        `;

    }


    document.getElementById(
        "resultado"
    ).innerHTML = texto;


    crearTabla(
        coeficientes
    );


    crearGrafica(
        coeficientes,
        funcion
    );

}



// Construir el texto de la función

function construirFuncion(
    coeficientes,
    grado
) {

    let texto = "f(x) = ";

    let primero = true;


    for (
        let i = grado;
        i >= 0;
        i--
    ) {

        const coef =
            coeficientes[i];


        if (coef === 0) {

            continue;

        }


        if (!primero) {

            if (coef > 0) {

                texto += " + ";

            }

            else {

                texto += " - ";

            }

        }

        else if (coef < 0) {

            texto += "-";

        }


        const valor =
            Math.abs(coef);


        if (i === 0) {

            texto += valor;

        }

        else if (i === 1) {

            if (valor !== 1) {

                texto += valor;

            }

            texto += "x";

        }

        else {

            if (valor !== 1) {

                texto += valor;

            }

            texto += `x^${i}`;

        }


        primero = false;

    }


    if (primero) {

        return "f(x) = 0";

    }


    return texto;

}



// Evaluar el polinomio

function evaluar(
    coeficientes,
    x
) {

    let resultado = 0;


    for (const potencia in coeficientes) {

        resultado +=
            coeficientes[potencia] *
            Math.pow(
                x,
                potencia
            );

    }


    return resultado;

}



// Encontrar raíces

function encontrarRaices(
    coeficientes
) {

    const raices = [];

    const paso = 0.1;


    let xAnterior = -20;

    let yAnterior =
        evaluar(
            coeficientes,
            xAnterior
        );


    for (
        let x = -19.9;
        x <= 20;
        x += paso
    ) {

        const yActual =
            evaluar(
                coeficientes,
                x
            );


        // Cambio de signo

        if (
            yAnterior * yActual < 0
        ) {

            let izquierda =
                xAnterior;

            let derecha =
                x;


            // Método de bisección

            for (
                let i = 0;
                i < 50;
                i++
            ) {

                const medio =
                    (izquierda + derecha) / 2;


                const yMedio =
                    evaluar(
                        coeficientes,
                        medio
                    );


                const yIzquierda =
                    evaluar(
                        coeficientes,
                        izquierda
                    );


                if (
                    Math.abs(yMedio)
                    < 0.000001
                ) {

                    izquierda = medio;

                    derecha = medio;

                    break;

                }


                if (
                    yIzquierda * yMedio < 0
                ) {

                    derecha = medio;

                }

                else {

                    izquierda = medio;

                }

            }


            const raiz =
                (izquierda + derecha) / 2;


            agregarRaiz(
                raices,
                raiz
            );

        }


        // Raíz que toca el eje X

        if (
            Math.abs(yActual)
            < 0.001
        ) {

            agregarRaiz(
                raices,
                x
            );

        }


        xAnterior = x;

        yAnterior = yActual;

    }


    return raices;

}



// Evitar raíces repetidas

function agregarRaiz(
    raices,
    raiz
) {

    const repetida =
        raices.some(
            r =>
                Math.abs(r - raiz)
                < 0.05
        );


    if (!repetida) {

        raices.push(raiz);

    }

}



// Crear tabla

function crearTabla(
    coeficientes
) {

    let html = `

        <table>

            <thead>

                <tr>

                    <th>x</th>

                    <th>f(x)</th>

                </tr>

            </thead>

            <tbody>

    `;


    for (
        let x = -5;
        x <= 5;
        x++
    ) {

        const y =
            evaluar(
                coeficientes,
                x
            );


        html += `

            <tr>

                <td>${x}</td>

                <td>${formatear(y)}</td>

            </tr>

        `;

    }


    html += `

            </tbody>

        </table>

    `;


    document.getElementById(
        "tablaValores"
    ).innerHTML = html;

}



// Crear gráfica

function crearGrafica(
    coeficientes,
    funcion
) {

    const x = [];

    const y = [];


    for (
        let valor = -10;
        valor <= 10;
        valor += 0.1
    ) {

        x.push(valor);


        y.push(
            evaluar(
                coeficientes,
                valor
            )
        );

    }


    const datos = [

        {

            x: x,

            y: y,

            mode: "lines",

            name: funcion

        }

    ];


    const layout = {

        title:
            "Gráfica de la función polinomial",

        xaxis: {

            title: "x",

            zeroline: true

        },

        yaxis: {

            title: "f(x)",

            zeroline: true

        },

        hovermode: "closest"

    };


    Plotly.newPlot(

        "graficaFuncion",

        datos,

        layout,

        {
            responsive: true
        }

    );

}



// Formatear números

function formatear(numero) {

    return Number(
        numero.toFixed(4)
    );

}
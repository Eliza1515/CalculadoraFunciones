const botonCalcular = document.getElementById("calcular");

botonCalcular.addEventListener("click", calcularLineal);


// ==========================================
// CALCULAR FUNCIÓN LINEAL
// ==========================================

function calcularLineal() {

    let funcion =
        document.getElementById("funcion").value.trim();

    const resultado =
        document.getElementById("resultado");

    const tablaValores =
        document.getElementById("tablaValores");


    // Verificar que exista una función

    if (funcion === "") {

        resultado.innerHTML = `
            <p>⚠️ Por favor, ingresa una función.</p>
        `;

        tablaValores.innerHTML = "";

        return;
    }


    // Quitar "y =" si el usuario lo escribe

    funcion = funcion
        .replace(/^y\s*=\s*/i, "")
        .replace(/\s+/g, "");


    try {

        // Crear expresión matemática

        const expresion =
            math.compile(funcion);


        // f(0)

        const b =
            Number(
                expresion.evaluate({ x: 0 })
            );


        // f(1)

        const valorEn1 =
            Number(
                expresion.evaluate({ x: 1 })
            );


        // Calcular pendiente

        const m =
            valorEn1 - b;


        // Verificar que sea lineal

        const valorEn2 =
            Number(
                expresion.evaluate({ x: 2 })
            );


        const valorEsperado =
            m * 2 + b;


        if (
            Math.abs(
                valorEn2 - valorEsperado
            ) > 0.000001
        ) {

            resultado.innerHTML = `

                <p>
                    ❌ La función ingresada
                    no es lineal.
                </p>

                <p>
                    Ejemplo:
                    <strong>2*x + 3</strong>
                </p>

            `;

            tablaValores.innerHTML = "";

            return;
        }


        // Intercepto X

        let interceptoX;

        if (m !== 0) {

            interceptoX =
                -b / m;

        } else {

            interceptoX =
                "No existe";
        }


        // Construir ecuación

        let ecuacion;


        if (m === 0) {

            ecuacion = `y = ${b}`;

        } else if (b > 0) {

            ecuacion =
                `y = ${m}x + ${b}`;

        } else if (b < 0) {

            ecuacion =
                `y = ${m}x - ${Math.abs(b)}`;

        } else {

            ecuacion =
                `y = ${m}x`;
        }


        // Mostrar resultados

        resultado.innerHTML = `

            <h3>Función Lineal</h3>

            <p>
                <strong>Ecuación:</strong>
                ${ecuacion}
            </p>

            <p>
                <strong>Pendiente (m):</strong>
                ${m}
            </p>

            <p>
                <strong>Intercepto en Y:</strong>
                (0, ${b})
            </p>

            <p>
                <strong>Intercepto en X:</strong>
                ${
                    typeof interceptoX === "number"
                    ? interceptoX.toFixed(2)
                    : interceptoX
                }
            </p>

        `;


        // Crear tabla

        crearTabla(
            expresion
        );


        // Crear gráfica

        crearGrafica(
            expresion,
            ecuacion
        );

    }

    catch (error) {

        console.error(error);

        resultado.innerHTML = `

            <p>
                ❌ No se pudo interpretar
                la función.
            </p>

            <p>
                Ejemplo:
                <strong>2*x + 3</strong>
            </p>

        `;

        tablaValores.innerHTML = "";
    }
}


// ==========================================
// CREAR TABLA
// ==========================================

function crearTabla(expresion) {

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
            expresion.evaluate({
                x: x
            });


        html += `

            <tr>

                <td>${x}</td>

                <td>
                    ${Number(y).toFixed(2)}
                </td>

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


// ==========================================
// CREAR GRÁFICA
// ==========================================

function crearGrafica(
    expresion,
    ecuacion
) {

    const valoresX = [];
    const valoresY = [];


    for (
        let x = -10;
        x <= 10;
        x += 0.1
    ) {

        valoresX.push(x);

        valoresY.push(
            expresion.evaluate({
                x: x
            })
        );
    }


    const datos = [

        {

            x: valoresX,

            y: valoresY,

            mode: "lines",

            type: "scatter",

            name: ecuacion
        }

    ];


    const configuracion = {

        title:
            "Gráfica de la función lineal",

        xaxis: {

            title: "Eje X",

            zeroline: true

        },

        yaxis: {

            title: "Eje Y",

            zeroline: true

        },

        showlegend: true

    };


    Plotly.newPlot(

        "graficaFuncion",

        datos,

        configuracion,

        {
            responsive: true
        }

    );
}   
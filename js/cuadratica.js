const botonCalcular =
    document.getElementById("calcular");


botonCalcular.addEventListener(
    "click",
    calcularCuadratica
);


// ==========================================
// FUNCIÓN CUADRÁTICA
// ==========================================

function calcularCuadratica() {

    let funcion =
        document.getElementById("funcion")
        .value
        .trim();


    const resultado =
        document.getElementById("resultado");


    const tablaValores =
        document.getElementById("tablaValores");


    // Verificar entrada

    if (funcion === "") {

        resultado.innerHTML = `

            <p>
                ⚠️ Por favor,
                ingresa una función.
            </p>

        `;

        tablaValores.innerHTML = "";

        return;
    }


    // Quitar "y ="

    funcion = funcion

        .replace(
            /^y\s*=\s*/i,
            ""
        )

        .replace(
            /\s+/g,
            ""
        );


    try {

        const expresion =
            math.compile(funcion);


        // ==================================
        // OBTENER a, b y c
        // ==================================

        const f0 =
            Number(
                expresion.evaluate({
                    x: 0
                })
            );


        const f1 =
            Number(
                expresion.evaluate({
                    x: 1
                })
            );


        const f2 =
            Number(
                expresion.evaluate({
                    x: 2
                })
            );


        const f3 =
            Number(
                expresion.evaluate({
                    x: 3
                })
            );


        const a =
            (f2 - 2 * f1 + f0) / 2;


        const b =
            f1 - a - f0;


        const c = f0;


        // ==================================
        // VERIFICAR QUE SEA CUADRÁTICA
        // ==================================

        if (
            Math.abs(a)
            < 0.000001
        ) {

            resultado.innerHTML = `

                <p>
                    ❌ La función no es
                    cuadrática.
                </p>

                <p>
                    Ejemplo:
                    <strong>
                        x^2 - 4*x + 3
                    </strong>
                </p>

            `;

            tablaValores.innerHTML = "";

            return;
        }


        // ==================================
        // VERIFICAR GRADO
        // ==================================

        const valorEsperado =
            a * 9 +
            b * 3 +
            c;


        if (
            Math.abs(
                f3 - valorEsperado
            ) > 0.000001
        ) {

            resultado.innerHTML = `

                <p>
                    ❌ La función parece
                    tener un grado mayor
                    que 2.
                </p>

                <p>
                    Ejemplo:
                    <strong>
                        x^2 - 4*x + 3
                    </strong>
                </p>

            `;

            tablaValores.innerHTML = "";

            return;
        }


        // ==================================
        // DISCRIMINANTE
        // ==================================

        const discriminante =
            b * b - 4 * a * c;


        // ==================================
        // RAÍCES
        // ==================================

        let raices = "";

        let raiz1 = null;
        let raiz2 = null;


        if (discriminante > 0) {

            raiz1 =
                (
                    -b +
                    Math.sqrt(
                        discriminante
                    )
                ) /
                (2 * a);


            raiz2 =
                (
                    -b -
                    Math.sqrt(
                        discriminante
                    )
                ) /
                (2 * a);


            raices = `

                x₁ =
                ${raiz1.toFixed(2)}

                <br>

                x₂ =
                ${raiz2.toFixed(2)}

            `;

        }

        else if (
            discriminante === 0
        ) {

            raiz1 =
                -b / (2 * a);


            raiz2 = raiz1;


            raices = `

                x =
                ${raiz1.toFixed(2)}

            `;

        }

        else {

            raices = `

                No existen
                raíces reales.

            `;
        }


        // ==================================
        // VÉRTICE
        // ==================================

        const xv =
            -b / (2 * a);


        const yv =
            expresion.evaluate({
                x: xv
            });


        // ==================================
        // CONCAVIDAD
        // ==================================

        let concavidad;


        if (a > 0) {

            concavidad =
                "La parábola abre hacia arriba.";

        } else {

            concavidad =
                "La parábola abre hacia abajo.";
        }


        // ==================================
        // MOSTRAR RESULTADOS
        // ==================================

        resultado.innerHTML = `

            <h3>
                Función Cuadrática
            </h3>


            <p>

                <strong>
                    Ecuación:
                </strong>

                y =
                ${a}x²
                ${b >= 0 ? "+" : "-"}
                ${Math.abs(b)}x
                ${c >= 0 ? "+" : "-"}
                ${Math.abs(c)}

            </p>


            <hr>


            <p>

                <strong>
                    Valor de a:
                </strong>

                ${a}

            </p>


            <p>

                <strong>
                    Valor de b:
                </strong>

                ${b}

            </p>


            <p>

                <strong>
                    Valor de c:
                </strong>

                ${c}

            </p>


            <p>

                <strong>
                    Discriminante:
                </strong>

                ${discriminante}

            </p>


            <p>

                <strong>
                    Raíces:
                </strong>

                <br>

                ${raices}

            </p>


            <p>

                <strong>
                    Vértice:
                </strong>

                (

                ${xv.toFixed(2)},

                ${Number(yv).toFixed(2)}

                )

            </p>


            <p>

                <strong>
                    Intercepto en Y:
                </strong>

                (0, ${c})

            </p>


            <p>

                <strong>
                    Concavidad:
                </strong>

                ${concavidad}

            </p>

        `;


        // ==================================
        // TABLA
        // ==================================

        crearTabla(
            expresion
        );


        // ==================================
        // GRÁFICA
        // ==================================

        crearGrafica(
            expresion,
            xv,
            yv
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
                <strong>
                    x^2 - 4*x + 3
                </strong>
            </p>

        `;


        tablaValores.innerHTML = "";

    }
}


// ==========================================
// TABLA
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

                <td>
                    ${x}
                </td>


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
// GRÁFICA
// ==========================================

function crearGrafica(
    expresion,
    xv,
    yv
) {

    const valoresX = [];

    const valoresY = [];


    for (
        let x = xv - 10;
        x <= xv + 10;
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

            name:
                "Función cuadrática"

        },


        {

            x: [xv],

            y: [yv],

            mode: "markers",

            type: "scatter",

            name: "Vértice"

        }

    ];


    const configuracion = {

        title:
            "Gráfica de la función cuadrática",


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
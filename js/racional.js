document.getElementById("calcular")
    .addEventListener("click", calcularRacional);



function calcularRacional() {

    let funcion =
        document.getElementById("funcion")
        .value
        .trim();


    const resultado =
        document.getElementById("resultado");


    // Verificar que exista una función

    if (funcion === "") {

        resultado.innerHTML = `

            <p>
                Por favor, ingrese una función racional.
            </p>

        `;

        return;

    }


    // Quitar "y ="

    funcion =
        funcion.replace(
            /^y\s*=\s*/i,
            ""
        );


    // Quitar espacios

    funcion =
        funcion.replace(
            /\s+/g,
            ""
        );


    try {

        // Crear expresión

        const expresion =
            math.compile(funcion);


        // Función f(x)

        function f(x) {

            return Number(
                expresion.evaluate({
                    x: x
                })
            );

        }


        // Comprobar que sea válida

        const prueba =
            f(0);


        if (
            !Number.isFinite(prueba) &&
            !funcion.includes("/x")
        ) {

            throw new Error(
                "Función no válida"
            );

        }


        // Encontrar asíntota vertical

        const asintotaVertical =
            encontrarAsintotaVertical(
                f
            );


        // Encontrar asíntota horizontal

        const asintotaHorizontal =
            encontrarAsintotaHorizontal(
                f
            );


        // Intercepto en Y

        let interceptoY = null;


        try {

            const valor =
                f(0);


            if (
                Number.isFinite(valor)
            ) {

                interceptoY = valor;

            }

        }

        catch {

            interceptoY = null;

        }


        // Buscar raíces

        const raices =
            encontrarRaices(f);


        // Mostrar resultados

        let texto = `

            <p>
                <strong>Función:</strong>
                y = ${funcion}
            </p>

        `;


        if (
            asintotaVertical !== null
        ) {

            texto += `

                <p>
                    <strong>
                        Asíntota vertical:
                    </strong>

                    x =
                    ${formatear(
                        asintotaVertical
                    )}
                </p>

            `;

        }

        else {

            texto += `

                <p>
                    <strong>
                        Asíntota vertical:
                    </strong>

                    No encontrada.
                </p>

            `;

        }


        if (
            asintotaHorizontal !== null
        ) {

            texto += `

                <p>
                    <strong>
                        Asíntota horizontal:
                    </strong>

                    y =
                    ${formatear(
                        asintotaHorizontal
                    )}
                </p>

            `;

        }

        else {

            texto += `

                <p>
                    <strong>
                        Asíntota horizontal:
                    </strong>

                    No encontrada.
                </p>

            `;

        }


        if (
            interceptoY !== null
        ) {

            texto += `

                <p>
                    <strong>
                        Intercepto en Y:
                    </strong>

                    (0,
                    ${formatear(
                        interceptoY
                    )})
                </p>

            `;

        }

        else {

            texto += `

                <p>
                    <strong>
                        Intercepto en Y:
                    </strong>

                    No existe.
                </p>

            `;

        }


        if (
            raices.length > 0
        ) {

            texto += `

                <p>
                    <strong>
                        Raíces reales aproximadas:
                    </strong>
                </p>

                <ul>

            `;


            raices.forEach(
                function(raiz) {

                    texto += `

                        <li>
                            x ≈
                            ${formatear(raiz)}
                        </li>

                    `;

                }
            );


            texto += `

                </ul>

            `;

        }

        else {

            texto += `

                <p>
                    <strong>
                        Raíces reales:
                    </strong>

                    No se encontraron.
                </p>

            `;

        }


        resultado.innerHTML =
            texto;


        // Crear tabla

        crearTabla(f);


        // Crear gráfica

        crearGrafica(
            f,
            funcion,
            asintotaVertical,
            asintotaHorizontal
        );

    }


    catch (error) {

        resultado.innerHTML = `

            <p>
                <strong>Error:</strong>
                La función ingresada no es válida.
            </p>

            <p>
                Ejemplo:
                <strong>
                    (2*x+1)/(x-3)
                </strong>
            </p>

        `;


        document.getElementById(
            "tablaValores"
        ).innerHTML = "";


        if (
            typeof Plotly !== "undefined"
        ) {

            Plotly.purge(
                "graficaFuncion"
            );

        }

    }

}



// Buscar asíntota vertical

function encontrarAsintotaVertical(f) {

    const paso = 0.01;


    for (
        let x = -10;
        x <= 10;
        x += paso
    ) {

        let izquierda;
        let derecha;


        try {

            izquierda =
                f(x - 0.001);

            derecha =
                f(x + 0.001);

        }

        catch {

            continue;

        }


        if (
            (
                !Number.isFinite(izquierda) ||
                !Number.isFinite(derecha)
            )
        ) {

            return x;

        }


        if (
            Math.abs(izquierda) > 1000 &&
            Math.abs(derecha) > 1000
        ) {

            return x;

        }

    }


    return null;

}



// Buscar asíntota horizontal

function encontrarAsintotaHorizontal(f) {

    try {

        const positivo =
            f(10000);


        const negativo =
            f(-10000);


        if (
            Number.isFinite(positivo) &&
            Number.isFinite(negativo)
        ) {

            if (
                Math.abs(
                    positivo - negativo
                ) < 0.1
            ) {

                return (
                    positivo + negativo
                ) / 2;

            }

        }

    }

    catch {

        return null;

    }


    return null;

}



// Buscar raíces

function encontrarRaices(f) {

    const raices = [];

    const paso = 0.1;


    let xAnterior = -20;

    let yAnterior;


    try {

        yAnterior =
            f(xAnterior);

    }

    catch {

        yAnterior = NaN;

    }


    for (
        let x = -20 + paso;
        x <= 20;
        x += paso
    ) {

        let yActual;


        try {

            yActual =
                f(x);

        }

        catch {

            yActual = NaN;

        }


        if (
            Number.isFinite(
                yAnterior
            ) &&
            Number.isFinite(
                yActual
            )
        ) {


            // Cambio de signo

            if (
                yAnterior *
                yActual < 0
            ) {

                const raiz =
                    buscarRaiz(
                        f,
                        xAnterior,
                        x
                    );


                agregarRaiz(
                    raices,
                    raiz
                );

            }


            // Valor cercano a cero

            if (
                Math.abs(yActual)
                < 0.001
            ) {

                agregarRaiz(
                    raices,
                    x
                );

            }

        }


        xAnterior = x;

        yAnterior = yActual;

    }


    return raices;

}



// Método de bisección

function buscarRaiz(
    f,
    izquierda,
    derecha
) {

    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const medio =
            (
                izquierda +
                derecha
            ) / 2;


        const yMedio =
            f(medio);


        const yIzquierda =
            f(izquierda);


        if (
            Math.abs(yMedio)
            < 0.000001
        ) {

            return medio;

        }


        if (
            yIzquierda *
            yMedio < 0
        ) {

            derecha = medio;

        }

        else {

            izquierda = medio;

        }

    }


    return (
        izquierda +
        derecha
    ) / 2;

}



// Evitar raíces repetidas

function agregarRaiz(
    raices,
    raiz
) {

    if (
        !Number.isFinite(raiz)
    ) {

        return;

    }


    const repetida =
        raices.some(
            function(r) {

                return (
                    Math.abs(
                        r - raiz
                    ) < 0.05
                );

            }
        );


    if (!repetida) {

        raices.push(raiz);

    }

}



// Crear tabla

function crearTabla(f) {

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

        let y;


        try {

            y = f(x);

        }

        catch {

            y = NaN;

        }


        html += `

            <tr>

                <td>
                    ${x}
                </td>

                <td>
                    ${formatear(y)}
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



// Crear gráfica

function crearGrafica(
    f,
    funcion,
    asintotaVertical,
    asintotaHorizontal
) {

    const valoresX = [];

    const valoresY = [];


    for (
        let x = -10;
        x <= 10;
        x += 0.05
    ) {

        valoresX.push(x);


        let y;


        try {

            y = f(x);

        }

        catch {

            y = null;

        }


        // Evitar valores enormes

        if (
            !Number.isFinite(y) ||
            Math.abs(y) > 100
        ) {

            valoresY.push(null);

        }

        else {

            valoresY.push(y);

        }

    }


    const datos = [

        {

            x: valoresX,

            y: valoresY,

            mode: "lines",

            name:
                "y = " + funcion

        }

    ];


    // Asíntota vertical

    if (
        asintotaVertical !== null
    ) {

        datos.push({

            x: [
                asintotaVertical,
                asintotaVertical
            ],

            y: [
                -20,
                20
            ],

            mode: "lines",

            name:
                "Asíntota vertical"

        });

    }


    // Asíntota horizontal

    if (
        asintotaHorizontal !== null
    ) {

        datos.push({

            x: [
                -10,
                10
            ],

            y: [
                asintotaHorizontal,
                asintotaHorizontal
            ],

            mode: "lines",

            name:
                "Asíntota horizontal"

        });

    }


    const layout = {

        title:
            "Gráfica de la función racional",

        xaxis: {

            title: "x",

            zeroline: true

        },

        yaxis: {

            title: "f(x)",

            zeroline: true

        },

        hovermode:
            "closest"

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

    if (
        !Number.isFinite(numero)
    ) {

        return "No definido";

    }


    return Number(
        numero.toFixed(4)
    );

}
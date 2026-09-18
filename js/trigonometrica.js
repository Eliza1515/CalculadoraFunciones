const botonCalcular =
    document.getElementById("calcular");


botonCalcular.addEventListener(
    "click",
    calcularTrigonometrica
);



function calcularTrigonometrica() {

    const tipo =
        document.getElementById(
            "tipoFuncion"
        ).value;


    const amplitud =
        parseFloat(
            document.getElementById(
                "amplitud"
            ).value
        );


    const multiplicador =
        parseFloat(
            document.getElementById(
                "periodo"
            ).value
        );


    const desplazamiento =
        parseFloat(
            document.getElementById(
                "desplazamiento"
            ).value
        );


    const resultado =
        document.getElementById(
            "resultado"
        );


    // Validar datos

    if (
        !Number.isFinite(amplitud) ||
        !Number.isFinite(multiplicador) ||
        !Number.isFinite(desplazamiento)
    ) {

        resultado.innerHTML = `

            <p>
                <strong>Error:</strong>
                Ingrese valores numéricos válidos.
            </p>

        `;

        return;

    }


    if (multiplicador === 0) {

        resultado.innerHTML = `

            <p>
                <strong>Error:</strong>
                El multiplicador de x
                no puede ser cero.
            </p>

        `;

        return;

    }


    // Nombre de la función

    let nombre;


    if (tipo === "sin") {

        nombre = "seno";

    }

    else if (tipo === "cos") {

        nombre = "coseno";

    }

    else {

        nombre = "tangente";

    }


    // Crear texto de la función

    const funcion =
        construirFuncion(
            tipo,
            amplitud,
            multiplicador,
            desplazamiento
        );


    // Calcular período

    let periodo;


    if (tipo === "tan") {

        periodo =
            Math.PI /
            Math.abs(multiplicador);

    }

    else {

        periodo =
            (2 * Math.PI) /
            Math.abs(multiplicador);

    }


    // Intercepto en Y

    const interceptoY =
        calcularValor(
            tipo,
            amplitud,
            multiplicador,
            desplazamiento,
            0
        );


    // Rango

    let rango;


    if (tipo === "tan") {

        rango =
            "(-∞, ∞)";

    }

    else {

        const inferior =
            desplazamiento -
            Math.abs(amplitud);


        const superior =
            desplazamiento +
            Math.abs(amplitud);


        rango =
            `[${formatear(inferior)}, ` +
            `${formatear(superior)}]`;

    }


    // Mostrar resultados

    let texto = `

        <p>
            <strong>Función:</strong>
            ${funcion}
        </p>

        <p>
            <strong>Tipo:</strong>
            ${capitalizar(nombre)}
        </p>

        <p>
            <strong>Amplitud:</strong>
            ${formatear(
                Math.abs(amplitud)
            )}
        </p>

        <p>
            <strong>Período:</strong>
            ${formatear(periodo)}
            radianes
        </p>

        <p>
            <strong>Intercepto en Y:</strong>
            (0,
            ${formatear(interceptoY)})
        </p>

        <p>
            <strong>Rango:</strong>
            ${rango}
        </p>

    `;


    // Dominio

    if (tipo === "tan") {

        texto += `

            <p>
                <strong>Dominio:</strong>
                Todos los números reales,
                excepto los puntos donde
                cos(x) = 0.
            </p>

        `;

    }

    else {

        texto += `

            <p>
                <strong>Dominio:</strong>
                Todos los números reales.
            </p>

        `;

    }


    resultado.innerHTML =
        texto;


    // Tabla

    crearTabla(
        tipo,
        amplitud,
        multiplicador,
        desplazamiento
    );


    // Gráfica

    crearGrafica(
        tipo,
        amplitud,
        multiplicador,
        desplazamiento,
        funcion
    );

}



// Construir función

function construirFuncion(
    tipo,
    amplitud,
    multiplicador,
    desplazamiento
) {

    let texto = "f(x) = ";


    if (amplitud === 1) {

        texto += "";

    }

    else if (amplitud === -1) {

        texto += "-";

    }

    else {

        texto += formatear(amplitud);

    }


    if (tipo === "sin") {

        texto += "sen";

    }

    else if (tipo === "cos") {

        texto += "cos";

    }

    else {

        texto += "tan";

    }


    texto += "(";


    if (multiplicador === 1) {

        texto += "x";

    }

    else {

        texto +=
            formatear(
                multiplicador
            ) + "x";

    }


    texto += ")";


    if (desplazamiento > 0) {

        texto +=
            " + " +
            formatear(
                desplazamiento
            );

    }

    else if (desplazamiento < 0) {

        texto +=
            " - " +
            formatear(
                Math.abs(
                    desplazamiento
                )
            );

    }


    return texto;

}



// Evaluar función

function calcularValor(
    tipo,
    amplitud,
    multiplicador,
    desplazamiento,
    x
) {

    const argumento =
        multiplicador * x;


    let valor;


    if (tipo === "sin") {

        valor =
            Math.sin(argumento);

    }

    else if (tipo === "cos") {

        valor =
            Math.cos(argumento);

    }

    else {

        valor =
            Math.tan(argumento);

    }


    return (
        amplitud * valor
    ) + desplazamiento;

}



// Crear tabla

function crearTabla(
    tipo,
    amplitud,
    multiplicador,
    desplazamiento
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


    // Valores en radianes

    for (
        let i = -5;
        i <= 5;
        i++
    ) {

        const x = i;


        const y =
            calcularValor(
                tipo,
                amplitud,
                multiplicador,
                desplazamiento,
                x
            );


        let valor;


        if (
            Math.abs(y) > 1000000
        ) {

            valor = "No definido";

        }

        else {

            valor =
                formatear(y);

        }


        html += `

            <tr>

                <td>
                    ${x}
                </td>

                <td>
                    ${valor}
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
    tipo,
    amplitud,
    multiplicador,
    desplazamiento,
    funcion
) {

    const valoresX = [];

    const valoresY = [];


    for (
        let x = -2 * Math.PI;
        x <= 2 * Math.PI;
        x += 0.01
    ) {

        const y =
            calcularValor(
                tipo,
                amplitud,
                multiplicador,
                desplazamiento,
                x
            );


        valoresX.push(x);


        // Evitar valores enormes

        if (
            Math.abs(y) > 100
        ) {

            valoresY.push(null);

        }

        else if (
            !Number.isFinite(y)
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

            name: funcion

        }

    ];


    const layout = {

        title:
            "Gráfica de la función trigonométrica",

        xaxis: {

            title: "x (radianes)",

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



// Primera letra mayúscula

function capitalizar(texto) {

    return texto
        .charAt(0)
        .toUpperCase()
        + texto.slice(1);

}
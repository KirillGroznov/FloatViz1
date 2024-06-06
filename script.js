function updateFloatingPoint(inputNumber) {
    const signOutputElement = document.getElementById("sign-output");
    const exponentOutputElement = document.getElementById("exponent-output");
    const mantissaOutputElement = document.getElementById("mantissa-output");

    if (isNaN(inputNumber)) {
        signOutputElement.innerHTML = "Invalid input";
        exponentOutputElement.innerHTML = "";
        mantissaOutputElement.innerHTML = "";
        return;
    }

    const sign = inputNumber >= 0 ? "0" : "1";
    const absoluteValue = Math.abs(inputNumber);
    const exponent = Math.floor(Math.log2(absoluteValue));
    const mantissa = absoluteValue / Math.pow(2, exponent) - 1; // Нормализуем мантиссу

    let exponentBinary = (exponent + 127).toString(2).padStart(8, '0');
    let mantissaBinary = mantissa.toString(2).substring(2).padEnd(23, '0').slice(0, 23); // Ограничиваем длину мантиссы 23 битами

    let signBit = `<div class="bit sign">${sign}</div>`;
    let exponentBits = '';
    for (let i = 0; i < exponentBinary.length; i++) {
        exponentBits += `<div class="bit exponent">${exponentBinary[i]}</div>`;
    }
    let mantissaBits = '';
    for (let i = 0; i < mantissaBinary.length; i++) {
        mantissaBits += `<div class="bit mantissa">${mantissaBinary[i]}</div>`;
    }

    signOutputElement.innerHTML = signBit;
    exponentOutputElement.innerHTML = exponentBits;
    mantissaOutputElement.innerHTML = mantissaBits;

    roundAndDisplay(inputNumber);
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateFloatingPoint(1); // Initialize with value 1
    // Показываем гифку при загрузке страницы
    document.getElementById("gif-container").style.display = "block";
});

function selectAlgorithm(algorithmNumber) {
    console.log("Selected Algorithm " + algorithmNumber);
    const algorithmTitleElement = document.getElementById("algorithm-title");

    const algorithms = {
        1: "Округление к ближайшему целому",
        2: "Округление к нулю",
        3: "Округление к плюс бесконечности",
        4: "Округление к минус бесконечности",
        5: "NaN числа",
        6: "Представление чисел с плавающей запятой в формате MF, VAX и IEEE",
        7: "Определение значения числа с плавающей запятой по его представлению в формате MF, VAX и IEEE"
    };

    const floatingPointRepresentation = document.getElementById("floating-point-representation");
    const gifcontainer = document.getElementById("gif-container");

    if (algorithmNumber === 1) {
        document.getElementById("secondInput").style.display = "block";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        floatingPointRepresentation.style.display = "block";
        algorithmTitleElement.style.display = "block";
        gifcontainer.style.display = "none";
        document.getElementById('vax').style.display = "none";
    } else if (algorithmNumber === 2) {
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "block";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        floatingPointRepresentation.style.display = "block";
        algorithmTitleElement.style.display = "block";
        gifcontainer.style.display = "none";
        document.getElementById('vax').style.display = "none";
        const inputValue = parseFloat(document.querySelector('.number-input').value);
        roundToZero(inputValue);
    } else if (algorithmNumber === 3) {
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "block";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        floatingPointRepresentation.style.display = "block";
        algorithmTitleElement.style.display = "block";
        gifcontainer.style.display = "none";
        const inputValue = parseFloat(document.querySelector('.number-input').value);
        roundToPositiveInfinity(inputValue);
    } else if (algorithmNumber === 4) {
        document.getElementById("secondInput").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "block";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        floatingPointRepresentation.style.display = "block";
        algorithmTitleElement.style.display = "block";
        gifcontainer.style.display = "none";
        const inputValue = parseFloat(document.querySelector('.number-input').value);
        roundToNegativeInfinity(inputValue);
    } else if (algorithmNumber === 5) {
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "block";
        document.getElementById('vax').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        floatingPointRepresentation.style.display = "none";
        algorithmTitleElement.style.display = "block";
        gifcontainer.style.display = "none";
    }
    else if (algorithmNumber === 6) {
        document.getElementById("additional-options").style.display = "block";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        floatingPointRepresentation.style.display = "none";
    }
    else if (algorithmNumber === 6.1) {
        document.getElementById('floating-point-representation').style.display = "block";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "block";
    }
    else if (algorithmNumber === 6.2) {
        document.getElementById('vax').style.display = "block";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById('floating-point-representation').style.display = "none";
    }
    else if (algorithmNumber === 6.3) {
        document.getElementById('mf').style.display = "block";
        document.getElementById('vax').style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById('floating-point-representation').style.display = "none";
    }
    else if (algorithmNumber === 7) {
        document.getElementById("additional-options2").style.display = "block";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById('floating-point-representation').style.display = "none";
    }
    else if (algorithmNumber === 7.1) {
        document.getElementById('ieee-to-number').style.display = "block";
        document.getElementById('mf').style.display = "none";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById('floating-point-representation').style.display = "none";
    }
    else if (algorithmNumber === 7.2) {
        document.getElementById('vax-to-number').style.display = "block";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        document.getElementById('mf-to-number').style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById('floating-point-representation').style.display = "none";
    }
    else if (algorithmNumber === 7.3) {
        document.getElementById('mf-to-number').style.display = "block";
        document.getElementById('vax-to-number').style.display = "none";
        document.getElementById('ieee-to-number').style.display = "none";
        document.getElementById('mf').style.display = "none";
        document.getElementById('vax').style.display = "none";
        document.getElementById("secondInput").style.display = "none";
        document.getElementById("secondInputZero").style.display = "none";
        document.getElementById("secondInputInfP").style.display = "none";
        document.getElementById("secondInputInfM").style.display = "none";
        document.getElementById("NaN").style.display = "none";
        gifcontainer.style.display = "none";
        algorithmTitleElement.style.display = "none";
        document.getElementById('floating-point-representation').style.display = "none";
    }
    algorithmTitleElement.innerHTML = algorithms[algorithmNumber] || "Представление числа с плавающей запятой в формате IEEE 754 Floating Point";
}

// Функция переключения списка алгоритмов
function toggleAlgorithmList() {
    var algorithmList = document.getElementById("algorithm-list");
    if (algorithmList.style.display === "block") {
        algorithmList.style.display = "none";
    } else {
        algorithmList.style.display = "block";
    }
}

function updateFloatingPoint(inputNumber) {
    // Получаем элементы для отображения знака, порядка и мантиссы
    const signOutputElement = document.getElementById("sign-output");
    const exponentOutputElement = document.getElementById("exponent-output");
    const mantissaOutputElement = document.getElementById("mantissa-output");

    // Проверяем, является ли входное число NaN
    if (isNaN(inputNumber)) {
        // Если входное число не является числом, отображаем сообщение об ошибке
        signOutputElement.innerHTML = "Invalid input";
        exponentOutputElement.innerHTML = "";
        mantissaOutputElement.innerHTML = "";
        return;
    }

    // Определяем знак входного числа
    const sign = inputNumber >= 0 ? "0" : "1";
    // Вычисляем абсолютное значение входного числа
    const absoluteValue = Math.abs(inputNumber);
    // Вычисляем экспоненту входного числа
    const exponent = Math.floor(Math.log2(absoluteValue));
    // Вычисляем нормализованную мантиссу входного числа
    const mantissa = absoluteValue / Math.pow(2, exponent) - 1;

    // Преобразуем экспоненту и мантиссу в двоичные строки
    let exponentBinary = (exponent + 127).toString(2).padStart(8, '0');
    let mantissaBinary = mantissa.toString(2).substring(2).padEnd(23, '0').slice(0, 23); // Ограничиваем длину мантиссы 23 битами

    // Формируем HTML для отображения знака, порядка и мантиссы
    let signBit = `<div class="bit sign">${sign}</div>`;
    let exponentBits = '';
    for (let i = 0; i < exponentBinary.length; i++) {
        exponentBits += `<div class="bit exponent">${exponentBinary[i]}</div>`;
    }
    let mantissaBits = '';
    for (let i = 0; i < mantissaBinary.length; i++) {
        mantissaBits += `<div class="bit mantissa">${mantissaBinary[i]}</div>`;
    }

    // Отображаем знак, порядок и мантиссу
    signOutputElement.innerHTML = signBit;
    exponentOutputElement.innerHTML = exponentBits;
    mantissaOutputElement.innerHTML = mantissaBits;

    // Вызываем функцию для округления и отображения округленного числа
    roundAndDisplay(inputNumber);
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateFloatingPoint(1); // Инициализируем значение числа 1 при загрузке страницы
    // Показываем гифку при загрузке страницы
    document.getElementById("gif-container").style.display = "block";
});

function selectAlgorithm(algorithmNumber) {
    // Выводим номер выбранного алгоритма в консоль для отладки
    console.log("Selected Algorithm " + algorithmNumber);
    // Получаем элемент заголовка алгоритма
    const algorithmTitleElement = document.getElementById("algorithm-title");

    // Объект, содержащий названия алгоритмов
    const algorithms = {
        1: "Округление к ближайшему целому",
        2: "Округление к нулю",
        3: "Округление к плюс бесконечности",
        4: "Округление к минус бесконечности",
        5: "NaN числа",
        6: "Представление чисел с плавающей запятой в формате MF, VAX и IEEE",
        7: "Определение значения числа с плавающей запятой по его представлению в формате MF, VAX и IEEE"
    };

    // Получаем элементы для отображения представления числа с плавающей запятой и GIF-изображения
    const floatingPointRepresentation = document.getElementById("floating-point-representation");
    const gifcontainer = document.getElementById("gif-container");

    // Определяем видимость элементов в зависимости от выбранного алгоритма
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
    // Получаем элемент списка алгоритмов
    var algorithmList = document.getElementById("algorithm-list");
    // Проверяем текущее состояние отображения списка
    if (algorithmList.style.display === "block") {
        // Если список отображается, скрываем его
        algorithmList.style.display = "none";
    } else {
        // Если список скрыт, отображаем его
        algorithmList.style.display = "block";
    }
}


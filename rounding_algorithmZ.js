function roundAndDisplay(inputNumber) {
    // Округляем введенное число
    const roundedValue = Math.round(inputNumber);

    // Отображаем округленное число во втором поле ввода
    document.getElementById("rounded-output").value = roundedValue;

    // Обновляем знак, порядок и мантиссу для второго числа
    updateSecondFloatingPoint(roundedValue);
}

function updateSecondFloatingPoint(inputNumber) {
    // Получаем элементы для отображения знака, порядка и мантиссы второго числа
    const signOutputElement = document.getElementById("sign-output-second");
    const exponentOutputElement = document.getElementById("exponent-output-second");
    const mantissaOutputElement = document.getElementById("mantissa-output-second");

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
    // Вычисляем мантиссу входного числа
    const mantissa = absoluteValue / Math.pow(2, exponent);

    // Преобразуем экспоненту и мантиссу в двоичные строки
    let exponentBinary = (exponent + 127).toString(2).padStart(8, '0');
    let mantissaBinary = mantissa.toString(2).substring(2).padEnd(23, '0').slice(0, 23); // Ограничиваем длину мантиссы 23 битами

    // Формируем HTML для отображения знака, порядка и мантиссы второго числа
    let signBit = `<div class="bit sign">${sign}</div>`;
    let exponentBits = '';
    for (let i = 0; i < exponentBinary.length; i++) {
        exponentBits += `<div class="bit exponent">${exponentBinary[i]}</div>`;
    }
    let mantissaBits = '';
    for (let i = 0; i < mantissaBinary.length; i++) {
        mantissaBits += `<div class="bit mantissa">${mantissaBinary[i]}</div>`;
    }

    // Отображаем знак, порядок и мантиссу второго числа
    signOutputElement.innerHTML = signBit;
    exponentOutputElement.innerHTML = exponentBits;
    mantissaOutputElement.innerHTML = mantissaBits;
}

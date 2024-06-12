// Добавляем прослушивание события input на поле ввода числа
document.querySelector('.number-input').addEventListener('input', function() {
    // Получаем текст заголовка алгоритма
    const algorithmTitleElement = document.getElementById("algorithm-title").innerText;
    // Проверяем, содержит ли заголовок текст "Округление к минус бесконечности"
    if (algorithmTitleElement.includes("Округление к минус бесконечности")) {
        // Получаем текущее значение из поля ввода
        const inputValue = parseFloat(this.value);
        // Вызываем функцию округления к минус бесконечности с текущим значением
        roundToNegativeInfinity(inputValue);
    }
});

// Функция для округления числа к минус бесконечности
function roundToNegativeInfinity(inputNumber) {
    // Округляем введенное число к минус бесконечности
    const roundedValue = Math.floor(inputNumber);

    // Отображаем округленное число во втором поле ввода
    document.getElementById("rounded-output-infm").value = roundedValue;

    // Обновляем знак, порядок и мантиссу для второго числа
    updateSecondFloatingPointNegativeInfinity(roundedValue);
}

// Функция обновления значений для округленного числа при округлении к минус бесконечности
function updateSecondFloatingPointNegativeInfinity(inputNumber) {
    // Получаем элементы для отображения знака, порядка и мантиссы второго числа
    const signOutputElement = document.getElementById("sign-output-second-infm");
    const exponentOutputElement = document.getElementById("exponent-output-second-infm");
    const mantissaOutputElement = document.getElementById("mantissa-output-second-infm");

    // Проверяем, является ли ввод числом или null
    if (inputNumber === null || isNaN(inputNumber)) {
        // Отображаем значения по умолчанию, если ввод не является числом
        signOutputElement.innerHTML = "<div class=\"bit sign\">0</div>";
        exponentOutputElement.innerHTML = "<div class=\"bit exponent\">0</div>";
        mantissaOutputElement.innerHTML = "<div class=\"bit mantissa\">0</div>";
        return;
    }

    // Определяем знак округленного числа
    const sign = inputNumber >= 0 ? "0" : "1";
    // Вычисляем экспоненту округленного числа
    const exponent = inputNumber === 0 ? 0 : Math.floor(Math.log2(Math.abs(inputNumber)));
    // Вычисляем мантиссу округленного числа
    const mantissa = inputNumber === 0 ? 0 : Math.abs(inputNumber) / Math.pow(2, exponent);

    // Преобразуем экспоненту в двоичную форму
    let exponentBinary = (exponent + 127).toString(2).padStart(8, '0');
    // Преобразуем мантиссу в двоичную форму
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

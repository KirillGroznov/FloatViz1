// Добавляем прослушивание события input на поле ввода
document.querySelector('.number-input').addEventListener('input', function() {
    const algorithmTitleElement = document.getElementById("algorithm-title").innerText;
    if (algorithmTitleElement.includes("Округление к нулю")) {
        // Получаем текущее значение из поля ввода
        const inputValue = parseFloat(this.value);
        // Вызываем функцию округления к нулю с текущим значением
        roundToZero(inputValue);
    }
});

function roundToZero(inputNumber) {
    // Округляем введенное число к нулю
    const roundedValue = Math.trunc(inputNumber);

    // Отображаем округленное число во втором поле ввода
    document.getElementById("rounded-output-zero").value = roundedValue;

    // Обновляем знак, порядок и мантиссу для второго числа
    updateSecondFloatingPointZero(roundedValue);
}

// Функция обновления значений для округленного числа при округлении к нулю
function updateSecondFloatingPointZero(inputNumber) {
    const signOutputElement = document.getElementById("sign-output-second-zero");
    const exponentOutputElement = document.getElementById("exponent-output-second-zero");
    const mantissaOutputElement = document.getElementById("mantissa-output-second-zero");

    if (inputNumber === null || isNaN(inputNumber)) {
        // Отображаем значения по умолчанию, если ввод не является числом
        signOutputElement.innerHTML = "<div class=\"bit sign\">0</div>";
        exponentOutputElement.innerHTML = "<div class=\"bit exponent\">0</div>";
        mantissaOutputElement.innerHTML = "<div class=\"bit mantissa\">0</div>";
        return;
    }

    const sign = inputNumber >= 0 ? "0" : "1";
    const exponent = inputNumber === 0 ? 0 : Math.floor(Math.log2(Math.abs(inputNumber)));
    const mantissa = inputNumber === 0 ? 0 : Math.abs(inputNumber) / Math.pow(2, exponent);

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
}



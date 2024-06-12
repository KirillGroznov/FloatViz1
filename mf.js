function convertToMF(number) {
    // Получаем модуль числа
    let absNumber = Math.abs(number);

    // Определяем знак числа
    let sign = number < 0 ? 1 : 0;

    // Определяем порядок (экспонента)
    let exponent = Math.floor(Math.log(absNumber) / Math.log(16));

    // Если число равно 0, порядок также равен 0
    if (absNumber === 0) exponent = 0;

    // Определяем характеристику
    let characteristic = exponent + 65;

    // Преобразуем мантиссу в шестнадцатеричную строку
    let mantissaHex = (absNumber / Math.pow(16, exponent)).toString(16);

    // Убираем возможные ведущие нули и десятичную точку
    if (mantissaHex.includes('.')) {
        mantissaHex = mantissaHex.replace('.', '');
    }
    mantissaHex = mantissaHex.padEnd(6, '0').slice(0, 6); // Дополним до нужного количества цифр (6 символов)

    // Преобразуем мантиссу в двоичную строку
    let mantissaBin = '';
    for (let i = 0; i < mantissaHex.length; i++) {
        mantissaBin += parseInt(mantissaHex[i], 16).toString(2).padStart(4, '0');
    }

    // Удаляем ведущие нули в мантиссе, если они есть
    mantissaBin = mantissaBin.replace(/^0+/, '');

    // Обрезаем мантиссу до 24 бит
    mantissaBin = mantissaBin.slice(0, 24).padEnd(24, '0');

    // Преобразуем характеристику в двоичную строку
    let characteristicBin = characteristic.toString(2).padStart(7, '0');

    return {
        sign: sign,
        characteristic: characteristicBin,
        mantissa: mantissaBin
    };
}

document.addEventListener("DOMContentLoaded", function () {
    // Функция для обновления представления числа в формате MF
    function updateMFRepresentation(number) {
        let mfRepresentation = convertToMF(number);

        // Обновляем знак числа
        document.getElementById("sign-mf").innerHTML = `<div class="bit sign">${mfRepresentation.sign}</div>`;

        // Обновляем экспоненту
        document.getElementById("exponent-mf").innerHTML = mfRepresentation.characteristic.split('').map(bit => `<div class="bit exponent">${bit}</div>`).join('');

        // Обновляем мантиссу
        document.getElementById("mantissa-mf").innerHTML = mfRepresentation.mantissa.split('').map(bit => `<div class="bit mantissa">${bit}</div>`).join('');
    }

    // Функция для инициализации
    function init() {
        let numberInput = document.getElementById("mff");

        // Устанавливаем начальное значение
        numberInput.value = "250";

        // Обновляем представление для начального значения
        updateMFRepresentation(250);

        // Добавляем обработчик события для обновления представления при изменении ввода
        numberInput.addEventListener("input", function () {
            let number = parseFloat(numberInput.value);

            // Проверяем, является ли введенное значение числом
            if (!isNaN(number)) {
                updateMFRepresentation(number);
            } else {
                // Очищаем представление, если введенное значение не является числом
                document.getElementById("sign-mf").textContent = "";
                document.getElementById("exponent-mf").textContent = "";
                document.getElementById("mantissa-mf").textContent = "";
            }
        });
    }

    // Инициализируем приложение
    init();
});


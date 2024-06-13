let isMFMantissaAnimationRunning = false; // Флаг для отслеживания состояния анимации
let initialMFMantissaValue = ''; // Переменная для хранения начального значения мантиссы в MF

// Функция для анимации изменения мантиссы
function animateMFMantissaChange(inputValue) {
    if (isMFMantissaAnimationRunning) {
        return; // Если анимация уже запущена, выход из функции
    }

    // Сохраняем начальное значение мантиссы перед запуском анимации
    initialMFMantissaValue = document.getElementById("mantissa-mf").innerHTML;

    isMFMantissaAnimationRunning = true; // Устанавливаем флаг анимации в true
    const mantissaOutputElement = document.getElementById("mantissa-mf");
    mantissaOutputElement.innerHTML = ''; // Очищаем содержимое элемента вывода мантиссы
    mantissaOutputElement.style.transition = "background-color 0.5s, color 0.5s"; // Устанавливаем CSS-переходы для фона и цвета текста
    mantissaOutputElement.style.color = "white"; // Устанавливаем белый цвет текста

    // Шаг 1: Преобразование числа в шестнадцатеричный формат
    const step1 = createStepElement3('Шаг 1: Преобразование числа в шестнадцатеричный формат');
    mantissaOutputElement.appendChild(step1); // Добавляем шаг 1 в элемент вывода мантиссы

    setTimeout(() => {
        const hexadecimal = convertToHexadecimalSteps(inputValue); // Преобразуем число в шестнадцатеричный формат
        let binaryDetail = `<br>Число: ${inputValue} → Шестнадцатеричный формат: <br>`;

        // Добавляем каждый шаг конвертации в подробное описание
        hexadecimal.forEach(step => {
            binaryDetail += `${step}<br>`;
        });

        step1.innerHTML += binaryDetail; // Добавляем подробное описание в шаг 1

        // Шаг 2: Нормализация числа
        const step2 = createStepElement3('Шаг 2: Нормализация числа');
        mantissaOutputElement.appendChild(step2);
        setTimeout(() => {
            const binary = Math.abs(inputValue).toString(16).toUpperCase();
            step2.innerHTML += `<br>Число: ${inputValue} → Двоичный формат: ${binary}`;

            // Нормализация числа
            const normalizedBinary = binary.indexOf('.') === -1 ? binary : binary.replace('.', ''); // Убираем точку (если есть)
            let exponent = calculateMFExponent(inputValue) + 1; // Добавляем 1 к экспоненте

            // Показываем число в нормализованном виде с указанием сдвига десятичной точки
            const shiftedComma = exponent >= 0 ? '0' + normalizedBinary.substring(-1, 0) + ',' + normalizedBinary.substring(0) :
                normalizedBinary.substring(0, 1) + '.' + normalizedBinary.substring(1 - exponent);
            const normalizedNumber = `${shiftedComma} * 16^(сдвинуто число на ${Math.abs(exponent)} разрядов)`;
            step2.innerHTML += `<br>Для определения мантиссы и порядка производится перемещение запятой в шестнадцатеричном числе влево или вправо таким образом, чтобы она установилась перед старшей значащей цифрой.<br>Нормализация числа: ${normalizedNumber}`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как порядок положительный (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как порядок отрицательный (${exponent}), десятичная точка сдвигается вправо.`;
            }

            const step3 = createStepElement3('Шаг 3: Определение мантиссы');

            mantissaOutputElement.appendChild(step3);

            setTimeout(() => {

                const tetradTable = `
        <table border="1">
            <caption>Таблица тетрад:</caption>
            <thead>
                <tr>
                    <th>Цифра</th>
                    <th>Тетрада</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>0</td><td>0000</td></tr>
                <tr><td>1</td><td>0001</td></tr>
                <tr><td>2</td><td>0010</td></tr>
                <tr><td>3</td><td>0011</td></tr>
                <tr><td>4</td><td>0100</td></tr>
                <tr><td>5</td><td>0101</td></tr>
                <tr><td>6</td><td>0110</td></tr>
                <tr><td>7</td><td>0111</td></tr>
                <tr><td>8</td><td>1000</td></tr>
                <tr><td>9</td><td>1001</td></tr>
                <tr><td>A</td><td>1010</td></tr>
                <tr><td>B</td><td>1011</td></tr>
                <tr><td>C</td><td>1100</td></tr>
                <tr><td>D</td><td>1101</td></tr>
                <tr><td>E</td><td>1110</td></tr>
                <tr><td>F</td><td>1111</td></tr>
            </tbody>
        </table>`;
                // Создаем строку, содержащую HTML-код таблицы тетрад.
                // В таблице отображаются соответствия между шестнадцатеричными цифрами (0-F) и их двоичными представлениями (0000-1111).

                // Вычисляем мантиссу
                const mantissaHex = calculateMFMantissa(inputValue);

                // Преобразуем шестнадцатеричную мантиссу в двоичную
                let mantissaBin = '';
                let count = 0;
                let lastHexDigit = '0';
                for (let i = 0; i < normalizedBinary.substring(1 - exponent).length; i++) {
                    const hexDigit = normalizedBinary.substring(1 - exponent)[i];
                    const binaryDigit = parseInt(hexDigit, 16).toString(2).padStart(4, '0');
                    if (binaryDigit !== '0000' || count > 0) {
                        mantissaBin += binaryDigit + ' ';
                        lastHexDigit = hexDigit;
                        count++;
                    }
                    if (count === 6 || (count === 5 && i === normalizedBinary.substring(1 - exponent).length - 1)) break;
                }

                // Если седьмая цифра в шестнадцатеричной мантиссе влияет на старший разряд в двоичной мантиссе, производим округление
                if (count === 6) {
                    // Получаем седьмую цифру в шестнадцатеричном формате и переводим её в двоичный формат
                    const seventhBinaryDigit = parseInt(normalizedBinary.substring(1 - exponent)[6], 16).toString(2).padStart(4, '0');
                    if (seventhBinaryDigit === '1') {
                        // Если седьмая цифра равна 1, производим округление
                        // Получаем последний добавленный двоичный разряд
                        let lastBinaryDigit = mantissaBin.trim().split(' ').pop();
                        // Округляем до следующего четного числа
                        lastBinaryDigit = parseInt(lastBinaryDigit, 2);
                        lastBinaryDigit = (lastBinaryDigit + 1) % 2 === 0 ? lastBinaryDigit : lastBinaryDigit + 1;
                        lastBinaryDigit = lastBinaryDigit.toString(2).padStart(4, '0');
                        // Заменяем последний добавленный разряд на округленный
                        mantissaBin = mantissaBin.substring(0, mantissaBin.length - 5) + lastBinaryDigit + ' ';
                        // Выводим сообщение об округлении
                        step3.innerHTML += `<br>Так как в седьмой цифре в двоичной форме старший разряд равен 1, мы округлили шестую цифру: ${mantissaBin.trim().split(' ').pop()}`;
                    } else {
                        // Если седьмая цифра равна 0, оставляем мантиссу без изменений
                        // Выводим сообщение о старшем разряде равном 0
                        step3.innerHTML += `<br>Так как в седьмой цифре в двоичной форме старший разряд равен 0, оставляем мантиссу без изменений.`;
                    }
                }

                // Получаем шестнадцатеричную мантиссу
                const hexMantissa = normalizedBinary.substring(1 - exponent);

                // Удаление ведущих нулей
                let trimmedHexMantissa = hexMantissa.replace(/^0+/, '');

                // Сокращаем до 6 цифр/букв, не считая нулей
                if (trimmedHexMantissa.length > 6) {
                    trimmedHexMantissa = trimmedHexMantissa.slice(0, 6);
                }

                // Выводим шестнадцатеричную мантиссу
                step3.innerHTML += `<br>Мантисса в шестнадцатеричной системе: ${trimmedHexMantissa}`;
                step3.innerHTML += `<br>${tetradTable}`;
                step3.innerHTML += `<br>Мантисса в двоичной системе: ${mantissaBin}<br>При записи числа в формате MF шестнадцатеричная мантисса представляется в двоичной системе счисления.<br> При переводе необходимо получить максимум шесть цифр, не считая старших нулей.`;

                setTimeout(() => {
                    // Восстанавливаем начальное значение мантиссы
                    mantissaOutputElement.innerHTML = initialMFMantissaValue;
                    mantissaOutputElement.style.backgroundColor = "";
                    mantissaOutputElement.style.color = "";
                    mantissaOutputElement.style.transition = "";
                    isMFMantissaAnimationRunning = false;
                }, 3500); // Измените значение таймера в соответствии с вашими требованиями
            }, 3500);
        }, 3500);
    }, 3500);
}


// Обработчик клика по метке мантиссы
const mantissaLabelMF = document.getElementById("mantissa-mf");
mantissaLabelMF.addEventListener('click', function() {
    // Получаем текущее значение числа из поля ввода для формата MF
    const inputValueMF = parseFloat(document.getElementById('mff').value);
    animateMFMantissaChange(inputValueMF);
});
function calculateMFMantissa(number) {
    // Получаем модуль числа
    let absNumber = Math.abs(number);

    // Определяем порядок (экспонента)
    let exponent = Math.floor(Math.log(absNumber) / Math.log(16));

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

    return mantissaBin;
}
// Создаем элемент шага с анимационными стилями
function createStepElement3(stepText) {
    const step = document.createElement('div');
    step.classList.add('animation-color');
    step.innerHTML = stepText;
    return step;
}
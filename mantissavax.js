let isVAXMantissaAnimationRunning = false; // Флаг, указывающий, идет ли анимация изменения мантиссы в формате VAX
let initialVAXMantissaValue = ''; // Переменная для хранения начального значения мантиссы в формате VAX

function animateVAXMantissaChange(inputValue) {
    if (isVAXMantissaAnimationRunning) {
        return; // Если анимация уже запущена, прерываем выполнение функции
    }

    // Сохраняем начальное значение мантиссы перед запуском анимации
    initialVAXMantissaValue = document.getElementById("mantissa-vax").innerHTML;

    isVAXMantissaAnimationRunning = true; // Устанавливаем флаг, что анимация запущена
    const mantissaOutputElement = document.getElementById("mantissa-vax");
    mantissaOutputElement.innerHTML = ''; // Очищаем содержимое элемента мантиссы
    mantissaOutputElement.style.transition = "background-color 0.5s, color 0.5s"; // Устанавливаем анимацию для изменения цвета фона и текста
    mantissaOutputElement.style.color = "white"; // Устанавливаем белый цвет текста

    const step1 = createStepElement2('Шаг 1: Преобразование числа в двоичный формат');
    mantissaOutputElement.appendChild(step1); // Добавляем созданный элемент шага в мантиссу
    setTimeout(() => {
        const binarySteps = convertToBinarySteps(inputValue); // Получаем шаги преобразования числа в двоичный формат
        let binaryDetail = `<br>Число: ${inputValue} → Двоичный формат: <br>`;
        binarySteps.forEach(step => {
            binaryDetail += `${step}<br>`; // Формируем детали преобразования для отображения
        });
        step1.innerHTML += binaryDetail; // Добавляем детали преобразования в первый шаг

        const step2 = createStepElement1('Шаг 2: Нормализация числа');
        mantissaOutputElement.appendChild(step2);
        setTimeout(() => {

            const binary = Math.abs(inputValue).toString(2); // Преобразуем число в двоичную форму
            step2.innerHTML += `<br>Число: ${inputValue} → Двоичный формат: ${binary}`;
            const normalizedBinary = normalizeBinaryVAX(binary);
            const exponent = calculateExponent(inputValue) + 1;

            // Находим позицию первой значащей цифры
            let firstSignificantDigitIndex = 0;
            for (let i = 0; i < normalizedBinary.length; i++) {
                if (normalizedBinary[i] !== '0') {
                    firstSignificantDigitIndex = i;
                    break;
                }
            }

            // Показываем число в нормализованном виде с указанием сдвига десятичной точки
            const shiftedComma = exponent >= 0 ?
               '0' + ',' + normalizedBinary.substring(firstSignificantDigitIndex, firstSignificantDigitIndex + 1) + normalizedBinary.substring(firstSignificantDigitIndex + 1) :
                '0' + ',' + normalizedBinary.substring(firstSignificantDigitIndex, firstSignificantDigitIndex + 1) + normalizedBinary.substring(firstSignificantDigitIndex + 1, Math.abs(exponent) + firstSignificantDigitIndex + 1);

            const normalizedNumber = `${shiftedComma} * 2^(сдвинуто число на ${Math.abs(exponent)} разрядов)`;
            step2.innerHTML += `<br>Нормализация числа: ${normalizedNumber}<br>Старшая единица мантиссы нормализованного числа является единицей целой части мантиссы, в формате VAX запятая в мантиссе фиксируется перед старшей единицей`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как экспонента положительная (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как экспонента отрицательная (${exponent}), десятичная точка сдвигается вправо.`;
            }

            const step3 = createStepElement1('Шаг 3: Определение мантиссы'); // Создаем элемент шага для определения мантиссы
            mantissaOutputElement.appendChild(step3); // Добавляем созданный элемент шага в мантиссу
            setTimeout(() => {
                const mantissa = calculateVAXMantissa(inputValue); // Вычисляем мантиссу в формате VAX

                // Выводим полученную мантиссу
                step3.innerHTML += `<br>Мантисса: ${mantissa}<br>Оставляем все после запятой.<br>НО!!! При записи числа необходимо учитывать, что в формате VAX используются только нормализованные числа и, так как нормализация осуществляется с точностью до двоичной цифры, старший разряд мантиссы всегда равен единице, в связи с чем он в разрядной сетке не представляется (так называемый «скрытый разряд»).`;

                setTimeout(() => {
                    // Восстанавливаем начальное значение мантиссы
                    mantissaOutputElement.innerHTML = initialVAXMantissaValue;
                    mantissaOutputElement.style.backgroundColor = "";
                    mantissaOutputElement.style.color = "";
                    mantissaOutputElement.style.transition = "";
                    isVAXMantissaAnimationRunning = false;
                }, 10000);
            }, 5000);
        }, 3500);
    }, 3500);
}

function calculateVAXMantissa(number) {
    const binary = Math.abs(number).toString(2); // Преобразуем число в двоичное представление
    const normalizedBinary = normalizeBinaryVAX(binary); // Нормализуем двоичное представление в формате VAX

    // Находим часть после запятой (дробную часть)
    const mantissaPart = normalizedBinary.indexOf('.') === -1 ? normalizedBinary : normalizedBinary.split('.')[1];

    // Убираем первую цифру старшего разряда после запятой, чтобы получить мантиссу
    const mantissa = mantissaPart.slice(1);

    return mantissa.padEnd(23, '0').slice(0, 23); // Убеждаемся, что мантисса имеет длину 23 бита
}

function normalizeBinaryVAX(binary) {
    if (binary.indexOf('.') === -1) { // Если нет дробной части
        const firstOneIndex = binary.indexOf('1'); // Находим позицию первой единицы
        return firstOneIndex !== -1 ? '1' + binary.slice(firstOneIndex + 1) : '0'; // Если есть первая единица, возвращаем строку с этой единицей, если нет - возвращаем "0"
    }

    const [integerPart, fractionalPart] = binary.split('.'); // Разделяем на целую и дробную части
    const firstOneIndex = integerPart.indexOf('1'); // Находим позицию первой единицы в целой части
    if (firstOneIndex !== -1) { // Если есть первая единица в целой части
        return '1' + integerPart.slice(firstOneIndex + 1) + fractionalPart; // Возвращаем строку с первой единицей и остальной частью числа
    }

    const firstFractionalOneIndex = fractionalPart.indexOf('1'); // Находим позицию первой единицы в дробной части
    return '1' + fractionalPart.slice(firstFractionalOneIndex + 1); // Возвращаем строку с первой единицей и остальной частью числа
}

// Обработчик клика по метке мантиссы в формате VAX
const mantissaLabelVAX = document.getElementById("mantissa-vax");
mantissaLabelVAX.addEventListener('click', function() {
    const inputValue = parseFloat(document.getElementById('vaxx').value); // Получаем введенное значение
    animateVAXMantissaChange(inputValue); // Запускаем анимацию изменения мантиссы
});

// Создаем элемент шага с анимационными стилями
function createStepElement1(stepText) {
    const step = document.createElement('div'); // Создаем новый элемент
    step.classList.add('animation-color'); // Добавляем класс для анимации цвета
    step.innerHTML = stepText; // Устанавливаем текст шага
    return step; // Возвращаем созданный элемент
}

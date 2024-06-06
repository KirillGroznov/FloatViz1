let isVAXMantissaAnimationRunning = false;
let initialVAXMantissaValue = ''; // Переменная для хранения начального значения мантиссы в VAX

function animateVAXMantissaChange(inputValue) {
    if (isVAXMantissaAnimationRunning) {
        return;
    }

    // Сохраняем начальное значение мантиссы перед запуском анимации
    initialVAXMantissaValue = document.getElementById("mantissa-vax").innerHTML;

    isVAXMantissaAnimationRunning = true;
    const mantissaOutputElement = document.getElementById("mantissa-vax");
    mantissaOutputElement.innerHTML = '';
    mantissaOutputElement.style.transition = "background-color 0.5s, color 0.5s";
    mantissaOutputElement.style.color = "white";

    const step1 = createStepElement2('Шаг 1: Преобразование числа в двоичный формат');
    mantissaOutputElement.appendChild(step1);
    setTimeout(() => {
        const binarySteps = convertToBinarySteps(inputValue);
        let binaryDetail = `<br>Число: ${inputValue} → Двоичный формат: <br>`;
        binarySteps.forEach(step => {
            binaryDetail += `${step}<br>`;
        });
        step1.innerHTML += binaryDetail;

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

            const step3 = createStepElement1('Шаг 3: Определение мантиссы');
            mantissaOutputElement.appendChild(step3);
            setTimeout(() => {
                const mantissa = calculateVAXMantissa(inputValue); // Вычисляем мантиссу

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
    const binary = Math.abs(number).toString(2);
    const normalizedBinary = normalizeBinaryVAX(binary);

    // Находим часть после запятой
    const mantissaPart = normalizedBinary.indexOf('.') === -1 ? normalizedBinary : normalizedBinary.split('.')[1];

    // Убираем первую цифру старшего разряда после запятой
    const mantissa = mantissaPart.slice(1);

    return mantissa.padEnd(23, '0').slice(0, 23); // Убеждаемся, что мантисса имеет длину 23 бита
}

function normalizeBinaryVAX(binary) {
    if (binary.indexOf('.') === -1) {
        const firstOneIndex = binary.indexOf('1');
        return firstOneIndex !== -1 ? '1' + binary.slice(firstOneIndex + 1) : '0';
    }

    const [integerPart, fractionalPart] = binary.split('.');
    const firstOneIndex = integerPart.indexOf('1');
    if (firstOneIndex !== -1) {
        return '1' + integerPart.slice(firstOneIndex + 1) + fractionalPart;
    }

    const firstFractionalOneIndex = fractionalPart.indexOf('1');
    return '1' + fractionalPart.slice(firstFractionalOneIndex + 1);
}

// Обработчик клика по метке мантиссы
const mantissaLabelVAX = document.getElementById("mantissa-vax");
mantissaLabelVAX.addEventListener('click', function() {
    const inputValue = parseFloat(document.getElementById('vaxx').value);
    animateVAXMantissaChange(inputValue);
});

// Создаем элемент шага с анимационными стилями
function createStepElement1(stepText) {
    const step = document.createElement('div');
    step.classList.add('animation-color');
    step.innerHTML = stepText;
    return step;
}

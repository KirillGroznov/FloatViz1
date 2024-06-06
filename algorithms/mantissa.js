let isMantissaAnimationRunning = false;
let initialMantissaValue = ''; // Переменная для хранения начального значения мантиссы

function animateMantissaChange(inputValue) {
    if (isMantissaAnimationRunning) {
        return;
    }

    // Сохраняем начальное значение мантиссы перед запуском анимации
    initialMantissaValue = document.getElementById("mantissa-output").innerHTML;

    isMantissaAnimationRunning = true;
    const mantissaOutputElement = document.getElementById("mantissa-output");
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

        // Шаг 2: Нормализация числа
        const step2 = createStepElement2('Шаг 2: Нормализация числа');
        mantissaOutputElement.appendChild(step2);
        setTimeout(() => {
            const binary = Math.abs(inputValue).toString(2); // Преобразуем число в двоичную форму
            step2.innerHTML += `<br>Число: ${inputValue} → Двоичный формат: ${binary}`;

            // Нормализация числа
            const normalizedBinary = binary.indexOf('.') === -1 ? binary : binary.replace('.', ''); // Убираем точку (если есть)
            let exponent = calculateExponent(inputValue);

            // Находим позицию первой значащей цифры
            let firstSignificantDigitIndex = 0;
            for (let i = 0; i < normalizedBinary.length; i++) {
                if (normalizedBinary[i] !== '0') {
                    firstSignificantDigitIndex = i;
                    break;
                }
            }
            // Показываем число в нормализованном виде с указанием сдвига десятичной точки
            const shiftedComma = exponent >= 0 ? normalizedBinary.substring(firstSignificantDigitIndex, firstSignificantDigitIndex + 1) + ',' + normalizedBinary.substring(firstSignificantDigitIndex + 1) :
                normalizedBinary.substring(firstSignificantDigitIndex, firstSignificantDigitIndex + 1) + '.' + normalizedBinary.substring(firstSignificantDigitIndex + 1, Math.abs(exponent) + firstSignificantDigitIndex + 1);
            const normalizedNumber = `${shiftedComma} * 2^(сдвинуто число на ${Math.abs(exponent)} разрядов)`;
            step2.innerHTML += `<br>При нормализации числа для представления в формате с плавающей запятой, мы представляем его в виде 1,xxx * 2^n. Это делается для того, чтобы получить нормализованную форму числа, где n является экспонентой.<br>Нормализация числа: ${normalizedNumber}`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как экспонента положительная (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как экспонента отрицательная (${exponent}), десятичная точка сдвигается вправо.`;
            }

            const step3 = createStepElement2('Шаг 3: Определение мантиссы');
            mantissaOutputElement.appendChild(step3);
            setTimeout(() => {
                const mantissa = calculateMantissa(inputValue); // Вычисляем мантиссу

                // Выводим полученную мантиссу
                step3.innerHTML += `<br>Мантисса: ${mantissa}<br>Оставляем все после запятой`;

                setTimeout(() => {
                    // Восстанавливаем начальное значение мантиссы
                    mantissaOutputElement.innerHTML = initialMantissaValue;
                    mantissaOutputElement.style.backgroundColor = "";
                    mantissaOutputElement.style.color = "";
                    mantissaOutputElement.style.transition = "";
                    isMantissaAnimationRunning = false;
                }, 3500);
            }, 3500);
        }, 3500);
    }, 3500);
}

function calculateMantissa(number) {
    const binary = Math.abs(number).toString(2);
    const normalizedBinary = normalizeBinary(binary);
    let mantissa;
    if (normalizedBinary.indexOf('.') === -1) {
        mantissa = normalizedBinary.substring(1); // Если нет дробной части, берем все биты после первой единицы
    } else {
        mantissa = normalizedBinary.split('.')[1]; // Берем только дробную часть
    }
    return mantissa.padEnd(23, '0').slice(0, 23); // Убеждаемся, что мантисса имеет длину 23 бита
}

// Функция для нормализации двоичного числа
function normalizeBinary(binary) {
    if (binary.indexOf('.') === -1) {
        return binary + ''; // Если нет десятичной точки, добавляем её и ноль
    }

    const [integerPart, fractionalPart] = binary.split('.');

    // Удаляем лидирующие нули и конкатенируем целую и дробную части
    const normalized = integerPart.replace(/^0+/, '') + fractionalPart;

    // Определяем позицию первой единицы после удаления лидирующих нулей
    const firstOneIndex = normalized.indexOf('1');

    // Возвращаем число с точкой перед первой значащей единицей
    return '1' + normalized.slice(firstOneIndex + 1);
}

// Обработчик клика по метке мантиссы
const mantissaLabel = document.querySelector('.mantissa-label');
mantissaLabel.addEventListener('click', function() {
    const inputValue = parseFloat(document.querySelector('.number-input').value);
    animateMantissaChange(inputValue);
});

// Создаем элемент шага с анимационными стилями
function createStepElement2(stepText) {
    const step = document.createElement('div');
    step.classList.add('animation-color');
    step.innerHTML = stepText;
    return step;
}

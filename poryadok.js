let isExponentAnimationRunning = false;
let initialExponentValue = ''; // Переменная для хранения начального значения порядка

function animateExponentChange(inputValue) {
    if (isExponentAnimationRunning) {
        return;
    }

    // Сохраняем начальное значение порядка перед запуском анимации
    initialExponentValue = document.getElementById("exponent-output").innerHTML;

    isExponentAnimationRunning = true;
    const exponentOutputElement = document.getElementById("exponent-output");
    exponentOutputElement.innerHTML = '';
    exponentOutputElement.style.transition = "background-color 0.5s, color 0.5s";
    exponentOutputElement.style.color = "white";

    const step1 = createStepElement('Шаг 1: Преобразование числа в двоичный формат');
    exponentOutputElement.appendChild(step1);
    setTimeout(() => {
        const binarySteps = convertToBinarySteps(inputValue);
        let binaryDetail = `<br>Число: ${inputValue} → Двоичный формат: <br>`;
        binarySteps.forEach(step => {
            binaryDetail += `${step}<br>`;
        });
        step1.innerHTML += binaryDetail;

        // Шаг 2: Нормализация числа
        const step2 = createStepElement('Шаг 2: Нормализация числа');
        exponentOutputElement.appendChild(step2);
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
            step2.innerHTML += `<br>При нормализации числа для представления в формате с плавающей запятой, мы представляем его в виде 1,xxx * 2^n(в формате IEEE запятая в мантиссе фиксируется после старшей единицы). Это делается для того, чтобы получить нормализованную форму числа, где n является экспонентой.<br>Нормализация числа: ${normalizedNumber}`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как экспонента положительная (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как экспонента отрицательная (${exponent}), десятичная точка сдвигается вправо.`;
            }

            const step3 = createStepElement('Шаг 3: Вычисление экспоненты');
            exponentOutputElement.appendChild(step3);
            setTimeout(() => {
                let exponent = calculateExponent(Math.abs(inputValue));
                step3.innerHTML += `<br>Вычисление экспоненты: n = ${exponent}`;

                const step4 = createStepElement('Шаг 4: Смещение экспоненты');
                exponentOutputElement.appendChild(step4);
                setTimeout(() => {
                    let shiftedExponent = exponent + 127;
                    step4.innerHTML += `<br>Величина смещения в формате IEEE равна 127<br>Смещение экспоненты: ${exponent} + 127 = ${shiftedExponent}`;

                    const step5 = createStepElement('Шаг 5: Преобразование экспоненты в двоичное представление');
                    exponentOutputElement.appendChild(step5);
                    setTimeout(() => {
                        const binarySteps = convertToBinarySteps(shiftedExponent);
                        let binaryDetail = `<br>Число: ${shiftedExponent} → Двоичный формат: <br>`;
                        binarySteps.forEach(step => {
                            binaryDetail += `${step}<br>`;
                        });
                        step5.innerHTML += binaryDetail;
                        // Пояснение про порядок
                        if (exponent >= 0) {
                            step5.innerHTML += `Для чисел с положительным порядком ничего не меняется`;
                        } else {
                            step5.innerHTML += `Для чисел с отрицательным порядком, значение смещённого порядка будет представлять собой число, полученное из обратного кода от исходной экспоненты с одним дополнительным правилом: старший (самый левый) разряд в этом смещённом порядке всегда равен 0.`;
                        }
                        setTimeout(() => {
                            // Восстанавливаем начальное значение порядка
                            exponentOutputElement.innerHTML = initialExponentValue;
                            exponentOutputElement.style.backgroundColor = "";
                            exponentOutputElement.style.color = "";
                            exponentOutputElement.style.transition = "";
                            isExponentAnimationRunning = false;
                        }, 4000);
                    }, 4000);
                }, 3500);
            }, 3500);
        }, 3500);
    }, 3500);
}

function createStepElement(stepText) {
    const step = document.createElement('div');
    step.classList.add('step-animation');
    step.innerHTML = stepText;
    return step;
}

const exponentLabel = document.querySelector('.exponent-label');
exponentLabel.addEventListener('click', function() {
    const inputValue = parseFloat(document.querySelector('.number-input').value);
    animateExponentChange(inputValue); // Используем inputValue вместо вычисления экспоненты
});

function calculateExponent(number) {
    if (number === 0) return -127; // Если число равно 0, возвращаем -127
    return Math.floor(Math.log2(number)); // Возвращаем экспоненту числа в формате с плавающей запятой
}

function convertToBinarySteps(number) {
    let integerPart = Math.floor(Math.abs(number));
    let fractionalPart = Math.abs(number) - integerPart;
    let steps = [];

    // Преобразование целой части
    let integerBinary = '';
    if (integerPart === 0) {
        integerBinary = '0';
    } else {
        let originalIntegerPart = integerPart; // Сохраняем исходное значение для отображения в шагах
        while (integerPart > 0) {
            let remainder = integerPart % 2;
            steps.push(`Целая часть: ${integerPart} / 2 = ${Math.floor(integerPart / 2)}, остаток = ${remainder}`);
            integerBinary = remainder + integerBinary;
            integerPart = Math.floor(integerPart / 2);
        }
    }

    // Преобразование дробной части
    let fractionalBinary = '';
    if (fractionalPart > 0) {
        fractionalBinary = '.';
        while (fractionalPart > 0) {
            fractionalPart *= 2;
            let bit = Math.floor(fractionalPart);
            steps.push(`Дробная часть: умножаем на 2 = ${fractionalPart}, бит = ${bit}`);
            fractionalBinary += bit;
            fractionalPart -= bit;
        }
    }

    steps.push(`Итоговое двоичное представление (для целой части пишем снизу вверх, для дробной наоборот): ${integerBinary}${fractionalBinary}`);
    return steps;
}

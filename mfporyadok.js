let isMFExponentAnimationRunning = false;
let initialMFExponentValue = ''; // Переменная для хранения начального значения порядка

function animateMFExponentChange(inputValue) {
    if (isMFExponentAnimationRunning) {
        return;
    }

    // Сохраняем начальное значение порядка перед запуском анимации
    initialMFExponentValue = document.getElementById("exponent-mf").innerHTML;

    isMFExponentAnimationRunning = true;
    const exponentOutputElement = document.getElementById("exponent-mf");
    exponentOutputElement.innerHTML = '';
    exponentOutputElement.style.transition = "background-color 0.5s, color 0.5s";
    exponentOutputElement.style.color = "white";

    // Шаг 1: Преобразование числа в шестнадцатеричный формат
    const step1 = createStepElement('Шаг 1: Преобразование числа в шестнадцатеричный формат');
    exponentOutputElement.appendChild(step1);
    setTimeout(() => {
        const hexadecimal = convertToHexadecimalSteps(inputValue); // Преобразуем число в шестнадцатеричный формат
        let binaryDetail = `<br>Число: ${inputValue} → Шестнадцатеричный формат: <br>`;
        hexadecimal.forEach(step => {
            binaryDetail += `${step}<br>`;
        });
        step1.innerHTML += binaryDetail;

        // Шаг 2: Нормализация числа
        const step2 = createStepElement('Шаг 2: Нормализация числа');
        exponentOutputElement.appendChild(step2);
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
            step2.innerHTML += `<br>Для определения мантиссы и порядка производится перемещение запятой в шестнадцатеричном числе влево или вправо таким образом, чтобы она установилась перед старшей значащей цифрой. Это делается для того, чтобы получить нормализованную форму числа, где n является экспонентой.<br>Нормализация числа: ${normalizedNumber}`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как экспонента положительная (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как экспонента отрицательная (${exponent}), десятичная точка сдвигается вправо.`;
            }

            // Шаг 3: Вычисление экспоненты
            const step3 = createStepElement('Шаг 3: Вычисление экспоненты');
            exponentOutputElement.appendChild(step3);
            setTimeout(() => {
                let exponent = calculateMFExponent(Math.abs(inputValue)) + 1; // Добавляем 1 к экспоненте
                step3.innerHTML += `<br>Вычисление экспоненты: n = ${exponent}`;

                // Шаг 4: Смещение экспоненты
                const step4 = createStepElement('Шаг 4: Смещение экспоненты');
                exponentOutputElement.appendChild(step4);
                setTimeout(() => {
                    let shiftedExponent = exponent + 64; // Для MF смещение +64
                    step4.innerHTML += `<br>Величина смещения в формате MF равна 64<br>Смещение экспоненты: ${exponent} + 64 = ${shiftedExponent}`;

                    // Шаг 5: Преобразование экспоненты в двоичное представление
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
                            exponentOutputElement.innerHTML = initialMFExponentValue;
                            exponentOutputElement.style.backgroundColor = "";
                            exponentOutputElement.style.color = "";
                            exponentOutputElement.style.transition = "";
                            isMFExponentAnimationRunning = false;
                        }, 4000);
                    }, 4000);
                }, 3500);
            }, 3500);
        }, 3500);
    }, 3500);
}

// Получаем элемент метки "Порядок" для формата MF
const exponentOutputElementMF = document.getElementById("exponent-mf");

// Добавляем слушатель события клика к значению порядка для формата MF
exponentOutputElementMF.addEventListener('click', function() {
    // Получаем текущее значение числа из поля ввода для формата MF
    const inputValueMF = parseFloat(document.getElementById('mff').value);
    // Вызываем функцию анимации изменения порядка для формата MF
    animateMFExponentChange(inputValueMF);
});

function createStepElement(stepText) {
    const step = document.createElement('div');
    step.classList.add('step-animation');
    step.innerHTML = stepText;
    return step;
}

function calculateMFExponent(number) {
    if (number === 0) return -64; // Если число равно 0, возвращаем -64
    return Math.floor(Math.log(number) / Math.log(16)); // Возвращаем экспоненту числа в формате MF
}
function convertToHexadecimalSteps(number) {
    let integerPart = Math.floor(Math.abs(number));
    let fractionalPart = Math.abs(number) - integerPart;
    let steps = [];

    // Преобразование целой части
    let integerHexadecimal = '';
    if (integerPart === 0) {
        integerHexadecimal = '0';
    } else {
        let originalIntegerPart = integerPart; // Сохраняем исходное значение для отображения в шагах
        while (integerPart > 0) {
            let remainder = integerPart % 16;
            let hexDigit;
            if (remainder < 10) {
                hexDigit = remainder.toString();
            } else {
                // Для цифр от 10 до 15 используем буквы A-F
                hexDigit = String.fromCharCode(65 + remainder - 10);
            }
            steps.push(`Целая часть: ${integerPart} / 16 = ${Math.floor(integerPart / 16)}, остаток = ${hexDigit}`);
            integerHexadecimal = hexDigit + integerHexadecimal;
            integerPart = Math.floor(integerPart / 16);
        }
    }

    // Преобразование дробной части
    let fractionalHexadecimal = '';
    if (fractionalPart > 0) {
        fractionalHexadecimal = '.';
        let maxFractionalDigits = 8; // Максимальное количество знаков после запятой
        while (fractionalPart > 0 && fractionalHexadecimal.length <= maxFractionalDigits) {
            fractionalPart *= 16;
            let hexDigit = Math.floor(fractionalPart);
            if (hexDigit < 10) {
                fractionalHexadecimal += hexDigit;
            } else {
                fractionalHexadecimal += String.fromCharCode(65 + hexDigit - 10);
            }
            steps.push(`Дробная часть: умножаем на 16 = ${fractionalPart}, знак = ${hexDigit}`);
            fractionalPart -= hexDigit;
        }
    }

    steps.push(`Итоговое шестнадцатеричное представление: ${integerHexadecimal}${fractionalHexadecimal}`);
    return steps;
}

let isExponentAnimationRunning = false; // Флаг, указывающий, выполняется ли анимация изменения порядка
let initialExponentValue = ''; // Переменная для хранения начального значения порядка

function animateExponentChange(inputValue) {
    // Проверка, выполняется ли уже анимация
    if (isExponentAnimationRunning) {
        return; // Если да, прекращаем выполнение функции
    }

    // Сохраняем начальное значение порядка перед запуском анимации
    initialExponentValue = document.getElementById("exponent-output").innerHTML;

    // Устанавливаем флаг, что анимация начата
    isExponentAnimationRunning = true;

    const exponentOutputElement = document.getElementById("exponent-output");
    exponentOutputElement.innerHTML = ''; // Очищаем содержимое элемента вывода порядка
    exponentOutputElement.style.transition = "background-color 0.5s, color 0.5s"; // Добавляем плавный переход
    exponentOutputElement.style.color = "white"; // Устанавливаем белый цвет текста

    // Создаем элемент шага для отображения прогресса
    const step1 = createStepElement('Шаг 1: Преобразование числа в двоичный формат');
    exponentOutputElement.appendChild(step1);

    // Ожидаем некоторое время перед отображением шага
    setTimeout(() => {
        // Преобразуем число в двоичный формат и отображаем результат
        const binarySteps = convertToBinarySteps(inputValue);
        let binaryDetail = `<br>Число: ${inputValue} → Двоичный формат: <br>`;
        binarySteps.forEach(step => {
            binaryDetail += `${step}<br>`;
        });
        step1.innerHTML += binaryDetail; // Добавляем подробности преобразования в элемент шага


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
            step2.innerHTML += `<br>При нормализации числа для представления в формате с плавающей запятой, мы представляем его в виде 1,xxx * 2^n(в формате IEEE запятая в мантиссе фиксируется после старшей единицы). Это делается для того, чтобы получить нормализованную форму числа, где n является порядком.<br>Нормализация числа: ${normalizedNumber}`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как порядок положительный (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как порядок отрицательный (${exponent}), десятичная точка сдвигается вправо.`;
            }

            // Создание элемента шага для вычисления экспоненты
            const step3 = createStepElement('Шаг 3: Вычисление порядка');
            exponentOutputElement.appendChild(step3);
            // Ожидание некоторого времени перед выполнением вычисления экспоненты
            setTimeout(() => {
                // Вычисление экспоненты числа
                let exponent = calculateExponent(Math.abs(inputValue));
                // Добавление результатов вычисления в элемент шага
                step3.innerHTML += `<br>Вычисление порядка: n = ${exponent}`;

                // Создание элемента шага для смещения экспоненты
                const step4 = createStepElement('Шаг 4: Смещение порядка');
                exponentOutputElement.appendChild(step4);
                // Ожидание некоторого времени перед выполнением смещения экспоненты
                setTimeout(() => {
                    // Вычисление смещенной экспоненты
                    let shiftedExponent = exponent + 127;
                    // Добавление результатов смещения в элемент шага
                    step4.innerHTML += `<br>Величина смещения в формате IEEE равна 127<br>Смещение порядка: ${exponent} + 127 = ${shiftedExponent}`;

                    // Создание элемента шага для преобразования экспоненты в двоичное представление
                    const step5 = createStepElement('Шаг 5: Преобразование порядка в двоичное представление');
                    exponentOutputElement.appendChild(step5);
                    // Ожидание некоторого времени перед выполнением преобразования экспоненты
                    setTimeout(() => {
                        // Преобразование смещенной экспоненты в двоичный формат
                        const binarySteps = convertToBinarySteps(shiftedExponent);
                        let binaryDetail = `<br>Число: ${shiftedExponent} → Двоичный формат: <br>`;
                        binarySteps.forEach(step => {
                            binaryDetail += `${step}<br>`;
                        });
                        step5.innerHTML += binaryDetail; // Добавление подробностей преобразования в элемент шага
                        // Пояснение про порядок в зависимости от значения экспоненты
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

// Функция для создания элемента шага с анимацией
function createStepElement(stepText) {
    const step = document.createElement('div'); // Создаем новый элемент div
    step.classList.add('step-animation'); // Добавляем ему класс для анимации
    step.innerHTML = stepText; // Устанавливаем текст шага внутри элемента
    return step; // Возвращаем созданный элемент
}

// Получаем метку порядка для кликабельности
const exponentLabel = document.querySelector('.exponent-label');
// Добавляем слушатель события клика к метке порядка
exponentLabel.addEventListener('click', function() {
    // Получаем текущее значение числа из поля ввода
    const inputValue = parseFloat(document.querySelector('.number-input').value);
    animateExponentChange(inputValue); // Запускаем анимацию изменения экспоненты
});

// Функция для вычисления экспоненты числа в формате с плавающей запятой
function calculateExponent(number) {
    if (number === 0) return -127; // Если число равно 0, возвращаем -127
    return Math.floor(Math.log2(number)); // Вычисляем экспоненту числа в формате с плавающей запятой
}

// Функция для преобразования числа в двоичное представление с шагами
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

    // Формирование окончательного двоичного представления числа с шагами
    steps.push(`Итоговое двоичное представление (для целой части пишем снизу вверх, для дробной наоборот): ${integerBinary}${fractionalBinary}`);
    return steps;
}

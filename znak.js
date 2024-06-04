// Флаг, указывающий, выполняется ли анимация в данный момент
let isAnimationRunning = false;

// Функция для анимации изменения значения знака числа
function animateSignChange(newSign) {
    // Проверяем, выполняется ли уже анимация
    if (isAnimationRunning) {
        return; // Если да, прекращаем выполнение функции
    }

    // Устанавливаем флаг, что анимация начата
    isAnimationRunning = true;

    const signOutputElement = document.getElementById("sign-output");
    // Изменяем цвет и фон элемента для анимации
    signOutputElement.style.transition = "background-color 0.5s, color 0.5s"; // Добавляем плавный переход
    signOutputElement.style.backgroundColor = "orange";
    signOutputElement.style.color = "white";

    // Создаем элементы для анимации сравнения с нулем
    const comparisonAnimation = document.createElement('div');
    comparisonAnimation.classList.add('comparison-animation');
    comparisonAnimation.innerHTML = 'Сравниваем введенное число с 0';
    const zeroAnimation = document.createElement('div');
    zeroAnimation.classList.add('zero-animation');

    // Добавляем анимацию сравнения с нулем
    signOutputElement.appendChild(comparisonAnimation);
    signOutputElement.appendChild(zeroAnimation);

    // Ждем некоторое время для анимации
    setTimeout(function() {
        // Плавно меняем цвет в соответствии с полученным значением знака
        if (newSign === "0") {
            zeroAnimation.style.backgroundColor = "green";
            comparisonAnimation.innerHTML = 'Число больше 0, знак = 0';
        } else {
            zeroAnimation.style.backgroundColor = "red";
            comparisonAnimation.innerHTML = 'Число меньше 0, знак = 1';
        }
    }, 2500);

    // Ждем некоторое время перед обновлением значения знака
    setTimeout(function() {
        // Удаляем анимации после завершения
        signOutputElement.removeChild(comparisonAnimation);
        signOutputElement.removeChild(zeroAnimation);
        // Обновляем значение знака
        signOutputElement.innerHTML = `<div class="bit sign">${newSign}</div>`;
        // Возвращаем изначальные стили через короткое время
        setTimeout(function() {
            signOutputElement.style.backgroundColor = "";
            signOutputElement.style.color = "";
            signOutputElement.style.transition = ""; // Сбрасываем переход
            // Снимаем флаг, что анимация завершена
            isAnimationRunning = false;
        }, 1);
    }, 4500);
}

// Получаем элемент метки "Знак"
const signLabel = document.querySelector('.sign-label');


// Добавляем слушатель события клика
signLabel.addEventListener('click', function() {
    // Получаем текущее значение числа из поля ввода
    const inputValue = parseFloat(document.querySelector('.number-input').value);
    // Определяем значение знака числа
    const sign = inputValue >= 0 ? "0" : "1";
    // Отображаем анимацию изменения значения знака
    animateSignChange(sign);
});





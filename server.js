// Подключаем модуль Express для создания веб-приложения
const express = require('express');
// Подключаем модуль path для работы с путями к файлам
const path = require('path');
// Создаем экземпляр приложения Express
const app = express();
// Указываем порт, на котором будет работать сервер
const port = 3000;

// Устанавливаем middleware для обслуживания статических файлов из текущего каталога
app.use(express.static(path.join(__dirname)));

// Настраиваем маршрут для обработки запросов к корневому URL ('/')
app.get('/', (req, res) => {
    // Отправляем файл index.html в ответ на запрос к корневому URL
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запускаем сервер на указанном порту
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

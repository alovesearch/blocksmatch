const colors = [];
const numberOfColors = 20;
const boardSize = 10;
const totalBlocks = boardSize * boardSize; 
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
let selectedBlock = null; 
let highlightedBlocks = []; // Хранит общее количество выделенных блоков

// Функция для генерации случайного цвета
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// Генерация цветов блоков
for (let i = 0; i < numberOfColors; i++) {
    colors.push(getRandomColor());
}

// Создание массива для определения количества блоков каждого цвета
let blockCounts = colors.reduce((acc, color) => {
    acc[color] = 2; // Установлено значение по умолчанию 2
    return acc;
}, {});

// Случайное распределение количества цветных блоков
function distributeBlocks() {
    let totalAvailableBlocks = totalBlocks; // Общее количество блоков, которые нужно распределить

    while (true) {
        // Подсчитываем текущее общее количество блоков
        const currentTotal = Object.values(blockCounts).reduce((sum, count) => sum + count, 0);
        
        // Проверяем, достигнуто ли общее количество
        if (currentTotal >= totalAvailableBlocks) {
            break; // Если общее количество достигнуто, выходим из цикла
        }

        // Выбираем случайный цвет
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // Увеличиваем значение блока на 2
        blockCounts[randomColor] += 2; 
    }
}

// Генерация блоков
function generateBlocks() {
    distributeBlocks(); // Распределение блоков по количеству

    let pairs = []; // массив блоков

    // Формируем массив блоков на основе количества
    for (const color in blockCounts) {
        for (let i = 0; i < blockCounts[color]; i++) {
            pairs.push(color); // добавляем цвет в массив заданное количество раз
        }
    }

    // Перемешивание блоков
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]]; // перемешивание
    }

    // Заполнение доски
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (pairs.length > 0) {
                board[i][j] = pairs.pop(); // берём последний элемент из массива блоков
            }
        }
    }
}

// Вызов функции для генерации блоков
generateBlocks();

// Обновление игрового поля
function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            if (board[i][j]) {
                let block = document.createElement('div');
                block.className = 'block';
                block.style.backgroundColor = board[i][j];
                block.onclick = () => handleBlockClick(i, j, block);
                cell.appendChild(block);
            }
            boardElement.appendChild(cell);
        }
    }
}











// Перемещение блока по свайпу
function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleTouchMove(event) {
    if (!selectedBlock) return; // Если блок не выбран, ничего не делать

    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    let targetX = selectedBlock.x;
    let targetY = selectedBlock.y;

    // Выполнение сдвига блока
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Горизонтальное перемещение
        if (deltaX > 0) {
            // Вправо
            while (targetY + 1 < boardSize && !board[targetX][targetY + 1]) {
                targetY++; // Двигаемся вправо, пока ячейки свободны
            }
        } else {
            // Влево
            while (targetY - 1 >= 0 && !board[targetX][targetY - 1]) {
                targetY--; // Двигаемся влево, пока ячейки свободны
            }
        }
    } else {
        // Вертикальное перемещение
        if (deltaY > 0) {
            // Вниз
            while (targetX + 1 < boardSize && !board[targetX + 1][targetY]) {
                targetX++; // Двигаемся вниз, пока ячейки свободны
            }
        } else {
            // Вверх
            while (targetX - 1 >= 0 && !board[targetX - 1][targetY]) {
                targetX--; // Двигаемся вверх, пока ячейки свободны
            }
        }
    }

    // Перемещение блока до целевой ячейки
    moveBlock(selectedBlock.x, selectedBlock.y, targetX, targetY);
    updateBoard(); // Обновление игрового поля после перемещения
}

function handleTouchEnd() {
    // Сброс данных после завершения свайпа
    selectedBlock = null;
}

// Вызов событий
const boardElement = document.getElementById('board');
boardElement.addEventListener('touchstart', handleTouchStart);
boardElement.addEventListener('touchmove', handleTouchMove);
boardElement.addEventListener('touchend', handleTouchEnd);

// Функция перемещения блока
function moveBlock(fromX, fromY, toX, toY) {
    // Проверка на границы и наличие пустой ячейки
    if (toX < 0 || toX >= boardSize || toY < 0 || toY >= boardSize || board[toX][toY]) {
        return false; // Если ячейка не пустая или за границами, перемещение невозможно
    }
    // Перемещение блока
    board[toX][toY] = board[fromX][fromY];
    board[fromX][fromY] = null; // Очищаем исходную ячейку
    return true; // Возвращаем успех
}

// Проверка на допустимость перемещения
function isMoveValid(origX, origY, targetX, targetY) {
    // Здесь должна быть логика проверки пути между ячейками
    // Примерно так:
    const deltaX = Math.abs(targetX - origX);
    const deltaY = Math.abs(targetY - origY);
    
    if (deltaX > 1 || deltaY > 1) return false; // Можно двигаться только на одну ячейку

    // Проверка на наличие пустых ячеек на пути
    for (let i = Math.min(origX, targetX); i <= Math.max(origX, targetX); i++) {
        for (let j = Math.min(origY, targetY); j <= Math.max(origY, targetY); j++) {
            if (board[i][j] === null) {
                return false;
            }
        }
    }

    return true;
}

// Возврат блока на изначальное место
function returnBlockToOriginalPosition(selectedBlock) {
    const { x: origX, y: origY } = selectedBlock;

    // Возвращаем цвет блока в изначальную позицию
    board[origX][origY] = selectedBlock.color;
    selectedBlock = null; // Сбрасываем выбранный блок
}











// Обработка нажатия на блок
function handleBlockClick(x, y, blockElem) {
    
    const color = board[x][y];
    if (!color) return;

    // Условие для другого блока
    if (highlightedBlocks.length > 0 && !highlightedBlocks.includes(`${x}-${y}`)) {
        deselectBlocks(); // Отмена выделения, если выбран другой блок
        selectedBlock = null; // Обнуляем выбранный блок
        return; // Завершаем выполнение функции
    }

    if (!selectedBlock) {
        // Первый выбор блока
        selectedBlock = { x, y, color };
        const matchedBlocks = findMatchingBlocks(x, y, color);

        // Если совпадений нет, выделяем все блоки того же цвета
        if (matchedBlocks.length === 0) {
            highlightAllBlocksOfColor(color);
            animateBlockColor(blockElem, color);
        } else if (matchedBlocks.length === 1) {
            // Удаляем пару, если только один совпадающий блок
            removeMatchingBlocks(selectedBlock, matchedBlocks[0]);
            deselectBlocks();
        } else {
            // Затемняем все совпадающие блоки, чтобы дать выбор
            darkenMatchedBlocks(matchedBlocks);
        }

    } else {
        // Удаляем пару, если было нажатие на слегка затемнённый блок
        if (highlightedBlocks.includes(`${x}-${y}`)) {
            removeMatchingBlocks(selectedBlock, { x, y });
        }
        deselectBlocks();
        selectedBlock = null;
    }
}



// Поиск совпадающих блоков в направлении
function findMatchingBlocks(x, y, color) {
    let matchingBlocks = [];

    // Проверяем каждое направление отдельно
    const directions = [
        { dx: -1, dy: 0 }, // вверх
        { dx: 1, dy: 0 },  // вниз
        { dx: 0, dy: -1 }, // влево
        { dx: 0, dy: 1 }   // вправо
    ];

    directions.forEach(direction => {
        let step = 1; // Начальный шаг
        while (true) {
            const newX = x + direction.dx * step;
            const newY = y + direction.dy * step;

            // Проверка на выход за границы
            if (newX < 0 || newX >= boardSize || newY < 0 || newY >= boardSize) {
                break; // Выход за пределы
            }

            const cellColor = board[newX][newY];

            if (cellColor) {
                // Если ячейка не пустая
                if (cellColor === color) {
                    matchingBlocks.push({ x: newX, y: newY });
                }
                break; // Блок найден или не пустая ячейка, прекращаем проверку в этом направлении
            }
            // Инкремент шага, продолжаем проверку в данном направлении
            step++;
        }
    });

    return matchingBlocks;
}

        
// Плавная смена цвета блока на черный и обратно
function animateBlockColor(blockElem, originalColor) {
    blockElem.style.backgroundColor = 'black';
    setTimeout(() => {
        blockElem.style.transition = 'background-color 0.5s';
        blockElem.style.backgroundColor = originalColor; // Возвращаем исходный цвет
    }, 500); // Через 500мс возвращаем оригинальный цвет
}
        
        // Подсветить все блоки того же цвета
function highlightAllBlocksOfColor(color) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const blockElem = cell.firstChild;
        if (blockElem && blockElem.style.backgroundColor === color) {
            blockElem.classList.add('highlighted'); // Класс для выделения
            highlightedBlocks.push(blockElem.dataset.position); // Добавляем позицию блока в highlightedBlocks
        }
    });
}

// Снять выделение со всех блоков
function deselectBlocks() {
    highlightedBlocks.forEach(position => {
        const blockElem = document.querySelector(`.block[data-position="${position}"]`);
        if (blockElem) {
            blockElem.classList.remove('highlighted'); // Убираем выделение
        }
    });
    highlightedBlocks = []; // Очищаем массив выделенных блоков
}

        // Затемнение совпадающих блоков
function darkenMatchedBlocks(matchedBlocks, selectedColor) {
    // Сбрасываем выделение, если выбран другой блок
    if (highlightedBlocks.length > 0) {
        deselectBlocks(selectedColor);
    }
    // Подсветить все блоки того же цвета
function highlightAllBlocksOfColor(color) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const blockElem = cell.firstChild;
        if (blockElem && blockElem.style.backgroundColor === color) {
            // Затемняем блок и добавляем анимацию
            blockElem.classList.add('darkened');
            setTimeout(() => {
                blockElem.classList.remove('darkened'); // Убираем затемнение через определенное время
            }, 1000); // Время затемнения в миллисекундах
        }
    });
}

    matchedBlocks.forEach(block => {
        const cell = document.getElementsByClassName('cell')[block.x * boardSize + block.y];
        if (cell.firstChild) {
            const blockElem = cell.firstChild;
            blockElem.classList.add('darkened');
            highlightedBlocks.push(`${block.x}-${block.y}`); // Добавляем координаты блока в выделенные
            animateLightenBlock(blockElem, () => {
                blockElem.style.backgroundColor = shadeColor(blockElem.style.backgroundColor, -20); // Затемняем цвет
            });
        }
    });
}


        // Анимация осветления блока
          
        function animateLightenBlock(blockElem, callback) {
            const originalColor = blockElem.style.backgroundColor;
            blockElem.style.backgroundColor = 'yellow'; // Осветляем цвет (пример)
            setTimeout(() => {
                blockElem.style.transition = 'background-color 0.5s';
                callback(); // Затемняем цвет после осветления
                blockElem.style.backgroundColor = originalColor; // Возвращаем оригинальный цвет
            }, 500);
        }

        // Функция затемнения цвета
function shadeColor(color, percent) {
    // Проверяем, что цвет в формате 'rgb(r, g, b)'
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+)?\)/);
    
    if (!rgbMatch) return color; // Без изменений, если не удалось распарсить

    // Извлекаем значения r, g и b
    const [_, r, g, b] = rgbMatch.map(Number);
    
    const shade = Math.round((percent / 100) * 255);
    const newR = Math.max(0, Math.min(255, r + shade));
    const newG = Math.max(0, Math.min(255, g + shade));
    const newB = Math.max(0, Math.min(255, b + shade));
    
    // Возвращаем новый цвет в формате rgb
    return `rgb(${newR}, ${newG}, ${newB})`;
}

        // Удаление совпадающих блоков
function removeMatchingBlocks(selected, matched) {
    board[selected.x][selected.y] = null;
    board[matched.x][matched.y] = null;
    updateBoard();
}

        // Сброс подсветки и затемнения
function deselectBlocks(selectedColor) {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        const blockElem = cells[i].firstChild;
        if (blockElem) {
            // Проверяем, если цвет блока совпадает с выбранным цветом
            if (blockElem.style.backgroundColor === selectedColor) {
                blockElem.classList.remove('darkened'); // Убираем затемнение
            }
        }
    }
    highlightedBlocks = []; // Очищаем список выделенных блоков
}

// Проверить, являются ли блоки парой по заданной координате
function checkPair(cell, color, visited) {
    const [row, col] = cell;
    const cells = document.querySelectorAll('.cell');
    const boardSize = Math.sqrt(cells.length);

    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return false; // Выход за пределы
    }

    const currentCell = cells[row * boardSize + col];
    const blockElem = currentCell.firstChild;

    // Проверяем, была ли эта ячейка уже посещена
    if (visited.has(currentCell)) {
        return false; // Уже посещённая ячейка
    }

    // Проверяем, если ячейка не пустая
    if (blockElem) {
        // Если ячейка не пустая, проверяем цвет
        if (blockElem.style.backgroundColor === color) {
            visited.add(currentCell); // Добавляем в посещенные
            return true; // Найдена парная ячейка
        }
        return false; // Не тот цвет
    }

    // Вводим направление
    const directions = [
        { dr: -1, dc: 0 }, // вверх
        { dr: 1, dc: 0 },  // вниз
        { dr: 0, dc: -1 }, // влево
        { dr: 0, dc: 1 }   // вправо
    ];

    // Проверяем каждое направление независимо
    for (const direction of directions) {
        const { dr, dc } = direction;

        for (let step = 1; step < boardSize; step++) {
            const newRow = row + dr * step;
            const newCol = col + dc * step;

            // Проверка на выход за границы
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
                break; // Выход за пределы
            }

            const nextCell = [newRow, newCol];

            if (checkPair(nextCell, color, visited)) {
                return true; // Если парный блок найден
            }
        }
    }

    return false; // Пара не найдена
}

// Удаление пар блоков
function removePairs(color) {
    const cells = document.querySelectorAll('.cell');
    const visited = new Set();

    cells.forEach((cell, index) => {
        const blockElem = cell.firstChild;

        if (blockElem && blockElem.style.backgroundColor === color && !visited.has(cell)) {
            // Проверяем, есть ли пара
            if (checkPair([Math.floor(index / Math.sqrt(cells.length)), index % Math.sqrt(cells.length)], color, visited)) {
                // Удаляем блоки
                blockElem.remove(); // Удаляем блок
                visited.add(cell);
            }
        }
    });
}

// Пример вызова функции удаления пар
removePairs('ваш_цвет'); // Замените 'ваш_цвет' на нужный цвет

        // Инициализация игры
        function init() {
            generateBlocks();
            updateBoard();
        }

        init();




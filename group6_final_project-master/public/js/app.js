console.log('This log comes from public/js/app.js  🎉');

document.addEventListener("turbo:load", () => {
    const alerts = document.querySelectorAll(".alert");

    alerts.forEach((alert) => {
        setTimeout(() => {
            alert.classList.add("fade-out");
        setTimeout(() => {
                alert.remove();
            }, 500);
        }, 5000);
    });
});


// ===============================================

function initFileInput() {
    const fileInput = document.querySelector('.custom-file-input');
    const fileName = document.querySelector('.file-name');

    if (fileInput && fileName) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileName.textContent = fileInput.files[0].name;
            } else {
                fileName.textContent = 'No File Chosen';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initFileInput);
document.addEventListener('turbo:load', initFileInput);


// ================= adding illumination type button by creating recipe start ===================

function activateRecipeTypeButtons() {
    const recipeTypeButtons = document.querySelectorAll('.recipe-types label.btn');
    const form = document.querySelector('form');

    if (!recipeTypeButtons || !form) return;

    recipeTypeButtons.forEach(button => {
        const input = button.querySelector('input[type="radio"]');

        if (input.checked) {
            button.classList.add('active');
        }

        input.addEventListener('change', () => {
            recipeTypeButtons.forEach(b => b.classList.remove('active'));
            if (input.checked) {
                button.classList.add('active');
            }
        });
    });

    form.addEventListener('submit', () => {
        recipeTypeButtons.forEach(button => button.classList.remove('active'));
    });
}

document.addEventListener('DOMContentLoaded', activateRecipeTypeButtons);
document.addEventListener('turbo:render', activateRecipeTypeButtons);
document.addEventListener('turbo:load', activateRecipeTypeButtons);


// ================= adding illumination type button by creating recipe end ===================

// ================= adding ingredients start ===================

function activateIngredientManagement() {
    const input = document.getElementById('recipe_ingredients'); // Поле вводу
    const ingredientsField = document.querySelector('input[name="recipe[ingredients]"]'); // Текстове поле для Symfony
    const list = document.getElementById('ingredients-list'); // Список інгредієнтів

    if (!input || !ingredientsField || !list) return; // Перевіряємо наявність елементів

    // Синхронізуємо поле з інгредієнтами, які вже є у списку при завантаженні
    syncExistingIngredients();

    // Додавання інгредієнта
    document.getElementById('add-ingredient').addEventListener('click', function () {
        const ingredient = input.value.trim();

        if (ingredient) {
            // Додаємо в список
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                ${ingredient}
                <button type="button" class="btn btn-danger btn-sm remove-ingredient">x</button>
            `;
            list.appendChild(li);

            // Оновлюємо текстове поле для Symfony
            updateIngredientsField();

            // Очищаємо поле вводу
            input.value = '';
        }
    });

    // Видалення інгредієнта
    list.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-ingredient')) {
            e.target.closest('li').remove();
            updateIngredientsField(); // Оновлюємо текстове поле після видалення
        }
    });

    // Оновлення текстового поля `recipe[ingredients]`
    function updateIngredientsField() {
        const ingredients = [];
        list.querySelectorAll('li').forEach(li => {
            const ingredientText = li.firstChild.textContent.trim(); // Отримуємо текст інгредієнта
            ingredients.push(ingredientText);
        });
        ingredientsField.value = ingredients.join(', '); // Форматуємо список через кому
    }

    // Синхронізуємо значення текстового поля з інгредієнтами зі списку
    function syncExistingIngredients() {
        const initialIngredients = ingredientsField.value.split(',').map(ingredient => ingredient.trim());
        initialIngredients.forEach(ingredient => {
            if (ingredient) {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `
                    ${ingredient}
                    <button type="button" class="btn btn-danger btn-sm remove-ingredient">Remove</button>
                `;
                list.appendChild(li);
            }
        });
        updateIngredientsField(); // Оновлюємо текстове поле після синхронізації
    }

    // Перевірка перед відправленням форми
    document.querySelector('form').addEventListener('submit', function (e) {
        updateIngredientsField(); // Оновлюємо поле перед відправленням форми

        if (!ingredientsField.value.trim()) {
            e.preventDefault(); // Зупиняємо відправку форми, якщо інгредієнти порожні
            alert('Please add at least one ingredient.');
        }
    });
}

// Активуємо функцію при завантаженні сторінки та навігації через Turbo
document.addEventListener('DOMContentLoaded', activateIngredientManagement);
document.addEventListener('turbo:render', activateIngredientManagement);
document.addEventListener('turbo:load', activateIngredientManagement);


// ================= adding ingredients end ===================



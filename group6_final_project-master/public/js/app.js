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

// function activateIngredientManagement() {
//     const input = document.getElementById('recipe_ingredients'); 
//     const ingredientsField = document.querySelector('input[name="recipe[ingredients]"]'); 
//     const list = document.getElementById('ingredients-list'); 

//     if (!input || !ingredientsField || !list) return; // Перевіряємо наявність елементів

//     list.innerHTML = ''; 

//     syncExistingIngredients();

//     document.getElementById('add-ingredient').addEventListener('click', handleAddIngredient);

//     list.addEventListener('click', handleListClick);

//     // Перевірка перед відправленням форми
//     document.querySelector('form').addEventListener('submit', handleFormSubmit);

//     function handleAddIngredient() {
//         const ingredient = input.value.trim();

//         if (ingredient) {            
//             addIngredientToList(ingredient);
//             updateIngredientsField();
//             input.value = '';
//         }
//     }

//     function handleListClick(e) {
//         if (e.target.classList.contains('remove-ingredient')) {
//             e.target.closest('li').remove();
//             updateIngredientsField(); 
//         }
//     }

//     function handleFormSubmit(e) {
//         updateIngredientsField(); 
    
//         const errorContainer = document.getElementById('ingredients-error');
    
//         if (!ingredientsField.value.trim()) {
//             e.preventDefault(); 
    
//             const ingredientsContainer = document.getElementById('ingredients-container');
//             ingredientsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
//             errorContainer.style.display = 'inline-block';
//             errorContainer.textContent = 'Please add at least one ingredient.';

//             setTimeout(() => {
//                 errorContainer.classList.add('fade-out'); 
//                 setTimeout(() => {
//                     errorContainer.style.display = 'none'; 
//                     errorContainer.classList.remove('fade-out'); 
//                 }, 500); 
//             }, 5000); 
//         } else {
//             errorContainer.style.display = 'none'; 
//         }
//     }
    
    
    

//     function addIngredientToList(ingredient) {
//         const existingItems = Array.from(list.querySelectorAll('li span.list-group-item__ingredient')).map(
//             span => span.textContent.trim()
//         );
//         if (existingItems.includes(ingredient)) return;

//         const li = document.createElement('li');
//         li.className = 'list-group-item';
//         li.innerHTML = `
//             <span class="list-group-item__ingredient">${ingredient}</span>
//             <button type="button" class="btn btn-danger btn-sm remove-ingredient">x</button>
//         `;
//         list.appendChild(li);
//     }

//     function updateIngredientsField() {
//         const ingredients = [];
//         list.querySelectorAll('li span.list-group-item__ingredient').forEach(span => {
//             const ingredientText = span.textContent.trim(); // Отримуємо текст із спана
//             ingredients.push(ingredientText);
//         });
//         ingredientsField.value = ingredients.join(', '); // Форматуємо список через кому
//     }

//     function syncExistingIngredients() {
//         const initialIngredients = ingredientsField.value.split(',').map(ingredient => ingredient.trim());
//         initialIngredients.forEach(ingredient => {
//             if (ingredient) {
//                 addIngredientToList(ingredient);
//             }
//         });
//         updateIngredientsField(); // Оновлюємо текстове поле після синхронізації
//     }
// }

// // Активуємо функцію при завантаженні сторінки та навігації через Turbo
// document.addEventListener('DOMContentLoaded', activateIngredientManagement);
// document.addEventListener('turbo:render', activateIngredientManagement);
// document.addEventListener('turbo:load', activateIngredientManagement);


// ================= adding ingredients end ===================


function activateIngredientManagement() {
    const input = document.getElementById('recipe_ingredients');
    const addButton = document.getElementById('add-ingredient');
    const list = document.getElementById('ingredients-list');    

    if (!input || !addButton || !list) return;

    addButton.addEventListener('click', () => {
        const ingredient = input.value.trim();

        if(ingredient) {
            const li = document.createElement('li');
            li.className = 'list-group-item appear-animation';
            li.innerHTML = `
                    <span class="list-group-item__ingredient">${ingredient}</span>
                    <button class="btn btn-danger btn-sm ms-2">x</button>
            `;
            list.appendChild(li);

            setTimeout(() => {
                li.classList.remove('appear-animation');
            }, 50);

            input.value = '';
        }

        list.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.preventDefault();
                const li = e.target.parentElement;

                li.classList.add('remove-animation');

                setTimeout(() => {
                    li.remove();
                }, 700);
            };
        })

    })
}

document.addEventListener('DOMContentLoaded', activateIngredientManagement);



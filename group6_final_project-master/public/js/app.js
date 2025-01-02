// console.log('This log comes from public/js/app.js  🎉');

// document.addEventListener("turbo:load", () => {
//     const alerts = document.querySelectorAll(".alert");

//     alerts.forEach((alert) => {
//         setTimeout(() => {
//             alert.classList.add("fade-out");
//         setTimeout(() => {
//                 alert.remove();
//             }, 500);
//         }, 5000);
//     });
// });


// // ===============================================

// function initFileInput() {
//     const fileInput = document.querySelector('.custom-file-input');
//     const fileName = document.querySelector('.file-name');

//     if (fileInput && fileName) {
//         fileInput.addEventListener('change', () => {
//             if (fileInput.files.length > 0) {
//                 fileName.textContent = fileInput.files[0].name;
//             } else {
//                 fileName.textContent = 'No File Chosen';
//             }
//         });
//     }
// }

// document.addEventListener('DOMContentLoaded', initFileInput);
// document.addEventListener('turbo:load', initFileInput);


// // ================= adding illumination type button by creating recipe start ===================

// function activateRecipeTypeButtons() {
//     const recipeTypeButtons = document.querySelectorAll('.recipe-types label.btn');
//     const form = document.querySelector('form');

//     if (!recipeTypeButtons || !form) return;

//     recipeTypeButtons.forEach(button => {
//         const input = button.querySelector('input[type="radio"]');

//         if (input.checked) {
//             button.classList.add('active');
//         }

//         input.addEventListener('change', () => {
//             recipeTypeButtons.forEach(b => b.classList.remove('active'));
//             if (input.checked) {
//                 button.classList.add('active');
//             }
//         });
//     });

//     form.addEventListener('submit', () => {
//         recipeTypeButtons.forEach(button => button.classList.remove('active'));
//     });
// }

// document.addEventListener('DOMContentLoaded', activateRecipeTypeButtons);
// document.addEventListener('turbo:render', activateRecipeTypeButtons);
// document.addEventListener('turbo:load', activateRecipeTypeButtons);


// // ================= adding illumination type button by creating recipe end ===================



// // ================= adding ingredients start ===================

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
//             const li = e.target.closest('li');
//             li.classList.add('remove-animation');

//             setTimeout(() => {
//                 li.remove();
//             }, 700);

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
//         li.className = 'list-group-item appear-animation';
//         li.innerHTML = `
//             <span class="list-group-item__ingredient">${ingredient}</span>
//             <button type="button" class="btn btn-danger btn-sm remove-ingredient">x</button>
//         `;
//         list.appendChild(li);

//         setTimeout(() => {
//             li.classList.remove('appear-animation');
//         }, 50);
//     }

//     function updateIngredientsField() {
//         const ingredients = [];
//         list.querySelectorAll('li span.list-group-item__ingredient').forEach(span => {
//             const ingredientText = span.textContent.trim(); 
//             ingredients.push(ingredientText);
//         });
//         ingredientsField.value = ingredients.join(', '); 
//     }

//     function syncExistingIngredients() {
//         const initialIngredients = ingredientsField.value.split(',').map(ingredient => ingredient.trim());
//         initialIngredients.forEach(ingredient => {
//             if (ingredient) {
//                 addIngredientToList(ingredient);
//             }
//         });
//         updateIngredientsField(); 
//     }
// }

// document.addEventListener('DOMContentLoaded', activateIngredientManagement);
// document.addEventListener('turbo:render', activateIngredientManagement);
// document.addEventListener('turbo:load', activateIngredientManagement);

// // ================= adding ingredients end ===================


// // ======================= file upload size start ===========================

// function uploadLargePhoto() {
//     const fileInput = document.getElementById("recipe_photo");
//     const fileHint = document.getElementById("image-hint");
//     const flashContainer = document.querySelector(".container.mt-3"); // Контейнер для флеш-повідомлень

//     if (!fileInput || !fileHint || !flashContainer) {
//         return; // Виходимо, якщо потрібні елементи не знайдено
//     }

//     let isFileValid = false; // Статус валідності файлу

//     // Форматування розміру файлу
//     function formatFileSize(size) {
//         if (size >= 1024 * 1024) {
//             return (size / (1024 * 1024)).toFixed(2) + " MB"; // Форматування в МБ
//         } else {
//             return (size / 1024).toFixed(2) + " KB"; // Форматування в КБ
//         }
//     }

//     // Додаємо слухач подій для перевірки вибору файлу
//     fileInput.addEventListener("change", function (event) {
//         const file = event.target.files[0];
//         if (file) {
//             const fileSize = formatFileSize(file.size); // Форматований розмір файлу
//             if (file.size > 2 * 1024 * 1024) { // Якщо файл більше 2 МБ
//                 fileHint.textContent = `The file is too large (${fileSize}). Please upload a file smaller than 2 MB.`;
//                 fileHint.style.color = "red";
//                 fileHint.style.fontWeight = "bold";
//                 isFileValid = false; // Файл невалідний
//                 fileInput.value = ""; // Скидаємо вибір файлу
//             } else {
//                 fileHint.textContent = `File is valid and ready to upload! (${fileSize})`;
//                 fileHint.style.color = "green";
//                 fileHint.style.fontWeight = "bold";
//                 isFileValid = true; // Файл валідний
//             }
//         }
//     });

//     // Додаємо перевірку перед надсиланням форми
//     const form = document.querySelector("form");
//     if (form) {
//         form.addEventListener("submit", function (event) {
//             if (!isFileValid) { // Якщо файл не валідний
//                 event.preventDefault(); // Зупиняємо відправлення форми
//                 addFlashMessage("Please upload a valid file smaller than 2 MB.", "danger");
//             }
//         });
//     }

//     // Функція для додавання флеш-повідомлення
//     function addFlashMessage(message, type) {
//         const flashMessage = document.createElement("div");
//         flashMessage.className = `alert alert-${type} alert-dismissible fade show`;
//         flashMessage.role = "alert";
//         flashMessage.innerHTML = `
//             <p>${message}</p>
//             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         `;

//         flashContainer.appendChild(flashMessage);

//         // Автоматичне видалення через 5 секунд
//         setTimeout(() => {
//             flashMessage.classList.add("fade-out");
//             setTimeout(() => flashMessage.remove(), 500);
//         }, 5000);

//         // Прокрутка до флеш-повідомлення
//         flashMessage.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
// }
// document.addEventListener('DOMContentLoaded', uploadLargePhoto);
// document.addEventListener("turbo:render", uploadLargePhoto);
// document.addEventListener("turbo:load", uploadLargePhoto);




// // ======================= file upload size end ===========================




// Centralized function to initialize all page behaviors
function initPage() {
    console.log('This log comes from public/js/app.js  🎉');

    handleAlerts();
    initFileInput();
    activateRecipeTypeButtons();
    activateIngredientManagement();
    uploadLargePhoto();
}


// *******************************************************************************




// Функція для спостереження за змінами #ingredients-container
function observeIngredientsContainer() {
    const target = document.getElementById('ingredients-container');

    if (!target) {
        console.log("Target #ingredients-container не знайдений.");
        return;
    }

    // Функція обробки змін
    const observerCallback = (mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                console.log(`Змінено стиль елемента #ingredients-container:`);
                console.log(`Новий стиль:`, mutation.target.getAttribute('style'));
            }
        });
    };

    // Налаштування спостерігача
    const observer = new MutationObserver(observerCallback);

    observer.observe(target, {
        attributes: true, // Відстежуємо зміни атрибутів
        attributeFilter: ['style'], // Фільтруємо тільки зміни стилю
    });

    console.log("Observer initialized for #ingredients-container");
}

// Додай виклик функції у `DOMContentLoaded` чи `turbo:load`
document.addEventListener('DOMContentLoaded', observeIngredientsContainer);
document.addEventListener('turbo:load', observeIngredientsContainer);







// *******************************************************************************


// Handle alerts (fade out and remove)
function handleAlerts() {
    const alerts = document.querySelectorAll(".alert");

    alerts.forEach((alert) => {
        setTimeout(() => {
            alert.classList.add("fade-out");
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 5000);
    });
}

// Initialize custom file input behavior
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

// Activate recipe type buttons
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

// Activate ingredient management
function activateIngredientManagement() {
    const input = document.getElementById('recipe_ingredients'); 
    const ingredientsField = document.querySelector('input[name="recipe[ingredients]"]'); 
    const list = document.getElementById('ingredients-list'); 
    const ingredientsContainer = document.getElementById('ingredients-container'); 

    if (!input || !ingredientsField || !list) return;

    list.innerHTML = ''; 

    syncExistingIngredients();

    document.getElementById('add-ingredient').addEventListener('click', handleAddIngredient);
    list.addEventListener('click', handleListClick);
    document.querySelector('form').addEventListener('submit', handleFormSubmit);

    function handleAddIngredient() {
        const ingredient = input.value.trim();

        if (ingredient) {            
            addIngredientToList(ingredient);
            updateIngredientsField();
            input.value = '';
        }
    }

    function handleListClick(e) {
        if (e.target.classList.contains('remove-ingredient')) {
            const li = e.target.closest('li');
            li.classList.add('remove-animation');

            setTimeout(() => {
                li.remove();
            }, 700);

            updateIngredientsField(); 
        }
    }

    function handleFormSubmit(e) {
        updateIngredientsField(); 
    
        const errorContainer = document.getElementById('ingredients-error');
    
        if (!ingredientsField.value.trim()) {
            e.preventDefault(); 

            const ingredientsContainer = document.getElementById('ingredients-container');
            ingredientsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

            errorContainer.style.display = 'inline-block';
            errorContainer.textContent = 'Please add at least one ingredient.';

            setTimeout(() => {
                errorContainer.classList.add('fade-out'); 
                setTimeout(() => {
                    errorContainer.style.display = 'none'; 
                    errorContainer.classList.remove('fade-out'); 
                }, 500); 
            }, 5000); 
        } else {
            errorContainer.style.display = 'none'; 
        }
    }   

    function addIngredientToList(ingredient) {
        const existingItems = Array.from(list.querySelectorAll('li span.list-group-item__ingredient')).map(
            span => span.textContent.trim()
        );
        if (existingItems.includes(ingredient)) return;

        const li = document.createElement('li');
        li.className = 'list-group-item appear-animation';
        li.innerHTML = `
            <span class="list-group-item__ingredient">${ingredient}</span>
            <button type="button" class="btn btn-danger btn-sm remove-ingredient">x</button>
        `;
        list.appendChild(li);

        setTimeout(() => {
            li.classList.remove('appear-animation');
        }, 50);
    }

    function updateIngredientsField() {
        const ingredients = [];
        list.querySelectorAll('li span.list-group-item__ingredient').forEach(span => {
            const ingredientText = span.textContent.trim(); 
            ingredients.push(ingredientText);
        });
        ingredientsField.value = ingredients.join(', '); 
    }

    function syncExistingIngredients() {
        const initialIngredients = ingredientsField.value.split(',').map(ingredient => ingredient.trim());
        initialIngredients.forEach(ingredient => {
            if (ingredient) {
                addIngredientToList(ingredient);
            }
        });
        updateIngredientsField(); 
    }
}

// Validate file size and display flash messages with auto-scroll
function uploadLargePhoto() {
    const fileInput = document.getElementById("recipe_photo");
    const fileHint = document.getElementById("image-hint");
    const flashContainer = document.querySelector(".container.mt-3");

    if (!fileInput || !fileHint || !flashContainer) {
        return;
    }

    let isFileValid = false;

    function formatFileSize(size) {
        if (size >= 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + " MB";
        } else {
            return (size / 1024).toFixed(2) + " KB";
        }
    }

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const fileSize = formatFileSize(file.size);
            if (file.size > 2 * 1024 * 1024) {
                fileHint.textContent = `The file is too large (${fileSize}). Please upload a file smaller than 2 MB.`;
                fileHint.style.color = "red";
                fileHint.style.fontWeight = "bold";
                isFileValid = false;
                fileInput.value = "";
                addFlashMessage(`The file is too large (${fileSize}).`, "danger");
            } else {
                fileHint.textContent = `File is valid and ready to upload! (${fileSize})`;
                fileHint.style.color = "green";
                fileHint.style.fontWeight = "bold";
                isFileValid = true;
            }
        }
    });

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (event) {
            if (!isFileValid) {
                event.preventDefault();
                addFlashMessage("Please upload a valid file smaller than 2 MB.", "danger");
            }
        });
    }

    function addFlashMessage(message, type) {
        const flashMessage = document.createElement("div");
        flashMessage.className = `alert alert-${type} alert-dismissible fade show`;
        flashMessage.role = "alert";
        flashMessage.innerHTML = `
            <p>${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        flashContainer.appendChild(flashMessage);

        flashMessage.scrollIntoView({ behavior: "smooth", block: "center" }); // Auto-scroll to the message

        setTimeout(() => {
            flashMessage.classList.add("fade-out");
            setTimeout(() => flashMessage.remove(), 500);
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', initPage);
document.addEventListener('turbo:render', initPage);
document.addEventListener('turbo:load', initPage);




// Centralized function to initialize all page behaviors
function initPage() {

    handleAlerts();
    initFileInput();
    activateRecipeTypeButtons();
    activateIngredientManagement();
}


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

function activateIngredientManagement() {
    const hiddenInput = document.getElementById('recipe_ingredients'); 
    const visibleInput = document.getElementById('recipe_ingredients-visible'); 
    const list = document.getElementById('ingredients-list'); 
    const ingredientsContainer = document.getElementById('ingredients-container'); 
    const errorContainer = document.getElementById('ingredients-error');

    if (!hiddenInput || !visibleInput || !list) return;

    list.innerHTML = ''; 

    syncExistingIngredients();

    document.getElementById('add-ingredient').addEventListener('click', handleAddIngredient);
    list.addEventListener('click', handleListClick);
    document.querySelector('form').addEventListener('submit', handleFormSubmit);

    function handleAddIngredient() {
        const ingredient = visibleInput.value.trim();        

        if (ingredient) {
            const existingItems = Array.from(list.querySelectorAll('li span.list-group-item__ingredient')).map(
                span => span.textContent.trim()
            );

            if (existingItems.includes(ingredient)) {
                errorContainer.style.display = 'inline-block';
                errorContainer.textContent = 'This ingredient already exists. Please check if it is necessary.';
                ingredientsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    errorContainer.style.display = 'none'; 
                }, 5000);

                return; 
            }

            addIngredientToList(ingredient);
            updateIngredientsField();
            visibleInput.value = ''; 
        }
    }

    function handleListClick(e) {
        if (e.target.classList.contains('remove-ingredient')) {
            const li = e.target.closest('li');
            li.classList.add('remove-animation');

            setTimeout(() => {
                li.remove();
                updateIngredientsField();
            }, 700);
        }
    }

    function handleFormSubmit(e) {
        updateIngredientsField(); 
    
        if (!hiddenInput.value || hiddenInput.value === '[]') {
            e.preventDefault(); 

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

            return; 
        }
    }

    function addIngredientToList(ingredient) {
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

        const jsonIngredients = JSON.stringify(ingredients); 
        hiddenInput.value = jsonIngredients; 

        visibleInput.value = ingredients.join(', '); 
    }

    function syncExistingIngredients() {
        try {
            const initialIngredients = JSON.parse(hiddenInput.value || '[]'); 
            if (!Array.isArray(initialIngredients)) {
                return;
            }

            initialIngredients.forEach(ingredient => {
                if (ingredient) {
                    addIngredientToList(ingredient);
                }
            });

            visibleInput.value = initialIngredients.join(', ');
        } catch (error) {
            console.error('Error parsing JSON in hiddenInput:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', initPage);
document.addEventListener('turbo:render', initPage);
document.addEventListener('turbo:load', initPage);


// Validate file size and display flash messages with auto-scroll
// function uploadLargePhoto() {
//     const fileInput = document.getElementById("recipe_photo");
//     const fileHint = document.getElementById("image-hint");
//     const flashContainer = document.querySelector(".container.mt-3");

//     if (!fileInput || !fileHint || !flashContainer) {
//         return;
//     }

//     let isFileValid = true; 

//     function formatFileSize(size) {
//         if (size >= 1024 * 1024) {
//             return (size / (1024 * 1024)).toFixed(2) + " MB";
//         } else {
//             return (size / 1024).toFixed(2) + " KB";
//         }
//     }

//     fileInput.addEventListener("change", function (event) {
//         const file = event.target.files[0];
//         if (file) {
//             const fileSize = formatFileSize(file.size);
//             if (file.size > 2 * 1024 * 1024) {
//                 fileHint.textContent = `The file is too large (${fileSize}). Please upload a file smaller than 2 MB.`;
//                 fileHint.style.color = "red";
//                 fileHint.style.fontWeight = "bold";
//                 isFileValid = false;
//                 fileInput.value = "";
//                 addFlashMessage(`The file is too large (${fileSize}).`, "danger", fileHint);
//             } else {
//                 fileHint.textContent = `File is valid and ready to upload! (${fileSize})`;
//                 fileHint.style.color = "green";
//                 fileHint.style.fontWeight = "bold";
//                 isFileValid = true;
//             }
//         } else {
            
//             isFileValid = true;
//         }
//     });

//     const form = document.querySelector("form");
//     if (form) {
//         form.addEventListener("submit", function (event) {
//             if (!isFileValid) {
//                 event.preventDefault();
//                 addFlashMessage("Please upload a valid file smaller than 2 MB.", "danger", fileHint);
//             }
//         });
//     }

//     function addFlashMessage(message, type, returnToElement) {
//         const flashMessage = document.createElement("div");
//         flashMessage.className = `alert alert-${type} alert-dismissible fade show`;
//         flashMessage.role = "alert";
//         flashMessage.innerHTML = `
//             <p>${message}</p>
//             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         `;

//         flashContainer.appendChild(flashMessage);

//         flashMessage.scrollIntoView({ behavior: "smooth", block: "center" }); 

//         setTimeout(() => {
//             flashMessage.classList.add("fade-out");
//             setTimeout(() => {
//                 flashMessage.remove();
                
//                 returnToElement.scrollIntoView({ behavior: "smooth", block: "center" });
//             }, 500);
//         }, 3000);
//     }
// }

// =========================================================


function uploadLargePhoto() {
    const fileInput = document.getElementById("recipe_photo");
    const fileHint = document.getElementById("image-hint");
    const flashContainer = document.querySelector(".container.mt-3");

    if (!fileInput || !fileHint || !flashContainer) {
        return;
    }

    let isFileValid = true; 

    function formatFileSize(size) {
        if (size >= 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + " MB";
        } else {
            return (size / 1024).toFixed(2) + " KB";
        }
    }

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const placeholderImage = document.querySelector(".image-placeholder img");
        const imagePlaceholder = document.querySelector(".image-placeholder");
    
        if (file) {
            const fileSize = formatFileSize(file.size);

            if (file.size > 2 * 1024 * 1024) {
                fileHint.textContent = `The file is too large (${fileSize}). Please upload a file smaller than 2 MB.`;
                fileHint.style.color = "red";
                fileHint.style.fontWeight = "bold";
                isFileValid = false;
                fileInput.value = "";
                addFlashMessage(`The file is too large (${fileSize}).`, "danger", fileHint);
                placeholderImage.src = "/pictures/image-upload.png";
                imagePlaceholder.classList.remove("image-placeholder--large");
                return;
            }

            if (!file.type.startsWith("image/")) {
                fileHint.textContent = "Invalid file type. Please upload an image.";
                fileHint.style.color = "red";
                fileInput.value = "";
                isFileValid = false;
                placeholderImage.src = "/pictures/image-upload.png";
                imagePlaceholder.classList.remove("image-placeholder--large");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                if (placeholderImage) {
                    
                    placeholderImage.classList.add("fade-out");

                    setTimeout(() => {
                        placeholderImage.src = e.target.result; 

                        placeholderImage.classList.remove("fade-out");
                        placeholderImage.classList.add("fade-in");

                        setTimeout(() => {
                            placeholderImage.classList.remove("fade-in");
                        }, 500); 
                    }, 500); 
                }
    
                fileHint.textContent = `File is valid and ready to upload! (${fileSize})`;
                fileHint.style.color = "green";
                fileHint.style.fontWeight = "bold";
                isFileValid = true;
    
                imagePlaceholder.classList.add("image-placeholder--large");
            };
            reader.readAsDataURL(file); 
        } else {
            isFileValid = true;
            placeholderImage.src = "/pictures/image-upload.png";
            imagePlaceholder.classList.remove("image-placeholder--large");
        }
    });
    
    

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (event) {
            if (!isFileValid) {
                event.preventDefault();
                addFlashMessage("Please upload a valid file smaller than 2 MB.", "danger", fileHint);
            }
        });
    }

    function addFlashMessage(message, type, returnToElement) {
        const flashMessage = document.createElement("div");
        flashMessage.className = `alert alert-${type} alert-dismissible fade show`;
        flashMessage.role = "alert";
        flashMessage.innerHTML = `
            <p>${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        flashContainer.appendChild(flashMessage);

        flashMessage.scrollIntoView({ behavior: "smooth", block: "center" }); 

        setTimeout(() => {
            flashMessage.classList.add("fade-out");
            setTimeout(() => {
                flashMessage.remove();
                
                returnToElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 500);
        }, 3000);
    }
}



// =========================================================

document.addEventListener('DOMContentLoaded', uploadLargePhoto);
document.addEventListener('turbo:render', uploadLargePhoto);


// Check user during the registration
function checkUser() {
    const emailField = document.getElementById('registration_form_email');
    const feedback = document.getElementById('email-feedback');
    const form = document.getElementById('registration_form');

    if (!emailField || !feedback || !form) {
        return; 
    }

    let hasError = false;
    let debounceTimer;
    let typingTimeout;
    let isTyping = false; 

    function lockForm(form, lock = true) {
        const elements = form.querySelectorAll('input, textarea, button, select');
        elements.forEach(element => element.disabled = lock);
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function typeEffect(element, text, delay = 30) {
        clearTimeout(typingTimeout); 
        isTyping = true; 
        element.textContent = ''; 
        let index = 0;

        function addLetter() {
            if (!isTyping) return; 
            if (index < text.length) {
                element.textContent += text[index]; 
                index++;
                typingTimeout = setTimeout(addLetter, delay); 
            } else {
                isTyping = false; 
            }
        }

        addLetter(); 
    }

    if (!emailField.dataset.listenerAdded) {
        emailField.addEventListener('input', function () {
            const email = this.value;

            feedback.textContent = '';
            feedback.className = 'form-text';
            isTyping = false; 

            clearTimeout(debounceTimer);

            debounceTimer = setTimeout(() => {
                if (!email || !isValidEmail(email)) {
                    feedback.className = 'form-text text-danger';
                    typeEffect(feedback, 'Please enter a valid email address.', 30);
                    lockForm(form, true);
                    feedback.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(() => lockForm(form, false), 500);
                    hasError = true;
                    return;
                }

                const xhr = new XMLHttpRequest();
                xhr.open('GET', `/check-email?email=${encodeURIComponent(email)}`, true);
                xhr.onload = function () {
                    lockForm(form, true);
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);

                        if (response.exists) {
                            feedback.className = 'form-text text-danger';
                            typeEffect(feedback, 'This email is already in use.', 30);
                            feedback.scrollIntoView({behavior: 'smooth', block: 'center'});
                            hasError = true;
                        } else {
                            feedback.className = 'form-text text-success';
                            typeEffect(feedback, 'This email is available for registration.', 30);
                            feedback.scrollIntoView({behavior: 'smooth', block: 'center'})
                            hasError = false;
                        }
                    } else {
                        feedback.className = 'form-text text-danger';
                        typeEffect(feedback, 'Validation error. Please try again later.', 30);
                        feedback.scrollIntoView({behavior: 'smooth', block: 'center'});
                        hasError = true;
                    }
                    setTimeout(() => lockForm(form, false), 500);
                };
                xhr.onerror = function () {
                    lockForm(form, true); 
                    feedback.className = 'form-text text-danger';
                    typeEffect(feedback, 'Server connection error.', 30);
                    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => lockForm(form, false), 500); 
                    hasError = true;
                };
                xhr.send();
            }, 2000);
        });

        emailField.dataset.listenerAdded = true;
    }

    if (!form.dataset.listenerAdded) {
        form.addEventListener('submit', function(event) {
            if (hasError) {
                event.preventDefault();
                emailField.scrollIntoView({ behavior: 'smooth', block: 'center'});
                feedback.className = 'form-text text-danger';
                typeEffect(feedback, 'User with this email address is already registered.', 30);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
document.addEventListener('turbo:render', checkUser);
document.addEventListener('turbo:load', checkUser);


function addUserRegistration () {
    const fileInput = document.getElementById('registration_form_imageFile_file');
    const fileNameSpan = document.getElementById('registration-image-file-name');

    if (fileInput && fileNameSpan) {
        fileInput.addEventListener('change', function () {
            if (fileInput.files.length > 0) {
                fileNameSpan.textContent = fileInput.files[0].name;
            } else {
                fileNameSpan.textContent = 'No File Chosen';
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', addUserRegistration);
document.addEventListener('turbo:render', addUserRegistration);






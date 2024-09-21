const API_URL = 'http://localhost:8000/api/todos/'; // Update with your API URL

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken'); // Get CSRF token

document.getElementById('todo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    // Adding a new to-do item
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, // Include CSRF token
        },
        body: JSON.stringify({ title, description }),
    })
        .then(response => response.json())
        .then(data => {
            addTodoToList(data);
            document.getElementById('todo-form').reset();
        })
        .catch(error => console.error('Error:', error));
});

// Fetch and display todos on page load
function fetchTodos() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(todo => addTodoToList(todo));
        })
        .catch(error => console.error('Error:', error));
}

// Function to add a todo to the list with a completion checkbox
function addTodoToList(todo) {
    const todoList = document.getElementById('todo-list');
    const li = document.createElement('li');

    // Create a checkbox for marking the task as completed
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;  // Set the checkbox based on the completed status

    // Add a listener to update the "completed" status
    checkbox.addEventListener('change', function () {
        toggleTodoCompletion(todo.id, checkbox.checked, li);
    });

    // Create text node for title and description
    const textNode = document.createTextNode(`${todo.title} - ${todo.description}`);

    li.appendChild(checkbox);  // Add checkbox to the list item
    li.appendChild(textNode);

    // Add completed styling if the task is completed
    if (todo.completed) {
        li.classList.add('completed');
    }

    // Add edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent triggering the toggle
        editTodo(todo.id, li);
    });
    li.appendChild(editButton);

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent triggering the toggle
        deleteTodo(todo.id, li);
    });
    li.appendChild(deleteButton);

    todoList.appendChild(li);
}

// Function to toggle completion status
function toggleTodoCompletion(id, isCompleted, li) {
    fetch(`${API_URL}${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, // Include CSRF token
        },
        body: JSON.stringify({ completed: isCompleted }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.completed) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
        })
        .catch(error => console.error('Error:', error));
}


// Edit function

function editTodo(id, li) {
    // Get the current title and description
    const currentText = li.childNodes[1].textContent; // Get the text node
    const [currentTitle, currentDescription] = currentText.split(' - '); // Split the title and description

    // Create input fields for title and description
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = currentTitle.trim(); // Set the value to the title

    const descriptionInput = document.createElement('textarea');
    descriptionInput.value = currentDescription ? currentDescription.trim() : ''; // Set the value to the description

    // Clear existing content and append inputs
    li.innerHTML = ''; // Clear current content
    li.appendChild(titleInput);
    li.appendChild(descriptionInput);

    // Create a save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    li.appendChild(saveButton);

    // Create a cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    li.appendChild(cancelButton);

    // Handle save action
    saveButton.addEventListener('click', function () {
        const title = titleInput.value;
        const description = descriptionInput.value;

        // PUT request to update the to-do item
        fetch(`${API_URL}${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, // Include CSRF token
            },
            body: JSON.stringify({ title, description }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update the list item with the new title and description
                li.innerHTML = `${data.title} - ${data.description}`;
                // Re-add the checkbox
                addCheckbox(data, li);
                // Add back the edit and delete buttons
                addEditAndDeleteButtons(data.id, li);
            })
            .catch(error => console.error('Error:', error));
    });

    // Handle cancel action
    cancelButton.addEventListener('click', function () {
        // Reset the list item to its original state
        li.innerHTML = `${currentTitle} - ${currentDescription}`;
        // Re-add the checkbox
        addCheckbox({ completed: false }, li); // Adjust this based on your logic
        // Add back the edit and delete buttons
        addEditAndDeleteButtons(id, li);
    });
}

function addCheckbox(todo, li) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed; // Use the completed status from the todo object
    checkbox.addEventListener('change', function () {
        toggleTodoCompletion(todo.id, checkbox.checked, li);
    });
    li.prepend(checkbox); // Add checkbox at the start
}

function addEditAndDeleteButtons(id, li) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function () {
        editTodo(id, li);
    });
    li.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        deleteTodo(id, li);
    });
    li.appendChild(deleteButton);
}

/////


// Function to delete todo
function deleteTodo(id, li) {
    fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrftoken, // Include CSRF token
        },
    })
        .then(() => {
            li.remove();
        })
        .catch(error => console.error('Error:', error));
}

// Fetch todos on page load
fetchTodos();

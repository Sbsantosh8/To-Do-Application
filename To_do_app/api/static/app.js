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


function editTodo(id, li) {
    // Create text input fields for title and description
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = li.firstChild.textContent;

    const descriptionInput = document.createElement('textarea');
    descriptionInput.value = li.firstChild.nextSibling.textContent;

    // Replace the existing text with the input fields
    li.innerHTML = '';  // Clear existing content
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
            .then(response => response.json())
            .then(data => {
                // Update the list item with the new title and description
                li.innerHTML = `${data.title} - ${data.description}`;

                // Optionally, add back the edit and delete buttons
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', function () {
                    editTodo(data.id, li);
                });
                li.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteTodo(data.id, li);
                });
                li.appendChild(deleteButton);
            })
            .catch(error => console.error('Error:', error));
    });

    // Handle cancel action
    cancelButton.addEventListener('click', function () {
        li.innerHTML = `${titleInput.value} - ${descriptionInput.value}`;

        // Re-add the edit and delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () {
            editTodo(id, li);
        });
        li.appendChild(editButton);


    });
}

// Call submitEditTodo on form submission
document.getElementById('edit-todo-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    submitEditTodo();   // Call the function to submit the edit form
});

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

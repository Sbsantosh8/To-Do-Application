# To-Do-Application
 
This is a simple To-Do List application that provides a RESTful API for managing tasks. The backend is built using Django and Django REST Framework, and the frontend interacts with this API using vanilla JavaScript.

## Features :<br />
Create, Read, Update, and Delete (CRUD) to-do items via API . <br />
Backend built with Django . <br />
API documentation available via DRF .<br />
Frontend built with HTML,CSS,Vanilla Javascript . <br />


# Project Setup
## Prerequisites<br/>
Make sure you have the following installed on your machine:<br/>

• Python 3.8+ <br/>
• Django 4.x+ <br/>
• Django REST Framework <br/>
• Git <br/>


# 1. Clone the Repository <br/>
```bash
git clone https://github.com/Sbsantosh8/To-Do-Application.git.
cd To-Do-Application
cd To_do_app
```

# 2. Create and Activate Virtual Environment
``` bash
python -m venv myenv
source venv/bin/activate  # On Windows use `myenv\Scripts\activate.ps1`
```

# 3. Install Dependencies

```
pip install -r requirements.txt
```
# 4. Apply Migrations
```
python manage.py migrate
```
# 5. Create a Superuser (Optional)
To access the Django admin interface:
```
python manage.py createsuperuser
```

# 6. Run the Development Server
```
python manage.py runserver
```

## Your API will be available at http://127.0.0.1:8000/api/.

## API Endpoints
GET /api/todos/ - Retrieve a list of to-do items <br/>
POST /api/todos/ - Create a new to-do item <br/>
GET /api/todos/{id}/ - Retrieve a specific to-do item by ID <br/>
PUT /api/todos/{id}/ - Update an existing to-do item <br/>
DELETE /api/todos/{id}/ - Delete a to-do item <br/>

# Example Request
To test the API, you can use Postman or curl.

GET All To-Do Items

```

curl -X GET http://127.0.0.1:8000/api/todos/

```

## Frontend Setup
# The frontend is built with vanilla JavaScript, HTML,CSS








from django.urls import path
from . import views

urlpatterns = [
    path("todos/", views.task_list, name="task-list"),
    path("todos/<int:id>/", views.task_detail, name="task-detail"),
]

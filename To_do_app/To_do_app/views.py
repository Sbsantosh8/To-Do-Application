# views.py
from django.views.generic import TemplateView
from api.models import Task


class HomeView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["tasks"] = Task.objects.all()  # Retrieve all tasks
        return context

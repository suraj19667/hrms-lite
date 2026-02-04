from django.urls import path
from . import views

urlpatterns = [
    path('', views.employee_list_create, name='employee_list_create'),  # GET and POST
    path('<str:employee_id>/', views.delete_employee, name='delete_employee'),  # MongoDB ObjectId is string
]

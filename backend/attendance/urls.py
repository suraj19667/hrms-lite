from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_attendance, name='create_attendance'),
    path('all/', views.list_all_attendance, name='list_all_attendance'),
    path('<str:employee_id>/', views.get_employee_attendance, name='get_employee_attendance'),
]

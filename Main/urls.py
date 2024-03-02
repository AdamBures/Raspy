from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create', views.create, name='create'),
    path('create/<str:filename>', views.create, name='create'),
    path('login', views.login_view, name='login'),
    path('profile/<str:username>/', views.my_view, name='profile'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
    path('upload', views.upload_file, name='upload'),
    path("api/users/", views.UserListCreateView.as_view(), name="users"),
    path("api/projects/", views.ProjectListCreateView.as_view(), name="projects"),
    path("api/users/<int:pk>/", views.UserDataView.as_view(), name="users-detail"),
    path("api/projects/<int:pk>/", views.ProjectDataView.as_view(), name="projects-details"),
]

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.conf import settings

from rest_framework import generics

from .models import Component, User, Project, PredefinedProjects
from .serializers import UserSerializer, ProjectSerializer

import os
import json
# Create your views here.
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class UserDataView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectDataView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

def index(request):
	return render(request, "index.html")

def create(request, filename=None):
    components = Component.objects.all().values()
    context = {
        "components": components,
    }

    if filename is None:
        return render(request, "create.html", context)

    else:
        if Project.objects.filter(name=filename).exists():
            project = Project.objects.get(name=filename).file

            context["filename"] = project
        
        elif PredefinedProjects.objects.filter(name=filename).exists():
            project = PredefinedProjects.objects.get(name=filename).file

            file_content = project.read().decode("utf-8")

            context["filename"] = file_content.strip("\n")
        return render(request, "create.html", context)

@csrf_protect
def upload_file(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in request body'}, status=400)

        title = data.get('title')
        file_content = data.get('content')
        
        if not title or not file_content:
            return JsonResponse({'error': 'Title or file content missing in request'}, status=400)

        file_object = Project(name=title, file=file_content, owner=User.objects.get(username=request.session['username']))
        file_object.save()
        
        return JsonResponse({'message': 'File uploaded successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

def my_view(request, **kwargs):
    username = kwargs.get('username')
    if request.session.get('LOGGED', True):
        return render(request, 'profile.html', {'username': username, 'projects': User.objects.get(username=username).get_user_projects(), 'predefined': PredefinedProjects.objects.all()})
    else:
        return redirect('login')

def download_file(request, username, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, f"files/{username}/{filename}")
    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
            return response
    return HttpResponse('File not found', status=404)

def register(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = User.objects.create(username=username, password=password)
        user.save()
        return redirect('login')
    else:
        return render(request, "register.html")

def logout_view(request):
    logout(request)
    return redirect('login')

@csrf_protect
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=username)
            found_user = User.objects.get(id=user.id)

            if (found_user.password == password):
                request.session['LOGGED'] = True
                request.session['username'] = username
                return redirect(f'profile/{username}')
            else:
                request.session['LOGGED'] = False
                messages.error(request, 'Invalid password.')
                return redirect('login')
        
        except User.DoesNotExist:
            request.session['LOGGED'] = False
            messages.error(request, 'Invalid username.')

            return redirect('login')
    else:
        username = request.session.get('username')
        if username == None:
            request.session['LOGGED'] = False
            return render(request, 'login.html')
        else:
            return redirect(f'profile/{username}')

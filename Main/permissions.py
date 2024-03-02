# permissions.py
from rest_framework import permissions

class IsLoggedInUserCanAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow GET and POST requests only
        return request.method in ['GET', 'POST'] and request.session['LOGGED']

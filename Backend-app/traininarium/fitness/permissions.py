from rest_framework import permissions

from health.models import DynamicInfo


class AdminOrRespondedUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            if request.user.is_staff:
                return True
            if DynamicInfo.objects.filter(user=request.user).exists():
                return True
        return False


class RespondedUserOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            if request.user.is_staff:
                return False
            if DynamicInfo.objects.filter(user=request.user).exists():
                return True
        return False


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(user.is_staff or obj.owner == user)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return getattr(obj, obj.get_user_field_name()) == user

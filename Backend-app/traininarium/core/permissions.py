from rest_framework import permissions


class CurrentNonAdminUserOnly(permissions.IsAuthenticated):
    """
    Предоставление прав доступа для текущего
    пользователя, если он не администратор
    """
    def has_permission(self, request, view):
        return bool(not request.user.is_staff and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        return not user.is_staff and obj.pk == user.pk


class CurrentNoBanUserOrAdmin(permissions.IsAuthenticated):
    """
    Предоставление прав доступа для текущего
    пользователя, если он администратор или не
    заблокирован
    """
    def has_permission(self, request, view):
        if hasattr(request.user, "is_banned"):
            return bool(request.user.is_staff or (not request.user.is_banned and request.user.is_authenticated))
        else:
            return False

    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, "is_banned"):
            return request.user.is_staff or (not request.user.is_banned and obj.pk == request.user.pk)
        else:
            return False


class NoBanUser(permissions.IsAuthenticated):
    """
    Предоставление прав доступа для не заблокированных
    пользователей
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return not request.user.is_banned
        return False


class NoAdminUser(permissions.IsAuthenticated):
    """
    Предоставление прав доступа не для администраторов
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return not request.user.is_staff
        return False

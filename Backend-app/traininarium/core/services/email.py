from templated_mail.mail import BaseEmailMessage
from core.services.email_code import generate_code


class CodeEmail(BaseEmailMessage):
    """
    Класс отправки e-mail с кодом подтверждения
    """
    def get_context_data(self):
        context = super().get_context_data()

        user = context.get("user")
        context["code"] = generate_code(user)
        return context


class ActivationEmail(CodeEmail):
    """
    Провайдер шаблона письма активации
    """
    template_name = "activation.html"


# Password reset email provided
class PasswordResetEmail(CodeEmail):
    """
    Провайдер шаблона письма сброса пароля
    """
    template_name = "password_reset.html"


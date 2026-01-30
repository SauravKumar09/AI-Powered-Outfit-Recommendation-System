from django.contrib import admin
from django.apps import apps


# Auto-register all models in this app so they appear in the admin.
for model in apps.get_app_config("recommendations").get_models():
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass

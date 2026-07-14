from django.contrib import admin

from .models import DrugInteraction


@admin.register(DrugInteraction)
class DrugInteractionAdmin(admin.ModelAdmin):
    list_display = ["medicine_a", "medicine_b", "severity", "title"]
    list_filter = ["severity"]
    search_fields = ["medicine_a__name", "medicine_b__name", "title"]

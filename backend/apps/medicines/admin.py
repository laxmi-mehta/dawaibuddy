from django.contrib import admin

from .models import GenericAlternative, Medicine


class GenericAlternativeInline(admin.TabularInline):
    model = GenericAlternative
    extra = 0


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ["name", "generic_name", "category", "manufacturer", "price", "in_stock"]
    search_fields = ["name", "generic_name", "category"]
    list_filter = ["category", "rx_required", "in_stock"]
    inlines = [GenericAlternativeInline]


@admin.register(GenericAlternative)
class GenericAlternativeAdmin(admin.ModelAdmin):
    list_display = ["name", "medicine", "manufacturer", "price", "save_percent"]
    search_fields = ["name", "medicine__name"]

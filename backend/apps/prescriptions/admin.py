from django.contrib import admin

from .models import Prescription, PrescriptionMedicine


class PrescriptionMedicineInline(admin.TabularInline):
    model = PrescriptionMedicine
    extra = 0


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ["doctor_name", "user", "status", "source", "prescribed_on"]
    list_filter = ["status", "source"]
    search_fields = ["doctor_name", "clinic", "user__email"]
    inlines = [PrescriptionMedicineInline]

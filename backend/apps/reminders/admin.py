from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ["medicine_name", "user", "bucket", "scheduled_time", "is_taken"]
    list_filter = ["bucket"]
    search_fields = ["medicine_name", "user__email"]

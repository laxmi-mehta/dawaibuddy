from django.contrib import admin

from .models import FamilyMember, Profile, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "username", "first_name", "last_name", "is_staff", "is_active"]
    search_fields = ["email", "username", "first_name", "last_name"]
    list_filter = ["is_staff", "is_active", "is_superuser"]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "age", "blood_group", "height_cm", "weight_kg"]
    search_fields = ["user__email", "user__username"]


@admin.register(FamilyMember)
class FamilyMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "relation", "age", "user"]
    search_fields = ["name", "user__email"]

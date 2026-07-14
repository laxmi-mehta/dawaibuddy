"""Turn a prescription's extracted medicines into daily Reminder slots.

Frequency is the standard Indian prescription shorthand "M-A-N" (e.g. "1-0-1"
for morning + night). Anything that doesn't parse as exactly three numeric
parts is left alone — silently guessing a schedule is worse than skipping it.
"""
import datetime

from apps.reminders.models import Reminder

_SLOT_TO_BUCKET_AND_TIME = [
    (Reminder.Bucket.MORNING, datetime.time(8, 0)),
    (Reminder.Bucket.AFTERNOON, datetime.time(14, 0)),
    (Reminder.Bucket.NIGHT, datetime.time(21, 0)),
]


def create_reminders_for_medicine(user, medicine) -> list[Reminder]:
    parts = [p.strip() for p in (medicine.frequency or "").split("-")]
    if len(parts) != 3 or not all(p.isdigit() for p in parts):
        return []

    created = []
    for (bucket, scheduled_time), count in zip(_SLOT_TO_BUCKET_AND_TIME, parts):
        if count == "0":
            continue
        created.append(
            Reminder.objects.create(
                user=user,
                medicine_name=medicine.name,
                dosage=medicine.dosage,
                scheduled_time=scheduled_time,
                bucket=bucket,
                instruction=medicine.timing,
            )
        )
    return created

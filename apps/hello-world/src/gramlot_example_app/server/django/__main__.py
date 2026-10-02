"""Launch the Django Hello World profile on 127.0.0.1:8000."""
import os

from django.core.management import execute_from_command_line


def main():
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "gramlot_example_app.server.django.settings"
    )
    execute_from_command_line(["gramlot-hello-django", "runserver", "127.0.0.1:8000", "--noreload"])


if __name__ == "__main__":
    main()

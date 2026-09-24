from genro_asgi import BaseServer

from . import application


def main():
    try:
        BaseServer(applications=[application]).serve(host="127.0.0.1", port=8000)
    except KeyboardInterrupt:
        pass
    finally:
        application.host._pages.clear()


if __name__ == "__main__":
    main()

from pyramid.config import Configurator


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include("cornice")
    config.scan("website_editor.resources")
    config.scan("website_editor.services")
    return config.make_wsgi_app()

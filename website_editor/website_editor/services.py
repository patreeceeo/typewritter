from pyramid.response import Response
from cornice import Service
import subprocess
import json
import sys

build = Service(name='build',
                description='(re)build site with Gatsby',
                path='/api/build')

@build.get()
def start_build(request):

    popen_kwargs = dict(
            stdout=subprocess.PIPE,
            cwd=request.registry.settings['gatsby_project_path'],
            bufsize=1,
            universal_newlines=True,
    )

    def event(data, event_type='message'):
        return 'event: %s\ndata: %s\n\n' % (event_type, data)

    def read_process():
        yield event('starting Gatsby...', 'started')
        try:
            with subprocess.Popen(['node_modules/.bin/gatsby', 'build'], **popen_kwargs) as process:
                while process.poll() == None:
                    for line in iter(process.stdout.readline,""):
                        yield event(line)
        except:
            yield event("Unexpected error: %s" % sys.exc_info()[0])
            raise
        finally:
            yield event(process.poll(), 'finished')


    def convert_to_bytes(str_generator):
        for line in str_generator():
            yield bytes(line, encoding='utf-8')

    return Response(
                content_type="text/event-stream",
                cache_control="no-cache",
                app_iter=convert_to_bytes(read_process),
            )





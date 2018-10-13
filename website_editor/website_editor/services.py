from cornice import Service
import subprocess

build = Service(name='build',
                description='(re)build site with Gatsby',
                path='/api/build')

@build.post()
def start_build(request):
    gatsby_result = subprocess.run(['node_modules/.bin/gatsby', 'build'],
        cwd=request.registry.settings['gatsby_project_path'],
        capture_output=True
    )

    # response.app_iter = gatsby_result.stdout
    return {
        'stdout': gatsby_result.stdout
    }




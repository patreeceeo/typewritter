from cornice.resource import resource
from .controllers import PostController

# Using this approach:
# https://cornice.readthedocs.io/en/latest/resources.html

@resource(collection_path='/api/posts', path='/api/posts/{id}')
class PostResource(object):
    def __init__(self, request, context=None):
        self.request = request
        self.post_controller = PostController(request.registry.settings['posts_dir_path'])

    def __acl__(self):
        return [(Allow, Everyone, 'everything')]

    def collection_get(self):
        return {'posts': _POSTS.keys()}

    def get(self):
        return self.post_controller.posts.get(int(self.request.matchdict['id'])).to_json()

    def collection_post(self):
        pass
        # print(self.request.json_body)
        # _POSTS[len(_POSTS) + 1] = self.request.json_body
        # return True

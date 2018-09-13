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
        return {'posts': self.post_controller.posts.to_json()}

    def get(self):
        return self.post_controller.lookupById(int(self.request.matchdict['id'])).to_json()

    def post(self):
        params = self.request.POST
        self.post_controller.create(**params)

    def put(self):
        params = self.request.PUT
        self.post_controller.update(**params)

    def collection_post(self):
        pass
        # print(self.request.json_body)
        # _POSTS[len(_POSTS) + 1] = self.request.json_body
        # return True

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
        return {'posts': list(self.post_controller.fetch())}

    def get(self):
        filter_crit = lambda post: post['id'] == int(self.request.matchdict['id'])
        return next(self.post_controller.fetch(filter_crit))

    def post(self):
        params = self.request.POST
        print('self.post_controller',self.post_controller)
        self.post_controller.create(params)

    def put(self):
        params = self.request.PUT
        self.post_controller.update(params)

    def collection_post(self):
        pass
        # print(self.request.json_body)
        # _POSTS[len(_POSTS) + 1] = self.request.json_body
        # return True

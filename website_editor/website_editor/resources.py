from cornice.resource import resource
from .controllers import PostController
from pyramid.httpexceptions import HTTPNotFound

# Using this approach:
# https://cornice.readthedocs.io/en/latest/resources.html

@resource(collection_path='/api/posts', path='/api/posts/{post_id}')
class PostResource(object):
    def __init__(self, request, context=None):
        self.request = request
        self.post_controller = PostController(request.registry.settings['posts_dir_path'])

    def __acl__(self):
        return [(Allow, Everyone, 'everything')]

    def collection_get(self):
        return {'posts': list(self.post_controller.fetch())}

    def get(self):
        filter_crit = lambda post: post['post_id'] == int(self.request.matchdict['post_id'])
        try:
            return next(self.post_controller.fetch(filter_crit))
        except StopIteration:
            raise HTTPNotFound()

    def collection_post(self):
        for post in self.request.json_body:
            self.post_controller.create(post)

    def put(self):
        attrs = self.request.json_body
        self.post_controller.update(int(self.request.matchdict['post_id']), attrs)

    def delete(self):
        self.post_controller.delete(int(self.request.matchdict['post_id']))


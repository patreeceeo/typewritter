from cornice.resource import resource
from .models import PostModel, PostCollection

# Using this approach:
# https://cornice.readthedocs.io/en/latest/resources.html

@resource(collection_path='/api/posts', path='/api/posts/{id}')
class PostResource(object):
    def __init__(self, request, context=None):
        self.request = request

        # TODO: remove dummy code
        # replace with loading posts from file system
        self.collection = PostCollection()
        self.collection.add(PostModel(id=1, file_path='/posts/boo', post_with_metadata='Yo!'))

    def __acl__(self):
        return [(Allow, Everyone, 'everything')]

    def collection_get(self):
        return {'posts': _POSTS.keys()}

    def get(self):
        return self.collection.get(int(self.request.matchdict['id'])).to_json()

    def collection_post(self):
        print(self.request.json_body)
        _POSTS[len(_POSTS) + 1] = self.request.json_body
        return True

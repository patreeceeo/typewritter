from .models import load_posts, PostModel, PostCollection

_posts_by_path = {}

class PostController(object):
    def __init__(self, posts_dir_path):
        self.posts_dir_path = posts_dir_path
        if not posts_dir_path in _posts_by_path:
            _posts_by_path[posts_dir_path] = PostCollection(load_posts('/path/to/posts'))

    @property
    def posts(self):
        return _posts_by_path[self.posts_dir_path]

    def lookupById(self, id):
        return self.posts.get(id)

    def create(self, **kwargs):
        model = PostModel(**kwargs)
        self.posts.add(model)
        model.save()

    def update(self, **kwargs):
        model = self.posts.get(kwargs['id'])
        model.attrs['post_with_metadata'] = kwargs['post_with_metadata']
        model.save()



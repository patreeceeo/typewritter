from .models import load_posts, PostCollection

_posts_by_path = {}

class PostController(object):
    def __init__(self, posts_dir_path):
        self.posts_dir_path = posts_dir_path
        if posts_dir_path in _posts_by_path:
            return _posts_by_path[posts_dir_path]
        else:
            _posts_by_path[posts_dir_path] = PostCollection(load_posts('/path/to/posts'))

    @property
    def posts(self):
        return _posts_by_path[self.posts_dir_path]



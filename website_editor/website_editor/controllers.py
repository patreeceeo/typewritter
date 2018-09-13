from .models import load_posts, PostModel, PostCollection


# class BaseController(object):

#     def __init__(self, base_dir_path):
#         self.base_dir_path = base_dir_path
#         if not base_dir_path in _collection_by_path:
#             _collection_by_path[base_dir_path] = self.create_collection(base_dir_path)

#     def create_collection(self):
#         raise NotImplemented

#     def fetch(self, **search_crit):

_posts_by_path = {}
class PostController(object):
    def __init__(self, posts_dir_path):
        self.posts_dir_path = posts_dir_path
        if not posts_dir_path in _posts_by_path:
            _posts_by_path[posts_dir_path] = PostCollection(load_posts(posts_dir_path))

    def fetch(self, filter_crit=None):
        return _posts_by_path[self.posts_dir_path].to_json(filter_crit)

    def create(self, attrs):
        model = PostModel(**attrs)
        self.posts.add(model)
        model.save()

    def update(self, **kwargs):
        model = self.posts.get(kwargs['id'])
        model.attrs['post_with_metadata'] = kwargs['post_with_metadata']
        model.save()



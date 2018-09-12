from glob import glob

class PostCollection(object):
    def __init__(self, raw_models):
        self.by_id = {}
        self.length = 0
        for data in raw_models:
            self.add(PostModel(**data))

    def add(self, model):
        model.attrs['id'] = self.length
        self.by_id[model.attrs['id']] = model
        self.length = self.length + 1

    def get(self, id):
        return self.by_id[id]

    def to_json(self):
        return [
            model.to_json()
            for model in self.by_id.values()
        ]

class PostModel(object):

    def __init__(self, **kwargs):
        self.attrs = kwargs

    @classmethod
    def from_json(cls, data):
        return cls(**constructor_args)

    def to_json(self):
        return self.attrs

    def save(self):
        with open(self.attrs['abs_file_path'], 'w') as post_file:
            post_file.write(self.attrs['post_with_metadata'])


def load_post(abs_file_path):
    with open(abs_file_path, 'r') as post_file:
        return {
            'post_with_metadata': post_file.read(),
            'abs_file_path': abs_file_path
        }

def load_posts(post_dir_path):
    print('post_dir_path', post_dir_path)
    print('glob result', glob(post_dir_path + '/*.md'))

    return [
        load_post(path)
        for path in glob(post_dir_path + '/*.md')
    ]


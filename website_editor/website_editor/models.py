from glob import glob

class PostCollection(object):
    def __init__(self):
        # self.models = models
        self.by_id = {}

    def add(self, model):
        self.by_id[model.attrs['id']] = model

    def get(self, id):
        return self.by_id[id]

class PostModel(object):

    def __init__(self, **kwargs):
        self.attrs = kwargs

    @classmethod
    def from_json(cls, data):
        return cls(**constructor_args)

    def to_json(self):
        return self.attrs


def save_post(post_model):
    with open(post_model.abs_file_path, 'w') as post_file:
        post_file.write(post_model.post_with_metadata)

def load_post(abs_file_path):
    with open(abs_file_path, 'r') as post_file:
        return {
            'post_with_metadata': post_file.read(),
            'abs_file_path': abs_file_path
        }


def load_posts(post_dir_path):
    return [
        load_post(path)
        for path in glob(post_dir_path + '/*.md')
    ]


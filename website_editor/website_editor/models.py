


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
        # self.id = id
        # self.abs_file_path = BASE_PATH + file_path
        # self.post_with_metadata = post_with_metadata

    @classmethod
    def from_json(cls, data):
        return cls(**constructor_args)

    def to_json(self):
        return self.attrs
        # return {
        #     'id': self.id,
        #     'file_path': self.file_path,
        #     'post_with_metadata': self.post_with_metadata
        # }

    def abs_file_path(self):
        BASE_PATH='/Users/patrick/tmp'
        return BASE_PATH + self.attrs['file_path']


def save_post(post_model):
    with open(post_model.abs_file_path(), 'w') as post_file:
        post_file.write(post_model.post_with_metadata)

def load_post(post_model):
    with open(post_model.abs_file_path(), 'r') as post_file:
        post_model.post_with_metadata = post_file.read()


from glob import glob
import os

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

    def remove(self, id):
        del self.by_id[id]
        self.length -= 1

    def get(self, id):
        return self.by_id[id]

    def to_json(self, filter_crit=None):
        json_list = [model.to_json() for model in self.by_id.values()]
        return filter(filter_crit, json_list)

class PostModel(object):

    def __init__(self, **kwargs):
        self.attrs = kwargs

    @classmethod
    def from_json(cls, data):
        return cls(**data)

    def to_json(self):
        return self.attrs

    def save(self, dir_path):
        with open(os.path.join(dir_path, self.attrs['file_path']), 'w') as post_file:
            post_file.write(self.attrs['post_with_metadata'])

    def delete(self, dir_path):
        os.remove(os.path.join(dir_path, self.attrs['file_path']))



def load_post(file_path):
    with open(file_path, 'r') as post_file:
        return {
            'post_with_metadata': post_file.read(),
            'file_path': file_path
        }

def load_posts(post_dir_path):
    return [
        load_post(path)
        for path in glob(post_dir_path + '/*.md')
    ]


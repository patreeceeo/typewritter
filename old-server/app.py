from sqlalchemy import Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

BASE_PATH='/Users/patrick/tmp'

class Post(Base):
    __tablename__ = 'Post'
    id = Column(Integer, primary_key=True)
    file_path = Column(Text)

    def __init__(self, file_path):
        self.file_path = file_path

    @classmethod
    def from_json(cls, data):
        with open(BASE_PATH + data['file_path'], 'w') as post_file:
            post_file.write(data['post_with_metadata'])

        return cls({
            "file_path": data['file_path']
        })

    def to_json(self):
        d = {
            'file_path': getattr(self, 'file_path')
        }

        with open(BASE_PATH + getattr(self, 'file_path'), 'r') as post_file:
            d['post_with_metadata'] = post_file.read()

        return d


@resource(collection_path='/api/posts', path='/api/posts/{id}')
class PostView(object):

    def __init__(self, request):
        self.request = request

    def collection_get(self):
        return {
            'posts': [
                {
                    'id': post.id,
                    'file_path': post.file_path,
                    'post_with_metadata': post.post_with_metadata,
                }
                for Post in DBSession.query(Post)
            ]
        }

    def get(self):
        try:
            return DBSession.query(Post).get(
                int(self.request.matchdict['id'])).to_json()
        except:
            return {}

    def collection_post(self):
        post = self.request.json
        DBSession.add(Post.from_json(post))

    def put(self):
        try:
            obj=DBSession.query(Post).filter(Post.id==self.request.matchdict['id'])
            obj.update(self.request.json)

            return {
                'posts': [
                    {
                        'id': post.id,
                        'file_path': post.file_path,
                        'post_with_metadata': post.post_with_metadata,
                    }
                    for Post in DBSession.query(Post)
                ]
            }
        except:
            return {'result': 'No object found'}


    def delete(self):
        obj=DBSession.query(Post).filter(Post.id==self.request.matchdict['id']).first()
        DBSession.delete(obj)

        return {
            'posts': [
                {
                    'id': post.id,
                    'file_path': post.file_path,
                    'post_with_metadata': post.post_with_metadata,
                }
                for Post in DBSession.query(Post)
            ]
        }


# from wsgiref.simple_server import make_server
# from pyramid.config import Configurator
# from pyramid.response import Response


# def hello_world(request):
#     return Response("Hello World!")

# if __name__ == '__main__':
#     config = Configurator()
#     config.add_route('hello', '/')
#     config.add_view(hello_world, route_name='hello')
#     app = config.make_wsgi_app()
#     server = make_server('0.0.0.0', 6543, app)
#     server.serve_forever()

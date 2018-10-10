import unittest
from unittest.mock import patch, Mock
from pyfakefs import fake_filesystem_unittest
from pyramid import testing
from pyramid.httpexceptions import HTTPNotFound

class mock_registry:
    def __init__(self, posts_dir_path):
        self.settings = dict(
            posts_dir_path=posts_dir_path
        )


class MockPostController(object):
    def __init__(self, posts_dir_path):
        self.posts = [
            dict(
                post_id=0,
                file_path='1.md',
                post_with_metadata='Yes'
            ),
            dict(
                post_id=1,
                file_path='2.md',
                post_with_metadata='Si'
            )
        ]



    def fetch(self, filter_crit=None):
        return filter(filter_crit, self.posts)


class TestPostResource(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()
        patcher = patch('website_editor.resources.PostController', MockPostController)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.addCleanup(testing.tearDown)
        self.addCleanup(lambda: print('cleaning up!'))

    def test_post(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.registry = mock_registry('/path/to/posts')
        request.json_body = {
            'file_path': '/path/to/posts/3.md',
            'post_with_metadata': 'Yo!'
        }

        thing = PostResource(request)

        setattr(thing.post_controller, 'create', Mock())

        PostResource.collection_post(thing)

        thing.post_controller.create.assert_called_once_with(request.json_body)

    def test_put(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts/0'
        request.registry = mock_registry('/path/to/posts')
        request.matchdict = { 'post_id': 0 }
        request.json_body = {
            'post_with_metadata': 'Hi!'
        }

        thing = PostResource(request)

        setattr(thing.post_controller, 'update', Mock())

        PostResource.put(thing)

        thing.post_controller.update.assert_called_once_with(0, request.json_body)


    def test_get(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.matchdict = {'post_id': u'1'}
        request.registry = mock_registry('/path/to/posts')

        info = PostResource.get(PostResource(request))
        self.assertEqual(info['post_with_metadata'], 'Si')

    def test_collection_get(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts'
        request.registry = mock_registry('/path/to/posts')

        posts = PostResource.collection_get(PostResource(request))['posts']

        self.assertEqual(posts[0]['post_with_metadata'], 'Yes')
        self.assertEqual(posts[1]['post_with_metadata'], 'Si')

    def test_delete(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts'
        request.registry = mock_registry('/path/to/posts')
        request.matchdict = {
                'post_id': 1
        }

        thing = PostResource(request)

        setattr(thing.post_controller, 'delete', Mock())

        PostResource.delete(thing)

        thing.post_controller.delete.assert_called_once_with(1)



class TestPostController(unittest.TestCase):
    def test_reuses_collection_for_same_path(self):
        self.PostCollection = Mock()
        patcher = patch.multiple('website_editor.controllers',
            PostCollection=self.PostCollection,
            load_posts=lambda path: path,
        )
        patcher.start()
        self.addCleanup(patcher.stop)

        from .controllers import PostController
        from .models import PostCollection
        controller1 = PostController('path1')
        controller2 = PostController('path1')
        self.PostCollection.assert_called_once_with('path1')
        controller3 = PostController('path2')
        self.PostCollection.assert_called_with('path2')


class TestPostLoader(fake_filesystem_unittest.TestCase):
    def setUp(self):
        self.setUpPyfakefs()
        self.fs.create_file('/path/to/posts/1.md', contents='Yo!')
        self.fs.create_file('/path/to/posts/2.md', contents='Yo!')
        self.fs.create_file('/path/to/posts/3.md', contents='Yo!')

    def test_load_post(self):
        from .models import load_posts

        models = load_posts('/path/to/posts')

        self.assertEqual([
            {
                'file_path': '/path/to/posts/1.md',
                'post_with_metadata': 'Yo!'
            },
            {
                'file_path': '/path/to/posts/2.md',
                'post_with_metadata': 'Yo!'
            },
            {
                'file_path': '/path/to/posts/3.md',
                'post_with_metadata': 'Yo!'
            }
        ], models)


class TestPostModel(fake_filesystem_unittest.TestCase):
    def setUp(self):
        self.setUpPyfakefs()
        self.fs.create_dir('/path/to/posts')

    def test_save(self):
        from .models import PostModel
        model = PostModel(
            file_path='1.md',
            post_with_metadata='Hi'
        )
        model.save('/path/to/posts')

        with open('/path/to/posts/1.md') as post_file:
            self.assertEqual('Hi', post_file.read())

    def test_delete(self):
        from .models import PostModel
        import os
        model = PostModel(
            file_path='/path/to/posts/1.md',
            post_with_metadata='Hi'
        )
        model.save('/path/to/posts')
        model.delete('/path/to/posts')

        self.assertTrue(not os.path.isfile('/path/to/posts/1.md'))

    def test_from_json(self):
        from .models import PostModel
        attrs = {'file_path': '/', 'post_with_metadata': 'Hi!'}
        model = PostModel.from_json(attrs)
        self.assertEqual(attrs, model.attrs)

    def test_to_json(self):
        from .models import PostModel
        model = PostModel(file_path='/', post_with_metadata='Hi')
        self.assertEqual(model.attrs, model.to_json())


class FunctionalTests(fake_filesystem_unittest.TestCase):
    def setUp(self):
        from website_editor import main

        settings = {
            'posts_dir_path': '/path/to/posts'
        }
        app = main({}, **settings)

        from webtest import TestApp
        self.testapp = TestApp(app)

        self.setUpPyfakefs()
        self.fs.create_dir(settings['posts_dir_path'])

    def test_post_lifecycle(self):
        res = self.testapp.post_json('/api/posts', {
            'file_path': '/path/to/posts/1.md',
            'post_with_metadata': 'Hi!'
        })

        self.assertEqual(200, res.status_int)

        res = self.testapp.get('/api/posts')

        self.assertEqual(200, res.status_int)
        self.assertEqual(1, len(res.json_body))

        post_id = res.json_body['posts'][0]['post_id']

        res = self.testapp.put_json('/api/posts/%d' % post_id, {
            'file_path': '/path/to/posts/1.md',
            'post_with_metadata': 'Hola!'
        })

        self.assertEqual(200, res.status_int)

        res = self.testapp.get('/api/posts/%d' % post_id)

        self.assertEqual(200, res.status_int)
        self.assertEqual({
            'file_path': '/path/to/posts/1.md',
            'post_with_metadata': 'Hola!',
            'post_id': 0
        }, res.json_body)

        res = self.testapp.delete('/api/posts/%d' % post_id)

        self.assertEqual(200, res.status_int)

        res = self.testapp.get('/api/posts/%d' % post_id, status=404)

        self.assertEqual(404, res.status_int)


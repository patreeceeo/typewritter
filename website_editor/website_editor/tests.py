import unittest
from unittest.mock import patch, Mock
from pyfakefs import fake_filesystem_unittest
from pyramid import testing

class mock_registry:
    def __init__(self, posts_dir_path):
        self.settings = dict(
            posts_dir_path=posts_dir_path
        )

def mock_load_posts(posts_dir_path):
    def mock(path):
        return [
            dict(
                abs_file_path=posts_dir_path + '/1.md',
                post_with_metadata='Yes'
            ),
            dict(
                abs_file_path=posts_dir_path + '/2.md',
                post_with_metadata='Si'
            )
        ]

    return mock

class TestPostResource(fake_filesystem_unittest.TestCase):
    def setUp(self):
        self.setUpPyfakefs()
        self.config = testing.setUp()

    def tearDown(self):
        testing.tearDown()

    def test_post_post(self):
        from .resources import PostResource
        from glob import glob
        self.fs.create_dir('/path/to/posts')
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.registry = mock_registry('/path/to/posts')
        request.POST = {
            'abs_file_path': '/path/to/posts/1.md',
            'post_with_metadata': 'Yo!'
        }

        self.assertEqual([], glob('/path/to/posts/*.md'))

        PostResource.post(PostResource(request))

        self.assertEqual(['/path/to/posts/1.md'], glob('/path/to/posts/*.md'))


    @patch('website_editor.models.load_posts', mock_load_posts('/path/to/posts'))
    def test_get_post(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.matchdict = {'id': u'1'}
        request.registry = mock_registry('/path/to/posts')

        info = PostResource.get(PostResource(request))
        self.assertEqual(info['post_with_metadata'], 'Si')

    @patch('website_editor.models.load_posts', mock_load_posts('/path/to/posts'))
    def test_get_posts(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts'
        request.registry = mock_registry('/path/to/posts')

        posts = PostResource.collection_get(PostResource(request))['posts']

        self.assertEqual(posts[0]['post_with_metadata'], 'Yes')
        self.assertEqual(posts[1]['post_with_metadata'], 'Si')

    def test_put_post(self):
        from .resources import PostResource
        self.fs.create_file('/path/to/posts/1.md', contents='Yo!')
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.registry = mock_registry('/path/to/posts')
        request.PUT = {
            'id': 0,
            'abs_file_path': '/path/to/posts/1.md',
            'post_with_metadata': 'Hi!'
        }

        PostResource.put(PostResource(request))

        with open('/path/to/posts/1.md') as post_file:
            self.assertEqual('Hi!', post_file.read())


class TestPostController(unittest.TestCase):
    @patch('website_editor.models.PostCollection', Mock)
    @patch('website_editor.models.load_posts', Mock)
    def test_reuses_collection_for_same_path(self):
        from .controllers import PostController
        controller1 = PostController('path1')
        controller2 = PostController('path1')
        controller3 = PostController('path2')
        self.assertEqual(controller1.posts, controller2.posts)
        self.assertNotEqual(controller1.posts, controller3.posts)


class TestPostLoader(fake_filesystem_unittest.TestCase):
    def setUp(self):
        self.setUpPyfakefs()
        self.fs.create_file('/path/to/posts/1.md', contents='Yo!')
        self.fs.create_file('/path/to/posts/2.md', contents='Yo!')
        self.fs.create_file('/path/to/posts/3.md', contents='Yo!')

    def tearDown(self):
        testing.tearDown()

    def test_load_post(self):
        from .models import load_posts

        models = load_posts('/path/to/posts')

        self.assertEqual([
            {
                'abs_file_path': '/path/to/posts/1.md',
                'post_with_metadata': 'Yo!'
            },
            {
                'abs_file_path': '/path/to/posts/2.md',
                'post_with_metadata': 'Yo!'
            },
            {
                'abs_file_path': '/path/to/posts/3.md',
                'post_with_metadata': 'Yo!'
            }
        ], models)




# class FunctionalTests(unittest.TestCase):
#     def setUp(self):
#         from website_editor import main
#         app = main({})
#         from webtest import TestApp
#         self.testapp = TestApp(app)

#     def test_root(self):
#         res = self.testapp.get('/', status=200)
#         self.assertTrue(b'Pyramid' in res.body)

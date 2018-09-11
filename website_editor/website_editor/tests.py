import unittest
from unittest.mock import patch, Mock
from pyfakefs import fake_filesystem_unittest
from pyramid import testing

class mock_registry:
    settings = dict(
        posts_dir_path='/path/to/posts'
    )

def load_posts_mock(path):
    return [
        dict(
            abs_file_path='/path/to/posts/1.md',
            post_with_metadata='Yes'
        ),
        dict(
            abs_file_path='/path/to/posts/2.md',
            post_with_metadata='Si'
        )
    ]

class TestPostResource(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        testing.tearDown()

    # def test_post_post(self):
    #     from .resources import PostResource
    #     request = testing.DummyRequest()
    #     request.url = '/api/posts/1'
    #     request.POST = {
    #             'post_with_metadata': 'Yo!'
    #     }

    #     PostResource.post(PostResource(request))

    # TODO this test seems pretty trivial, maybe too much so
    @patch('website_editor.models.load_posts', load_posts_mock)
    def test_get_post(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.matchdict = {'id': u'1'}
        request.registry = mock_registry

        info = PostResource.get(PostResource(request))
        self.assertEqual(info['post_with_metadata'], 'Si')



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

import unittest
from pyfakefs import fake_filesystem_unittest
from pyramid import testing

class TestPostResource(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        testing.tearDown()

    # TODO this test seems pretty trivial, maybe too much so
    def test_get_post(self):
        from .resources import PostResource
        request = testing.DummyRequest()
        request.url = '/api/posts/1'
        request.matchdict = {'id': u'1'}

        info = PostResource.get(PostResource(request))
        self.assertEqual(info['post_with_metadata'], 'Yo!')


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

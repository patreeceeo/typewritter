import unittest

from pyramid import testing

class TestResources(unittest.TestCase):
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


# class FunctionalTests(unittest.TestCase):
#     def setUp(self):
#         from website_editor import main
#         app = main({})
#         from webtest import TestApp
#         self.testapp = TestApp(app)

#     def test_root(self):
#         res = self.testapp.get('/', status=200)
#         self.assertTrue(b'Pyramid' in res.body)

const app = require('../index.js');
const request = require('supertest');
const { setupDB } = require('./setupDB.js');

const testBob = {
  username: 'bob',
  location: 'London',
  email: 'bob@bob',
  password: '123456'
};

const testJane = {
  username: 'jane',
  location: 'New York',
  email: 'jane@jane',
  password: '123456'
};

const post1 = { text: 'test post 1' };
const post2 = { text: 'test post 2' };

const comment1 = { text: 'test comment 1' };

describe('Posts and Comments file tests', () => {
  setupDB('postsAndCommentsDB');

  describe('Post tests', () => {
    beforeAll(async () => {
      /// Add two users and store their ids for later tests ///
      const user1 = await request(app).post('/api/auth/register').send(testBob);
      const user2 = await request(app)
        .post('/api/auth/register')
        .send(testJane);
      testBob.id = user1.body._id;
      testJane.id = user2.body._id;

      /// Two test users become friends ///
      await request(app)
        .put(`/api/users/${testBob.id}/friend-request`)
        .send({ userId: testJane.id });
      await request(app)
        .put(`/api/users/${testJane.id}/accept`)
        .send({ userId: testBob.id });
    });

    test('Look for post that does not exist', async () => {
      const res = await request(app).get(`/api/posts/${post1.id}`);
      expect(res.status).toBe(500);
    });

    test('Create a new post (bob)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ authorId: testBob.id, text: post1.text });
      post1.id = res.body._id; // Store the post id for later tests
      expect(res.status).toBe(200);
      expect(res.body.text).toBe(post1.text);
    });

    test('Create a second new post (jane)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ authorId: testJane.id, text: post2.text });
      post2.id = res.body._id; // Store the post id for later tests
      expect(res.status).toBe(200);
      expect(res.body.text).toBe(post2.text);
    });

    test('Created post should now exist (bob)', async () => {
      const res = await request(app).get(`/api/posts/${post1.id}`);
      expect(res.status).toBe(200);
      expect(res.body.text).toBe(post1.text);
    });

    test('Created post should now exist (jane)', async () => {
      const res = await request(app).get(`/api/posts/${post2.id}`);
      expect(res.status).toBe(200);
      expect(res.body.text).toBe(post2.text);
    });

    test('Edit a post', async () => {
      const res = await request(app)
        .put(`/api/posts/${post1.id}`)
        .send({ authorId: testBob.id, text: 'Post 1 text edited' });
      expect(res.status).toBe(200);
      expect(res.body).toBe('The post was updated');
    });

    test('Check the edited post contains the new text', async () => {
      const res = await request(app).get(`/api/posts/${post1.id}`);
      expect(res.status).toBe(200);
      expect(res.body.text).toBe('Post 1 text edited');
    });

    test('Try to edit a post that is not users', async () => {
      const res = await request(app)
        .put(`/api/posts/${post2.id}`)
        .send({ authorId: testBob.id, text: 'Post 1 text edited' });
      expect(res.status).toBe(403);
      expect(res.body).toBe('You can only update your own posts');
    });

    test('Like a post', async () => {
      const res = await request(app)
        .put(`/api/posts/${post1.id}/like`)
        .send({ userId: testJane.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe('The post was liked');
    });

    test('Unlike a post', async () => {
      const res = await request(app)
        .put(`/api/posts/${post1.id}/like`)
        .send({ userId: testJane.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe('The post was unliked');
    });

    test('Get all posts for a single user', async () => {
      const res = await request(app).get(`/api/posts/author/${testBob.id}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    test('Get all posts for a user and their friends', async () => {
      const res = await request(app).get(`/api/posts/timeline/${testBob.id}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    test('Try to delete another users post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${post1.id}`)
        .send({ userId: testJane.id });
      expect(res.status).toBe(403);
      expect(res.body).toBe('You can only delete your own posts');
    });

    test('Delete a post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${post1.id}`)
        .send({ userId: testBob.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe('The post was deleted');
    });

    test('Deleted post should no longer exist', async () => {
      const res = await request(app).get(`/api/posts/${post1.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toBe(null);
    });
  });

  describe('Comment tests', () => {
    test('Comment on a post', async () => {
      const res = await request(app)
        .put(`/api/posts/${post2.id}/comment`)
        .send({ authorId: testBob.id, text: comment1.text });
      comment1.id = res.body._id; // Store the comment id for later tests
      expect(res.status).toBe(200);
      expect(res.body.text).toBe(comment1.text);
    });

    test('Get all comments for a post', async () => {
      const res = await request(app).get(`/api/posts/${post2.id}/comments`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    test('Try to delete another users comment', async () => {
      const res = await request(app)
        .delete(`/api/posts/comments/${comment1.id}`)
        .send({ authorId: testJane.id });
      expect(res.status).toBe(403);
      expect(res.body).toBe('You can only delete your own comments');
    });

    test('Delete a comment', async () => {
      const res = await request(app)
        .delete(`/api/posts/comments/${comment1.id}`)
        .send({ authorId: testBob.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe('Comment was deleted');
    });

    test('Deleted comment should not exist in the posts comment list', async () => {
      const res = await request(app).get(`/api/posts/${post2.id}/comments`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });
});

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

describe('Tests for Auth, FriendRequests and Users routes', () => {
  setupDB('testSocial1');

  /// Auth routes file ///
  describe('Auth tests', () => {
    test('Register a new user called bob', async () => {
      const res = await request(app).post('/api/auth/register').send(testBob);
      testBob.id = res.body._id; // Add the _id to user for later tests
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('bob');
    });

    test('Try to register an already registered user', async () => {
      const res = await request(app).post('/api/auth/register').send(testBob);
      expect(res.status).toBe(500);
    });

    test('Try to login a user that does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'none@none', password: '123456' });
      expect(res.status).toBe(404);
      expect(res.body).toBe('user not found');
    });

    test('Try to login a user with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bob@bob', password: '121212' });
      expect(res.status).toBe(400);
      expect(res.body).toBe('wrong password');
    });

    test('Register a second new user called jane', async () => {
      const res = await request(app).post('/api/auth/register').send(testJane);
      testJane.id = res.body._id; // Add the _id to user for later tests
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('jane');
    });

    test('Login a user that exists', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testBob.email, password: testBob.password });

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('bob');
    });
  });

  /// Friend request routes file ///
  describe('FriendRequests', () => {
    test('Make a friend request', async () => {
      const res = await request(app)
        .put(`/api/users/${testJane.id}/friend-request`)
        .send({ userId: testBob.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe(
        `Your friend request to ${testJane.username} was successful`
      );
    });

    test('Make a duplicate friend request', async () => {
      const res = await request(app)
        .put(`/api/users/${testJane.id}/friend-request`)
        .send({ userId: testBob.id });
      expect(res.status).toBe(403);
      expect(res.body).toBe(
        'Either you or this user already sent a request to the other!'
      );
    });

    test('Accept a friend request', async () => {
      const res = await request(app)
        .put(`/api/users/${testBob.id}/accept`)
        .send({ userId: testJane.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe(
        `You have accepted a friend request from ${testBob.username}`
      );
      const userList = await request(app).get(
        `/api/users/${testJane.id}/friends`
      );
      expect(userList.body.length).toBe(1);
    });

    test('Unfriend a friend', async () => {
      const res = await request(app)
        .put(`/api/users/${testBob.id}/unfriend`)
        .send({ userId: testJane.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe(`You unfriended ${testBob.username}`);
    });

    test('Janes friend list should now be empty', async () => {
      const userList = await request(app).get(
        `/api/users/${testJane.id}/friends`
      );
      expect(userList.body.length).toBe(0);

      const bobFriends = await request(app).get(
        `/api/users/${testBob.id}/friends`
      );

      const res = await request(app).get('/api/users/' + testJane.id);
    });

    test('Cancel a friend request', async () => {
      await request(app)
        .put(`/api/users/${testJane.id}/friend-request`)
        .send({ userId: testBob.id });
      const res = await request(app)
        .put(`/api/users/${testJane.id}/cancel`)
        .send({ userId: testBob.id });
      expect(res.status).toBe(200);
      expect(res.body).toBe(
        `You cancelled a friend request to ${testJane.username}`
      );
    });
  });

  /// User routes file ///
  describe('User routes file', () => {
    test('Get a user', async () => {
      const res = await request(app)
        .get(`/api/users/${testBob.id}`)
        .send({ userId: testBob.id });
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('bob');
      expect(res.body.location).toBe('London');
    });

    test('Successfully update a user', async () => {
      const res = await request(app)
        .put(`/api/users/${testBob.id}`)
        .send({ userId: testBob.id, location: 'Paris' });
      const updatedUser = await request(app).get(`/api/users/${testBob.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toBe('Account update successful');
      expect(updatedUser.body.location).toBe('Paris');
    });

    /// This should fail with the above code commented!? ///
    test('Get user friends', async () => {
      const a = await request(app)
        .put(`/api/users/${testJane.id}/friend-request`)
        .send({ userId: testBob.id });
      const b = await request(app)
        .put(`/api/users/${testBob.id}/accept`)
        .send({ userId: testJane.id });
      const res = await request(app).get(`/api/users/${testJane.id}/friends`);
      expect(res.status).toBe(200);
      expect(res.body[0]._id).toBe(testBob.id);
    });

    test('Delete a user', async () => {
      const res = await request(app)
        .delete(`/api/users/${testBob.id}`)
        .send({ userId: testBob.id });
      const removedUser = await request(app).get(`/api/users/${testBob.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toBe('Account has been deleted');
      expect(removedUser.status).toBe(404);
      expect(removedUser.body).toBe('User not found');
    });
  });
});

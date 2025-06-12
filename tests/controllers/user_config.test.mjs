import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import Signup from '../../models/signup_schema.js';
import Resource from '../../models/resource_schema.js';
import PResource from '../../models/resource_pending_approval.js';
import Enrollment from '../../models/enrollment.js';
import user_config from '../../controllers/user_config.js';

const { logout, updateProfile, UaddResource, getnot, enrollment, enrolledCourses } = user_config;

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      session: {},
    };
    res = {
      redirect: sinon.spy(),
      status: sinon.stub().returns({ json: sinon.spy(), send: sinon.spy() }),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('logout', () => {
    it('should destroy the session and redirect to home', (done) => {
      req.session.destroy = sinon.stub().yields(null);
      
      logout(req, res);

      expect(req.session.destroy.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/')).to.be.true;
      done();
    });

  
  });

  describe('updateProfile', () => {
    it('should update user profile and redirect to /profile', async () => {
      req.params.id = '663b776a164d4c6206438410';
      req.body = {
        profileName: 'New Name',
        profileEmail: 'newemail@example.com',
        profilePassword: 'password663b776a164d4c6206438410',
        profileConfirmPassword: 'password663b776a164d4c6206438410',
      };
      const user = { save: sinon.stub().resolves() };
      sinon.stub(Signup, 'findById').resolves(user);
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

      await updateProfile(req, res);

      expect(Signup.findById.calledWith('663b776a164d4c6206438410')).to.be.true;
      expect(user.save.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/profile')).to.be.true;
    });

    it('should return 400 if passwords do not match', async () => {
      req.body = {
        profileName: 'New Name',
        profileEmail: 'newemail@example.com',
        profilePassword: 'password663b776a164d4c6206438410',
        profileConfirmPassword: 'differentPassword',
      };

      await updateProfile(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.status().send.calledWith('Passwords do not match')).to.be.true;
    });

    it('should return 404 if user is not found', async () => {
      req.params.id = '663b776a164d4c6206438410';
      req.body = {
        profileName: 'New Name',
        profileEmail: 'newemail@example.com',
        profilePassword: 'password663b776a164d4c6206438410',
        profileConfirmPassword: 'password663b776a164d4c6206438410',
      };
      sinon.stub(Signup, 'findById').resolves(null);

      await updateProfile(req, res);

      expect(Signup.findById.calledWith('663b776a164d4c6206438410')).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().send.calledWith('User not found')).to.be.true;
    });

    it('should handle errors and send a 500 response', async () => {
      req.params.id = '663b776a164d4c6206438410';
      req.body = {
        profileName: 'New Name',
        profileEmail: 'newemail@example.com',
        profilePassword: 'password663b776a164d4c6206438410',
        profileConfirmPassword: 'password663b776a164d4c6206438410',
      };
      sinon.stub(Signup, 'findById').rejects(new Error('Error finding user'));

      await updateProfile(req, res);

      expect(Signup.findById.calledWith('663b776a164d4c6206438410')).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().send.calledWith('Error finding user')).to.be.true;
    });
  });

  describe('UaddResource', () => {
    it('should add a new resource and redirect to /adminDashboard', async () => {
      req.body = {
        name: 'Test Resource',
        category: 'Test Category',
        link: 'http://testlink.com',
        description: 'Test Description',
        image: 'testimage.png',
        notification: true,
        approval: false,
      };
      const newResource = new PResource(req.body);
      sinon.stub(PResource.prototype, 'save').resolves(newResource);

      await UaddResource(req, res);

      expect(PResource.prototype.save.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/adminDashboard')).to.be.true;
    });

    it('should handle errors and send a 500 response', async () => {
      req.body = {
        name: 'Test Resource',
        category: 'Test Category',
        link: 'http://testlink.com',
        description: 'Test Description',
        image: 'testimage.png',
        notification: true,
        approval: false,
      };
      sinon.stub(PResource.prototype, 'save').rejects(new Error('Save failed'));

      await UaddResource(req, res);

      expect(PResource.prototype.save.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Save failed' })).to.be.true;
    });
  });

  describe('getnot', () => {
    it('should return resources with notifications', async () => {
      const resources = [{ notification: true }];
      sinon.stub(Resource, 'find').resolves(resources);

      const result = await getnot();

      expect(Resource.find.calledWith({ notification: true })).to.be.true;
      expect(result).to.equal(resources);
    });

    it('should handle errors during retrieval', async () => {
      sinon.stub(Resource, 'find').rejects(new Error('Error retrieving resources'));

      try {
        await getnot();
      } catch (error) {
        expect(Resource.find.calledWith({ notification: true })).to.be.true;
        expect(error.message).to.equal('Error retrieving resources');
      }
    });
  });

  describe('enrollment', () => {
    it('should redirect to /signin if user is not logged in', async () => {
      req.params.id = 'resourceId';

      await enrollment(req, res);

      expect(res.redirect.calledWith('/signin')).to.be.true;
    });

    it('should create a new enrollment and redirect to home', async () => {
      req.session.User = { _id: 'userId' };
      req.params.id = 'resourceId';
      sinon.stub(Enrollment, 'findOne').resolves(null);
      sinon.stub(Enrollment.prototype, 'save').resolves();

      await enrollment(req, res);

      expect(Enrollment.findOne.calledWith({ user_id: 'userId', resource_id: 'resourceId' })).to.be.true;
      expect(Enrollment.prototype.save.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/')).to.be.true;
    });

    it('should redirect to home if user is already enrolled', async () => {
      req.session.User = { _id: 'userId' };
      req.params.id = 'resourceId';
      sinon.stub(Enrollment, 'findOne').resolves({});

      await enrollment(req, res);

      expect(Enrollment.findOne.calledWith({ user_id: 'userId', resource_id: 'resourceId' })).to.be.true;
      expect(res.redirect.calledWith('/')).to.be.true;
    });
  });

  describe('enrolledCourses', () => {
    it('should return enrolled courses for the user', async () => {
      req.session.User = { _id: 'userId' };
      const enrollments = [{ resource_id: 'resourceId' }];
      const resources = [{ _id: 'resourceId' }];
      sinon.stub(Enrollment, 'find').resolves(enrollments);
      sinon.stub(Resource, 'findById').resolves(resources[0]);

      const result = await enrolledCourses(req, res);

      expect(Enrollment.find.calledWith({ user_id: 'userId' })).to.be.true;
      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(result).to.deep.equal(resources);
    });

    it('should handle errors during retrieval', async () => {
      req.session.User = { _id: 'userId' };
      sinon.stub(Enrollment, 'find').rejects(new Error('Error fetching enrollments'));

      await enrolledCourses(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Internal server error' })).to.be.true;
    });
  });
});

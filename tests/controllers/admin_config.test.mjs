import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import Signup from '../../models/signup_schema.js';
import Resource from '../../models/resource_schema.js';
import PResource from '../../models/resource_pending_approval.js';
import admin_config from '../../controllers/admin_config.js';

const { addResource, updateResource, deleteResource, addUser, deleteUser, updateUser, udeleteResource, approveResource } = admin_config;

describe('Admin Controller', () => {
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

  describe('addResource', () => {
    it('should add a new resource and redirect to /adminDashboard', async () => {
      req.body = {
        name: 'Test Resource',
        category: 'Test Category',
        link: 'http://testlink.com',
        description: 'Test Description',
        image: 'testimage.png',
        notification: true,
      };
      sinon.stub(Resource.prototype, 'save').resolves();

      await addResource(req, res);

      expect(Resource.prototype.save.calledOnce).to.be.true;
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
      };
      sinon.stub(Resource.prototype, 'save').rejects(new Error('Save failed'));

      await addResource(req, res);

      expect(Resource.prototype.save.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Save failed' })).to.be.true;
    });
  });

  describe('updateResource', () => {
    it('should update an existing resource and redirect to /adminDashboard', async () => {
      req.params.id = 'resourceId';
      req.body = {
        name: 'Updated Test Resource',
        category: 'Updated Test Category',
        link: 'http://updatedtestlink.com',
        description: 'Updated Test Description',
        image: 'updatedtestimage.png',
        notification: false,
      };
      sinon.stub(Resource, 'findById').resolves({});
      sinon.stub(Resource.prototype, 'save').resolves();

      await updateResource(req, res);

      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(Resource.prototype.save.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/adminDashboard')).to.be.true;
    });

    it('should handle errors and send a 500 response', async () => {
      req.params.id = 'resourceId';
      req.body = {
        name: 'Updated Test Resource',
        category: 'Updated Test Category',
        link: 'http://updatedtestlink.com',
        description: 'Updated Test Description',
        image: 'updatedtestimage.png',
        notification: false,
      };
      sinon.stub(Resource, 'findById').resolves({});
      sinon.stub(Resource.prototype, 'save').rejects(new Error('Update failed'));

      await updateResource(req, res);

      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(Resource.prototype.save.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Update failed' })).to.be.true;
    });

    it('should return 404 if resource is not found', async () => {
      req.params.id = 'resourceId';
      req.body = {
        name: 'Updated Test Resource',
        category: 'Updated Test Category',
        link: 'http://updatedtestlink.com',
        description: 'Updated Test Description',
        image: 'updatedtestimage.png',
        notification: false,
      };
      sinon.stub(Resource, 'findById').resolves(null);

      await updateResource(req, res);

      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Resource not found' })).to.be.true;
    });
  });

  describe('deleteResource', () => {
    it('should delete an existing resource and redirect to /adminDashboard', async () => {
      req.params.id = 'resourceId';
      sinon.stub(Resource, 'findById').resolves({});
      sinon.stub(Resource.prototype, 'deleteOne').resolves();

      await deleteResource(req, res);

      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(Resource.prototype.deleteOne.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/adminDashboard')).to.be.true;
    });

    it('should handle errors and send a 500 response', async () => {
      req.params.id = 'resourceId';
      sinon.stub(Resource, 'findById').resolves({});
      sinon.stub(Resource.prototype, 'deleteOne').rejects(new Error('Deletion failed'));

      await deleteResource(req, res);

      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(Resource.prototype.deleteOne.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Deletion failed' })).to.be.true;
    });

    it('should return 404 if resource is not found', async () => {
      req.params.id = 'resourceId';
      sinon.stub(Resource, 'findById').resolves(null);

      await deleteResource(req, res);

      expect(Resource.findById.calledWith('resourceId')).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Resource not found' })).to.be.true;
    });
  });

  describe('addUser', () => {
    // Test cases for addUser function
  });

  describe('deleteUser', () => {
    // Test cases for deleteUser function
  });

  describe('updateUser', () => {
    // Test cases for updateUser function
  });

  describe('udeleteResource', () => {
    // Test cases for udeleteResource function
  });

  describe('approveResource', () => {
    // Test cases for approveResource function
  });
});

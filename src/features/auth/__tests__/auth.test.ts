import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loginSchema, registerSchema } from '../schemas.ts';
import { resolvePrimaryDashboardPath, type AppRole } from '../queries.ts';

describe('Auth Feature Slice - Unit Tests', () => {
  describe('loginSchema', () => {
    it('validates and transforms correct email and password', () => {
      const result = loginSchema.safeParse({
        email: '  Coordinator@University.EDU  ',
        password: 'securepassword123',
      });

      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.email, 'coordinator@university.edu');
        assert.equal(result.data.password, 'securepassword123');
      }
    });

    it('rejects invalid email addresses', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'validpassword',
      });

      assert.equal(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.email);
        assert.ok(errors.email.length > 0);
      }
    });

    it('rejects passwords shorter than 8 characters', () => {
      const result = loginSchema.safeParse({
        email: 'user@university.edu',
        password: 'short',
      });

      assert.equal(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.password);
        assert.ok(errors.password[0].includes('8 characters'));
      }
    });
  });

  describe('registerSchema', () => {
    it('validates valid registration input and trims full name', () => {
      const result = registerSchema.safeParse({
        fullName: '  Dr. Maria Santos  ',
        email: '  MSantos@College.EDU ',
        password: 'supersecretpass12',
        confirmPassword: 'supersecretpass12',
      });

      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.fullName, 'Dr. Maria Santos');
        assert.equal(result.data.email, 'msantos@college.edu');
      }
    });

    it('rejects mismatched passwords with clear error on confirmPassword', () => {
      const result = registerSchema.safeParse({
        fullName: 'Prof. John Doe',
        email: 'jdoe@univ.edu',
        password: 'password1234',
        confirmPassword: 'password9999',
      });

      assert.equal(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.confirmPassword);
        assert.equal(errors.confirmPassword[0], 'Passwords do not match');
      }
    });

    it('rejects full name shorter than 2 characters', () => {
      const result = registerSchema.safeParse({
        fullName: 'A',
        email: 'a@univ.edu',
        password: 'password123',
        confirmPassword: 'password123',
      });

      assert.equal(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.fullName);
      }
    });
  });

  describe('resolvePrimaryDashboardPath - Role Hierarchy & Precedence', () => {
    it('resolves admin with highest priority even when holding multiple roles', () => {
      const roles: AppRole[] = ['faculty', 'evaluator', 'admin', 'coordinator'];
      assert.equal(resolvePrimaryDashboardPath(roles), '/admin');
    });

    it('resolves coordinator if admin is absent', () => {
      const roles: AppRole[] = ['faculty', 'evaluator', 'coordinator'];
      assert.equal(resolvePrimaryDashboardPath(roles), '/coordinator');
    });

    it('resolves evaluator if neither admin nor coordinator is present', () => {
      const roles: AppRole[] = ['faculty', 'evaluator'];
      assert.equal(resolvePrimaryDashboardPath(roles), '/evaluator');
    });

    it('resolves faculty for sole faculty role', () => {
      const roles: AppRole[] = ['faculty'];
      assert.equal(resolvePrimaryDashboardPath(roles), '/faculty');
    });

    it('resolves /pending-approval for empty role array', () => {
      const roles: AppRole[] = [];
      assert.equal(resolvePrimaryDashboardPath(roles), '/pending-approval');
    });
  });
});

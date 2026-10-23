import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  toggleUserRoleSchema,
  validateRoleMutationPolicy,
} from '../schemas.ts';
import {
  mapProfilesWithRoles,
  type ProfileRow,
  type UserRoleRow,
} from '../queries.ts';

describe('Admin User & Role Management - Unit Tests', () => {
  describe('toggleUserRoleSchema', () => {
    it('accepts valid UUID, role, and intent', () => {
      const result = toggleUserRoleSchema.safeParse({
        targetUserId: '550e8400-e29b-41d4-a716-446655440000',
        role: 'coordinator',
        intent: 'grant',
      });

      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.role, 'coordinator');
        assert.equal(result.data.intent, 'grant');
      }
    });

    it('rejects invalid UUID targetUserId', () => {
      const result = toggleUserRoleSchema.safeParse({
        targetUserId: 'not-a-uuid',
        role: 'admin',
        intent: 'grant',
      });

      assert.equal(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.targetUserId);
      }
    });

    it('rejects unsupported role strings', () => {
      const result = toggleUserRoleSchema.safeParse({
        targetUserId: '550e8400-e29b-41d4-a716-446655440000',
        role: 'super_hacker',
        intent: 'grant',
      });

      assert.equal(result.success, false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        assert.ok(errors.role);
      }
    });
  });

  describe('validateRoleMutationPolicy - Self-Lockout Protection', () => {
    const adminId = '11111111-1111-1111-1111-111111111111';
    const otherUserId = '22222222-2222-2222-2222-222222222222';

    it('blocks self-revocation of admin role', () => {
      const result = validateRoleMutationPolicy({
        actorUserId: adminId,
        targetUserId: adminId,
        role: 'admin',
        intent: 'revoke',
      });

      assert.equal(result.allowed, false);
      if (!result.allowed) {
        assert.equal(result.reason, 'You cannot revoke your own admin role.');
      }
    });

    it('permits an admin to revoke other roles from themselves', () => {
      const result = validateRoleMutationPolicy({
        actorUserId: adminId,
        targetUserId: adminId,
        role: 'evaluator',
        intent: 'revoke',
      });

      assert.equal(result.allowed, true);
    });

    it('permits an admin to grant roles to themselves', () => {
      const result = validateRoleMutationPolicy({
        actorUserId: adminId,
        targetUserId: adminId,
        role: 'coordinator',
        intent: 'grant',
      });

      assert.equal(result.allowed, true);
    });

    it('permits revoking admin from a different user', () => {
      const result = validateRoleMutationPolicy({
        actorUserId: adminId,
        targetUserId: otherUserId,
        role: 'admin',
        intent: 'revoke',
      });

      assert.equal(result.allowed, true);
    });
  });

  describe('mapProfilesWithRoles - Profile and Role Aggregation', () => {
    it('correctly associates multiple roles and computes isPending status', () => {
      const profiles: ProfileRow[] = [
        {
          id: 'user-active-1',
          email: 'active@univ.edu',
          full_name: 'Dr. Jane Smith',
          avatar_url: null,
          department: 'Computer Science',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        {
          id: 'user-pending-1',
          email: 'pending@univ.edu',
          full_name: 'Prof. John Doe',
          avatar_url: null,
          department: 'Engineering',
          created_at: '2026-01-02T00:00:00Z',
          updated_at: '2026-01-02T00:00:00Z',
        },
      ];

      const roles: UserRoleRow[] = [
        {
          id: 'role-1',
          user_id: 'user-active-1',
          role: 'coordinator',
          created_at: '2026-01-01T01:00:00Z',
        },
        {
          id: 'role-2',
          user_id: 'user-active-1',
          role: 'faculty',
          created_at: '2026-01-01T01:00:00Z',
        },
      ];

      const mapped = mapProfilesWithRoles(profiles, roles);

      // Pending users must appear first
      assert.equal(mapped.length, 2);
      assert.equal(mapped[0].id, 'user-pending-1');
      assert.equal(mapped[0].isPending, true);
      assert.deepEqual(mapped[0].roles, []);

      // Active user has both roles
      assert.equal(mapped[1].id, 'user-active-1');
      assert.equal(mapped[1].isPending, false);
      assert.deepEqual(mapped[1].roles, ['coordinator', 'faculty']);
    });
  });
});

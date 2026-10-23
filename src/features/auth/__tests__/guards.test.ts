import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRoleAccess, type AppRole } from '../guards.ts';

describe('Role Guard Logic - evaluateRoleAccess', () => {
  it('allows access when requiredRole is present in a single-role array', () => {
    const roles: AppRole[] = ['faculty'];
    const result = evaluateRoleAccess(roles, 'faculty');

    assert.equal(result.allowed, true);
  });

  it('allows access when requiredRole is present in a multi-role array', () => {
    const roles: AppRole[] = ['faculty', 'evaluator'];
    const resultFaculty = evaluateRoleAccess(roles, 'faculty');
    const resultEvaluator = evaluateRoleAccess(roles, 'evaluator');

    assert.equal(resultFaculty.allowed, true);
    assert.equal(resultEvaluator.allowed, true);
  });

  it('denies access and redirects to /faculty when a faculty user attempts to access admin', () => {
    const roles: AppRole[] = ['faculty'];
    const result = evaluateRoleAccess(roles, 'admin');

    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.redirectTo, '/faculty');
    }
  });

  it('denies access and redirects to /admin when an admin user attempts to access evaluator without the role', () => {
    const roles: AppRole[] = ['admin'];
    const result = evaluateRoleAccess(roles, 'evaluator');

    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.redirectTo, '/admin');
    }
  });

  it('denies access and redirects to /pending-approval when user has no assigned roles', () => {
    const roles: AppRole[] = [];
    const result = evaluateRoleAccess(roles, 'coordinator');

    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.redirectTo, '/pending-approval');
    }
  });
});

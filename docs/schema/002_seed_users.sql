-- ==============================================================================
-- OAMS: Local Development & Staging Seed Accounts
-- ==============================================================================
-- Note: Supabase GoTrue scanner requires token columns to be empty string ''
-- instead of NULL to prevent "Database error querying schema" (converting NULL to string).

DO $$
DECLARE
  v_admin_id uuid := 'a0000000-0000-0000-0000-000000000001';
  v_coord_id uuid := 'a0000000-0000-0000-0000-000000000002';
  v_eval_id  uuid := 'a0000000-0000-0000-0000-000000000003';
  v_fac_id   uuid := 'a0000000-0000-0000-0000-000000000004';
  v_hashed_pw text := crypt('Password123!', gen_salt('bf'));
BEGIN
  -- 1. Insert or Update Admin
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change_token_current,
    email_change, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at
  ) VALUES (
    v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin@oams.edu', v_hashed_pw, now(),
    '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Dr. Arthur Admin"}', false, now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = v_hashed_pw,
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change_token_current = '',
    reauthentication_token = '';

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_admin_id, v_admin_id,
    jsonb_build_object('sub', v_admin_id::text, 'email', 'admin@oams.edu'),
    'email', v_admin_id::text, now(), now(), now()
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Insert or Update Coordinator
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change_token_current,
    email_change, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at
  ) VALUES (
    v_coord_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'coordinator@oams.edu', v_hashed_pw, now(),
    '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Prof. Clara Coordinator"}', false, now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = v_hashed_pw,
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change_token_current = '',
    reauthentication_token = '';

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_coord_id, v_coord_id,
    jsonb_build_object('sub', v_coord_id::text, 'email', 'coordinator@oams.edu'),
    'email', v_coord_id::text, now(), now(), now()
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Insert or Update Evaluator
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change_token_current,
    email_change, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at
  ) VALUES (
    v_eval_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'evaluator@oams.edu', v_hashed_pw, now(),
    '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Dr. Edward Evaluator"}', false, now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = v_hashed_pw,
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change_token_current = '',
    reauthentication_token = '';

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_eval_id, v_eval_id,
    jsonb_build_object('sub', v_eval_id::text, 'email', 'evaluator@oams.edu'),
    'email', v_eval_id::text, now(), now(), now()
  ) ON CONFLICT (id) DO NOTHING;

  -- 4. Insert or Update Faculty
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change_token_current,
    email_change, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at
  ) VALUES (
    v_fac_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'faculty@oams.edu', v_hashed_pw, now(),
    '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Prof. Fiona Faculty"}', false, now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = v_hashed_pw,
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change_token_current = '',
    reauthentication_token = '';

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_fac_id, v_fac_id,
    jsonb_build_object('sub', v_fac_id::text, 'email', 'faculty@oams.edu'),
    'email', v_fac_id::text, now(), now(), now()
  ) ON CONFLICT (id) DO NOTHING;

  -- 5. Upsert Profiles
  INSERT INTO public.profiles (id, email, full_name, department) VALUES
    (v_admin_id, 'admin@oams.edu', 'Dr. Arthur Admin', 'Quality Assurance Office'),
    (v_coord_id, 'coordinator@oams.edu', 'Prof. Clara Coordinator', 'Academic Affairs'),
    (v_eval_id, 'evaluator@oams.edu', 'Dr. Edward Evaluator', 'Accreditation Board'),
    (v_fac_id, 'faculty@oams.edu', 'Prof. Fiona Faculty', 'Computer Science Department')
  ON CONFLICT (id) DO UPDATE SET
    full_name = excluded.full_name,
    department = excluded.department;

  -- 6. Assign Roles
  INSERT INTO public.user_roles (user_id, role) VALUES
    (v_admin_id, 'admin'),
    (v_coord_id, 'coordinator'),
    (v_eval_id, 'evaluator'),
    (v_fac_id, 'faculty')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;


CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  has_any_admin BOOLEAN;
BEGIN
  IF uid IS NULL THEN RETURN FALSE; END IF;
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_any_admin;
  IF has_any_admin THEN RETURN FALSE; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN TRUE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

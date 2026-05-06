
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

ALTER FUNCTION public.set_updated_at() SET search_path = public;

DROP POLICY "anyone can submit quote" ON public.quote_requests;
CREATE POLICY "anyone can submit quote" ON public.quote_requests
  FOR INSERT WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 1 AND 2000
  );

DROP POLICY "anyone can submit review" ON public.reviews;
CREATE POLICY "anyone can submit review" ON public.reviews
  FOR INSERT WITH CHECK (
    rating BETWEEN 1 AND 5
    AND length(customer_name) BETWEEN 1 AND 100
    AND length(comment) BETWEEN 1 AND 1000
  );

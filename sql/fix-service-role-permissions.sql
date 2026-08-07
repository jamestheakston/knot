-- Grant service_role SELECT access to habits table
GRANT SELECT ON public.habits TO service_role;

-- Grant service_role SELECT access to other tables if needed
GRANT SELECT ON public.pods TO service_role;
GRANT SELECT ON public.pod_members TO service_role;
GRANT SELECT ON public.check_ins TO service_role;
GRANT SELECT ON public.user_profiles TO service_role;

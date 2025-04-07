
-- Create a function to check if an email exists in auth.users table
create or replace function public.check_email_exists(email_to_check text)
returns int
language plpgsql security definer
as $$
declare
  user_count int;
begin
  select count(*) into user_count from auth.users where email = email_to_check;
  return user_count;
end;
$$;

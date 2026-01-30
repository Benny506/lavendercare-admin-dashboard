import { createClient } from '@supabase/supabase-js'
import { generateNumericCode } from '../lib/utils'
import { requestApi } from '../lib/requestApi'
import { data } from 'react-router-dom'

export const SUPABASE_URL = 'https://tzsbbbxpdlupybfrgdbs.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6c2JiYnhwZGx1cHliZnJnZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzU0MTEsImV4cCI6MjA2NzU1MTQxMX0.3MPot37N05kaUG8W84JItSKgH2bymVBee1MxJ905XEk'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: { params: { eventsPerSecond: 10 } },
    debug: true // This will print realtime connection logs
})

export default supabase





//LOGIN
export async function adminLogin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log("Users error", error)
    return { errorMsg: error.message, data: null };
  }
  
  const { data: infoData, error: infoError } = await getAdminDetails({ id: data.user.id })

  if(infoError){
    return {
      data: null,
      errorMsg: infoError
    }
  }

  return {
    data: {
      user: data.user,
      session: data.session,
      profile: {
        ...data, ...infoData?.profile
      },
      ...infoData      
    },
    errorMsg: null
  }
}
export async function getAdminDetails({ id }){

  try {
  
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("*")
      .eq("role_for", "admin")

    const { data: allPermissions, error: allPermissionsError } = await supabase
      .from("permissions")
      .select("*")
      .eq("perm_for", "admin")      

    const { data: allusers, error: allUsersError } = await supabase.rpc('get_all_profiles_with_email')
    const { data: profileData, error: profileError } = await supabase
      .from("admins")
      .select('*')
      .eq('id', id) 
      .single();

      const { data: permissions, error: permissionsError } = await supabase.rpc("get_my_permissions")

    if(
        profileError
        ||
        allUsersError
        ||
        permissionsError || allPermissionsError || rolesError
      ){
      console.log("Profile error", profileError)
      console.log("All users error", allUsersError)
      console.log("permissionsError", permissionsError)
      console.log("allPermissionsError", allPermissionsError)
      console.log("rolesError", rolesError)

      return { error: "Error getting admin profile", data: null };
    }

    const { users: mothers, providers, vendors } = allusers

    return{
      data: {
        profile: profileData,
        providers,
        mothers,
        vendors,
        permissions,
        roles,
        allPermissions
      },
      error: null
    }   
    
    
  } catch (error) {
    console.log(error)
    return { error: "Error getting admon profile", data: null };
  }
}





// OTP 
export async function createOrUpdateOtp({ email, requiresAuth }) {
    // 1. Check if user exists in auth.mothers
    const { data: userExistsData, error: existsError } = await supabase
        .rpc('user_exists', { email_input: email });

    const userAlreadyExists = userExistsData === true ? true : false

    if(requiresAuth){
        if(!userAlreadyExists){
            return { userAlreadyExists }
        }

    } else{
        if (userAlreadyExists) {
            return { userAlreadyExists };
        }
    }


    // 2. Generate 6-digit OTP
    const otp = generateNumericCode(6)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 3. Upsert into otps
    const { error: otpError } = await supabase
        .from('otps')
        .upsert(
            {
                email,
                otp,
                expires_at: expiresAt,
            },
            { onConflict: ['email'] }
    );

    if (otpError) {
        console.log('Error upserting OTP:', otpError);

        if(requiresAuth){
            return { error: 'Error sending OTP to mail', userAlreadyExists }
        }

        return { error: 'Error sending OTP to mail' }
    }

    if(requiresAuth){
        return { token: { otp, expiresAt }, userAlreadyExists };
    }

    return { token: { otp, expiresAt } };
}
export async function validateOtp({ email, otp }) {
  const { data: isValid, error } = await supabase
    .rpc('validate_otp', { provider_email: email, provider_otp: otp });

  if (error) {
    console.error('OTP validation error:', error);
    throw error;
  }

  return isValid; // boolean
}

export async function checkPhoneNumberExists({ phone_number }) {
  const { data: isUsed, error } = await supabase
    .rpc('check_phone_number_exists', { p_phone: phone_number });
    
  if (error) {
    console.error('Phone number check error:', error);
    throw error;
  }

  return isUsed; // boolean
}
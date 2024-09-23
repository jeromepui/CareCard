import supabase from './Supabase'

export async function Auth(email, password) {
    const { data } = await supabase.from('volunteers').select().eq('email', email).limit(1)

    if (data.length < 1) {
        return 'Volunteer not found'
    }

    let volunteer = data[0]

    // password does not match
    if (password !== volunteer.password) {
        return 'Wrong credentials'
    }
}

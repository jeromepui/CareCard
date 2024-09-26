import supabase from '../Supabase'

export const api = {
    async fetchVisits(userEmail) {
        try {
            const { data: volunteerData, error: volunteerError } = await supabase
                .from('volunteers')
                .select('id')
                .eq('email', userEmail)
                .single()

            if (volunteerError) throw volunteerError

            const { data, error } = await supabase
                .from('activities')
                .select('id, volunteer_id, category, issue, activity_date, seniors (id, name)')
                .eq('volunteer_id', volunteerData.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            return data
        } catch (err) {
            console.error(err)
            throw err
        }
    },

    async fetchSeniorData(id) {
        const { data, error } = await supabase.from('seniors').select('*').eq('id', id).single()
        if (error) throw error
        return data
    },

    async fetchCareSummary(id) {
        const { data, error } = await supabase
            .from('care_summary')
            .select('response')
            .eq('senior_id', id)
            .single()
        if (error) throw error
        return data.response
    },

    async fetchRecentVisits(id) {
        const { data, error } = await supabase
            .from('activities')
            .select('*, volunteers(organisation)')
            .eq('senior_id', id)
            .order('activity_date', { ascending: false })
            .limit(5)
        if (error) throw error
        return data
    },

    async fetchOrganisations(id) {
        const { data, error } = await supabase
            .from('activities')
            .select('category, volunteers(organisation)')
            .eq('senior_id', id)
            .order('activity_date', { ascending: false })
        if (error) throw error
        return data
    },

    async fetchUserName(userEmail) {
        const { data, error } = await supabase
            .from('volunteers')
            .select('name')
            .eq('email', userEmail)
            .single()
        if (error) throw error
        return data.name
    },

    async fetchUserData(userEmail) {
        const { data, error } = await supabase
            .from('volunteers')
            .select('id, name, organisation')
            .eq('email', userEmail)
            .single()
        if (error) throw error
        return data
    },
}

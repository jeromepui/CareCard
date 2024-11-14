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

    fetchUserData: async email => {
        const { data, error } = await supabase
            .from('volunteers')
            .select(
                `
                    id,
                    name,
                    email,
                    organisation_id,
                    organisations (
                        name,
                        contact_info
                    )
                `
            )
            .eq('email', email)
            .single()
        if (error) throw error
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            organisation_id: data.organisation_id,
            organisation: data.organisations?.name || '',
            organisation_contact: data.organisations?.contact_info || '',
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
            .select(
                `
                    id,
                    category,
                    activity_date,
                    issue,
                    volunteers (
                        id,
                        name,
                        organisations (
                            name
                        )
                    )
                `
            )
            .eq('senior_id', id)
            .order('activity_date', { ascending: false })
            .limit(10)

        if (error) throw error

        return data.map(visit => ({
            id: visit.id,
            category: visit.category,
            activity_date: visit.activity_date,
            issue: visit.issue,
            volunteer: visit.volunteers
                ? {
                      id: visit.volunteers.id,
                      name: visit.volunteers.name,
                      organisation: visit.volunteers.organisations
                          ? visit.volunteers.organisations.name
                          : 'N/A',
                  }
                : null,
        }))
    },

    async fetchOrganisations(id) {
        const { data, error } = await supabase
            .from('activities')
            .select(
                `
                    category,
                    volunteers (
                        organisation_id,
                        organisations (
                            name,
                            contact_info
                        )
                    )
                `
            )
            .eq('senior_id', id)
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

    async updateCareSummary(seniorId, summary) {
        const { data, error } = await supabase
            .from('care_summary')
            .update({ 
                response: summary,
                updated_at: new Date().toISOString()
            })
            .eq('senior_id', seniorId)
            .select()

        if (error) throw error
        return data
    },
}

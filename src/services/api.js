import supabase from '../Supabase'

const handleError = (error, message = 'API Error') => {
    console.error(message, error)
    throw error
}

export const api = {
    async fetchVisits(userEmail) {
        try {
            const { data: volunteerData, error: volunteerError } = await supabase
                .from('volunteers')
                .select('id')
                .eq('email', userEmail)
                .single()

            if (volunteerError) handleError(volunteerError, 'Error fetching volunteer')

            const { data, error } = await supabase
                .from('activities')
                .select(
                    `
                    id, 
                    volunteer_id, 
                    category, 
                    issue, 
                    resolved, 
                    activity_date, 
                    created_at,
                    seniors (id, name)
                `
                )
                .eq('volunteer_id', volunteerData.id)
                .order('created_at', { ascending: false })

            if (error) handleError(error, 'Error fetching activities')
            return data
        } catch (error) {
            handleError(error, 'Error in fetchVisits')
        }
    },

    async fetchUserData(email) {
        try {
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

            if (error) handleError(error, 'Error fetching user data')

            return {
                id: data.id,
                name: data.name,
                email: data.email,
                organisation_id: data.organisation_id,
                organisation: data.organisations?.name || '',
                organisation_contact: data.organisations?.contact_info || '',
            }
        } catch (error) {
            handleError(error, 'Error in fetchUserData')
        }
    },

    async fetchSeniorData(id) {
        try {
            const { data, error } = await supabase.from('seniors').select('*').eq('id', id).single()

            if (error) handleError(error, 'Error fetching senior data')
            return data
        } catch (error) {
            handleError(error, 'Error in fetchSeniorData')
        }
    },

    async fetchCareSummary(id) {
        try {
            const { data, error } = await supabase
                .from('care_summary')
                .select('response')
                .eq('senior_id', id)
                .single()

            if (error) handleError(error, 'Error fetching care summary')
            return data.response
        } catch (error) {
            handleError(error, 'Error in fetchCareSummary')
        }
    },

    async fetchRecentVisits(id) {
        try {
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

            if (error) handleError(error, 'Error fetching recent visits')

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
        } catch (error) {
            handleError(error, 'Error in fetchRecentVisits')
        }
    },

    async fetchOrganisations(id) {
        try {
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

            if (error) handleError(error, 'Error fetching organisations')
            return data
        } catch (error) {
            handleError(error, 'Error in fetchOrganisations')
        }
    },

    async fetchUserName(userEmail) {
        try {
            const { data, error } = await supabase
                .from('volunteers')
                .select('name')
                .eq('email', userEmail)
                .single()

            if (error) handleError(error, 'Error fetching user name')
            return data.name
        } catch (error) {
            handleError(error, 'Error in fetchUserName')
        }
    },

    async updateCareSummary(seniorId, summary) {
        try {
            const { data, error } = await supabase
                .from('care_summary')
                .update({
                    response: summary,
                    updated_at: new Date().toISOString(),
                })
                .eq('senior_id', seniorId)
                .select()

            if (error) handleError(error, 'Error updating care summary')
            return data
        } catch (error) {
            handleError(error, 'Error in updateCareSummary')
        }
    },

    async updateVisit(visitId, updateData) {
        try {
            const { data, error } = await supabase
                .from('activities')
                .update({
                    category: updateData.category,
                    activity_date: updateData.activity_date,
                    issue: updateData.issue,
                })
                .eq('id', visitId)
                .select()

            if (error) handleError(error, 'Error updating visit')
            return data
        } catch (error) {
            handleError(error, 'Error in updateVisit')
        }
    },

    async deleteVisit(visitId) {
        try {
            const { error } = await supabase.from('activities').delete().eq('id', visitId)

            if (error) handleError(error, 'Error deleting visit')
            return { success: true }
        } catch (error) {
            handleError(error, 'Error in deleteVisit')
        }
    },
}

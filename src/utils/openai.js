import OpenAI from 'openai'
import supabase from '../Supabase'

const openAIClient = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

const systemPrompt = `You are a helpful assistant that summarizes elderly care information
    that have been logged by care providers who visit them regularly.`

async function fetchRecentActivities(seniorId) {
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('senior_id', seniorId)
        .order('activity_date', { ascending: false })
        .limit(5)

    if (error) {
        console.error('Error fetching activities:', error)
        return []
    }

    return data
}

export async function updateCareSummary(seniorId) {
    const activities = await fetchRecentActivities(seniorId)
    const sortedActivities = [...activities].reverse()

    const issuesIdentifiedPrompt = sortedActivities
        .map(
            a =>
                `- ${new Date(a.activity_date).toLocaleDateString()} (${a.category}): ${
                    a.issue ? a.issue : 'No issues identified'
                }`
        )
        .join('\n')

    const issuesResolvedPrompt = sortedActivities
        .map(
            a =>
                `- ${new Date(a.activity_date).toLocaleDateString()} (${a.category}): ${
                    a.resolved ? a.resolved : 'No issues resolved'
                }`
        )
        .join('\n')

    const prompt = `Analyze care visit records and create a care summary.

                VISIT RECORDS (oldest to newest):
                Issues identified:
                ${issuesIdentifiedPrompt}

                Issues resolved:
                ${issuesResolvedPrompt}

                TASK 1 - SUMMARIZE VISITS:
                For each visit date, write:
                "Issues identified: [findings/None]. Issues resolved: [resolutions/None]."

                TASK 2 - CREATE ACTION ITEMS:
                1. List all identified issues
                2. Remove any issues that were later resolved (including related issues)
                3. Convert remaining issues into clear instructions

                Example output:
                Recent visits summary:
                - 1/1/24: Issues identified: Needs walker for mobility. Issues resolved: None.
                - 1/5/24: Issues identified: None. Issues resolved: Provided walker, mobility improved.
                - 1/8/24: Issues identified: Feeling lonely. Issues resolved: None.

                Action items:
                - Connect resident with social activities to address loneliness

                Note: "Needs walker" was removed from action items as it was resolved on 1/5.

                YOUR RESPONSE MUST FOLLOW THIS FORMAT:
                Recent visits summary:
                - [Date]: Issues identified: [findings/None]. Issues resolved: [resolutions/None].

                Action items:
                - [Instructions for unresolved issues]
                OR
                - No outstanding action items`

    try {
        const completion = await openAIClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
        })

        const summary = completion.choices[0].message.content

        const { error: updateError } = await supabase
            .from('care_summary')
            .upsert({ senior_id: seniorId, response: summary })

        if (updateError) {
            console.error('Error updating care summary:', updateError)
        }

        return summary
    } catch (error) {
        console.error('Error calling OpenAI API:', error)
    }
}

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

    const activitiesPrompt = activities
        .map(
            a =>
                `- ${a.category}: ${a.issue} (Date: ${new Date(
                    a.activity_date
                ).toLocaleDateString()})`
        )
        .join('\n')

    const prompt = `Your task is to provide a concise summary of recent activities and action items for
                the other care providers to take note of when they are visiting the elderly next.

                Here are the most recent visits, sorted in ascending order by date.

                <activities>
                ${activitiesPrompt}
                </activities>

                <instructions>
                Step 1: Summarise each visit one by one into the format: {Date}: {Summary of visit}. Then format them into a list.
                Step 2: Based on each summarised visit on each day, identify key action items for the care provider to do so that
                        they can care for the elderly better.

                Format your response with 'Action items:' followed by a bullet list,
                then 'Recent visits summary:' followed by another bullet list.
                </instructions>

                <output>
                Action items:
                - [List of action items]
                Recent visits summary:
                - [Summary of recent visits]
                </output>
                `

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
        return null
    }
}

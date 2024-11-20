import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'

const openAIClient = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const systemPrompt = `You are a helpful assistant that summarizes elderly care information
    that have been logged by care providers who visit them regularly.`

async function fetchRecentActivities(seniorId: string) {
  const { data, error } = await supabaseClient
    .from('activities')
    .select('*')
    .eq('senior_id', seniorId)
    .order('activity_date', { ascending: false })
    .limit(5)

  if (error) {
    return []
  }

  return data
}

const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',').map(origin => origin.trim())

const corsHeaders = (origin: string) => {
  if (!allowedOrigins.includes(origin)) {
    return {}
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || ''

  if (req.method === 'OPTIONS') {
    const headers = corsHeaders(origin)
    if (Object.keys(headers).length === 0) {
      return new Response(null, { status: 403 })
    }
    return new Response(null, {
      status: 204,
      headers
    })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders(origin)
      })
    }

    const { senior_id } = await req.json()
    
    if (!senior_id) {
      return new Response(
        JSON.stringify({ error: 'senior_id is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          } 
        }
      )
    }

    const activities = await fetchRecentActivities(senior_id)
    const sortedActivities = [...activities].reverse()

    const issuesIdentifiedPrompt = sortedActivities
      .map(a => `- ${new Date(a.activity_date).toLocaleDateString()} (${a.category}): ${
        a.issue ? a.issue : 'No issues identified'
      }`)
      .join('\n')

    const issuesResolvedPrompt = sortedActivities
      .map(a => `- ${new Date(a.activity_date).toLocaleDateString()} (${a.category}): ${
        a.resolved ? a.resolved : 'No issues resolved'
      }`)
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

    const completion = await openAIClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    })

    const summary = completion.choices[0].message.content

    const { error: updateError } = await supabaseClient
      .from('care_summary')
      .upsert({ senior_id, response: summary })

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ summary }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        } 
      }
    )
  }
})

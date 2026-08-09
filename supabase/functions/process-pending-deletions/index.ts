import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get deletion requests that are pending hard deletion (status 'deleted' and more than 24 hours old)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: pendingDeletions, error: fetchError } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('status', 'deleted')
      .lt('deleted_at', twentyFourHoursAgo)

    if (fetchError) {
      console.error('Error fetching pending deletions:', fetchError)
      return new Response(JSON.stringify({ error: 'Failed to fetch pending deletions' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!pendingDeletions || pendingDeletions.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending deletions to process' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`Found ${pendingDeletions.length} pending deletions to process`)

    const results = []
    for (const deletion of pendingDeletions) {
      try {
        // Call the delete-user-auth function to perform hard deletion
        const authDeleteResponse = await fetch(
          `${supabaseUrl}/functions/v1/delete-user-auth`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: deletion.user_id })
          }
        )

        const authDeleteResult = await authDeleteResponse.json()
        console.log('Auth deletion result for user', deletion.user_id, ':', authDeleteResult)

        // Update the deletion request status to completed
        const { error: updateError } = await supabase
          .from('account_deletion_requests')
          .update({ 
            status: 'completed',
            hard_deleted_at: new Date().toISOString()
          })
          .eq('id', deletion.id)

        if (updateError) {
          console.error('Error updating deletion request status:', updateError)
          results.push({
            userId: deletion.user_id,
            success: false,
            error: 'Failed to update deletion request status'
          })
        } else {
          results.push({
            userId: deletion.user_id,
            success: true,
            authDeleteResult
          })
        }
      } catch (error) {
        console.error('Error processing deletion for user', deletion.user_id, ':', error)
        results.push({
          userId: deletion.user_id,
          success: false,
          error: error.message
        })
      }
    }

    return new Response(JSON.stringify({
      processed: results.length,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in process-pending-deletions function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

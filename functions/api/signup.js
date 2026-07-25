export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { name, email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
    }

    const MAILCHIMP_API_KEY = env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = env.MAILCHIMP_LIST_ID;
    const DATACENTER = MAILCHIMP_API_KEY.split('-')[1];

    const mailchimpResponse = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name || ''
        }
      }),
    });

    if (!mailchimpResponse.ok) {
      const errorData = await mailchimpResponse.json();
      return new Response(JSON.stringify({ error: errorData.title || 'Newsletter signup failed' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
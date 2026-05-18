export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    console.error('Missing required environment variables: RESEND_API_KEY or CONTACT_EMAIL');
    return jsonResponse({ error: 'Server configuration error. Please contact us directly.' }, 500);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data' }, 400);
  }

  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const itemType = formData.get('itemType')?.toString().trim() ?? '';

  if (!name || !email || !itemType) {
    return jsonResponse({ error: 'Name, email, and item type are required' }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Invalid email address' }, 400);
  }

  const body = buildEmailBody([
    ['Item Type', itemType],
    ['Top Ring Text', formData.get('topRingText')],
    ['Bottom Ring Text', formData.get('bottomRingText')],
    ['Scripture Text', formData.get('scriptureText')],
    ['Sign Text', formData.get('signText')],
    ['Other Description', formData.get('otherDescription')],
    ['Occasion', formData.get('occasion')],
    ['Budget', formData.get('budget')],
    ['Needed By', formData.get('neededBy')],
    ['Fulfillment', formData.get('fulfillment')],
    ['Name', name],
    ['Email', email],
    ['Phone', formData.get('phone')],
    ['Notes', formData.get('notes')],
  ]);

  const safeItemType = itemType.replace(/[\r\n]/g, ' ');
  const safeName = name.replace(/[\r\n]/g, ' ');
  const emailText = `New custom order request from MuleCreations.com\n\n${body}`;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'orders@mulecreations.com',
      to: env.CONTACT_EMAIL,
      reply_to: email,
      subject: `Custom Order: ${safeItemType} — ${safeName}`,
      text: emailText,
    }),
  });

  if (!resendRes.ok) {
    console.error('Resend error:', resendRes.status, await resendRes.text());
    return jsonResponse({ error: 'Failed to send. Please try again.' }, 500);
  }

  return jsonResponse({ success: true }, 200);
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailBody(fields) {
  return fields
    .filter(([, value]) => value && value.toString().trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

export { isValidEmail, buildEmailBody };

#!/usr/bin/env node
/**
 * GHL Complete Setup Docs - Quick Version
 */

process.env.GHL_API_TOKEN = 'pit-1550d22e-591c-453f-891a-b41a0e2efdc5';
process.env.GHL_LOCATION_ID = 'q4grn2tRLSwgyl0vPzg6';

const CONFIG = {
  token: process.env.GHL_API_TOKEN,
  locationId: process.env.GHL_LOCATION_ID,
  apiUrl: 'https://services.leadconnectorhq.com',
  version: '2021-07-28'
};

async function req(endpoint) {
  const r = await fetch(`${CONFIG.apiUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${CONFIG.token}`,
      'Version': CONFIG.version,
      'Content-Type': 'application/json'
    }
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

const doc = { generated: new Date().toISOString(), credentials: CONFIG };

async function main() {
  console.log('🔄 Pulling GHL Setup Data...\n');

  try {
    const loc = await req(`/locations/${CONFIG.locationId}`);
    doc.location = { id: loc.location?.id, name: loc.location?.name, email: loc.location?.email, phone: loc.location?.phone, timezone: loc.location?.timezone };
    console.log(`✅ Location: ${doc.location.name}`);
  } catch(e) { console.log(`❌ Location: ${e.message}`); }

  try {
    const users = await req(`/users?locationId=${CONFIG.locationId}`);
    doc.users = users.users?.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) || [];
    console.log(`✅ Users: ${doc.users.length}`);
  } catch(e) { console.log(`❌ Users: ${e.message}`); }

  try {
    const cals = await req(`/calendars?locationId=${CONFIG.locationId}`);
    doc.calendars = cals.calendars?.map(c => ({ id: c.id, name: c.name, slug: c.slug, eventType: c.eventType, slotDuration: c.slotDuration })) || [];
    console.log(`✅ Calendars: ${doc.calendars.length}`);
  } catch(e) { console.log(`❌ Calendars: ${e.message}`); }

  try {
    const pipes = await req(`/opportunities/pipelines?locationId=${CONFIG.locationId}`);
    doc.pipelines = pipes.pipelines?.map(p => ({ id: p.id, name: p.name, stages: p.stages?.map(s => ({ id: s.id, name: s.name })) })) || [];
    console.log(`✅ Pipelines: ${doc.pipelines.length}`);
  } catch(e) { console.log(`❌ Pipelines: ${e.message}`); }

  try {
    const fields = await req(`/locations/${CONFIG.locationId}/customFields`);
    doc.customFields = fields.customFields?.map(f => ({ id: f.id, name: f.name, fieldKey: f.fieldKey, dataType: f.dataType, model: f.model })) || [];
    console.log(`✅ Custom Fields: ${doc.customFields.length}`);
  } catch(e) { console.log(`❌ Custom Fields: ${e.message}`); }

  try {
    const tags = await req(`/locations/${CONFIG.locationId}/tags`);
    doc.tags = tags.tags?.map(t => ({ id: t.id, name: t.name })) || [];
    console.log(`✅ Tags: ${doc.tags.length}`);
  } catch(e) { console.log(`❌ Tags: ${e.message}`); }

  try {
    const wf = await req(`/workflows?locationId=${CONFIG.locationId}`);
    doc.workflows = wf.workflows?.map(w => ({ id: w.id, name: w.name, status: w.status })) || [];
    console.log(`✅ Workflows: ${doc.workflows.length}`);
  } catch(e) { console.log(`❌ Workflows: ${e.message}`); }

  try {
    const convos = await req(`/conversations/search?locationId=${CONFIG.locationId}&limit=1`);
    doc.totalConversations = convos.total;
    console.log(`✅ Total Conversations: ${doc.totalConversations}`);
  } catch(e) { console.log(`❌ Conversations: ${e.message}`); }

  try {
    const contacts = await req(`/contacts?locationId=${CONFIG.locationId}&limit=1`);
    doc.contactSampleFields = contacts.contacts?.[0] ? Object.keys(contacts.contacts[0]) : [];
    console.log(`✅ Contact Fields: ${doc.contactSampleFields.length}`);
  } catch(e) { console.log(`❌ Contact Fields: ${e.message}`); }

  // Rate limits doc
  doc.rateLimits = {
    standard: '100 requests/minute',
    bulk: '10 requests/minute',
    recommended_delay_ms: 600,
    note: 'Use exponential backoff on 429 responses'
  };

  // Endpoints
  doc.endpoints = {
    contacts: {
      list: 'GET /contacts?locationId=X&limit=N',
      get: 'GET /contacts/:id',
      create: 'POST /contacts { firstName, lastName, email, phone, locationId }',
      update: 'PUT /contacts/:id { firstName, lastName, email, phone }',
      delete: 'DELETE /contacts/:id'
    },
    conversations: {
      search: 'GET /conversations/search?locationId=X&limit=N',
      get: 'GET /conversations/:id',
      messages: 'GET /conversations/:id/messages',
      send: 'POST /conversations/messages { type, conversationId, message }'
    },
    calendars: {
      list: 'GET /calendars?locationId=X',
      events: 'GET /calendars/events?locationId=X&calendarId=Y&startTime=Z&endTime=W',
      bookAppointment: 'POST /calendars/events/appointments { calendarId, contactId, startTime, endTime }'
    },
    pipelines: {
      list: 'GET /opportunities/pipelines?locationId=X',
      searchOpps: 'GET /opportunities/search?location_id=X',
      createOpp: 'POST /opportunities { pipelineId, stageId, name, contactId, monetaryValue }'
    },
    workflows: { list: 'GET /workflows?locationId=X' },
    users: { list: 'GET /users?locationId=X' },
    location: {
      get: 'GET /locations/:id',
      tags: 'GET /locations/:id/tags',
      customFields: 'GET /locations/:id/customFields'
    }
  };

  // Save
  const { writeFileSync, mkdirSync } = await import('fs');
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/ghl-complete-setup.json', JSON.stringify(doc, null, 2));
  console.log('\n✅ Saved: docs/ghl-complete-setup.json');

  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 COMPLETE GHL SETUP');
  console.log('═══════════════════════════════════════════');
  console.log(JSON.stringify(doc, null, 2));
}

main().catch(console.error);

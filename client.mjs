/**
 * JOM Connection Hub - GHL API Client
 * ====================================
 * White label GHL API client for JOM Services
 *
 * Usage:
 *   import JOM from 'jom-connection-hub';
 *   const contacts = await JOM.getContacts();
 *
 * Environment Variables Required:
 *   GHL_API_TOKEN    - Your GHL Private Integration Token (PIT)
 *   GHL_LOCATION_ID  - Your GHL Location ID
 */

// Load from environment or use defaults for local dev
const CONFIG = {
  token: process.env.GHL_API_TOKEN || '',
  locationId: process.env.GHL_LOCATION_ID || '',
  apiUrl: 'https://services.leadconnectorhq.com',
  version: '2021-07-28',

  brand: {
    name: 'JOM Services',
    domain: 'jom.services',
    baseUrl: 'https://jom.services',
    linkUrl: 'https://link.jom.services',
    appUrl: 'https://app.jom.services',
    oauthUrl: 'https://oauth.jom.services',
    webhookUrl: 'https://app.jom.services/webhooks',
  }
};

function validateConfig() {
  if (!CONFIG.token) {
    throw new Error('GHL_API_TOKEN environment variable is required');
  }
  if (!CONFIG.locationId) {
    throw new Error('GHL_LOCATION_ID environment variable is required');
  }
}

function getHeaders() {
  return {
    'Authorization': `Bearer ${CONFIG.token}`,
    'Version': CONFIG.version,
    'Content-Type': 'application/json'
  };
}

async function request(endpoint, options = {}) {
  validateConfig();
  const url = `${CONFIG.apiUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GHL API ${response.status}: ${text}`);
  }

  return response.json();
}

// ═══════════════════════════════════════════════════════════════════════════
// WHITE LABEL LINK HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function getBookingLink(calendarSlug) {
  return `${CONFIG.brand.linkUrl}/widget/booking/${calendarSlug}`;
}

export function getFormLink(formId) {
  return `${CONFIG.brand.linkUrl}/widget/form/${formId}`;
}

export function getSurveyLink(surveyId) {
  return `${CONFIG.brand.linkUrl}/widget/survey/${surveyId}`;
}

export function getShortLink(linkCode) {
  return `${CONFIG.brand.linkUrl}/l/${linkCode}`;
}

export function getWebhookUrl(path = '') {
  return path ? `${CONFIG.brand.webhookUrl}/${path}` : CONFIG.brand.webhookUrl;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACTS
// ═══════════════════════════════════════════════════════════════════════════

export async function getContacts(limit = 20, startAfter = null) {
  let endpoint = `/contacts?locationId=${CONFIG.locationId}&limit=${limit}`;
  if (startAfter) endpoint += `&startAfter=${startAfter}`;
  return request(endpoint);
}

export async function getContact(contactId) {
  return request(`/contacts/${contactId}`);
}

export async function createContact(data) {
  return request('/contacts', {
    method: 'POST',
    body: JSON.stringify({ ...data, locationId: CONFIG.locationId })
  });
}

export async function updateContact(contactId, data) {
  return request(`/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteContact(contactId) {
  return request(`/contacts/${contactId}`, { method: 'DELETE' });
}

export async function searchContacts(query, limit = 20) {
  return request(`/contacts?locationId=${CONFIG.locationId}&query=${encodeURIComponent(query)}&limit=${limit}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSATIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function searchConversations(limit = 20, startAfterDate = null) {
  let endpoint = `/conversations/search?locationId=${CONFIG.locationId}&limit=${limit}`;
  if (startAfterDate) endpoint += `&startAfterDate=${startAfterDate}`;
  return request(endpoint);
}

export async function getConversation(conversationId) {
  return request(`/conversations/${conversationId}`);
}

export async function getConversationMessages(conversationId, limit = 20) {
  return request(`/conversations/${conversationId}/messages?limit=${limit}`);
}

export async function sendMessage(conversationId, message, type = 'SMS') {
  return request('/conversations/messages', {
    method: 'POST',
    body: JSON.stringify({ type, conversationId, message })
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getUsers() {
  return request(`/users/?locationId=${CONFIG.locationId}`);
}

export async function getUser(userId) {
  return request(`/users/${userId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CALENDARS
// ═══════════════════════════════════════════════════════════════════════════

export async function getCalendars() {
  return request(`/calendars/?locationId=${CONFIG.locationId}`);
}

export async function getCalendarGroups() {
  return request(`/calendars/groups?locationId=${CONFIG.locationId}`);
}

export async function getCalendarEvents(calendarId, startTime, endTime) {
  return request(`/calendars/events?locationId=${CONFIG.locationId}&calendarId=${calendarId}&startTime=${startTime}&endTime=${endTime}`);
}

export async function createAppointment(calendarId, data) {
  return request('/calendars/events/appointments', {
    method: 'POST',
    body: JSON.stringify({ ...data, calendarId, locationId: CONFIG.locationId })
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// OPPORTUNITIES
// ═══════════════════════════════════════════════════════════════════════════

export async function getPipelines() {
  return request(`/opportunities/pipelines?locationId=${CONFIG.locationId}`);
}

export async function searchOpportunities(pipelineId = null, limit = 20) {
  let endpoint = `/opportunities/search?location_id=${CONFIG.locationId}&limit=${limit}`;
  if (pipelineId) endpoint += `&pipeline_id=${pipelineId}`;
  return request(endpoint);
}

export async function getOpportunity(opportunityId) {
  return request(`/opportunities/${opportunityId}`);
}

export async function createOpportunity(data) {
  return request('/opportunities', {
    method: 'POST',
    body: JSON.stringify({ ...data, locationId: CONFIG.locationId })
  });
}

export async function updateOpportunity(opportunityId, data) {
  return request(`/opportunities/${opportunityId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION
// ═══════════════════════════════════════════════════════════════════════════

export async function getLocation() {
  return request(`/locations/${CONFIG.locationId}`);
}

export async function getLocationTags() {
  return request(`/locations/${CONFIG.locationId}/tags`);
}

export async function getCustomFields() {
  return request(`/locations/${CONFIG.locationId}/customFields`);
}

export async function getCustomValues() {
  return request(`/locations/${CONFIG.locationId}/customValues`);
}

export async function getTemplates() {
  return request(`/locations/${CONFIG.locationId}/templates`);
}

export async function searchTasks(filters = {}) {
  return request(`/locations/${CONFIG.locationId}/tasks/search`, {
    method: 'POST',
    body: JSON.stringify(filters)
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BUSINESSES
// ═══════════════════════════════════════════════════════════════════════════

export async function getBusinesses() {
  return request(`/businesses/?locationId=${CONFIG.locationId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGNS
// ═══════════════════════════════════════════════════════════════════════════

export async function getCampaigns() {
  return request(`/campaigns/?locationId=${CONFIG.locationId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMS
// ═══════════════════════════════════════════════════════════════════════════

export async function getForms() {
  return request(`/forms/?locationId=${CONFIG.locationId}`);
}

export async function getFormSubmissions(limit = 20) {
  return request(`/forms/submissions?locationId=${CONFIG.locationId}&limit=${limit}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SURVEYS
// ═══════════════════════════════════════════════════════════════════════════

export async function getSurveys() {
  return request(`/surveys/?locationId=${CONFIG.locationId}`);
}

export async function getSurveySubmissions(limit = 20) {
  return request(`/surveys/submissions?locationId=${CONFIG.locationId}&limit=${limit}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// LINKS
// ═══════════════════════════════════════════════════════════════════════════

export async function getLinks() {
  return request(`/links/?locationId=${CONFIG.locationId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOWS
// ═══════════════════════════════════════════════════════════════════════════

export async function getWorkflows() {
  return request(`/workflows/?locationId=${CONFIG.locationId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════

export async function getProducts() {
  return request(`/products/?locationId=${CONFIG.locationId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════

export async function getPaymentOrders(limit = 20) {
  return request(`/payments/orders?altId=${CONFIG.locationId}&altType=location&limit=${limit}`);
}

export async function getPaymentTransactions(limit = 20) {
  return request(`/payments/transactions?altId=${CONFIG.locationId}&altType=location&limit=${limit}`);
}

export async function getPaymentSubscriptions() {
  return request(`/payments/subscriptions?altId=${CONFIG.locationId}&altType=location`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL
// ═══════════════════════════════════════════════════════════════════════════

export async function getSocialAccounts() {
  return request(`/social-media-posting/${CONFIG.locationId}/accounts`);
}

export async function getSocialCategories() {
  return request(`/social-media-posting/${CONFIG.locationId}/categories`);
}

export async function getSocialTags() {
  return request(`/social-media-posting/${CONFIG.locationId}/tags`);
}

// ═══════════════════════════════════════════════════════════════════════════
// MEDIA
// ═══════════════════════════════════════════════════════════════════════════

export async function getMediaFiles(type = 'file') {
  return request(`/medias/files?altId=${CONFIG.locationId}&altType=location&type=${type}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOGS
// ═══════════════════════════════════════════════════════════════════════════

export async function getBlogAuthors(limit = 10, offset = 0) {
  return request(`/blogs/authors?locationId=${CONFIG.locationId}&limit=${limit}&offset=${offset}`);
}

export async function getBlogCategories(limit = 10, offset = 0) {
  return request(`/blogs/categories?locationId=${CONFIG.locationId}&limit=${limit}&offset=${offset}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// VOICE AI
// ═══════════════════════════════════════════════════════════════════════════

export async function getVoiceAIAgents() {
  return request(`/voice-ai/agents?locationId=${CONFIG.locationId}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { CONFIG };

export default {
  CONFIG,

  // Links
  getBookingLink,
  getFormLink,
  getSurveyLink,
  getShortLink,
  getWebhookUrl,

  // Contacts
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,

  // Conversations
  searchConversations,
  getConversation,
  getConversationMessages,
  sendMessage,

  // Users
  getUsers,
  getUser,

  // Calendars
  getCalendars,
  getCalendarGroups,
  getCalendarEvents,
  createAppointment,

  // Opportunities
  getPipelines,
  searchOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,

  // Location
  getLocation,
  getLocationTags,
  getCustomFields,
  getCustomValues,
  getTemplates,
  searchTasks,

  // Businesses
  getBusinesses,

  // Campaigns
  getCampaigns,

  // Forms
  getForms,
  getFormSubmissions,

  // Surveys
  getSurveys,
  getSurveySubmissions,

  // Links
  getLinks,

  // Workflows
  getWorkflows,

  // Products
  getProducts,

  // Payments
  getPaymentOrders,
  getPaymentTransactions,
  getPaymentSubscriptions,

  // Social
  getSocialAccounts,
  getSocialCategories,
  getSocialTags,

  // Media
  getMediaFiles,

  // Blogs
  getBlogAuthors,
  getBlogCategories,

  // Voice AI
  getVoiceAIAgents,
};

# JOM Connection Hub

GHL API client for JOM Services.

## Install

```bash
npm install moemeyer/jom-connection-hub
```

Or clone:
```bash
git clone https://github.com/moemeyer/jom-connection-hub.git
```

## Setup

Set environment variables:

```bash
export GHL_API_TOKEN=pit-your-token-here
export GHL_LOCATION_ID=your-location-id
```

## Usage

```javascript
import JOM from 'jom-connection-hub';

// Get contacts
const { contacts } = await JOM.getContacts(20);

// Get conversations
const { conversations } = await JOM.searchConversations(50);

// Create contact
const contact = await JOM.createContact({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+15551234567'
});

// Generate white label links
const bookingUrl = JOM.getBookingLink('my-calendar');
// → https://link.jom.services/widget/booking/my-calendar
```

## API Methods

| Category | Methods |
|----------|---------|
| **Contacts** | `getContacts`, `getContact`, `createContact`, `updateContact`, `deleteContact`, `searchContacts` |
| **Conversations** | `searchConversations`, `getConversation`, `getConversationMessages`, `sendMessage` |
| **Users** | `getUsers`, `getUser` |
| **Calendars** | `getCalendars`, `getCalendarGroups`, `getCalendarEvents`, `createAppointment` |
| **Opportunities** | `getPipelines`, `searchOpportunities`, `getOpportunity`, `createOpportunity`, `updateOpportunity` |
| **Location** | `getLocation`, `getLocationTags`, `getCustomFields`, `getCustomValues`, `getTemplates`, `searchTasks` |
| **Marketing** | `getCampaigns`, `getForms`, `getFormSubmissions`, `getSurveys`, `getSurveySubmissions` |
| **Business** | `getBusinesses`, `getWorkflows`, `getProducts`, `getLinks` |
| **Payments** | `getPaymentOrders`, `getPaymentTransactions`, `getPaymentSubscriptions` |
| **Social** | `getSocialAccounts`, `getSocialCategories`, `getSocialTags` |
| **Media** | `getMediaFiles` |
| **Blogs** | `getBlogAuthors`, `getBlogCategories` |
| **Voice AI** | `getVoiceAIAgents` |

## White Label Links

```javascript
JOM.getBookingLink('calendar-slug')  // → https://link.jom.services/widget/booking/...
JOM.getFormLink('form-id')           // → https://link.jom.services/widget/form/...
JOM.getSurveyLink('survey-id')       // → https://link.jom.services/widget/survey/...
JOM.getShortLink('code')             // → https://link.jom.services/l/...
JOM.getWebhookUrl('path')            // → https://app.jom.services/webhooks/...
```

## Test

```bash
GHL_API_TOKEN=xxx GHL_LOCATION_ID=xxx npm test
```

## License

MIT

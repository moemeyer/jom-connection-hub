#!/usr/bin/env node
/**
 * Test script - verifies API connection
 * Run: GHL_API_TOKEN=xxx GHL_LOCATION_ID=xxx node test.mjs
 */

import JOM from './client.mjs';

async function test(name, fn) {
  try {
    const result = await fn();
    const count = Array.isArray(result) ? result.length :
      result?.contacts?.length ?? result?.conversations?.length ??
      result?.users?.length ?? result?.calendars?.length ?? '✓';
    console.log(`  ✅ ${name.padEnd(25)} ${count}`);
    return true;
  } catch (err) {
    console.log(`  ❌ ${name.padEnd(25)} ${err.message.slice(0, 40)}`);
    return false;
  }
}

console.log('\n🔌 JOM Connection Hub - API Test\n');
console.log(`   Token: ${JOM.CONFIG.token ? '***' + JOM.CONFIG.token.slice(-8) : 'NOT SET'}`);
console.log(`   Location: ${JOM.CONFIG.locationId || 'NOT SET'}\n`);

if (!JOM.CONFIG.token || !JOM.CONFIG.locationId) {
  console.log('❌ Missing environment variables.\n');
  console.log('   Set GHL_API_TOKEN and GHL_LOCATION_ID:\n');
  console.log('   GHL_API_TOKEN=pit-xxx GHL_LOCATION_ID=xxx node test.mjs\n');
  process.exit(1);
}

let passed = 0;
let total = 0;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

total++; if (await test('getContacts', () => JOM.getContacts(1))) passed++;
total++; if (await test('searchConversations', () => JOM.searchConversations(1))) passed++;
total++; if (await test('getUsers', () => JOM.getUsers())) passed++;
total++; if (await test('getCalendars', () => JOM.getCalendars())) passed++;
total++; if (await test('getPipelines', () => JOM.getPipelines())) passed++;
total++; if (await test('getLocation', () => JOM.getLocation())) passed++;
total++; if (await test('getWorkflows', () => JOM.getWorkflows())) passed++;
total++; if (await test('getCampaigns', () => JOM.getCampaigns())) passed++;
total++; if (await test('getForms', () => JOM.getForms())) passed++;
total++; if (await test('getSurveys', () => JOM.getSurveys())) passed++;
total++; if (await test('getProducts', () => JOM.getProducts())) passed++;
total++; if (await test('getLinks', () => JOM.getLinks())) passed++;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`\n   Result: ${passed}/${total} passed\n`);

process.exit(passed === total ? 0 : 1);

/**
 * WebRectangle Automated API Integration Test Suite.
 *
 * Runs end-to-end tests against the running server and active repository adapter
 * (Prisma / PostgreSQL or in-memory) to verify health, campaigns, invitations,
 * and creator onboarding workflows.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function main() {
  console.log(`\n🚀 Testing WebRectangle API at ${BASE_URL}...\n`);

  // 1. Health check
  const health = await fetch(`${BASE_URL}/api/health`).then((r) => r.json());
  if (!health.ok) {
    throw new Error('Health check failed: ' + JSON.stringify(health));
  }
  console.log('✔ [1/6] Health check OK');
  console.log(`       Adapter: ${health.adapter}`);
  console.log(`       Firebase: ${health.features?.firebase ? 'Enabled' : 'Disabled'}`);
  console.log(
    `       Firebase Analytics: ${health.features?.firebaseAnalytics ? 'Enabled' : 'Disabled'}`,
  );

  // 2. Creator Search
  const search = await fetch(`${BASE_URL}/api/creators/search?platform=instagram&limit=2`).then(
    (r) => r.json(),
  );
  if (!Array.isArray(search.items) || search.items.length === 0) {
    throw new Error('Creator search returned no items: ' + JSON.stringify(search));
  }
  console.log(`✔ [2/6] Creator search OK (${search.total} creators available)`);
  const sampleCreator = search.items[0];

  // 3. Campaign Creation
  const campaignRes = await fetch(`${BASE_URL}/api/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Automated Test Campaign',
      brandId: 'brand-automated-test',
      objective: 'awareness',
      status: 'draft',
      deliverables: [{ kind: 'reel', quantity: 1 }],
    }),
  }).then((r) => r.json());

  if (!campaignRes.success || !campaignRes.campaign?.id) {
    throw new Error('Campaign creation failed: ' + JSON.stringify(campaignRes));
  }
  console.log(`✔ [3/6] Campaign created (ID: ${campaignRes.campaign.id})`);

  // 4. Invitation Dispatch
  const invRes = await fetch(`${BASE_URL}/api/campaigns/${campaignRes.campaign.id}/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creatorId: sampleCreator.id,
      message: 'Automated test collaboration invitation',
    }),
  }).then((r) => r.json());

  if (!invRes.success || !invRes.invitation?.id) {
    throw new Error('Invitation dispatch failed: ' + JSON.stringify(invRes));
  }
  console.log(`✔ [4/6] Invitation sent (ID: ${invRes.invitation.id})`);

  // 5. Creator Acceptance
  const respondRes = await fetch(`${BASE_URL}/api/invitations/${invRes.invitation.id}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'accepted', message: 'Ready to collaborate' }),
  }).then((r) => r.json());

  if (!respondRes.success || respondRes.invitation?.status !== 'accepted') {
    throw new Error('Invitation response failed: ' + JSON.stringify(respondRes));
  }
  console.log('✔ [5/6] Invitation accepted successfully');

  // 6. Creator Application Onboarding
  const applyRes = await fetch(`${BASE_URL}/api/creators/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Verma',
      handle: 'rohan_travels',
      platform: 'instagram',
      category: 'travel',
      niche: 'Backpacking & Budget Travel',
      city: 'Jaipur',
      region: 'Rajasthan',
      languages: ['Hindi', 'English'],
      contentTypes: ['reel', 'story'],
      bio: 'Travel creator capturing budget-friendly adventures and heritage sites across India.',
      email: 'rohan.test@example.com',
    }),
  }).then((r) => r.json());

  if (!applyRes.success || !applyRes.applicationId) {
    throw new Error('Creator application submission failed: ' + JSON.stringify(applyRes));
  }
  console.log(`✔ [6/6] Creator application submitted (Lead ID: ${applyRes.applicationId})`);

  console.log('\n🎉 ALL 6 INTEGRATION TESTS PASSED!\n');
}

main().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});

import { query } from './connection.js';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Insert sample partner
    const partnerResult = await query(
      `INSERT INTO partners (organization_name, contact_email, contact_phone, description, verification_status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (contact_email) DO NOTHING
       RETURNING id`,
      [
        'Amani Connect',
        'contact@amaniconnect.org',
        '+1234567890',
        'Verified NGO empowering youth with safety and knowledge',
        'verified'
      ]
    );

    const partnerId = partnerResult.rows[0]?.id;

    if (partnerId) {
      // Insert sample tip
      await query(
        `INSERT INTO tips (partner_id, title, category, content, target_audience, priority, tags, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          partnerId,
          'Stay Safe Online: Strong Passwords',
          'Digital Security',
          'Always use strong, unique passwords for each account. A strong password should be at least 12 characters long and include a mix of uppercase, lowercase, numbers, and symbols.',
          'Youth (13-17)',
          'High Impact',
          ['password', 'security', 'online-safety'],
          'published'
        ]
      );

      // Insert sample campaign
      await query(
        `INSERT INTO campaigns (partner_id, title, description, campaign_type, target_audience, start_date, end_date, platforms, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          partnerId,
          'Anti-Bullying Awareness Week',
          'A comprehensive campaign to raise awareness about bullying prevention and support resources.',
          'Awareness Campaign',
          'Youth (13-17)',
          new Date('2024-01-01'),
          new Date('2024-01-07'),
          ['Social Media', 'School Programs'],
          'active'
        ]
      );

      // Insert sample session
      await query(
        `INSERT INTO sessions (partner_id, title, description, session_type, topic, scheduled_date, scheduled_time, facilitator, target_audience, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          partnerId,
          'Digital Safety Q&A',
          'Ask questions about staying safe online and protecting your digital identity.',
          'Live Q&A Session',
          'Digital Security',
          new Date('2024-12-20'),
          '14:00:00',
          'Dr. Sarah Johnson',
          'Youth (13-17)',
          'scheduled'
        ]
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();


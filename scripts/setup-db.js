import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to setup new database tables
function setupDatabase() {
  const dbPath = join(__dirname, '../data/reservations.sqlite');
  const db = new Database(dbPath);

  try {
    console.log('Setting up database tables...');

    // Create parameters/settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS parameters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        description TEXT,
        category TEXT DEFAULT 'general',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create invoices table
    db.exec(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reservation_id INTEGER,
        invoice_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        service_name TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        paid_amount DECIMAL(10,2) DEFAULT 0,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'partially_paid', 'paid', 'cancelled')),
        payment_method TEXT,
        payment_intent_id TEXT,
        due_date DATE,
        issued_date DATE DEFAULT CURRENT_DATE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reservation_id) REFERENCES reservations (id) ON DELETE SET NULL
      )
    `);

    // Create time_slots table for better availability management
    db.exec(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        is_available BOOLEAN DEFAULT 1,
        service_type TEXT,
        reserved_by INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, start_time),
        FOREIGN KEY (reserved_by) REFERENCES reservations (id) ON DELETE SET NULL
      )
    `);

    // Add default parameters
    const defaultParams = [
      // SMTP Settings
      { key: 'smtp_host', value: '', description: 'SMTP Server Host', category: 'email' },
      { key: 'smtp_port', value: '587', description: 'SMTP Server Port', category: 'email' },
      { key: 'smtp_username', value: '', description: 'SMTP Username', category: 'email' },
      { key: 'smtp_password', value: '', description: 'SMTP Password', category: 'email' },
      { key: 'smtp_from_email', value: '', description: 'From Email Address', category: 'email' },
      { key: 'smtp_from_name', value: 'Neill Beauty', description: 'From Name', category: 'email' },
      
      // Payment Settings
      { key: 'stripe_public_key', value: '', description: 'Stripe Public Key', category: 'payment' },
      { key: 'stripe_secret_key', value: '', description: 'Stripe Secret Key', category: 'payment' },
      { key: 'enable_payments', value: 'false', description: 'Enable Payment Processing', category: 'payment' },
      { key: 'deposit_percentage', value: '30', description: 'Deposit Percentage (to prevent no-shows)', category: 'payment' },
      
      // Google Calendar
      { key: 'google_calendar_id', value: '', description: 'Google Calendar ID', category: 'calendar' },
      { key: 'google_api_key', value: '', description: 'Google API Key', category: 'calendar' },
      { key: 'enable_google_sync', value: 'false', description: 'Enable Google Calendar Sync', category: 'calendar' },
      
      // General Settings
      { key: 'business_hours_start', value: '09:00', description: 'Business Hours Start', category: 'general' },
      { key: 'business_hours_end', value: '17:00', description: 'Business Hours End', category: 'general' },
      { key: 'slot_duration', value: '30', description: 'Default Slot Duration (minutes)', category: 'general' },
      { key: 'advance_booking_days', value: '60', description: 'Maximum Advance Booking (days)', category: 'general' },
      { key: 'cancellation_hours', value: '24', description: 'Cancellation Notice (hours)', category: 'general' }
    ];

    const insertParam = db.prepare(`
      INSERT OR IGNORE INTO parameters (key, value, description, category) 
      VALUES (?, ?, ?, ?)
    `);

    for (const param of defaultParams) {
      insertParam.run(param.key, param.value, param.description, param.category);
    }

    console.log('✓ Parameters table created with default settings');
    console.log('✓ Invoices table created');
    console.log('✓ Time slots table created');

    // Generate some sample time slots for the next 30 days
    const generateSlots = db.prepare(`
      INSERT OR IGNORE INTO time_slots (date, start_time, end_time, is_available) 
      VALUES (?, ?, ?, 1)
    `);

    const startDate = new Date();
    const businessStart = 9; // 9 AM
    const businessEnd = 17; // 5 PM
    const slotDuration = 30; // minutes

    for (let d = 0; d < 30; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      
      // Skip weekends for now (can be configured later)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

      const dateStr = currentDate.toISOString().split('T')[0];

      for (let hour = businessStart; hour < businessEnd; hour++) {
        for (let min = 0; min < 60; min += slotDuration) {
          const startTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
          const endHour = min + slotDuration >= 60 ? hour + 1 : hour;
          const endMin = (min + slotDuration) % 60;
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
          
          if (endHour < businessEnd) {
            generateSlots.run(dateStr, startTime, endTime);
          }
        }
      }
    }

    console.log('✓ Sample time slots generated for next 30 days');
    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    db.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };
import postgres from 'postgres';
import crypto from 'crypto';
import { Resend } from 'resend';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface Winner {
  id: string;
  name: string;
  amountWon: number;
  investmentType?: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  claimInfo?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    houseAddress: string;
    occupation: string;
    country: string;
    savedAt: string;
    submittedAt?: string;
    paymentMethod?: string;
    paymentConfirmedAt?: string;
    paymentFiles?: string[];
  };
  tempClaimInfo?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    houseAddress: string;
    occupation: string;
    country: string;
    savedAt: string;
  };
  orderItems?: Array<{
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
  }>;
}

interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  name: string;
  password: string;
}

const otpStore = new Map<string, OtpRecord>();

// Neon database connection
const sql = postgres(process.env.DATABASE_URL || '');

// Initialize database tables
export async function initializeTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS winners (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount_won DECIMAL(10,2) NOT NULL DEFAULT 0,
        investment_type TEXT,
        user_name TEXT,
        user_email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        claim_info JSONB DEFAULT '{}',
        order_items JSONB DEFAULT '[]'
      )
    `;

    // Add order_items column if it doesn't exist (for existing tables)
    try {
      await sql`
        ALTER TABLE winners ADD COLUMN IF NOT EXISTS order_items JSONB DEFAULT '[]'
      `;
    } catch (error) {
      // Column might already exist, ignore error
      console.log("order_items column check:", error);
    }
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
  }
}

// User functions
export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  await initializeTable();
  
  const id = crypto.randomUUID();
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  
  try {
    await sql`
      INSERT INTO users (id, email, password_hash, name)
      VALUES (${id}, ${email.toLowerCase()}, ${passwordHash}, ${name})
    `;
    
    return { id, email, passwordHash, name, createdAt: new Date().toISOString() };
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await initializeTable();
  
  try {
    const result = await sql`
      SELECT id, email, password_hash as "passwordHash", name, created_at as "createdAt"
      FROM users
      WHERE email = ${email.toLowerCase()}
    `;
    
    if (result.length === 0) return null;
    
    return {
      id: result[0].id,
      email: result[0].email,
      passwordHash: result[0].passwordHash,
      name: result[0].name,
      createdAt: result[0].createdAt.toISOString()
    };
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  return inputHash === hash;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function createOtp(email: string, name: string, password: string): Promise<string> {
  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  otpStore.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    otp,
    expiresAt,
    name,
    password: crypto.createHash('sha256').update(password).digest('hex')
  });
  
  const { error } = await resend.emails.send({
    from: 'IFSA Investment <noreply@ifsa-investment.org>',
    to: email,
    subject: 'Your IFSA Investments Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">IFSA Investments</h2>
        <p>Hello ${name},</p>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 14px;">If you did not request this, please ignore this email.</p>
      </div>
    `
  });
  
  if (error) {
    console.error('Resend error:', error);
  }
  
  return otp;
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const record = otpStore.get(email.toLowerCase());
  
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (record.otp !== otp) return false;
  
  otpStore.delete(email.toLowerCase());
  return true;
}

export async function getUsers(): Promise<User[]> {
  await initializeTable();
  
  try {
    const result = await sql`
      SELECT id, email, password_hash as "passwordHash", name, created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `;
    
    return result.map(user => ({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      createdAt: user.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Failed to get users:", error);
    return [];
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  await initializeTable();
  
  try {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return false;
  }
}

export interface Investment {
  id: string;
  name: string;
  amountWon: number;
  investmentType: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  claimInfo?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    houseAddress: string;
    occupation: string;
    country: string;
    savedAt: string;
    submittedAt?: string;
    paymentMethod?: string;
    paymentConfirmedAt?: string;
    paymentFiles?: string[];
  };
  orderItems?: Array<{
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
  }>;
}

export async function getUserInvestments(userEmail: string): Promise<Investment[]> {
  await sql`
    CREATE TABLE IF NOT EXISTS winners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount_won DECIMAL(10,2) NOT NULL DEFAULT 0,
      investment_type TEXT,
      user_name TEXT,
      user_email TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      claim_info JSONB DEFAULT '{}',
      order_items JSONB DEFAULT '[]'
    )
  `;

  try {
    const result = await sql`
      SELECT
        id,
        name,
        amount_won as "amountWon",
        investment_type as "investmentType",
        user_name as "userName",
        user_email as "userEmail",
        created_at as "createdAt",
        claim_info as "claimInfo",
        order_items as "orderItems"
      FROM winners
      WHERE user_email = ${userEmail.toLowerCase()}
      ORDER BY created_at DESC
    `;

    console.log('🔍 Query result for email:', userEmail.toLowerCase(), result);

    return result.map(investment => ({
      id: investment.id,
      name: investment.name,
      amountWon: Number(investment.amountWon),
      investmentType: investment.investmentType,
      userName: investment.userName,
      userEmail: investment.userEmail,
      createdAt: investment.createdAt ? investment.createdAt.toISOString() : new Date().toISOString(),
      claimInfo: investment.claimInfo && investment.claimInfo !== '{}' ?
        (typeof investment.claimInfo === 'string' ? JSON.parse(investment.claimInfo) : investment.claimInfo) :
        undefined,
      orderItems: investment.orderItems && investment.orderItems !== '[]' ?
        (typeof investment.orderItems === 'string' ? JSON.parse(investment.orderItems) : investment.orderItems) :
        undefined
    }));
  } catch (error) {
    console.error("Failed to get user investments:", error);
    return [];
  }
}

export async function getInvestmentById(id: string): Promise<Investment | null> {
  await sql`
    CREATE TABLE IF NOT EXISTS winners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount_won DECIMAL(10,2) NOT NULL DEFAULT 0,
      investment_type TEXT,
      user_name TEXT,
      user_email TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      claim_info JSONB DEFAULT '{}',
      order_items JSONB DEFAULT '[]'
    )
  `;

  try {
    const result = await sql`
      SELECT
        id,
        name,
        amount_won as "amountWon",
        investment_type as "investmentType",
        user_name as "userName",
        user_email as "userEmail",
        created_at as "createdAt",
        claim_info as "claimInfo",
        order_items as "orderItems"
      FROM winners
      WHERE id = ${id}
    `;

    if (result.length === 0) return null;

    const investment = result[0];
    return {
      id: investment.id,
      name: investment.name,
      amountWon: Number(investment.amountWon),
      investmentType: investment.investmentType,
      userName: investment.userName,
      userEmail: investment.userEmail,
      createdAt: investment.createdAt ? investment.createdAt.toISOString() : new Date().toISOString(),
      claimInfo: investment.claimInfo && investment.claimInfo !== '{}' ?
        (typeof investment.claimInfo === 'string' ? JSON.parse(investment.claimInfo) : investment.claimInfo) :
        undefined,
      orderItems: investment.orderItems && investment.orderItems !== '[]' ?
        (typeof investment.orderItems === 'string' ? JSON.parse(investment.orderItems) : investment.orderItems) :
        undefined
    };
  } catch (error) {
    console.error("Failed to get investment:", error);
    return null;
  }
}

export async function getWinners(): Promise<Winner[]> {
  await initializeTable();

  try {
    const winners = await sql`
      SELECT
        id,
        name,
        amount_won as "amountWon",
        investment_type as "investmentType",
        user_name as "userName",
        user_email as "userEmail",
        created_at as "createdAt",
        claim_info as "claimInfo",
        order_items as "orderItems"
      FROM winners
      ORDER BY created_at DESC
    `;

    console.log('Raw database data:', winners);

    return winners.map(winner => ({
      id: winner.id,
      name: winner.name,
      amountWon: Number(winner.amountWon),
      investmentType: winner.investmentType,
      userName: winner.userName,
      userEmail: winner.userEmail,
      createdAt: winner.createdAt ? winner.createdAt.toISOString() : new Date().toISOString(),
      claimInfo: winner.claimInfo && winner.claimInfo !== '{}' ?
        (typeof winner.claimInfo === 'string' ? JSON.parse(winner.claimInfo) : winner.claimInfo) :
        undefined,
      orderItems: winner.orderItems && winner.orderItems !== '[]' ?
        (typeof winner.orderItems === 'string' ? JSON.parse(winner.orderItems) : winner.orderItems) :
        undefined
    }));
  } catch (error) {
    console.error("Failed to get winners from database:", error);
    return [];
  }
}

export async function saveWinners(winnersToSave: Winner[]): Promise<void> {
  await initializeTable();

  try {
    console.log('💾 Saving winners to database:', winnersToSave.length, 'winners');
    console.log('Winners to save:', winnersToSave.map(w => ({ id: w.id, name: w.name, amountWon: w.amountWon, email: w.userEmail })));

    // Check if each winner exists and insert/update
    for (const winner of winnersToSave) {
      console.log('💾 Inserting winner:', { id: winner.id, name: winner.name, amountWon: winner.amountWon, email: winner.userEmail });

      // Try to update first, then insert if not exists
      const existing = await sql`SELECT id FROM winners WHERE id = ${winner.id}`;

      if (existing.length > 0) {
        await sql`
          UPDATE winners SET
            name = ${winner.name},
            amount_won = ${winner.amountWon || 0},
            investment_type = ${winner.investmentType || null},
            user_name = ${winner.userName || null},
            user_email = ${winner.userEmail || null},
            claim_info = ${winner.claimInfo ? JSON.stringify(winner.claimInfo) : '{}'},
            order_items = ${winner.orderItems ? JSON.stringify(winner.orderItems) : '[]'}
          WHERE id = ${winner.id}
        `;
      } else {
        await sql`
          INSERT INTO winners (
            id, name, amount_won, investment_type, user_name, user_email, created_at,
            claim_info, order_items
          ) VALUES (
            ${winner.id},
            ${winner.name},
            ${winner.amountWon || 0},
            ${winner.investmentType || null},
            ${winner.userName || null},
            ${winner.userEmail || null},
            ${winner.createdAt || new Date().toISOString()},
            ${winner.claimInfo ? JSON.stringify(winner.claimInfo) : '{}'},
            ${winner.orderItems ? JSON.stringify(winner.orderItems) : '[]'}
          )
        `;
      }
    }

    console.log('✅ Successfully saved winners to database');
  } catch (error) {
    console.error("Failed to save winners to database:", error);
    throw error;
  }
}

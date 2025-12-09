# Supabase Setup Guide for Knowledge Base

This guide will help you set up Supabase to store your video scripts and knowledge entries, replacing the static `knowledgeBase.ts` file.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Supabase project URL and anon key

## 🗄️ Step 1: Create the Database Table

### Method 1: Using Table Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** (left sidebar)
3. Click **"New table"** button (top right)
4. Configure the table:
   - **Name**: `knowledge_entries`
   - **Description**: (optional) "Stores video scripts and knowledge entries for Saba AI"

5. Add the following columns (click **"Add column"** for each):

   | Column Name | Type | Default Value | Nullable | Primary Key |
   |------------|-----|---------------|----------|-------------|
   | `id` | `text` | `gen_random_uuid()::text` | ❌ No | ✅ Yes |
   | `location` | `text` | `NULL` (or leave empty) | ✅ Yes | ❌ No |
   | `content` | `text` | (none - required) | ❌ No | ❌ No |
   | `created_at` | `timestamptz` | `now()` | ❌ No | ❌ No |
   | `updated_at` | `timestamptz` | `now()` | ❌ No | ❌ No |

6. Click **"Save"** to create the table

   **💡 Tips for Table Editor:**
   - When setting the default value for `id`, you may need to enter: `gen_random_uuid()::text` in the default value field
   - For timestamp columns, select type `timestamptz` (timestamp with time zone)
   - If you can't set a default value in the UI, you can set it later via SQL Editor
   - **`location`**: Can be NULL (optional) - leave default as NULL or empty
   - **`content`**: Must NOT be NULL (required) - make sure it's marked as **Required** (not nullable) and has no default value (you'll always provide content when inserting)

7. **Set up Row Level Security (RLS)**:
   - In the Table Editor, click on your `knowledge_entries` table
   - Go to the **"Policies"** tab (or click the shield icon)
   - Click **"New Policy"**
   - Choose **"Create a policy from scratch"**
   - **Policy name**: `Allow read-only access for chatbot`
   - **Allowed operation**: `SELECT` (read only)
   - **Policy definition**: `true` (allows reads, but no writes)
   - Click **"Save policy"**
   
   **What this does:**
   - ✅ Allows the chatbot to read entries (needed for answering questions)
   - ❌ Prevents public users from adding/editing/deleting entries
   - ✅ You can add entries using the service role key (see Step 2)

8. **Set up auto-update for `updated_at`** (requires SQL):
   - Go to **SQL Editor** (left sidebar)
   - Run this SQL to create the trigger function and trigger:

```sql
-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_knowledge_entries_updated_at
  BEFORE UPDATE ON knowledge_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Method 2: Using SQL Editor (Alternative)

If you prefer to create everything with SQL, you can use the SQL Editor instead:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Run the following SQL:

```sql
-- Create knowledge_entries table
CREATE TABLE IF NOT EXISTS knowledge_entries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  location TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on location for faster searches
CREATE INDEX IF NOT EXISTS idx_knowledge_entries_location ON knowledge_entries(location);

-- Enable Row Level Security (RLS)
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;

-- Create read-only policy (allows chatbot to read, but no writes)
CREATE POLICY "Allow read-only access for chatbot" ON knowledge_entries
  FOR SELECT
  USING (true);

-- Note: No write policies = no public users can add/edit/delete
-- You'll use the service role key for adding entries (see setup guide)

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_knowledge_entries_updated_at
  BEFORE UPDATE ON knowledge_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔑 Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`) - for read operations in your app
   - **service_role key** (starts with `eyJ...`) - **⚠️ Keep this secret!** Use this for adding/editing entries

   **Important Security Notes:**
   - The **anon key** respects RLS policies (read-only if no public policies exist)
   - The **service_role key** bypasses RLS and has full access - **never expose this in client-side code**
   - For adding entries, you can either:
     - Use the service role key in a secure server/backend
     - Or temporarily use it in your app for admin operations (not recommended for production)

## 🌍 Step 3: Set Environment Variables

### For Expo/React Native:

1. Create a `.env` file in the root of your project (`saba-takes-flight/.env`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Install `expo-constants` if you haven't already (for accessing env variables):
```bash
npm install expo-constants
```

3. Update `lib/supabase.ts` to use `expo-constants` if needed:

```typescript
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
```

### Alternative: Using app.json (for Expo)

You can also add environment variables to `app.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project-id.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    }
  }
}
```

**⚠️ Important:** Never commit your `.env` file or `app.json` with real keys to version control. Add `.env` to your `.gitignore`.

## 📦 Step 4: Add Your First Entries

Since you don't want public write access, you have two options for adding entries:

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase dashboard → **Table Editor** → `knowledge_entries`
2. Click **"Insert row"** button (top right)
3. Fill in the fields:
   - **id**: Enter a unique ID (e.g., `turkey-video-script`) or leave blank to auto-generate
   - **location**: Enter the location name (e.g., `Turkey`)
   - **content**: Paste your video script content
   - **created_at** and **updated_at**: Will auto-fill with current timestamp
4. Click **"Save"** to insert the row
5. Repeat for each entry you want to add

**Note**: The dashboard uses your admin credentials, so it bypasses RLS policies.

### Option 2: Using Service Role Key in Your App

If you want to add entries programmatically from your app, you'll need to create a separate Supabase client with the service role key. See the "Adding Entries Programmatically" section below.

---

### Migrate Existing Data from knowledgeBase.ts

If you have existing entries in `knowledgeBase.ts`, you can migrate them:

### Using Table Editor (Recommended)

1. Go to your Supabase dashboard → **Table Editor** → `knowledge_entries`
2. Click **"Insert row"** button (top right)
3. Fill in the fields:
   - **id**: Enter a unique ID (e.g., `turkey-video-script`) or leave blank to auto-generate
   - **location**: Enter the location name (e.g., `Turkey`)
   - **content**: Paste your video script content
   - **created_at** and **updated_at**: Will auto-fill with current timestamp
4. Click **"Save"** to insert the row
5. Repeat for each entry you want to migrate

### Using SQL Editor (Alternative)

Alternatively, you can use the SQL Editor to insert data:

```sql
-- Example: Insert existing Turkey entry
INSERT INTO knowledge_entries (id, location, content)
VALUES (
  'turkey-video-script',
  'Turkey',
  'Istanbul is a city where East meets West in the most beautiful way. The Hagia Sophia left me speechless with its incredible architecture. Tip: Visit early in the morning to avoid crowds. The Grand Bazaar is overwhelming but worth it - try the Turkish delight!'
);

-- Example: Insert existing Morocco entry
INSERT INTO knowledge_entries (id, location, content)
VALUES (
  'morocco-video-script',
  'Morocco',
  'Marrakech is a sensory explosion. The souks are labyrinthine but that''s part of the charm. I learned to haggle here - start at 30% of the asking price. The tagine is a must-try, and staying in a riad was one of my best decisions.'
);
```

Or create a migration script (Node.js):

```javascript
// migrate-data.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const entries = [
  {
    id: 'turkey-video-script',
    location: 'Turkey',
    content: 'Istanbul is a city where East meets West...'
  },
  // Add more entries here
];

async function migrate() {
  for (const entry of entries) {
    const { error } = await supabase
      .from('knowledge_entries')
      .insert(entry);
    
    if (error) {
      console.error(`Error inserting ${entry.id}:`, error);
    } else {
      console.log(`✅ Migrated ${entry.id}`);
    }
  }
}

migrate();
```

## ✅ Step 5: Test the Implementation

1. Start your app:
```bash
npm start
```

2. Open the chatbot and ask a question about a location you've added to Supabase
3. The chatbot should use the knowledge from Supabase to answer

## 🔍 Troubleshooting

### Issue: "Supabase credentials not found"
- Make sure your `.env` file is in the correct location
- Verify the environment variable names match exactly: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart your Expo development server after adding environment variables

### Issue: "Failed to fetch knowledge entries"
- Check that RLS policies are set up correctly
- Verify your Supabase URL and anon key are correct
- Check the Supabase dashboard logs for errors

### Issue: Optimistic updates not working
- Make sure you're using React 19 (required for `useOptimistic`)
- Check the browser/device console for errors

## 🚀 Next Steps

### Adding New Entries Programmatically

Since you've restricted write access, you'll need to use the **service role key** to add entries from your app. Here's how:

1. **Create a separate Supabase client for admin operations** (create `lib/supabaseAdmin.ts`):

```typescript
import { createClient } from '@supabase/supabase-js';

// ⚠️ WARNING: Service role key bypasses RLS - keep this secure!
// In production, use this only in a backend/server, never expose in client code
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Supabase admin credentials not found');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

2. **Add service role key to your `.env` file**:
```env
EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. **Update your knowledge entries functions** to use the admin client for writes:

```typescript
// In lib/knowledgeEntries.ts, import the admin client
import { supabaseAdmin } from './supabaseAdmin';

// For write operations, use supabaseAdmin instead of supabase
export async function addKnowledgeEntry(entry) {
  const { data, error } = await supabaseAdmin  // Use admin client
    .from('knowledge_entries')
    .insert([entry])
    .select()
    .single();
  // ... rest of function
}
```

**⚠️ Security Warning**: 
- The service role key has full database access
- Never commit it to version control
- In production, consider using a backend API instead of exposing the service role key in your app

### Future Enhancements

- **Full-text search**: Upgrade to use Postgres full-text search for better query matching
- **Vector embeddings**: Add semantic search using Supabase's vector extension
- **Admin UI**: Create a simple interface to add/edit entries
- **Versioning**: Track changes to entries over time

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React useOptimistic Hook](https://react.dev/reference/react/useOptimistic)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)


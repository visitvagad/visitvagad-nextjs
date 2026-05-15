# VisitVagad – Tourism Platform

A modern Next.js tourism platform for Vagad (Banswara & Dungarpur districts) with Appwrite CMS backend and editorial dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (using v22.22.3)
- npm or yarn
- Appwrite account (Cloud or Self-hosted)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Copy `.env.example` to `.env.local` and update with your Appwrite credentials:
```bash
APPWRITE_API_KEY=your_api_key
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
```

3. **Bootstrap Appwrite (first time only):**
```bash
npm run bootstrap:appwrite
```
This creates all required collections, indexes, and storage buckets.

4. **Run development server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Credentials

### Default Test Account
Use these credentials to access the editorial dashboard at `/admin`:

```
Email:    admin@visitvagad.com
Password: Admin@123456
```

### Creating Admin Users

Admin users are managed via **Appwrite Console**:

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project (visitvagad)
3. Navigate to **Auth → Users**
4. Create a new user with email & password
5. Click the user and add labels:
   - `super_admin` - Full access
   - `editor` - Can edit all content
   - `contributor` - Read-only access

**Labels Control Permissions:**
- `super_admin` - Manage all content, users, and settings
- `editor` - Edit destinations, events, food, experiences
- `contributor` - View-only access

## 📁 Project Structure

```
src/
├── app/               # Next.js app router pages
│   ├── admin/         # Editorial dashboard (protected)
│   ├── [slug]/        # Dynamic pages (destinations, events, etc.)
│   └── page.tsx       # Homepage
├── components/        # React components
│   ├── admin/         # Admin UI components
│   ├── features/      # Feature sections
│   ├── layout/        # Layout components
│   └── ui/            # Reusable UI components
├── lib/              # Utilities & helpers
│   ├── appwrite.ts   # Client SDK
│   ├── appwrite-admin.ts  # Server admin SDK
│   ├── auth.ts       # Authentication
│   └── media.ts      # File upload handling
└── types/            # TypeScript types
```

## 🗄️ Appwrite Collections

- **destinations** - Tourist destinations with images, coordinates, description
- **events** - Festivals and events with dates and categories
- **food** - Local cuisine and restaurants
- **experiences** - Activities, tours, and adventures
- **galleries** - Media files with parent references
- **regions** - Geographic regions (Banswara, Dungarpur)
- **settings** - Site configuration and metadata

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run bootstrap:appwrite  # Initialize Appwrite collections
npm run seed             # Seed database with sample data
npm run setup            # Run setup wizard
npm run env:check        # Validate environment variables
```

## 🌐 Deployment

### Netlify (Recommended)
The project is configured for Netlify with automatic deployments on git push.

**Configuration:**
- Build command: `npm run build`
- Publish directory: `.next`
- Runtime: Node.js 22.x

**Environment Variables in Netlify:**
Set these in Site Settings → Build & Deploy → Environment:
```
APPWRITE_API_KEY
NEXT_PUBLIC_APPWRITE_ENDPOINT
NEXT_PUBLIC_APPWRITE_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID
SESSION_SECRET
```

## 🛠️ Development

### Adding New Content
1. Create schema in [appwrite-schema.ts](src/lib/appwrite-schema.ts)
2. Run `npm run bootstrap:appwrite`
3. Add content via admin dashboard

### Creating Admin Pages
1. Add page in `src/app/admin/`
2. Use `requireRole()` to protect:
```typescript
import { requireRole } from '@/lib/auth';

export default async function MyPage() {
  await requireRole('editor');
  // Your content here
}
```

## 🔒 Security

- Session-based authentication via Appwrite
- Server Actions for secure API calls
- CORS protection on Appwrite
- Environment variables for sensitive data
- Rate limiting on file uploads (50MB max)

## 📝 Environment Variables

**Required:**
- `APPWRITE_API_KEY` - Appwrite API key (server only)
- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite endpoint URL
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Project ID
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID` - Database ID
- `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID` - Storage bucket ID

**Optional:**
- `NEXT_PUBLIC_SITE_URL` - Site URL (auto-detected)
- `SESSION_SECRET` - Session encryption key
- `NEXT_PUBLIC_DEBUG_MODE` - Enable debug logging
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable Vercel Analytics

## 🚨 Troubleshooting

**Build fails on Netlify:**
- Check `netlify.toml` has `NODE_ENV = ""` in `[build.environment]`
- Ensure all environment variables are set in Netlify dashboard
- Check Appwrite credentials are correct

**Admin login fails:**
- Verify user exists in Appwrite Console
- Check user has required label (super_admin, editor, contributor)
- Clear browser cookies and retry

**File upload fails:**
- Check file size is under 50MB
- Verify storage bucket ID in environment
- Check Appwrite API key has correct permissions

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 📄 License

MIT License - See LICENSE file for details

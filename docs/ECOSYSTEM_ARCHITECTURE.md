# VisitVagad — Multi-Role Tourism Ecosystem Architecture

> Complete platform design for a digital tourism operating system

---

## Part 1: User Roles & Authentication

---

### 1.1 Role Architecture

```
ROLE HIERARCHY
──────────────
super_admin
├── district_officer
├── moderator
├── content_editor
└── (all below)

BUSINESS ROLES (require approval)
├── hotel_owner
├── homestay_owner
├── restaurant_owner
├── guide
├── artisan
├── photographer
├── travel_agency
└── event_organizer

PUBLIC ROLES (instant activation)
└── tourist
```

### 1.2 Role-Permission Matrix

| Permission | tourist | hotel | homestay | restaurant | guide | artisan | photographer | agency | organizer | editor | moderator | officer | admin |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse content | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Book services | ✓ | — | — | — | — | — | — | — | — | — | — | — | ✓ |
| Write reviews | ✓ | — | — | — | — | — | — | — | — | — | — | — | ✓ |
| Manage own listing | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ |
| Accept bookings | — | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | — | — | — | ✓ |
| Manage inventory | — | ✓ | ✓ | ✓ | — | ✓ | — | — | — | — | — | — | ✓ |
| Upload products | — | — | — | — | — | ✓ | — | — | — | — | — | — | ✓ |
| Create tour packages | — | — | — | — | ✓ | — | — | ✓ | — | — | — | — | ✓ |
| Edit platform content | — | — | — | — | — | — | — | — | — | ✓ | — | — | ✓ |
| Moderate reviews | — | — | — | — | — | — | — | — | — | — | ✓ | — | ✓ |
| Approve businesses | — | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| Suspend accounts | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ | ✓ |
| View district analytics | — | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| Manage all settings | — | — | — | — | — | — | — | — | — | — | — | — | ✓ |
| Manage payouts | — | — | — | — | — | — | — | — | — | — | — | — | ✓ |

### 1.3 Role Details

#### Tourist / Traveler
- **Activation:** Instant on signup
- **Verification:** Email only
- **Dashboard:** Trips, bookmarks, bookings, reviews
- **Monetization:** None (consumer role)

#### Hotel Owner
- **Activation:** Requires admin approval
- **Verification:** Business registration, property photos, KYC
- **Dashboard:** Rooms, bookings, calendar, revenue, reviews
- **Monetization:** Room bookings (platform takes 8-12% commission)

#### Homestay Owner
- **Activation:** Requires admin approval (lighter than hotel)
- **Verification:** Aadhaar/ID, property photos, locality check
- **Dashboard:** Simplified room management, bookings, earnings
- **Monetization:** Bookings (platform takes 6-10% commission)

#### Restaurant Owner
- **Activation:** Requires admin approval
- **Verification:** FSSAI license (optional for small vendors), photos
- **Dashboard:** Menu, hours, reservations, reviews
- **Monetization:** Reservations, featured listing fees

#### Local Guide ("Paryatan Mitra")
- **Activation:** Requires verification + approval
- **Verification:** ID, language test, local knowledge assessment
- **Dashboard:** Calendar, bookings, tour packages, earnings
- **Monetization:** Tour bookings (platform takes 10-15%)

#### Artisan / Shop Owner
- **Activation:** Requires approval
- **Verification:** ID, craft samples, cooperative membership (optional)
- **Dashboard:** Products, orders, inventory, earnings
- **Monetization:** Product sales (platform takes 5-8%)

#### District Tourism Officer
- **Activation:** Manual assignment by super_admin
- **Verification:** Government ID, official appointment letter
- **Dashboard:** District analytics, business approvals, campaigns, alerts
- **Monetization:** N/A (governance role)

#### Super Admin
- **Activation:** Seeded via script
- **Access:** Everything — users, content, finance, settings, deployments

---

### 1.4 Authentication System

#### Tech Stack
```
Next.js 15 App Router
├── Middleware (route protection by role)
├── Server Actions (login, signup, role assignment)
└── Server Components (session-aware rendering)

Appwrite Auth
├── Email/Password accounts
├── OAuth (Google, optional)
├── Session management (server-side)
├── Role labels on user documents
└── Team-based permissions (future)
```

#### Auth Flow: Tourist Signup
```
1. User fills signup form (name, email, password, phone)
2. Server Action → Appwrite createAccount()
3. Appwrite sends verification email
4. User clicks verification link
5. Server Action → set role label: 'tourist'
6. Set httpOnly session cookie (7-day expiry)
7. Redirect to /dashboard
```

#### Auth Flow: Business Signup (Hotel/Guide/etc.)
```
1. User fills signup form + selects business type
2. Server Action → Appwrite createAccount()
3. Email verification (same as tourist)
4. Redirect to /onboarding/[role]
5. User fills business profile:
   - Property details / guide credentials / shop info
   - Upload verification documents
   - Upload photos
6. Status set to 'pending_approval'
7. Admin receives notification in moderation queue
8. Admin reviews → approves or requests changes
9. On approval: role label updated, dashboard unlocked
10. User notified via email
```

#### Session & Middleware Architecture

```typescript
// src/middleware.ts
const ROLE_ROUTES: Record<string, string[]> = {
  tourist:        ['/dashboard', '/bookings', '/wishlist', '/reviews'],
  hotel_owner:    ['/dashboard/hotel', '/dashboard/bookings', '/dashboard/rooms'],
  homestay_owner: ['/dashboard/homestay', '/dashboard/bookings'],
  restaurant:     ['/dashboard/restaurant', '/dashboard/menu'],
  guide:          ['/dashboard/guide', '/dashboard/tours', '/dashboard/calendar'],
  artisan:        ['/dashboard/shop', '/dashboard/products', '/dashboard/orders'],
  editor:         ['/admin/content', '/admin/editorial'],
  moderator:      ['/admin/moderation', '/admin/reports'],
  officer:        ['/admin/district', '/admin/analytics', '/admin/approvals'],
  super_admin:    ['/admin/*'],
};

// Middleware checks:
// 1. Is route protected? → Check session cookie exists
// 2. Is route role-restricted? → Check user role matches
// 3. Is account suspended? → Block access, show message
// 4. Is business pending approval? → Allow only onboarding routes
```

#### Verification Requirements by Role

| Role | Email | Phone | ID/KYC | Business Docs | Manual Approval |
|------|:-----:|:-----:|:------:|:-------------:|:---------------:|
| Tourist | ✓ | Optional | — | — | — |
| Hotel Owner | ✓ | ✓ | ✓ | ✓ (registration) | ✓ |
| Homestay Owner | ✓ | ✓ | ✓ | — | ✓ |
| Restaurant | ✓ | ✓ | ✓ | Optional (FSSAI) | ✓ |
| Guide | ✓ | ✓ | ✓ | — | ✓ (+ assessment) |
| Artisan | ✓ | ✓ | ✓ | — | ✓ |
| Photographer | ✓ | — | — | Portfolio review | ✓ |
| Travel Agency | ✓ | ✓ | ✓ | ✓ (IATA/license) | ✓ |
| Event Organizer | ✓ | ✓ | ✓ | — | ✓ |
| Editor | ✓ | — | — | — | ✓ (admin assigns) |
| Moderator | ✓ | — | — | — | ✓ (admin assigns) |
| Officer | ✓ | ✓ | ✓ | ✓ (govt ID) | ✓ (admin assigns) |

#### Security Measures

| Measure | Implementation |
|---------|---------------|
| Password hashing | Appwrite built-in (Argon2) |
| Session storage | httpOnly cookie, SameSite=Lax |
| CSRF protection | SameSite cookies + Server Actions |
| Rate limiting | Appwrite built-in (per endpoint) |
| Account lockout | 5 failed attempts → 15min cooldown |
| Suspension | `suspended: true` flag, middleware blocks all access |
| Token rotation | Sessions auto-refresh on activity |
| Role escalation prevention | Role changes only via admin Server Actions |



---

## Part 2: Tourist, Hospitality & Restaurant Systems

---

### 2.1 Tourist User System

#### Tourist Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────┐
│  TOURIST DASHBOARD                               │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ Upcoming │ │ Wishlist │ │ Recently Viewed  ││
│  │ Trips (2)│ │ (12)     │ │ (10)             ││
│  └──────────┘ └──────────┘ └──────────────────┘│
│                                                  │
│  MY BOOKINGS                                     │
│  ┌─────────────────────────────────────────────┐│
│  │ Hotel Udai Bilas  │ Dec 15-17 │ Confirmed  ││
│  │ Guide: Ramesh     │ Dec 15    │ Pending    ││
│  │ Tribal Food Tour  │ Dec 16    │ Confirmed  ││
│  └─────────────────────────────────────────────┘│
│                                                  │
│  MY REVIEWS (5)  │  MY PHOTOS (23)              │
│  TRIP PLANNER    │  NOTIFICATIONS (3)           │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### Tourist Features

| Feature | Description | Storage |
|---------|-------------|---------|
| Wishlist | Save destinations, stays, experiences | Appwrite `wishlists` collection |
| Recently Viewed | Last 10 items | localStorage (current) → migrate to DB for cross-device |
| Bookmarks | Quick-save for later | localStorage (current) |
| Trip Planner | Drag-and-drop itinerary builder | Appwrite `user_trips` collection |
| Booking History | All past/upcoming bookings | Appwrite `bookings` collection |
| Reviews | Text + rating + photos | Appwrite `reviews` collection |
| Photo Uploads | Travel photos tagged to destinations | Appwrite storage + `user_photos` |
| Public Profile | Display name, avatar, review count, trips | Appwrite `profiles` collection |
| Notifications | Booking updates, review responses | Appwrite `notifications` collection |

#### Review System

```
REVIEW LIFECYCLE:
1. Tourist completes a booking (stay/guide/experience)
2. 24 hours after checkout → prompt to review
3. Tourist submits: rating (1-5), text, optional photos
4. Review enters moderation queue (auto-approved if score > 3, no flagged words)
5. Business owner can respond (one response per review)
6. Review visible on listing page
7. Aggregate rating recalculated

REVIEW RULES:
- Only verified bookings can leave reviews
- One review per booking
- Editable within 48 hours
- Photos limited to 5 per review
- Minimum 20 characters text
- Profanity filter (auto-flag for moderation)
```

---

### 2.2 Hotel / Homestay System

#### Onboarding Flow

```
HOTEL ONBOARDING:
1. Signup → select "Hotel Owner"
2. Email verification
3. /onboarding/hotel → multi-step form:
   Step 1: Property basics (name, type, address, district)
   Step 2: Rooms (types, count, capacity, pricing)
   Step 3: Amenities (WiFi, parking, AC, pool, etc.)
   Step 4: Photos (minimum 5, hero + rooms + exterior)
   Step 5: Policies (check-in/out, cancellation, pets)
   Step 6: Documents (registration, GST optional)
   Step 7: Payout details (bank account / UPI)
4. Submit for review → status: 'pending_approval'
5. Admin reviews → approves / requests changes
6. On approval → listing goes live

HOMESTAY ONBOARDING (simplified):
- Same flow but fewer required fields
- No GST/registration required
- Minimum 3 photos
- Simpler room structure (no room types, just capacity)
- Lower commission rate (6-10% vs 8-12%)
```

#### Hotel Dashboard (`/dashboard/hotel`)

| Section | Features |
|---------|----------|
| Overview | Today's check-ins/outs, occupancy rate, revenue this month |
| Rooms | Add/edit room types, set pricing, manage availability |
| Calendar | Visual availability calendar, block dates, seasonal pricing |
| Bookings | Incoming requests, confirmed, completed, cancelled |
| Reviews | Guest reviews, response management |
| Photos | Gallery management, hero image, room photos |
| Pricing | Base rates, seasonal multipliers, weekend rates, offers |
| Analytics | Occupancy trends, revenue charts, booking sources |
| Payouts | Earnings, pending payouts, transaction history |
| Settings | Property details, policies, payout info |

#### Room Management

```typescript
interface Room {
  id: string;
  propertyId: string;
  name: string;              // "Deluxe Double", "Heritage Suite"
  type: 'standard' | 'deluxe' | 'suite' | 'dormitory';
  capacity: number;          // Max guests
  beds: number;
  basePrice: number;         // Per night in INR
  weekendPrice: number;
  seasonalPricing: {
    season: string;          // "monsoon", "winter", "festival"
    multiplier: number;      // 1.5 = 50% markup
  }[];
  amenities: string[];       // ["AC", "WiFi", "TV", "Balcony"]
  photos: string[];          // ImageKit URLs
  available: boolean;
  totalUnits: number;        // How many of this room type exist
}
```

#### Booking Lifecycle (Hotel)

```
STATES:
requested → confirmed → checked_in → checked_out → reviewed
    │           │                                      │
    ├→ rejected │                                      └→ completed
    └→ expired  └→ cancelled_by_guest
                └→ cancelled_by_host (penalty applies)

FLOW:
1. Tourist selects dates + room → creates booking (status: 'requested')
2. Hotel owner receives notification
3. Owner confirms within 24h (auto-reject if no response)
4. Tourist receives confirmation + payment link
5. Payment processed → status: 'confirmed'
6. Day of check-in → status: 'checked_in' (manual or auto)
7. Day after checkout → status: 'checked_out'
8. Review prompt sent to tourist
9. After review (or 7 days) → status: 'completed'

CANCELLATION POLICY:
- Free cancellation: 48+ hours before check-in → full refund
- Late cancellation: 24-48 hours → 50% refund
- No-show: < 24 hours → no refund
- Host cancellation: Full refund + platform penalty on host
```

#### Payment & Commission

```
PAYMENT FLOW:
Tourist pays full amount → Platform holds in escrow
    → On checkout: Platform takes commission (8-12%)
    → Remainder transferred to hotel owner
    → Payout within 3-5 business days

COMMISSION TIERS:
- Standard hotel: 12%
- Homestay: 8%
- Heritage property: 10%
- New listing (first 3 months): 6% promotional rate

PAYOUT METHODS:
- Bank transfer (NEFT/IMPS)
- UPI (for smaller operators)
```

---

### 2.3 Restaurant System

#### Restaurant Onboarding

```
1. Signup → select "Restaurant Owner"
2. Email + phone verification
3. /onboarding/restaurant → form:
   Step 1: Basics (name, cuisine type, address, district)
   Step 2: Menu (categories, items, prices, photos)
   Step 3: Hours (opening/closing, days off)
   Step 4: Photos (minimum 3 — exterior, interior, food)
   Step 5: Features (dine-in, takeaway, delivery, events)
   Step 6: Documents (FSSAI optional for small vendors)
4. Submit → admin review → approval
```

#### Restaurant Dashboard (`/dashboard/restaurant`)

| Section | Features |
|---------|----------|
| Overview | Today's reservations, reviews this week, rating |
| Menu | Add/edit categories, items, prices, photos, availability |
| Reservations | Table booking requests, confirmed, walk-ins |
| Reviews | Customer reviews, response management |
| Hours | Operating schedule, holiday closures |
| Events | Special nights (live music, food festivals) |
| Analytics | Popular dishes, peak hours, review trends |
| Photos | Food photography, ambiance shots |

#### Menu Management

```typescript
interface MenuItem {
  id: string;
  restaurantId: string;
  category: string;          // "Starters", "Main Course", "Desserts"
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isSignature: boolean;      // Featured dish
  available: boolean;        // Can be toggled daily
  tags: string[];            // "spicy", "tribal-special", "seasonal"
}
```

#### Reservation System

```
RESERVATION FLOW:
1. Tourist views restaurant → clicks "Reserve Table"
2. Selects: date, time, party size, special requests
3. Restaurant receives notification
4. Owner confirms (or auto-confirm if enabled)
5. Tourist gets confirmation with details
6. Day of: reminder notification to both parties
7. No-show tracking (3 no-shows → tourist flagged)

STATES: requested → confirmed → completed | no_show | cancelled
```

#### Hotel vs Homestay Differences

| Aspect | Hotel | Homestay |
|--------|-------|----------|
| Verification | Business registration required | ID only |
| Room types | Multiple (standard, deluxe, suite) | Single type (room/space) |
| Minimum photos | 5 | 3 |
| Commission | 8-12% | 6-10% |
| Amenities list | Full (pool, gym, restaurant) | Basic (WiFi, meals, parking) |
| Cancellation | Strict policy options | Flexible by default |
| Pricing | Seasonal + weekend + offers | Simple daily rate |
| Capacity | Unlimited rooms | Max 5 rooms/spaces |
| Approval | Full review | Lighter review |
| Dashboard | Full analytics | Simplified view |



---

## Part 3: Guide System, Artisan Marketplace & Booking Architecture

---

### 3.1 Local Guide System ("Paryatan Mitra")

#### Guide Profile

```typescript
interface GuideProfile {
  id: string;
  userId: string;
  name: string;
  slug: string;
  photo: string;
  district: 'Banswara' | 'Dungarpur';
  languages: string[];        // ["Hindi", "English", "Vagadi", "Bhili"]
  specialties: string[];      // ["heritage", "tribal", "nature", "photography", "spiritual"]
  experience: string;         // "5 years"
  bio: string;                // 200-500 chars
  hourlyRate: number;         // INR
  halfDayRate: number;
  fullDayRate: number;
  certifications: string[];   // ["Rajasthan Tourism Certified", "First Aid"]
  coverageAreas: string[];    // Specific locations they cover
  availability: {
    monday: boolean; tuesday: boolean; /* ... */
    blockedDates: string[];   // ISO dates
  };
  rating: number;             // Aggregate 1-5
  reviewCount: number;
  totalTours: number;
  verified: boolean;
  verifiedAt: string;
  status: 'pending' | 'active' | 'suspended';
}
```

#### Guide Onboarding & Verification

```
ONBOARDING:
1. Signup → select "Local Guide"
2. Email + phone verification
3. /onboarding/guide → form:
   Step 1: Personal (name, photo, district, languages)
   Step 2: Expertise (specialties, experience, coverage areas)
   Step 3: Pricing (hourly, half-day, full-day rates)
   Step 4: Documents (Aadhaar/ID upload, photo with ID)
   Step 5: Tour packages (optional — can add later)
4. Submit → enters verification queue

VERIFICATION PROCESS:
1. Admin reviews documents (ID match, photo quality)
2. Optional: Phone interview for language/knowledge check
3. Approval → 'verified' badge, listing goes live
4. First 3 bookings: reviews monitored closely
5. After 5 positive reviews: "Trusted Guide" badge

TRUST LEVELS:
- New Guide: Basic listing, no featured placement
- Verified Guide: Verified badge, eligible for search boost
- Trusted Guide: 5+ reviews, 4.0+ rating → featured in campaigns
- Expert Guide: 20+ tours, 4.5+ rating → premium placement
```

#### Guide Dashboard (`/dashboard/guide`)

| Section | Features |
|---------|----------|
| Overview | Upcoming tours, earnings this month, rating |
| Calendar | Availability management, blocked dates |
| Bookings | Incoming requests, confirmed, completed |
| Tour Packages | Create/edit packaged experiences |
| Reviews | Tourist feedback, response management |
| Earnings | Revenue breakdown, payout history |
| Profile | Edit bio, photos, rates, specialties |

#### Tour Package System

```typescript
interface TourPackage {
  id: string;
  guideId: string;
  title: string;              // "Heritage Walk: Arthuna Temples"
  description: string;
  duration: string;           // "4 hours", "Full day"
  maxGroupSize: number;
  price: number;              // Per person
  groupDiscount: number;      // % off for 4+ people
  includes: string[];         // ["Transport", "Snacks", "Entry fees"]
  destinations: string[];     // Destination slugs
  category: string;           // heritage, nature, tribal, food, photography
  photos: string[];
  meetingPoint: string;
  bestTime: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  status: 'active' | 'draft' | 'archived';
}
```

---

### 3.2 Artisan Marketplace ("Bhil Bazaar")

#### Artisan Shop System

```typescript
interface ArtisanShop {
  id: string;
  userId: string;
  name: string;               // "Ramesh's Pithora Art"
  slug: string;
  description: string;
  district: 'Banswara' | 'Dungarpur';
  village: string;
  craftType: string[];        // ["Pithora painting", "Bamboo craft", "Textile"]
  photo: string;              // Shop/artisan photo
  verified: boolean;
  rating: number;
  status: 'pending' | 'active' | 'suspended';
}

interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  images: string[];           // Up to 5
  category: string;           // "painting", "textile", "jewelry", "pottery"
  material: string;
  dimensions: string;
  weight: string;
  inStock: boolean;
  quantity: number;
  handmade: boolean;          // Always true for this marketplace
  madeToOrder: boolean;       // Custom orders
  deliveryTime: string;       // "3-5 days", "Made to order: 2 weeks"
  shippingAvailable: boolean;
  localPickupOnly: boolean;
  status: 'active' | 'sold_out' | 'draft';
}
```

#### Artisan Onboarding

```
1. Signup → select "Artisan"
2. Phone + email verification
3. /onboarding/artisan → form:
   Step 1: Personal (name, village, district, craft type)
   Step 2: Shop details (name, description, photos)
   Step 3: First products (minimum 2 products with photos)
   Step 4: Logistics (shipping capability, local pickup location)
   Step 5: Payout (bank/UPI details)
4. Admin review → approval

SPECIAL CONSIDERATIONS:
- Many artisans may have limited digital literacy
- Support phone-based onboarding (admin-assisted)
- Minimal required fields
- Photo upload via WhatsApp integration (future)
- Cooperative/SHG group listings supported
```

#### Order Flow

```
ORDER LIFECYCLE:
1. Tourist browses Bhil Bazaar → adds to cart
2. Checkout → payment (online or COD for local pickup)
3. Artisan receives order notification (SMS + app)
4. Artisan confirms → prepares item
5. Ships (if shipping) or marks ready for pickup
6. Tourist receives / picks up
7. Tourist confirms receipt
8. Payment released to artisan (minus 5-8% commission)

STATES: placed → confirmed → preparing → shipped/ready → delivered → completed

LOGISTICS:
- Local pickup: Tourist collects from artisan's location
- Shipping: India Post / local courier (artisan ships)
- Festival sales: Bulk orders during Beneshwar Fair, etc.
- Platform does NOT handle logistics (artisan responsibility)
- Future: Partner with logistics provider for remote areas
```

#### Fraud Prevention

| Risk | Mitigation |
|------|-----------|
| Fake products | Photo verification, admin review before listing |
| Non-delivery | Payment held until delivery confirmed |
| Quality issues | Return window (7 days), dispute resolution |
| Fake artisans | ID verification, village/cooperative cross-check |
| Price manipulation | Price history tracking, admin alerts on spikes |

---

### 3.3 Unified Booking Architecture

#### Booking Types

| Type | Provider | Duration | Payment |
|------|----------|----------|---------|
| Hotel/Homestay | Property owner | Multi-night | Full upfront |
| Guide Tour | Guide | Hours/day | Full upfront |
| Restaurant | Restaurant | Time slot | No payment (reservation only) |
| Experience | Guide/Agency | Hours | Full upfront |
| Event | Organizer | Fixed date | Ticket purchase |
| Product | Artisan | N/A | Purchase (not booking) |

#### Universal Booking Schema

```typescript
interface Booking {
  id: string;
  type: 'hotel' | 'homestay' | 'guide' | 'experience' | 'event' | 'restaurant';
  touristId: string;
  providerId: string;         // Hotel/guide/restaurant user ID
  listingId: string;          // Room/package/event ID
  
  // Dates
  startDate: string;
  endDate: string;
  startTime?: string;         // For guides/restaurants
  
  // Details
  guests: number;
  specialRequests: string;
  
  // Financial
  baseAmount: number;
  taxes: number;
  platformFee: number;        // Commission
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial_refund';
  paymentMethod: string;
  transactionId: string;
  
  // Status
  status: 'requested' | 'confirmed' | 'cancelled_tourist' | 'cancelled_host' 
        | 'in_progress' | 'completed' | 'disputed' | 'refunded';
  
  // Timestamps
  createdAt: string;
  confirmedAt: string;
  completedAt: string;
  cancelledAt: string;
  
  // Review
  reviewId?: string;
  rated: boolean;
}
```

#### Booking State Machine

```
                    ┌──────────────┐
                    │  requested   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │confirmed │ │ rejected │ │ expired  │
        └────┬─────┘ └──────────┘ └──────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌──────────────┐
│cancelled│ │in_prog │ │cancelled_host│
│_tourist │ │        │ └──────────────┘
└────────┘ └───┬────┘
               │
               ▼
         ┌──────────┐
         │completed │
         └────┬─────┘
              │
              ▼
         ┌──────────┐
         │ reviewed │ (optional)
         └──────────┘
```

#### Notification System

| Event | Tourist Gets | Provider Gets |
|-------|-------------|---------------|
| Booking requested | "Request sent" | "New booking request" |
| Booking confirmed | "Booking confirmed!" | "You confirmed a booking" |
| Booking cancelled | "Booking cancelled" | "Tourist cancelled" |
| Payment received | "Payment successful" | "Payment received" |
| Check-in reminder | "Tomorrow: check-in" | "Guest arriving tomorrow" |
| Review prompt | "How was your stay?" | — |
| Review received | — | "New review received" |
| Payout processed | — | "₹X transferred to your account" |

#### Commission & Payout Schedule

```
COMMISSION RATES:
- Hotels: 12% of booking value
- Homestays: 8%
- Guides: 12%
- Experiences: 15%
- Events: 10% of ticket sales
- Artisan products: 6%
- Restaurants: Free (reservations only, no commission)

PAYOUT SCHEDULE:
- Hotels/Homestays: 3 days after checkout
- Guides: 24 hours after tour completion
- Artisans: 3 days after delivery confirmation
- Events: 7 days after event date
- Minimum payout: ₹500

PAYOUT METHODS:
- Bank transfer (NEFT/IMPS) — default
- UPI — for small operators
- Payout frequency: Weekly (or on-demand for ₹5000+)
```



---

## Part 4: Database Schema, Admin System & Trust/Safety

---

### 4.1 Appwrite Database Architecture

#### Collection Map (Expanded from current 10 → 25+)

```
DATABASE: visitvagad
│
├── CONTENT (existing, enhanced)
│   ├── destinations          # Tourism content
│   ├── events                # Festivals, cultural events
│   ├── food                  # Cuisine items
│   ├── experiences           # Activities
│   ├── itineraries           # Travel plans
│   ├── galleries             # Image collections
│   ├── regions               # District metadata
│   ├── settings              # Platform config
│   ├── campaigns             # Seasonal campaigns (migrate from constants)
│   └── stories               # NEW: Blog/editorial content
│
├── USERS & PROFILES
│   ├── profiles              # Extended user profiles (all roles)
│   ├── verifications         # KYC documents, approval status
│   └── notifications         # User notifications
│
├── HOSPITALITY
│   ├── properties            # Hotels + Homestays
│   ├── rooms                 # Room types per property
│   ├── availability          # Date-based availability/pricing
│   └── property_photos       # Ordered photo galleries
│
├── FOOD & DINING
│   ├── restaurants           # Restaurant listings
│   ├── menus                 # Menu items per restaurant
│   └── reservations          # Table bookings
│
├── GUIDES & EXPERIENCES
│   ├── guides                # Guide profiles (enhanced from current)
│   ├── tour_packages         # Packaged experiences
│   └── guide_availability    # Calendar data
│
├── MARKETPLACE
│   ├── artisan_shops         # Shop listings
│   ├── products              # Craft products
│   └── orders                # Product orders
│
├── BOOKINGS & FINANCE
│   ├── bookings              # Universal booking records
│   ├── payments              # Payment transactions
│   └── payouts               # Provider payout records
│
├── REVIEWS & SOCIAL
│   ├── reviews               # Ratings + text + photos
│   ├── wishlists             # Tourist saved items
│   └── user_trips            # Trip planner data
│
└── MODERATION & ADMIN
    ├── reports               # User-submitted reports
    ├── moderation_queue       # Items pending review
    └── audit_log             # Admin action history
```

#### Key Collection Schemas

```typescript
// PROFILES — extends Appwrite auth user
interface ProfileDoc {
  userId: string;             // Appwrite user ID (indexed)
  role: string;               // Primary role
  displayName: string;
  avatar: string;
  phone: string;
  district: string;
  bio: string;
  verified: boolean;
  verifiedAt: string;
  suspended: boolean;
  suspendedReason: string;
  onboardingComplete: boolean;
  createdAt: string;
}

// PROPERTIES — Hotels & Homestays
interface PropertyDoc {
  ownerId: string;            // User ID (indexed)
  slug: string;               // Unique
  name: string;
  type: 'hotel' | 'homestay' | 'heritage' | 'eco-stay' | 'guesthouse';
  description: string;
  district: 'Banswara' | 'Dungarpur';
  address: string;
  coordinates: string;        // "lat,lng"
  amenities: string;          // JSON array
  policies: string;           // JSON: {checkIn, checkOut, cancellation, pets}
  heroImage: string;
  photos: string;             // JSON array of URLs
  rating: number;
  reviewCount: number;
  priceRange: string;         // "₹800 - ₹2500"
  contactPhone: string;
  contactEmail: string;
  status: 'pending' | 'active' | 'suspended' | 'archived';
  featured: boolean;
  approvedAt: string;
  approvedBy: string;
}

// BOOKINGS — Universal
interface BookingDoc {
  type: string;               // hotel|homestay|guide|experience|event|restaurant
  touristId: string;          // Indexed
  providerId: string;         // Indexed
  listingId: string;
  startDate: string;
  endDate: string;
  guests: number;
  specialRequests: string;
  baseAmount: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: string;
  transactionId: string;
  status: string;             // Indexed
  reviewId: string;
  createdAt: string;
  confirmedAt: string;
  completedAt: string;
}

// REVIEWS
interface ReviewDoc {
  bookingId: string;          // Indexed, ensures one review per booking
  touristId: string;
  providerId: string;
  listingId: string;
  listingType: string;        // hotel|guide|restaurant|product
  rating: number;             // 1-5
  text: string;
  photos: string;             // JSON array
  response: string;           // Provider's response
  respondedAt: string;
  status: 'published' | 'flagged' | 'removed';
  createdAt: string;
}

// MODERATION QUEUE
interface ModerationDoc {
  itemType: string;           // review|listing|photo|report
  itemId: string;
  reason: string;             // auto-flag reason or report reason
  reportedBy: string;         // User ID (if user-reported)
  assignedTo: string;         // Moderator user ID
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  decision: string;           // Moderator's note
  decidedAt: string;
  createdAt: string;
}
```

#### Indexing Strategy

| Collection | Indexes | Query Patterns |
|-----------|---------|----------------|
| profiles | userId (unique), role, district, suspended | By user, by role, active by district |
| properties | slug (unique), ownerId, status, district, type, featured | By owner, active by district/type, featured |
| rooms | propertyId, available | Rooms for a property |
| bookings | touristId, providerId, status, type, startDate | By tourist, by provider, upcoming, by type |
| reviews | bookingId (unique), providerId, listingType, rating | By provider, by listing, high-rated |
| products | shopId, category, status, price | By shop, by category, price range |
| orders | buyerId, shopId, status | By buyer, by shop, pending |
| moderation_queue | status, itemType, assignedTo | Pending items, by type, by moderator |

---

### 4.2 Admin System

#### Admin Hierarchy

```
SUPER ADMIN (full platform control)
├── District Tourism Officer (district-scoped)
│   ├── Approve/reject businesses in their district
│   ├── View district analytics
│   ├── Manage district campaigns
│   └── Emergency alerts
├── Moderator (content moderation)
│   ├── Review flagged content
│   ├── Handle reports
│   ├── Suspend accounts (temporary)
│   └── Escalate to admin
└── Content Editor (editorial)
    ├── Manage destinations/events/food
    ├── Editorial scoring
    ├── SEO management
    └── Campaign content
```

#### Super Admin Dashboard (`/admin`)

```
┌─────────────────────────────────────────────────────────────┐
│  SUPER ADMIN DASHBOARD                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PLATFORM HEALTH                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │
│  │Users   │ │Bookings│ │Revenue │ │Pending │ │Flagged   │ │
│  │1,247   │ │89 today│ │₹2.4L/mo│ │12 apps │ │3 reviews │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │
│                                                              │
│  SIDEBAR:                                                    │
│  ├── Dashboard (overview)                                    │
│  ├── Users & Roles                                           │
│  ├── Business Approvals                                      │
│  ├── Moderation Queue                                        │
│  ├── Content Management                                      │
│  │   ├── Destinations                                        │
│  │   ├── Events                                              │
│  │   ├── Food                                                │
│  │   ├── Itineraries                                         │
│  │   ├── Campaigns                                           │
│  │   └── Stories/Blog                                        │
│  ├── Hospitality                                             │
│  │   ├── Hotels                                              │
│  │   ├── Homestays                                           │
│  │   └── Restaurants                                         │
│  ├── Guides & Experiences                                    │
│  ├── Marketplace (Bhil Bazaar)                               │
│  ├── Bookings & Payments                                     │
│  ├── Reviews & Reports                                       │
│  ├── Analytics                                               │
│  │   ├── Platform metrics                                    │
│  │   ├── Revenue                                             │
│  │   ├── District breakdown                                  │
│  │   └── SEO performance                                     │
│  ├── Media Library                                           │
│  ├── Media QA                                                │
│  ├── Editorial Scoring                                       │
│  ├── SEO Management                                          │
│  └── Settings                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Moderation Workflow

```
CONTENT ENTERS MODERATION WHEN:
1. New business listing submitted (auto)
2. Review contains flagged words (auto)
3. User reports content (manual)
4. Photo fails quality check (auto)
5. Unusual activity detected (auto)

MODERATION FLOW:
1. Item enters queue → status: 'pending'
2. Assigned to moderator (round-robin or manual)
3. Moderator reviews:
   - Approve → item goes live
   - Reject → item removed, user notified with reason
   - Request changes → sent back to user
   - Escalate → forwarded to admin/officer
4. Action logged in audit_log
5. Repeated violations → account suspension

AUTO-MODERATION RULES:
- Profanity filter on reviews (flag, don't block)
- Duplicate photo detection (perceptual hash)
- Spam patterns (same text across multiple reviews)
- Price anomalies (flag listings 5x above/below average)
- New accounts with 10+ listings in 24h (flag)
```

---

### 4.3 Trust & Safety System

#### Verification Badges

| Badge | Criteria | Display |
|-------|----------|---------|
| ✓ Verified | ID verified by admin | Blue checkmark |
| ★ Trusted | 5+ reviews, 4.0+ rating | Gold star |
| 🏆 Expert | 20+ completions, 4.5+ rating | Trophy icon |
| 🏛️ Official | Government-affiliated | Shield icon |
| 🌿 Eco-Certified | Meets eco-tourism standards | Leaf icon |

#### Fake Review Prevention

| Mechanism | How It Works |
|-----------|-------------|
| Booking verification | Only completed bookings can leave reviews |
| One review per booking | Database constraint on bookingId |
| Time gating | Review window: 24h to 30 days after completion |
| Text analysis | Flag reviews < 20 chars or copy-pasted text |
| Rating patterns | Flag accounts that only give 1-star or 5-star |
| IP/device tracking | Flag multiple reviews from same device |
| Photo verification | Reverse image search on review photos |

#### Account Suspension Logic

```
AUTOMATIC SUSPENSION TRIGGERS:
- 3 confirmed fraud reports
- 5 rejected listings in 30 days
- Payment chargeback
- Identity verification failure (after 3 attempts)
- Confirmed fake reviews (posting or soliciting)

MANUAL SUSPENSION:
- Moderator can suspend for 7/30/permanent days
- Reason required (logged in audit)
- User notified via email with appeal instructions

APPEAL PROCESS:
1. Suspended user submits appeal via email
2. Admin reviews within 48 hours
3. Decision: reinstate / extend / permanent ban
4. User notified of outcome
```

#### Reporting System

```typescript
interface ReportDoc {
  reporterId: string;
  targetType: 'user' | 'listing' | 'review' | 'photo' | 'message';
  targetId: string;
  reason: 'spam' | 'fake' | 'inappropriate' | 'harassment' | 'fraud' | 'safety' | 'other';
  description: string;
  evidence: string;           // Optional photo/screenshot URLs
  status: 'submitted' | 'investigating' | 'resolved' | 'dismissed';
  resolution: string;
  resolvedBy: string;
  createdAt: string;
  resolvedAt: string;
}
```



---

## Part 5: Dashboards, Monetization & Development Roadmap

---

### 5.1 Dashboard UX Design

#### Tourist Dashboard

```
SIDEBAR: My Trips | Bookings | Wishlist | Reviews | Photos | Settings
MOBILE: Bottom tab bar with 4 icons (Home, Trips, Saved, Profile)

WIDGETS:
- Upcoming trip card (next booking with countdown)
- Quick actions (Search, Plan Trip, Browse Guides)
- Recently viewed (horizontal scroll)
- Recommended for you (based on wishlist/history)
- Review prompts (pending reviews)
```

#### Hotel/Homestay Dashboard

```
SIDEBAR: Overview | Rooms | Calendar | Bookings | Reviews | Pricing | Analytics | Payouts | Settings
MOBILE: Simplified — Overview, Bookings, Calendar tabs

KEY WIDGETS:
- Today's arrivals/departures
- Occupancy rate (this week)
- Revenue chart (30-day)
- Pending booking requests (action required)
- Recent reviews (with quick-reply)
- Payout summary
```

#### Guide Dashboard

```
SIDEBAR: Overview | Calendar | Bookings | Packages | Reviews | Earnings | Profile
MOBILE: Overview, Calendar, Bookings tabs

KEY WIDGETS:
- Next tour (countdown + tourist details)
- This month's earnings
- Availability toggle (online/offline)
- Booking requests (accept/decline)
- Rating trend
```

#### Super Admin Dashboard

```
SIDEBAR: (see Part 4.2 above)

TOP-LEVEL METRICS:
- Total users (by role breakdown)
- Active listings (hotels, guides, restaurants, shops)
- Bookings today / this week / this month
- Revenue (gross, commission, payouts)
- Moderation queue size
- Pending approvals

CHARTS:
- Booking volume (30-day trend)
- Revenue by category (pie)
- User growth (line)
- District comparison (bar)
- Top-rated listings
- Seasonal patterns
```

---

### 5.2 Monetization Model

#### Revenue Streams

| Stream | Model | Expected Revenue | Timeline |
|--------|-------|-----------------|----------|
| Hotel bookings | 8-12% commission | Primary revenue | Phase 2 |
| Guide bookings | 10-15% commission | Secondary | Phase 2 |
| Artisan sales | 5-8% commission | Growing | Phase 3 |
| Event tickets | 10% of ticket sales | Seasonal | Phase 3 |
| Featured listings | ₹500-2000/month | Steady | Phase 2 |
| Promoted campaigns | ₹5000-20000/campaign | B2B | Phase 3 |
| Tourism ads | CPM/CPC | Scale-dependent | Phase 4 |
| Analytics subscriptions | ₹2000-10000/month | B2B/Govt | Phase 4 |
| White-label licensing | Custom pricing | High-value | Phase 5 |

#### Commission Structure

```
TIERED COMMISSION (rewards volume):

HOTELS:
- 0-10 bookings/month: 12%
- 11-30 bookings/month: 10%
- 31+ bookings/month: 8%

GUIDES:
- New guide (first 3 months): 10%
- Established (3+ months): 12%
- Expert (20+ tours, 4.5+ rating): 10%

ARTISANS:
- Standard: 8%
- Cooperative/SHG members: 5%
- Festival sales: 6%

PROMOTIONAL RATES:
- First 3 months for any new business: 50% off commission
- Eco-certified properties: 2% discount
- Government-recommended listings: 2% discount
```

#### Featured Listing Tiers

| Tier | Price | Benefits |
|------|-------|----------|
| Basic (free) | ₹0 | Standard listing, organic search |
| Highlighted | ₹500/month | Border highlight, "Recommended" badge |
| Featured | ₹1500/month | Top of category, campaign inclusion, social promotion |
| Premium | ₹3000/month | Homepage placement, priority in search, dedicated support |

---

### 5.3 Scalability Architecture

#### Current → Scale Path

| Phase | Users | Listings | Bookings/mo | Infrastructure |
|-------|-------|----------|-------------|----------------|
| MVP | 100 | 20 | 10 | Appwrite Cloud free tier, Vercel free |
| Growth | 5,000 | 100 | 500 | Appwrite Pro, Vercel Pro |
| Scale | 50,000 | 500 | 5,000 | Self-hosted Appwrite, Redis cache, CDN |
| Enterprise | 500,000 | 2,000 | 50,000 | Kubernetes, dedicated DB, microservices |

#### Technical Scaling Decisions

| Threshold | Action |
|-----------|--------|
| 1000 users | Add Redis caching layer for hot queries |
| 5000 bookings/month | Move to self-hosted Appwrite (no rate limits) |
| 100K monthly visitors | Add CDN for API responses (Vercel Edge Config) |
| Real-time features needed | Add WebSocket layer (Appwrite Realtime or Pusher) |
| Mobile app needed | Build React Native app sharing types/logic |
| Multi-region | Deploy Appwrite in Mumbai region, add read replicas |

---

### 5.4 Development Phases

#### Phase 1: Foundation (Current — Months 1-3)
**Status: 80% Complete**

```
COMPLETED:
✅ Next.js 15 App Router architecture
✅ Appwrite backend (10 collections)
✅ ImageKit CDN integration
✅ Public tourism pages (destinations, events, food, itineraries, stays)
✅ Admin CMS (editorial, media QA, scoring)
✅ SEO system (JSON-LD, sitemap, OG, canonical)
✅ Performance optimization (next/image, ISR, preconnect)
✅ Seasonal campaigns (5 campaigns)
✅ Bookmarks + recently viewed
✅ Social section (Instagram integration)
✅ Role-based admin (super_admin, editor, contributor)

REMAINING:
□ Fix broken footer links (/about, /contact)
□ Build out stub pages (culture, plan-your-trip)
□ Add public /guides page
□ Remove dead i18n code
□ Add Sentry monitoring
□ Add CI/CD pipeline
□ E2E tests (Playwright)
```

#### Phase 2: Marketplace MVP (Months 4-6)

```
GOAL: Enable real bookings for hotels and guides

DELIVERABLES:
□ Multi-role auth system (tourist, hotel_owner, guide)
□ Hotel onboarding flow
□ Room management + availability calendar
□ Guide onboarding + verification
□ Booking system (request → confirm → complete)
□ Payment integration (Razorpay/Cashfree)
□ Review system (post-booking)
□ Tourist dashboard (bookings, wishlist)
□ Provider dashboards (hotel, guide)
□ Admin approval workflow
□ Email notifications (transactional)
□ Basic moderation queue

TECH ADDITIONS:
- Payment gateway SDK
- Email service (Resend/SendGrid)
- Cron jobs for booking expiry
- WebSocket for real-time notifications (optional)
```

#### Phase 3: Full Ecosystem (Months 7-12)

```
GOAL: Complete marketplace with all provider types

DELIVERABLES:
□ Homestay system (simplified hotel flow)
□ Restaurant listings + reservations
□ Artisan marketplace (Bhil Bazaar)
□ Event ticketing
□ Tour package system
□ Advanced search (filters, map view)
□ District officer dashboard
□ Analytics system (platform metrics)
□ Payout automation
□ Hindi language support
□ Mobile-responsive dashboards
□ Advanced moderation (auto-flag, AI assist)
□ Trip planner (drag-and-drop)
```

#### Phase 4: Intelligence & Scale (Year 2)

```
GOAL: Platform intelligence and government-grade features

DELIVERABLES:
□ AI itinerary generation
□ AI travel assistant (chatbot)
□ Tourism analytics dashboard (government)
□ Crowd management indicators
□ Weather integration
□ Offline mode (PWA)
□ Mobile apps (React Native)
□ Multi-language (Hindi, Gujarati)
□ API for third-party integrations
□ White-label system for other regions
□ AR heritage tours (experimental)
```

---

### 5.5 API Architecture (Future)

```
PUBLIC API (v1):
GET  /api/v1/destinations          # List destinations
GET  /api/v1/destinations/:slug    # Destination detail
GET  /api/v1/events                # List events
GET  /api/v1/stays                 # List properties
GET  /api/v1/guides                # List guides
GET  /api/v1/search?q=             # Full-text search

AUTHENTICATED API:
POST /api/v1/bookings              # Create booking
GET  /api/v1/bookings/mine         # My bookings
POST /api/v1/reviews               # Submit review
GET  /api/v1/wishlist              # My wishlist
POST /api/v1/wishlist              # Add to wishlist

PROVIDER API:
GET  /api/v1/provider/bookings     # My received bookings
PUT  /api/v1/provider/bookings/:id # Update booking status
GET  /api/v1/provider/analytics    # My analytics
PUT  /api/v1/provider/listing      # Update my listing

ADMIN API:
GET  /api/v1/admin/approvals       # Pending approvals
PUT  /api/v1/admin/approve/:id     # Approve/reject
GET  /api/v1/admin/moderation      # Moderation queue
GET  /api/v1/admin/analytics       # Platform analytics
```

---

### 5.6 Summary

| Metric | Value |
|--------|-------|
| Total roles designed | 13 |
| Database collections (full ecosystem) | 25+ |
| Booking types supported | 6 |
| Revenue streams | 9 |
| Development phases | 4 |
| Estimated Phase 2 timeline | 3 months |
| Estimated full ecosystem | 12 months |

This architecture is designed to:
- Start simple (current editorial platform)
- Add marketplace incrementally (Phase 2)
- Scale to full ecosystem (Phase 3-4)
- Support government collaboration (Phase 4)
- Enable white-label licensing (Phase 4+)

The current codebase (Phase 1) provides the foundation — server-first architecture, Appwrite backend, ImageKit CDN, role-based auth, and editorial workflows are all in place and production-ready.

---

<p align="center">
  <sub>Architecture document v1.0 — Living document, update as platform evolves.</sub>
</p>

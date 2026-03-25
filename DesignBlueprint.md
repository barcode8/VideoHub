# VidShare - Video Sharing Platform Design Blueprint

## 🎨 Color Scheme

### Primary Colors
- **Base (Background)**: `#000000` (Black)
- **Secondary**: `#9333ea` (Purple-600)
- **Accent**: `#ec4899` (Pink-500)

### Gradients
- **Primary Gradient**: `from-purple-600 to-pink-500`
- **Hover Gradient**: `from-purple-700 to-pink-600`

### Neutral Colors
- **Card Background**: `#18181b` (Zinc-900)
- **Input Background**: `#27272a` (Zinc-800)
- **Border**: `#3f3f46` (Zinc-700)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#a1a1aa` (Zinc-400)
- **Text Muted**: `#71717a` (Zinc-500)

### Utility Colors
- **Error/Required**: `#ef4444` (Red-500)
- **Success**: `#22c55e` (Green-600)

---

## 📐 Layout Structure

### Main Application Layout
```
┌─────────────────────────────────────────────┐
│              Header/Navbar                  │
│  (Fixed, h-16, Black bg, Purple glow)      │
├──────┬──────────────────────────────────────┤
│      │                                      │
│ Side │        Main Content Area            │
│ bar  │     (Video Grid / Player)           │
│      │                                      │
│ (w-20│                                      │
│  or  │                                      │
│ w-64)│                                      │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

### Register Page Layout
```
┌─────────────────────────────────────────────┐
│                                             │
│         Black Background (h-screen)         │
│                                             │
│     ┌───────────────────────────┐          │
│     │   Centered Form Card      │          │
│     │  (Zinc-900, max-w-lg)     │          │
│     │  Purple glow shadow       │          │
│     │  - Email *                │          │
│     │  - Username *             │          │
│     │  - Password *             │          │
│     │  [Submit Button]          │          │
│     └───────────────────────────┘          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🧩 Components Breakdown

### 1. **Navbar Component**
**File**: `/components/Navbar.tsx`

**Structure**:
- Fixed positioning at top
- Height: 64px (h-16)
- Black background with bottom border (zinc-800)
- Max width container: 7xl with responsive padding

**Elements**:
- **Logo**: "VidShare" with purple-to-pink gradient text
- **Navigation Links** (Desktop):
  - Home (active - white text)
  - Trending (zinc-400)
  - Subscriptions (zinc-400)
  - Library (zinc-400)
  - Hover effect: text-pink-500
- **Search Bar** (Desktop/Tablet):
  - Full width with max-w-2xl
  - Zinc-900 background
  - Rounded-full
  - Purple glow on focus
  - Search icon on left
- **Action Buttons**:
  - Upload button (gradient background)
  - Notifications (with pink dot indicator)
  - User profile icon
  - Mobile menu toggle
- **Mobile Menu**: Dropdown with navigation links

**Responsive Behavior**:
- `< 768px`: Hide nav links, show hamburger menu
- `< 1024px`: Hide search bar, show search icon
- `>= 768px`: Show nav links
- `>= 1024px`: Show search bar

---

### 2. **Header Component**
**File**: `/components/Header.tsx`

**Elements**:
- Logo section
- Search input (desktop only, w-96)
- Upload button with icon
- Notification bell
- User profile button

**Props**:
- `onUploadClick`: Function to trigger upload modal

---

### 3. **Sidebar Component**
**File**: `/components/Sidebar.tsx`

**Structure**:
- Fixed positioning (left side)
- Width: 80px collapsed, 256px expanded
- Black background with right border

**Menu Items**:
- Home (active state with gradient background)
- Trending
- Popular
- Watch Later
- Liked Videos
- History
- My Videos

**Categories Section**:
- Gaming
- Music
- Education
- Sports
- Technology

**States**:
- Active: `bg-gradient-to-r from-purple-600/20 to-pink-500/20` with pink text
- Hover: `bg-zinc-800`

**Props**:
- `isOpen`: Boolean for sidebar state

---

### 4. **VideoCard Component**
**File**: `/components/VideoCard.tsx`

**Structure**:
```
┌─────────────────────────┐
│   Thumbnail (16:9)      │
│   - Hover overlay       │
│   - Play button         │
│   - Duration badge      │
├─────────────────────────┤
│ [Avatar] Title          │
│          Author         │
│          Stats          │
└─────────────────────────┘
```

**Elements**:
- **Thumbnail**: Aspect-video, rounded-xl, hover scale effect
- **Play Button**: Purple-pink gradient circle, appears on hover
- **Duration**: Bottom-right badge (black/80 bg)
- **Author Avatar**: 40x40px circle
- **Title**: 2-line clamp, white text, pink on hover
- **Stats Row**: Views, Likes, Comments with icons

**Props**:
- `video`: Video object
- `onVideoClick`: Click handler

**Video Object Schema**:
```typescript
{
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  likes: string
  comments: string
  author: string
  authorAvatar: string
  uploadedAt: string
}
```

---

### 5. **VideoPlayer Component**
**File**: `/components/VideoPlayer.tsx`

**Structure**:
- Full-screen modal overlay (black/95 bg)
- 3-column grid layout (2:1 ratio on large screens)

**Left Column** (Main Content):
- Video player (aspect-video)
- Title
- Author info with subscribe button
- Action buttons (Like, Dislike, Share, Report)
- Description box (zinc-900 bg)
- Comments section

**Right Column** (Sidebar):
- Recommended videos list
- Compact horizontal cards

**Props**:
- `video`: Video object
- `onClose`: Close handler

---

### 6. **UploadModal Component**
**File**: `/components/UploadModal.tsx`

**Structure**:
- Centered modal (max-w-2xl)
- Zinc-900 background

**Elements**:
- Drag & drop zone (dashed border)
- File icon (purple-pink gradient circle)
- File select button
- Title input
- Description textarea
- Category dropdown
- Cancel/Upload buttons

**Props**:
- `onClose`: Close handler

**States**:
- `dragActive`: Visual feedback for drag state

---

### 7. **RegisterPage Component**
**File**: `/components/RegisterPage.tsx`

**Structure**:
- Full-screen black background
- Centered card (max-w-lg, max-h-90vh)
- Purple glow shadow

**Form Fields** (in order):
1. Email * (required)
2. Username * (required)
3. Password * (required)

**Elements**:
- VidShare logo (gradient text)
- "Create An Account" heading
- Form inputs with purple glow on focus
- Submit button (gradient background)
- "Already have an account?" link

**Animations**:
- Initial fade-in and slide-up (0.6s)
- Input scale on focus (1.02x)
- Button scale on hover (1.1x) and tap (0.95x)

---

## 🎭 Design Patterns

### Buttons

**Primary Button** (Gradient):
```jsx
className="bg-gradient-to-r from-purple-600 to-pink-500 
           hover:from-purple-700 hover:to-pink-600 
           px-4 py-2 rounded-full transition-all"
```

**Secondary Button** (Zinc):
```jsx
className="bg-zinc-900 hover:bg-zinc-800 
           px-4 py-2 rounded-full transition-colors"
```

**Icon Button**:
```jsx
className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
```

### Input Fields

**Standard Input**:
```jsx
className="w-full bg-zinc-800 text-white placeholder-zinc-500 
           px-4 py-2 rounded-lg border border-zinc-700 
           focus:border-purple-600 focus:outline-none 
           transition-colors"
```

**Search Input**:
```jsx
className="bg-zinc-900 text-white px-4 py-2 pl-10 
           rounded-full border border-zinc-700 
           focus:border-purple-600 focus:outline-none"
```

**Register Input** (with glow):
```jsx
className="w-full bg-zinc-800 text-white placeholder-zinc-500 
           rounded px-3 py-2 outline-none 
           border border-transparent 
           focus:border-purple-600 
           focus:shadow-[0_0_15px_rgba(147,51,234,0.6)] 
           transition-all duration-300"
```

### Cards

**Video Card**:
```jsx
className="bg-zinc-900 rounded-xl overflow-hidden 
           hover:scale-105 transition-transform"
```

**Modal/Form Card**:
```jsx
className="bg-zinc-900 rounded-2xl p-8 
           shadow-[0_0_60px_15px_rgba(147,51,234,0.3)]"
```

---

## ✨ Interactions & Animations

### Hover Effects
- **Video Cards**: Scale 1.05, overlay appears, play button fades in
- **Buttons**: Background color change, scale effects
- **Links**: Color change to pink-500
- **Inputs**: Border color to purple-600 with glow

### Focus Effects
- **Inputs**: Purple border + glow shadow
- **Search Bar**: Purple border + glow

### Click Effects
- **Buttons**: Scale down to 0.95 (tap effect)

### Motion Animations
- **Register Page**: Fade-in + slide-up on mount (0.6s)
- **Input Focus**: Scale to 1.02
- **Button Hover**: Scale to 1.1
- **Button Tap**: Scale to 0.95

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used
- **sm**: 640px - Mobile landscape
- **md**: 768px - Tablet
- **lg**: 1024px - Desktop
- **xl**: 1280px - Large desktop

### Component Responsiveness

**Navbar**:
- `< 768px`: Hamburger menu, no nav links
- `< 1024px`: No search bar
- `>= 1024px`: Full layout with search

**Sidebar**:
- `< 768px`: Hidden or overlay
- `>= 768px`: 80px width (collapsed)
- When open: 256px width

**Video Grid**:
- Mobile: 1 column
- sm: 2 columns
- lg: 3 columns
- xl: 4 columns

**Video Player**:
- Mobile: Single column
- lg: 2-column layout (main + sidebar)

---

## 🔤 Typography

### Font Family
- System font stack (San Francisco, Segoe UI, Roboto, etc.)

### Heading Sizes
- **H1 (Logo)**: text-2xl to text-4xl
- **H2 (Page Title)**: text-2xl
- **H3 (Section)**: text-xl

### Body Text
- **Primary**: text-base (white)
- **Secondary**: text-sm (zinc-400)
- **Small**: text-xs (zinc-500)

### Font Weights
- Regular (400) - Default
- Semi-bold (600) - Not explicitly set (using defaults from globals.css)
- Bold (700) - Not explicitly set (using defaults from globals.css)

---

## 🖼️ Image Handling

### Thumbnails
- Aspect ratio: 16:9 (aspect-video)
- Object fit: cover
- Border radius: rounded-xl

### Avatars
- Size: 40x40px to 48x48px
- Border radius: rounded-full
- Object fit: cover

### Upload Previews
- Avatar: Square (aspect-square)
- Cover: Rectangle (h-48, aspect-video)
- Border: Purple-600 when uploaded

---

## 🎯 Key Features

### Home Page
- Fixed navbar at top
- Collapsible sidebar
- Category filter chips
- Video grid (responsive)
- Video player modal
- Upload modal

### Register Page
- Centered form card
- Field validation indicators (*)
- Purple glow effects
- Motion animations
- Sign-in link

### Navigation
- Logo branding
- Search functionality
- Quick actions (Upload, Notifications, Profile)
- Mobile-friendly menu

### Video Interaction
- Click to play (modal)
- Like/dislike
- Share
- Comments
- Recommendations

---

## 📦 File Structure

```
/
├── App.tsx                    # Main app with routing logic
├── styles/
│   └── globals.css           # Global styles & CSS variables
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── Header.tsx            # Alternative header
│   ├── Sidebar.tsx           # Sidebar navigation
│   ├── VideoCard.tsx         # Video thumbnail card
│   ├── VideoPlayer.tsx       # Full video player modal
│   ├── UploadModal.tsx       # Upload video modal
│   └── RegisterPage.tsx      # Registration form page
└── DESIGN_BLUEPRINT.md       # This file
```

---

## 🎨 Design Principles

1. **Consistency**: Purple-pink gradient used throughout for primary actions
2. **Contrast**: Black background with white text for maximum readability
3. **Hierarchy**: Clear visual distinction between primary, secondary, and tertiary elements
4. **Feedback**: Visual feedback for all interactions (hover, focus, active states)
5. **Responsive**: Mobile-first approach with progressive enhancement
6. **Accessibility**: Semantic HTML, focus states, proper contrast ratios
7. **Performance**: Optimized animations, lazy loading considerations

---

## 🚀 Future Considerations

### Potential Enhancements
- Dark/Light mode toggle (currently dark only)
- User profile page
- Video upload progress indicator
- Real-time notifications
- Video playback controls
- Playlist functionality
- Advanced search filters
- Social sharing integration
- Comment replies/threading
- Video quality selector
- Keyboard shortcuts
- Accessibility improvements (ARIA labels, screen reader support)

### Technical Improvements
- Form validation
- Error handling
- Loading states
- Skeleton screens
- Infinite scroll
- Video streaming optimization
- Image lazy loading
- SEO optimization

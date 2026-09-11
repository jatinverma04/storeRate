# StoreRate UI Theme

## Design Direction

StoreRate should have a simple, clean, professional interface.

The UI should be easy to understand and use, with minimal visual decoration.

The design should feel like a practical full-stack application rather than a marketing website.

### Avoid

- Blue
- Indigo
- Purple
- Gradients
- Neon colors
- Glassmorphism
- Excessive animations
- Heavy shadows
- Excessive rounded cards
- Unnecessary decorative elements

---

## Color Palette

### Primary

**Charcoal**

```text
#374151
```

Used for:

- Primary buttons
- Important actions
- Active navigation
- Main controls

### Primary Hover

```text
#1F2937
```

Used for primary button hover states.

### Accent

**Muted Sage Green**

```text
#6B8E6B
```

Used sparingly for:

- Ratings
- Selected rating
- Positive indicators
- Small UI accents

### Background

**Warm Off-White**

```text
#F7F7F5
```

Used as the main application background.

### Surface

```text
#FFFFFF
```

Used for:

- Cards
- Tables
- Forms
- Sidebar
- Modals

### Primary Text

```text
#1F2937
```

Used for:

- Headings
- Important content
- Table text

### Secondary Text

```text
#6B7280
```

Used for:

- Descriptions
- Helper text
- Metadata

### Border

```text
#E5E7EB
```

Used for:

- Input borders
- Table borders
- Card borders
- Dividers

---

## Status Colors

### Success

```text
#4D7C5A
```

### Error

```text
#B91C1C
```

### Warning

```text
#A16207
```

Use status colors only when they communicate an actual status.

---

## Rating Colors

### Selected Rating

```text
#6B8E6B
```

### Unselected Rating

```text
#D1D5DB
```

Keep the rating interface simple and clearly understandable.

---

# Typography

Use a clean sans-serif font.

Preferred:

```text
Inter
```

Fallback:

```text
system-ui, sans-serif
```

Typography should prioritize readability.

Avoid oversized headings and decorative fonts.

---

# Layout

Use a simple application layout.

### Desktop

```text
┌──────────────┬─────────────────────────────┐
│              │                             │
│   Sidebar    │         Main Content        │
│              │                             │
│   Dashboard  │                             │
│   Stores     │                             │
│   Users      │                             │
│   Password   │                             │
│   Logout     │                             │
│              │                             │
└──────────────┴─────────────────────────────┘
```

Keep the sidebar simple.

Only display navigation items relevant to the user's role.

---

# Spacing

Use consistent spacing throughout the application.

Prefer:

```text
4px
8px
12px
16px
24px
32px
```

Avoid arbitrary spacing values unless necessary.

---

# Border Radius

Use moderate rounding.

```text
Inputs: 6px
Buttons: 6px
Cards: 8px
Modals: 8px
```

Do not make every element pill-shaped.

---

# Shadows

Keep shadows very subtle.

Prefer:

- Borders
- Spacing
- Background contrast

over heavy shadows.

Cards should still look good without shadows.

---

# Buttons

## Primary Button

```text
Background: #374151
Text: #FFFFFF
Hover: #1F2937
```

Examples:

- Login
- Sign Up
- Add User
- Add Store
- Submit Rating

## Secondary Button

```text
Background: #FFFFFF
Text: #374151
Border: #E5E7EB
```

## Success Button

```text
Background: #6B8E6B
Text: #FFFFFF
```

Use only where a positive action is appropriate.

## Destructive Button

```text
Background: #B91C1C
Text: #FFFFFF
```

Use only for genuinely destructive actions.

---

# Forms

Inputs should have:

```text
Background: #FFFFFF
Text: #1F2937
Border: #E5E7EB
```

Focused input:

```text
Border: #374151
```

Error input:

```text
Border: #B91C1C
```

Labels should be clearly visible above inputs.

Validation messages should appear close to the relevant field.

---

# Tables

Tables should be simple and readable.

### Header

```text
Background: #F7F7F5
Text: #1F2937
Border: #E5E7EB
```

### Body

```text
Background: #FFFFFF
Text: #1F2937
```

Use subtle hover feedback.

Do not use strong row colors.

Sorting indicators should be simple arrows/icons.

---

# Cards

Cards should use:

```text
Background: #FFFFFF
Border: #E5E7EB
```

Use cards only where they improve organization.

Avoid putting every piece of content inside a separate card.

---

# Navigation

### Active

```text
Background: #ECEDE9
Text: #374151
```

### Inactive

```text
Text: #6B7280
```

### Hover

```text
Background: #F7F7F5
Text: #1F2937
```

Navigation should be simple and easy to scan.

---

# Dashboard

Dashboard statistics should use simple cards.

Example:

```text
┌──────────────────┐
│ Total Users      │
│                  │
│ 128              │
└──────────────────┘
```

Use the same visual style for:

- Total Users
- Total Stores
- Total Ratings

Do not add charts or analytics that are not required.

---

# Rating UI

Rating selection should be immediately understandable.

Example:

```text
Rating

1   2   3   4   5
○   ○   ●   ○   ○
```

Selected:

```text
#6B8E6B
```

Unselected:

```text
#D1D5DB
```

Do not use unnecessary animations.

---

# Responsive Design

The application must remain usable on:

- Desktop
- Tablet
- Mobile

On smaller screens:

- Sidebar can collapse
- Forms become single-column
- Tables should remain readable
- Buttons remain accessible
- Content should not overflow horizontally unnecessarily

---

# Overall Visual Rules

1. Keep the interface mostly neutral.
2. Use charcoal for primary actions.
3. Use sage green only as a subtle accent.
4. Use red only for errors/destructive actions.
5. Use warm off-white as the page background.
6. Keep cards and tables simple.
7. Prioritize readability over decoration.
8. Avoid unnecessary animations.
9. Avoid gradients.
10. Avoid adding colors outside this theme.

---

# Final Palette

| Purpose | Color |
|---|---|
| Primary | `#374151` |
| Primary Hover | `#1F2937` |
| Accent | `#6B8E6B` |
| Background | `#F7F7F5` |
| Surface | `#FFFFFF` |
| Primary Text | `#1F2937` |
| Secondary Text | `#6B7280` |
| Border | `#E5E7EB` |
| Success | `#4D7C5A` |
| Error | `#B91C1C` |
| Warning | `#A16207` |
| Unselected Rating | `#D1D5DB` |
---
sidebar_position: 5
description: "Practice building StatelessWidgets, from visual atoms to modular molecules, with exercises organized by level."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Exercises: StatelessWidgets

In this guide you will test your ability to structure decoupled visual components in Flutter through **10 progressive exercises**, from basic atomic elements to complex composite cards.

Each exercise includes two tabs:
1. **Component & View**: Shows a screenshot of the component designed under **Google Material Design 3 (Material You)** guidelines and a short explanation of what it represents.
2. **Tips & Guide**: Lists recommendations on the file name, pedagogical purpose, tonal palette, suggested constructor parameters and the base Flutter widgets for building the layout.

---

## Level 1: Visual Atoms

### 01. Action Button with Icon

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-01-action-button.png" 
    alt="MD3 action button with icon" 
    style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

A prominent pill-shaped (*pill shape*) action button with an icon on the left and a clear text label, designed to trigger the download or saving of a resource in the application.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/action_button.dart`
* **Purpose:** Encapsulate a reusable pill-shaped button that responds to a configurable press event.
* **Suggested M3 palette:** Indigo primary background (`#6750A4`) with text and icon in white `on-primary` color (`#FFFFFF`).
* **Suggested constructor parameters (props):** `final String label;` (e.g. *"Download Guide"*), `final IconData icon;` (e.g. `Icons.download`), `final VoidCallback onPressed;`
* **Suggested base widgets:** `ElevatedButton.icon` or `FilledButton.icon` with `style: ElevatedButton.styleFrom(shape: const StadiumBorder())`.

</TabItem>
</Tabs>

---

### 02. Tonal Status Badge

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-02-status-badge.png" 
    alt="MD3 tonal status badge" 
    style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

A small tonal status pill with a bright circular indicator and a text label, ideal for reporting the progress or condition of a task in a list.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/status_badge.dart`
* **Purpose:** Create a compact operational status label with a glowing dot that denotes an active or completed state.
* **Suggested M3 palette:** Soft lavender `secondary-container` background (`#E8DEF8`), text in `on-secondary-container` and an emerald/green dot (`#10B981`).
* **Suggested constructor parameters (props):** `final String text;` (e.g. *"In Progress"*), `final Color dotColor;`
* **Suggested base widgets:** `Container` with a rounded `BoxDecoration` (`BorderRadius.circular(999)`), nesting a `Row(mainAxisSize: MainAxisSize.min)` with a small circular `Container` and a `Text`.

</TabItem>
</Tabs>

---

### 03. Tonal Information Banner

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-03-notification-banner.png" 
    alt="MD3 tonal information banner" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

An institutional notice banner with a subtle tonal background, a circular information icon, a bold title, descriptive text and a dismiss button in the right corner.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/notification_banner.dart`
* **Purpose:** Present a highlighted announcement at the top of screens with an option to dismiss it voluntarily.
* **Suggested M3 palette:** `surface-container-low` background (`#F9F1FD`) with a subtle `outline-variant` border (`#CBC4D2`) and an icon container in `primary-container` (`#6750A4`).
* **Suggested constructor parameters (props):** `final String title;` (e.g. *"Academic Notice"*), `final String message;`, `final IconData icon;` (defaults to `Icons.info`), `final VoidCallback? onDismiss;`
* **Suggested base widgets:** `Container` with a 16px radius, `Row` with a `CircleAvatar`, `Expanded` wrapping a `Column` of texts, and an `IconButton` with `Icons.close`.

</TabItem>
</Tabs>

---

## Level 2: Modular Molecules

### 04. User Profile Card

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-04-user-profile-card.png" 
    alt="MD3 user profile card" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

A horizontal row that groups the user's circular avatar with a connectivity dot, name, an "Online" tonal label, academic role and an instant messaging button.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/user_profile_card.dart`
* **Purpose:** Render summarized data of instructors, teaching assistants or students in lists and contact panels.
* **Suggested M3 palette:** `surface-container` background (`#F3EBF7`), badge in `primary-fixed` and a status dot in emerald green.
* **Suggested constructor parameters (props):** `final String name;` (e.g. *"Sofia Martinez"*), `final String role;` (e.g. *"SIS Teaching Assistant • Flutter GDE"*), `final String avatarUrl;`, `final bool isOnline;`, `final VoidCallback onMessage;`
* **Suggested base widgets:** `Card` or `Container`, a main `Row`, a `Stack` over the `CircleAvatar` for the connection indicator, a `Column` for the name and role, and an `IconButton` with `Icons.chat`.

</TabItem>
</Tabs>

---

### 05. Analytics Metric Card

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-05-metric-card.png" 
    alt="MD3 bento analytics metric card" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

A bento-style information card that presents a quantitative metric in a large type size, accompanied by its percentage trend and a study streak indicator.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/metric_card.dart`
* **Purpose:** Display key performance indicators (KPIs) in student dashboards or weekly summaries.
* **Suggested M3 palette:** White `surface-container-lowest` surface (`#FFFFFF`), icon in a 10% primary tonal container and the trend in emerald green.
* **Suggested constructor parameters (props):** `final String title;` (e.g. *"Study Time"*), `final String value;` (e.g. *"2,840 hrs"*), `final String trendText;` (e.g. *"+14.2% this month"*), `final String streakDays;` (e.g. *"28d"*), `final IconData icon;`
* **Suggested base widgets:** `Card` with pronounced rounded corners (24px radius), a `Row` that separates the stats column and a square `Container` for the streak badge.

</TabItem>
</Tabs>

---

### 06. Media List Item

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-06-audio-track-item.png" 
    alt="MD3 media list item" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

A list item with a rounded square cover image, the podcast title, duration with author and a tonal circular button for immediate playback.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/audio_track_item.dart`
* **Purpose:** Build interactive rows for audio libraries, podcast episodes or recorded lessons.
* **Suggested M3 palette:** `surface-container-low` background (`#F9F1FD`) with the action button in `secondary-container` (`#E8DEF8`).
* **Suggested constructor parameters (props):** `final String title;` (e.g. *"Flutter Podcast: State Management"*), `final String subtitle;` (e.g. *"DevCommunity Radio • 14:20 min"*), `final String imageUrl;`, `final VoidCallback onPlay;`
* **Suggested base widgets:** `Container` with padding, `ClipRRect` for the image thumbnail (12px radius), `Expanded` to avoid overflow in long texts, and `IconButton.filledTonal` with `Icons.play_arrow`.

</TabItem>
</Tabs>

---

### 07. Floating Mini Player

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-07-mini-music-player.png" 
    alt="MD3 floating mini player" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
  />
</div>

A floating widget with an episode cover, descriptive texts, a progress bar with timestamps (02:45 / 05:30) and compact playback controls.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/mini_music_player.dart`
* **Purpose:** Emulate the persistent playback bar that floats over the user interface.
* **Suggested M3 palette:** Elevated background in `surface-container-high` (`#EDE6F1`), progress bar and main button in `primary` (`#4F378A`).
* **Suggested constructor parameters (props):** `final String title;` (e.g. *"Ep. 42: Clean Architecture"*), `final String channel;` (e.g. *"Flutter Latam Network"*), `final String imageUrl;`, `final double progress;` (value between 0.0 and 1.0), `final bool isPlaying;`, `final VoidCallback onPlayPause;`, `final VoidCallback onNext;`
* **Suggested base widgets:** `Card` with level 3 elevation (24px radius), a `Column` that holds a top row with the image, titles and control buttons, and a bottom section with a `LinearProgressIndicator` and time texts.

</TabItem>
</Tabs>

---

## Level 3: Complex Organisms

### 08. Catalog Product Card

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-08-product-card.png" 
    alt="MD3 catalog product card" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
  />
</div>

A vertical educational catalog card that integrates a header image with a floating certification badge, a save button, a star rating, a struck-through price with discount and a buy button.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/product_card.dart`
* **Purpose:** Design the main piece of a catalog of courses, digital products or premium lessons.
* **Suggested M3 palette:** White `surface-container-lowest` background, category badge in the primary color, stars in an amber tone and the button in indigo primary color.
* **Suggested constructor parameters (props):** `final String title;` (e.g. *"Advanced Flutter Course: From Zero to Expert with MD3"*), `final String category;` (e.g. *"Certification"*), `final String imageUrl;`, `final double rating;` (e.g. `4.9`), `final String reviewsCount;` (e.g. *"(1.2k reviews)"*), `final String currentPrice;` (e.g. *"$29.99 USD"*), `final String originalPrice;` (e.g. *"$59.99 USD"*), `final VoidCallback onBuy;`, `final VoidCallback onBookmark;`
* **Suggested base widgets:** A vertical `Card` with a top `ClipRRect`, a `Stack` to overlay the chip and button on the image, and a bottom `Padding` with a `Column` that lays out the rating texts, prices and the `ElevatedButton.icon`.

</TabItem>
</Tabs>

---

### 09. Academic Task Card

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-09-course-task-card.png" 
    alt="MD3 academic task card" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

An activity card with a highlighted left border, a checkbox, a high-urgency priority label, the course code and the submission deadline.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/course_task_card.dart`
* **Purpose:** Manage lab deliverables and sprints within a list of pending tasks.
* **Suggested M3 palette:** `surface-container-low` background (`#F9F1FD`), a 4px left border in `primary` (`#6750A4`), and a priority badge in `error-container` (`#FFDAD6`).
* **Suggested constructor parameters (props):** `final String title;` (e.g. *"Module 4: Custom Painters in Flutter"*), `final String courseCode;` (e.g. *"FLT-302"*), `final String dueDate;` (e.g. *"Due: Oct 18"*), `final String priority;` (e.g. *"High Priority"*), `final bool isCompleted;`, `final ValueChanged<bool?> onToggle;`
* **Suggested base widgets:** `Container` with `BoxDecoration(border: Border(left: BorderSide(color: ..., width: 4)))`, a `Checkbox` for the state and a `Row` nesting badges with `Icons.code` and `Icons.calendar_today`.

</TabItem>
</Tabs>

---

### 10. Full Social Feed Post

<Tabs>
<TabItem value="vista" label="Component & View" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-10-activity-feed-post.png" 
    alt="MD3 full social feed post" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
  />
</div>

The most complete component of the series: a social post with an author header and timestamp, a text body with readable line spacing, a framed attached photo and an interaction bar with counters for likes, comments, share and save.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `lib/components/activity_feed_post.dart`
* **Purpose:** Assemble the most complete component of the series: an academic social network post that combines author, outreach text, attached image and an interactive reactions bar.
* **Suggested M3 palette:** A wide card in `surface-container-lowest` with 24px to 28px radii, subtle dividers and interaction buttons in dark gray / secondary.
* **Suggested constructor parameters (props):** `final String authorName;` (e.g. *"Carlos Mendoza"*), `final String authorHandle;` (e.g. *"@cmendoza_dev"*), `final String authorAvatarUrl;`, `final String timeAgo;` (e.g. *"2 hours ago"*), `final String content;`, `final String? mediaImageUrl;` (optional image), `final int likesCount;`, `final int commentsCount;`, `final bool isLiked;`, `final VoidCallback onLike;`, `final VoidCallback onComment;`, `final VoidCallback onShare;`, `final VoidCallback onBookmark;`
* **Suggested base widgets:** A `Card` wrapping a general 16px `Padding`, a `Row` with a `CircleAvatar` for the header, a 16px-radius `ClipRRect` for the optional media content, and a bottom `Row` (`MainAxisAlignment.spaceBetween`) with interaction buttons for likes, comments, share and save.

</TabItem>
</Tabs>

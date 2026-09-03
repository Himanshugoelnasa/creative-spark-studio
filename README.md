# Creative Spark Studio

Build a Production-Quality AI Creative Studio

Create a modern, premium React + TypeScript AI media generation web application for generating AI images, AI videos, AI voice/audio, and eventually complete AI videos.

The application should feel like a polished commercial SaaS product inspired by the best UX patterns from platforms such as Kling, HeyGen, ElevenLabs, Runway, Leonardo AI, Midjourney, and similar AI creative tools, but DO NOT directly copy their branding, layouts, or visual identity.

The product should have its own distinctive premium design language.

The primary goal is to create the frontend/UI first. AI generation APIs can initially be mocked with realistic demo data and simulated generation progress. The architecture must be designed so real AI providers can be connected later without rebuilding the UI.

1. Product Concept

The application is an AI Creative Studio where users can:

Generate images from text

Generate videos from text

Generate videos from an image

Generate videos using first-frame and last-frame images

Generate AI voices

Convert text to speech

Create voiceovers

Eventually create complete videos combining:

Script

Images

Video clips

Voice

Music

Sound effects

Captions

The application should be designed as a unified creative workspace rather than several disconnected tools.

Think:

Prompt → Generate → Review → Edit → Organize → Export

2. Technology

Use:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui where appropriate

Framer Motion / Motion for animations

Lucide React icons

Modern component architecture

Responsive design

Dark-first UI

Clean reusable components

Proper routing

Do NOT create a static HTML mockup.

Build a real React application with reusable components, routes, state management, forms, dialogs, dropdowns, tabs, cards, modals, generation states, and navigation.

3. Overall Visual Direction

The UI should look:

Premium

Futuristic

Cinematic

Minimal

Professional

Creative

Slightly futuristic but not overly neon

Similar quality level to a modern AI SaaS startup

Use a dark interface as the primary theme.

Design language:

Deep dark background

Subtle gradients

Glassmorphism used selectively

Soft borders

Large rounded cards

Excellent typography

Strong visual hierarchy

Generous spacing

Subtle shadows

Beautiful hover states

Smooth transitions

Micro-interactions

Avoid making the UI look like a generic admin dashboard.

The application should feel like a creative tool, not an enterprise CRM.

4. Application Layout

Create a persistent application shell with:

Left Sidebar

Include:

Logo

Dashboard

Create

Image

Video

Voice

Music

Complete Video

My Creations

Projects

Assets

Templates

Explore

Favorites

History

Then a divider.

Bottom section:

Credits

Upgrade

Help

Settings

User profile

The sidebar should support collapsed and expanded states.

Use smooth Motion animations when expanding/collapsing.

5. Top Navigation

Top bar should contain:

Current workspace/project

Search

Notifications

Credits indicator

Upgrade button

User avatar

User dropdown

User dropdown:

Profile

Account

Billing

API Keys

Preferences

Theme

Keyboard shortcuts

Help

Logout

6. Authentication

Create complete authentication UI screens.

Routes:

/login

/signup

/forgot-password

/reset-password

/verify-email

Login page should support:

Email

Password

Remember me

Forgot password

Login button

Google login

GitHub login

Signup:

Name

Email

Password

Confirm password

Terms checkbox

Google signup

GitHub signup

For now authentication can be mocked.

Build the UI as if it will later connect to Supabase/Auth0/Firebase/custom backend.

7. Dashboard

Create an impressive AI Creative Studio dashboard.

Hero section:

"Create anything with AI."

Subtitle:

"Generate images, videos and voices from a single creative workspace."

Primary buttons:

Create Image

Create Video

Create Voice

Show recent creations underneath.

Dashboard sections:

Continue Creating

Horizontal cards for recent projects.

Recent Generations

Grid of generated media.

Each card should show:

Preview

Type

Prompt

Model

Creation date

Status

Favorite

More menu

Quick Create

Large attractive cards:

Image

Video

Voice

Complete Video

Trending / Inspiration

Show example AI generations.

8. IMAGE GENERATOR

Route:

/create/image

This should be one of the most polished pages.

Layout:

Left side:

Prompt editor.

Right side:

Generation preview/results.

Prompt section should include:

Large prompt textarea

Prompt enhancement button

Negative prompt

Image model selector

Style selector

Aspect ratio

Resolution

Number of images

Seed

Guidance scale

Steps

Advanced settings

Model selector examples:

FLUX

SDXL

Stable Diffusion

Leonardo

Custom Model

Demo Model

Do not require real API keys yet.

When clicking Generate:

Show animated generation state.

Example:

"Preparing prompt..."
"Generating..."
"Rendering..."
"Finalizing..."

Use skeletons and shimmer effects.

Results should appear in a beautiful masonry/grid layout.

Each generated image should support:

Open

Download

Upscale

Variations

Edit

Image-to-video

Favorite

Delete

Use as reference

Copy prompt

Add image preview modal with zoom and metadata.

9. VIDEO GENERATOR

Route:

/create/video

This should be the primary flagship feature.

Create a sophisticated video-generation workspace inspired by modern AI video platforms.

Tabs:

Text to Video

Image to Video

First + Last Frame

Reference Video

Extend Video

Prompt area:

Large cinematic prompt editor.

Controls:

Video model

Duration

Aspect ratio

Resolution

FPS

Camera movement

Motion intensity

Style

Seed

Negative prompt

Generate audio toggle

Models can initially be mocked:

Wan 2.1

Wan 2.2

HunyuanVideo

Kling

Luma

Runway

Custom

Demo Video Model

The model architecture should allow real providers to be plugged in later.

10. First Frame / Last Frame Video

Create a dedicated workflow.

Allow user to:

Upload first frame

Upload last frame

Enter prompt

Select model

Set duration

Set aspect ratio

Show a visual timeline:

[ FIRST FRAME ] → [ AI GENERATED MOTION ] → [ LAST FRAME ]

Animate the timeline during generation.

Provide drag-and-drop upload zones.

Show image previews.

11. Image-to-Video

Allow users to:

Upload image

Describe motion

Select model

Select duration

Select aspect ratio

Select motion strength

Show:

Input image → AI animation → Generated video

12. Video Generation Queue

Create a generation queue system.

Users should be able to see:

Queued

Processing

Completed

Failed

Each generation card should show:

Thumbnail

Generation type

Model

Progress

Estimated status

Cancel button

Use animated progress indicators.

Example:

"Generating video • 62%"

Completed generations should automatically appear in the library.

13. VOICE / AUDIO GENERATOR

Route:

/create/voice

Create a polished voice-generation interface inspired by modern AI voice platforms.

Features:

Text-to-speech

Voice selection

Voice preview

Language

Emotion

Speed

Pitch

Stability

Similarity

Style

Audio format

Voice library:

Categories:

Male

Female

Narrator

Character

Cinematic

Storytelling

Corporate

Casual

Voice cards should have:

Avatar

Name

Language

Accent

Description

Play preview button

Favorite

Select

When selected, show an audio waveform player.

Text editor should support long scripts.

Add:

Generate voice

Preview

Pause

Download

Regenerate

14. Audio Player

Build a beautiful reusable audio player.

Features:

Play/pause

Timeline

Current time

Duration

Volume

Speed

Download

Waveform visualization

Use animated waveform effects.

15. COMPLETE AI VIDEO CREATOR

Create a higher-level workflow called:

"AI Video Studio"

Route:

/create/complete-video

This should eventually allow users to create a complete YouTube video.

Workspace structure:

Step 1 — Script

Large script editor.

Options:

Generate script

Rewrite

Shorten

Expand

Change tone

Step 2 — Scenes

Automatically break script into scenes.

Each scene card:

Scene number

Scene description

Image/video generation prompt

Duration

Voice text

Camera direction

Step 3 — Visuals

Generate images/video for each scene.

Step 4 — Voice

Generate narration.

Step 5 — Music

Select background music.

Step 6 — Timeline

Create a professional timeline editor.

Timeline tracks:

VIDEO
VOICE
MUSIC
SFX
TEXT

Include:

Playhead

Scene blocks

Audio waveform

Clip trimming

Timeline zoom

Play/pause

Fullscreen preview

Step 7 — Export

Export:

MP4

1080p

4K

Audio only

Captions

Initially simulate rendering.

16. PROJECT SYSTEM

Create project management.

Route:

/projects

Users can:

Create project

Rename project

Duplicate

Delete

Favorite

Archive

Project card:

Thumbnail

Project name

Last modified

Number of assets

Type

Status

Project workspace should contain:

Overview

Assets

Generations

Timeline

Settings

17. MY CREATIONS

Route:

/creations

Create a beautiful media library.

Filters:

All

Images

Videos

Audio

Projects

Sort:

Newest

Oldest

Most used

Favorites

Search by:

Prompt

Filename

Model

Project

Grid/list toggle.

Each asset should support:

Preview

Favorite

Download

Rename

Move

Delete

Copy prompt

Generate variation

18. ASSET LIBRARY

Route:

/assets

Allow users to store:

Images

Videos

Audio

Uploaded files

Generated files

Folders:

My Assets

Characters

Backgrounds

Voices

Music

References

Support drag-and-drop uploads.

19. EXPLORE PAGE

Route:

/explore

Create an inspiration feed.

Show:

Trending generations

Popular prompts

Featured creators

New models

Community creations

Each generation should show:

Preview

Creator

Model

Prompt

Like

Remix

Save

Make this visually rich.

20. TEMPLATES

Create template marketplace.

Categories:

YouTube

Social Media

Ads

Product Videos

Cinematic

Storytelling

Anime

Education

Marketing

Template cards should contain:

Preview

Title

Description

Duration

Category

Use Template button

21. ACCOUNT / PROFILE

Create:

/profile

Sections:

Profile

Avatar

Name

Username

Email

Bio

Account

Email

Password

Connected accounts

Security

Preferences

Theme

Language

Default model

Default aspect ratio

Default generation settings

Notifications

Allow toggles for:

Generation completed

Generation failed

Product updates

Marketing emails

22. BILLING / CREDITS

Create a credits system.

Display:

"1,240 credits remaining"

Credit usage should be visible.

Pricing page:

Free
Creator
Pro
Studio

Show:

Monthly credits

Image generations

Video generations

Voice generations

Resolution limits

Priority generation

Commercial usage

API access

Buttons:

Upgrade

Buy credits

Payments can be mocked.

23. API KEYS

Create:

/settings/api

Allow users to manage API keys.

UI:

Provider

API key

Status

Created date

Delete

Add key

Providers:

OpenAI

Replicate

Hugging Face

RunPod

Fal

Custom API

Important:

The frontend should NEVER expose secret API keys.

Design the UI so actual API keys will be stored securely on the backend.

24. NOTIFICATION SYSTEM

Create notification center.

Notifications:

"Your video is ready"
"Image generation completed"
"Generation failed"
"Credits running low"
"New model available"

Use animated notification badges.

25. GENERATION STATES

Every AI generation feature must have proper states:

Idle

Ready to generate.

Uploading

Animated progress.

Queued

"Waiting for GPU..."

Processing

Animated generation state.

Completed

Show result.

Failed

Show error with:

"Try again"

and:

"View details"

Do NOT use fake instant generation.

Simulate realistic processing times.

26. GLOBAL SEARCH

Create global search accessible from the top navigation.

Search:

Projects

Images

Videos

Audio

Prompts

Templates

Keyboard shortcut:

Cmd/Ctrl + K

Create an elegant command palette.

27. COMMAND PALETTE

Include commands:

Create Image

Create Video

Create Voice

Open Projects

Open Assets

Search

Settings

Toggle Sidebar

Toggle Theme

Use Motion animations.

28. KEYBOARD SHORTCUTS

Support:

Cmd/Ctrl + K → Search

Cmd/Ctrl + B → Toggle sidebar

G then I → Image generator

G then V → Video generator

G then A → Audio generator

29. RESPONSIVE DESIGN

The application must work beautifully on:

Desktop

Laptop

Tablet

Mobile

Desktop should be the primary experience.

On mobile:

Sidebar becomes drawer

Generator panels stack vertically

Timeline becomes horizontally scrollable

Controls become bottom sheets where appropriate

30. MOTION / ANIMATION

Use Motion extensively but professionally.

Animations should include:

Page transitions

Sidebar transitions

Card hover

Button interactions

Modal entrance/exit

Image reveal

Generation progress

Skeleton shimmer

Upload animations

Audio waveform

Video timeline

Toast notifications

Dropdowns

Command palette

Drag/drop states

Avoid excessive animation.

The UI should feel smooth and premium.

Use spring animations where appropriate.

31. MICRO-INTERACTIONS

Examples:

Generate button:

Idle:

"Generate"

Hover:

Subtle glow.

Click:

Button transforms into:

"Generating..."

Completion:

Show success animation.

Cards:

Hover → slight scale + metadata overlay.

Images:

Hover → quick action buttons.

Upload:

Drag file → animated border and upload indicator.

32. TOAST SYSTEM

Implement global toast notifications.

Examples:

"Image generation started"

"Video generation completed"

"Copied prompt"

"Project saved"

"Asset deleted"

"Credits updated"

33. ERROR HANDLING

Create realistic error states.

Examples:

"Generation failed"

"Model unavailable"

"Insufficient credits"

"Invalid prompt"

"Upload failed"

"Network error"

Every error should have useful recovery actions.

34. EMPTY STATES

Create beautiful empty states.

Examples:

No projects:

"Your creative workspace is empty."

Button:

"Create your first project"

No generations:

"Your creations will appear here."

No assets:

"Upload your first asset."

35. DEMO DATA

Since real APIs are not connected yet, create realistic mock data.

Include:

Example generated images

Example videos

Example audio

Example projects

Example users

Example models

Example voices

Example prompts

Generation should be simulated using timers and state changes.

For example:

Click Generate:

0% → 20% → 45% → 70% → 90% → 100%

Then display generated demo result.

36. PROVIDER ARCHITECTURE

VERY IMPORTANT:

Do not hardcode AI provider logic directly into UI components.

Create a clean abstraction.

For example:

AI Provider
→ Image Provider
→ Video Provider
→ Voice Provider

The frontend should interact with generic functions such as:

generateImage()
generateVideo()
generateVoice()

Later these can connect to:

RunPod

Replicate

Fal

Hugging Face

OpenAI

ElevenLabs

Kling

Wan

Custom inference servers

For now implement mock providers.

37. BACKEND-READY ARCHITECTURE

Although the first version is frontend-focused, structure the project so a backend can easily be connected later.

Use:

services/
components/
pages/
hooks/
types/
lib/
providers/

Separate:

UI state
Generation state
Authentication state
Project state
Credits state
Provider logic

Do not mix all logic inside page components.

38. DATA MODELS

Create TypeScript interfaces for:

User
Project
Generation
ImageGeneration
VideoGeneration
VoiceGeneration
Asset
Model
Voice
Template
Notification
CreditTransaction

Generation should include:

id

type

prompt

model

status

progress

createdAt

completedAt

outputUrl

thumbnailUrl

error

metadata

39. DARK / LIGHT THEME

Default to dark.

Also provide light mode.

Theme switcher should have:

Dark

Light

System

Persist preference.

40. ACCESSIBILITY

Follow accessibility best practices.

Include:

Keyboard navigation

Proper labels

Focus states

ARIA where appropriate

Sufficient contrast

Accessible dialogs

Accessible dropdowns

41. DESIGN DETAILS

Use a consistent design system.

Typography:

Modern sans-serif.

Cards:

Rounded corners.

Buttons:

Clear primary/secondary hierarchy.

Inputs:

Large and comfortable.

Generator prompt box:

Should feel like the central creative control of the application.

Use subtle gradients behind important areas.

Use icons consistently.

Do not overuse borders.

42. LANDING PAGE

Create a public landing page before authentication.

Route:

/

Hero:

"Create. Generate. Imagine."

Subtitle:

"One AI studio for images, videos and voice."

CTA:

"Start Creating"

Secondary CTA:

"Explore Creations"

Hero visual:

Show a cinematic animated AI generation workspace preview.

Sections:

AI Image Generation

AI Video Generation

AI Voice Generation

Complete AI Video

Powerful Models

Creative Workflow

Pricing

FAQ

Navigation:

Features
Models
Pricing
Explore
Login
Start Creating

43. MODEL SELECTOR

Create a reusable model selector component.

Each model should show:

Model name

Provider

Type

Speed

Quality

Cost

Badge

Example:

Wan 2.1
Video
High Quality
Open Source

FLUX
Image
High Quality

HunyuanVideo
Video
Open Source

Include search and filtering.

44. GENERATION COST

Before generation show estimated credit cost.

Example:

Estimated cost:

24 credits

Generate button:

"Generate • 24 credits"

If insufficient credits:

"Insufficient credits"

with:

"Upgrade"

45. PROMPT ENHANCEMENT

Add an "Enhance Prompt" button beside prompt input.

Clicking it should simulate AI prompt improvement.

Before:

"A woman walking in a city"

After:

"Cinematic tracking shot of a confident woman walking through a futuristic neon city at dusk..."

Show before/after modal.

Buttons:

Use enhanced prompt

Keep original

46. REMIX / VARIATIONS

Every generation should have:

Remix

Variations

Reuse settings

Clicking Remix should open the generator with previous settings populated.

47. DOWNLOAD / EXPORT

Support UI for:

Image:

PNG / JPG / WEBP

Video:

MP4

Audio:

MP3 / WAV

Show export modal with quality options.

48. FINAL QUALITY BAR

This should NOT look like a simple CRUD dashboard.

It should feel like a serious commercial AI product.

Prioritize:

Beautiful visual hierarchy

Excellent generator experience

Smooth animations

Professional media library

Realistic generation states

Excellent responsive behavior

Reusable component architecture

Backend-ready provider abstraction

Account and billing experience

Premium overall polish

The user should immediately understand:

"This is an AI creative studio where I can generate images, videos and voices."

49. IMPORTANT IMPLEMENTATION RULE

Do not try to connect real AI APIs yet.

Build the complete UI and use mocked generation services.

The application should be fully navigable and functional using demo data.

Every button should either:

Perform a meaningful UI action

Open the appropriate modal/page

Change application state

Start a mocked generation

Show a realistic toast

Avoid dead buttons.

Do not leave major sections as placeholders.

Build the application progressively, starting with:

Landing page

Authentication

Dashboard

Application shell

Image generator

Video generator

Voice generator

Creation library

Projects

Profile/settings

Billing

API keys

Complete Video Studio

Make the final result feel cohesive, polished, and production-ready.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2dfba1b3-56a0-4ece-b4aa-9aceb555d0ad).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

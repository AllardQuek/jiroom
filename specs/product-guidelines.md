# Product Guidelines

## Tone and Voice

**Overall Tone:** Friendly and Casual

The application should communicate in a conversational, approachable, and warm manner. This creates a welcoming experience for users who may be stressed about the rental process.

**Guidelines:**
- Use natural, conversational language
- Address users directly ("you", "your")
- Avoid overly formal or technical jargon
- Use contractions where natural (e.g., "don't" instead of "do not")
- Keep messages helpful and encouraging
- Use positive framing where possible (e.g., "Add your first listing" instead of "You have no listings")

**Examples:**
- Good: "Great! You've saved your first listing. Ready to add another?"
- Avoid: "The listing has been successfully added to the database."

## Visual Design and Aesthetics

**Design Philosophy:** Clean and Minimal

The interface should prioritize clarity, readability, and focus on content over decoration. Lots of white space, simple typography, and neutral colors create a calm, distraction-free environment for decision-making.

**Guidelines:**
- Use generous white space to separate elements
- Choose simple, readable sans-serif fonts
- Limit color palette to neutral base with accent colors for actions
- Avoid decorative elements that don't serve a functional purpose
- Use subtle shadows and borders for depth
- Prioritize content hierarchy through size and weight rather than color

**Color Palette (Suggested):**
- Primary: Neutral grays for backgrounds and text
- Accent: A single accent color for primary actions (e.g., blue or teal)
- Success: Green for positive states (Yes verdict, completion)
- Warning: Yellow/orange for attention states (Maybe verdict)
- Error: Red for negative states (No verdict, errors)

**Typography:**
- Headings: Bold, larger sizes for clear hierarchy
- Body: Regular weight, comfortable line height (1.5-1.6)
- Labels: Medium weight for form fields and UI elements
- Maintain consistent font sizes across similar elements

## User Feedback and Guidance

**Approach:** Guided Onboarding + Progressive Disclosure

The application should provide helpful guidance for new users while revealing advanced features progressively as users become more familiar with the product.

**Guidelines:**
- **For New Users:**
  - Show a brief onboarding tour on first visit
  - Use tooltips to explain key features
  - Provide contextual help text where actions are unclear
  - Offer "Get Started" walkthrough for the first listing

- **For Experienced Users:**
  - Hide help text after first use (remember user preference)
  - Reveal advanced features (template editing, scoring) after basic workflow is established
  - Use "Learn more" links for optional deep dives
  - Keep UI clean once user is familiar

**Progressive Disclosure Examples:**
- Basic listing creation first, advanced metadata editing later
- Simple template use first, customization options revealed after first evaluation
- Basic comparison view first, advanced filtering/sorting later

## Error Handling and Validation

**Approach:** Concise Messages + Inline Validation

Error messages should be brief, clear, and action-oriented. Validation should happen inline where appropriate to prevent errors before they occur.

**Guidelines:**
- **Message Style:**
  - Keep messages under 20 words when possible
  - Focus on what to do next, not what went wrong
  - Use clear, direct language
  - Avoid technical jargon or system-speak

- **Inline Validation:**
  - Validate fields as users type where appropriate
  - Show success indicators (checkmarks) for valid inputs
  - Show error messages immediately below the field
  - Use red text/borders for errors, green for success

- **Error Message Examples:**
  - Good: "Please enter a valid URL"
  - Avoid: "The input field contains an invalid URL format. Please correct and resubmit."
  - Good: "Price must be a number"
  - Avoid: "Validation error: price field expects numeric value"

**Validation Timing:**
- URLs: Validate on blur (when user leaves the field)
- Required fields: Validate on submit
- Numeric fields: Validate on input
- Email/phone: Validate on blur

## Accessibility and Inclusivity

**Approach:** Practical Accessibility

The application should be accessible to users with common accessibility needs without requiring full formal compliance. Focus on high-impact, low-effort accessibility improvements.

**Guidelines:**
- **Color Contrast:**
  - Ensure text and background contrast ratio meets WCAG AA standards (4.5:1 for normal text)
  - Don't rely on color alone to convey meaning (use icons or labels alongside colors)
  - Test with color blindness simulators

- **Typography:**
  - Use readable font sizes (minimum 16px for body text)
  - Ensure line height is sufficient (1.5-1.6)
  - Avoid using font size below 12px for any text

- **Interactive Elements:**
  - Make touch targets at least 44x44 pixels for mobile
  - Provide clear focus states for keyboard navigation
  - Use semantic HTML elements (buttons, links, form labels)

- **Inclusive Language:**
  - Use gender-neutral language where possible
  - Avoid assumptions about user's living situation or family structure
  - Use inclusive terminology for household types

**Priority Focus Areas:**
1. High contrast for all text
2. Large touch targets for mobile use
3. Clear labels for all form fields
4. Keyboard navigability for all interactive elements
5. Screen reader-friendly semantic HTML

**Out of Scope for MVP:**
- Full WCAG compliance audit
- Complex ARIA attributes
- Screen reader-specific optimizations beyond semantic HTML
- High contrast mode toggle
- Font size scaling beyond browser defaults

## Mobile-First Considerations

**Design Philosophy:** Optimize for Mobile, Adapt for Desktop

Since the primary use case is data entry during viewings, the mobile experience should be the primary design consideration, with desktop adaptations for comparison and detailed review.

**Guidelines:**
- Design touch-friendly interfaces (large buttons, easy-to-tap controls)
- Minimize text input on mobile (use toggles, selects, ratings where possible)
- Optimize for one-handed use (key actions at bottom of screen)
- Use responsive design to adapt layouts for larger screens
- Prioritize vertical scrolling over horizontal on mobile
- Keep forms short and break into steps if needed

**Mobile-Specific Patterns:**
- Bottom navigation bar for primary actions
- Swipe gestures for common actions (delete, archive)
- Pull-to-refresh for listing updates
- Sticky headers for context during scrolling
- Modal dialogs for focused tasks

## Content and Copywriting

**Writing Style:** Clear, Concise, Helpful

All copy should be written with the user's goal in mind: making rental decisions faster and with less stress.

**Guidelines:**
- Use active voice
- Start with the most important information
- Use verbs for buttons and CTAs (e.g., "Save listing" not "Listing save")
- Be specific about what will happen (e.g., "Delete this listing" not "Delete")
- Avoid marketing fluff or hype
- Use consistent terminology throughout

**Key Terminology:**
- "Listing" - a room option being considered
- "Viewing" - a scheduled or completed appointment to see a room
- "Evaluation" - the filled template responses for a listing
- "Verdict" - the final decision (Yes/Maybe/No)
- "Template" - the customizable evaluation criteria
- "Shortlist" - the collection of saved listings

**Button Copy Examples:**
- "Add listing" (not "Create new listing")
- "Save evaluation" (not "Submit form")
- "Compare" (not "View comparison")
- "Edit template" (not "Template settings")

## Performance and Loading States

**Approach:** Fast and Responsive

The application should feel snappy and responsive, with clear feedback during loading states.

**Guidelines:**
- Show loading indicators for any operation taking more than 200ms
- Use skeleton screens for content loading where appropriate
- Provide optimistic UI updates (show success immediately, rollback if fails)
- Cache data locally to minimize loading times
- Use simple animations (fade, slide) rather than complex transitions

**Loading State Examples:**
- "Saving..." for form submissions
- "Loading listings..." for data fetch
- Skeleton cards for listing list
- Spinner for comparison view generation

## Empty States

**Approach:** Helpful and Action-Oriented

When users have no data, empty states should explain what to do next and encourage action.

**Guidelines:**
- Explain why the state is empty
- Show what the user can do to add content
- Use friendly, encouraging language
- Include a clear call-to-action button
- Consider adding an illustration or icon for visual interest

**Empty State Examples:**
- Listings empty: "You haven't saved any listings yet. Add your first room to start comparing!"
- Evaluations empty: "No evaluations yet. Fill out the template after your viewing."
- Comparison empty: "Add at least 2 listings to compare them side by side."

## Success States

**Approach:** Celebratory but Brief

Acknowledge user accomplishments without being distracting or over-the-top.

**Guidelines:**
- Show brief success messages (2-3 seconds)
- Use positive language
- Consider subtle animations or confetti for major milestones
- Always suggest the next action
- Don't block the user's workflow with success modals

**Success State Examples:**
- "Listing saved! Ready to evaluate?"
- "Evaluation complete. Add notes or set your verdict."
- "Verdict saved. Compare with other options?"

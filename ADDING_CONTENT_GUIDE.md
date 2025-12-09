# Guide: Adding Video Scripts and Handling Unvisited Places

## 📝 Where to Add Your Video Scripts

**File:** `data/knowledgeBase.ts`

Add your video scripts directly in the `knowledgeBase` array. Here's how:

### Step-by-Step:

1. **Open** `saba-takes-flight/data/knowledgeBase.ts`

2. **Find the section** that says `// ADD YOUR ACTUAL VIDEO SCRIPTS BELOW:`

3. **Add an entry** for each location/video:

```typescript
{
  id: 'greece-santorini-script',          // Unique ID
  location: 'Greece',                      // Location name (helps with matching)
  content: `[PASTE YOUR ENTIRE VIDEO SCRIPT HERE]
  
  This is where you paste all the text from your video script.
  It can be as long as you want! Include everything:
  - Your experiences
  - Tips and recommendations
  - Stories and anecdotes
  - What you saw, ate, felt
  
  The more detail, the better the chatbot responses will be.`,
  
  tags: ['greece', 'santorini', 'sunset', 'islands', 'beach', 'travel'],
  source: 'video_script',
},
```

4. **Save the file** - the chatbot will automatically use it!

### Example with Full Video Script:

```typescript
{
  id: 'brazil-rio-script',
  location: 'Brazil',
  content: `My time in Rio de Janeiro was absolutely incredible! The energy 
  of the city is infectious. I stayed in Copacabana which was perfect - 
  right on the beach but still close to everything. 
  
  One of my favorite experiences was hiking up to Christ the Redeemer 
  early in the morning. The views are absolutely breathtaking, and going 
  early means you avoid the crowds. I'd recommend starting around 6am.
  
  For food, you HAVE to try the feijoada - it's Brazil's national dish 
  and it's amazing. I found this little restaurant in Lapa that makes it 
  perfectly. Also, don't miss the açai bowls on the beach - they're 
  nothing like what we have back home!
  
  My biggest tip: Learn a few Portuguese phrases before you go. People 
  really appreciate it and it makes the experience so much better.
  
  Safety-wise, just use common sense. I felt safe during the day in 
  tourist areas, but be more careful at night.`,
  tags: ['brazil', 'rio', 'copacabana', 'christ the redeemer', 'food', 'safety', 'tips'],
  source: 'video_script',
},
```

### Tips for Adding Content:

✅ **Do:**
- Paste your entire video script - more content = better responses
- Include specific details (restaurant names, times, prices if mentioned)
- Add location name for better matching
- Include relevant tags (helps find the entry when users ask)
- Write in first person ("I", "my", "I did")

❌ **Don't:**
- Worry about formatting - just paste the text
- Make it too short - more detail is better
- Duplicate entries for the same location (update the existing one instead)

---

## 🤔 How It Handles Places You Haven't Visited

### What Happens:

When a user asks about a place you **don't have** in your knowledge base:

1. **System searches** for matching entries
2. **Finds nothing** (score = 0)
3. **No context is injected** into the prompt
4. **AI gets special instructions** to handle this honestly

### The Response:

The chatbot will:

✅ **Say honestly:** 
- "I haven't been there yet"
- "I don't have personal experience with that"
- "I haven't visited [location] yet"

✅ **Still be helpful:**
- Provide general travel advice
- Share common knowledge about the place
- Stay friendly and conversational

❌ **Won't:**
- Make up fake personal experiences
- Pretend to have been there
- Invent stories about the location

### Example Scenarios:

**Scenario 1: User asks about Paris (not in knowledge base)**

```
User: "Tell me about Paris"

System: Searches knowledgeBase → No matches → No context injected

AI Response: 
"I haven't been to Paris yet, but it's definitely on my bucket list! 
From what I know, it's an incredible city known for its art, culture, 
and food. I'd love to visit the Louvre and experience the café culture. 
Once I do go, I'll be sure to share all my personal experiences with you!"
```

**Scenario 2: User asks about Istanbul (you have Turkey entry)**

```
User: "What should I do in Istanbul?"

System: Searches knowledgeBase → Finds Turkey entry → Injects context

AI Response (using your script):
"Istanbul is amazing! When I visited, the Hagia Sophia absolutely 
blew me away. My biggest tip is to go early in the morning to avoid 
the crowds. And don't miss the Grand Bazaar - it's overwhelming but 
worth it. Try the Turkish delight while you're there!"
```

### How the Code Works:

The logic is in `ChatBot.tsx`:

```typescript
// Get relevant knowledge (returns empty array if nothing matches)
const relevantKnowledge = getRelevantKnowledge(userMessage.text, 3);
const knowledgeContext = createContextString(relevantKnowledge);

if (knowledgeContext) {
  // Found matches - inject your experiences
  systemPrompt += `Here is context from Saba's experiences...`;
} else {
  // No matches - tell AI to be honest
  systemPrompt += `IMPORTANT: If user asks about something you don't have 
  information about, be honest and say you haven't been there yet...`;
}
```

---

## 🧪 Testing It Out

### Test 1: Place You Have Content For
```
Ask: "Tell me about Turkey" or "What's Istanbul like?"
Expected: Uses your video script content
```

### Test 2: Place You Don't Have
```
Ask: "Tell me about Tokyo" (if not in knowledge base)
Expected: Says "I haven't been there yet" + general advice
```

### Test 3: Partial Match
```
Ask: "Where should I stay in Morocco?"
Expected: Uses your Morocco content if you have it
```

---

## 📊 Current Locations in Your App

Based on `data/locations.ts`, you have these locations:
- Turkey
- Morocco  
- Greece
- Belgium
- Taiwan
- France
- United Kingdom
- Brazil
- Ethiopia
- Panama

**Tip:** Add video scripts for these locations first since they're already in your app!

---

## 🚀 Quick Start Checklist

- [ ] Open `data/knowledgeBase.ts`
- [ ] Find a location you have a video script for
- [ ] Copy the template format
- [ ] Paste your video script into the `content` field
- [ ] Add location name and tags
- [ ] Save the file
- [ ] Test in the chatbot!


# Fine-tuning Guide for Saba AI

## Overview
This guide explains how to personalize Saba AI with your travel experiences, writings, and video content.

## Current Implementation: Context Injection

The chatbot currently uses **context injection** - it searches your knowledge base and includes relevant content in the system prompt. This is the simplest approach.

### How to Add Your Content

1. **Edit `data/knowledgeBase.ts`**
   - Add your travel notes, blog posts, or writings
   - Each entry should be in the format:
     ```typescript
     {
       id: 'unique-id',
       location: 'Location Name', // Optional
       content: 'Your experience or tip here...',
       tags: ['tag1', 'tag2'], // Optional keywords
       source: 'blog_post' // Optional: 'blog_post', 'video_transcript', 'travel_notes'
     }
     ```

2. **For Videos:**
   - First, transcribe your videos (use tools like:
     - OpenAI Whisper API
     - Google Speech-to-Text
     - Otter.ai
     - YouTube auto-transcription)
   - Add the transcriptions as entries in `knowledgeBase.ts`

## Advanced Options

### Option 1: RAG (Retrieval Augmented Generation) - Recommended for Large Datasets

**When to use:** If you have lots of documents (>50 pages)

**How it works:**
1. Convert documents to text embeddings (vector representations)
2. Store in a vector database (Pinecone, Weaviate, or local)
3. On each query, search for relevant chunks
4. Inject top results into prompt

**Implementation steps:**
1. Install vector database: `npm install @pinecone-database/pinecone` or similar
2. Create embeddings of your documents using OpenAI's embedding API
3. Store in vector DB
4. Modify `ChatBot.tsx` to query vector DB before API call

### Option 2: Fine-tuning with OpenAI

**When to use:** You want the model to ALWAYS respond in a specific style consistently

**Requirements:**
- At least 10+ examples (recommended 50-100+)
- Cost: ~$3-10 per 1M tokens for training
- Time: 1-2 hours for training

**Steps:**
1. Prepare training data in JSONL format:
   ```json
   {"messages": [{"role": "system", "content": "You are Saba..."}, {"role": "user", "content": "Tell me about Istanbul"}, {"role": "assistant", "content": "I loved Istanbul! The Hagia Sophia..."}]}
   ```

2. Upload to OpenAI:
   ```bash
   openai api fine_tunes.create \
     -t training_data.jsonl \
     -m gpt-3.5-turbo
   ```

3. Use fine-tuned model:
   ```typescript
   model: 'ft:gpt-3.5-turbo:your-org:custom-name:abc123'
   ```

**Pros:**
- Model "remembers" style consistently
- No context length limits per query

**Cons:**
- Expensive to retrain
- Need many examples
- Harder to update with new content

### Option 3: Hybrid Approach (Best of Both)

1. Fine-tune for style/voice
2. Use RAG for specific facts/experiences
3. Combine both in the prompt

## Quick Start: Add Your First Content

1. Open `data/knowledgeBase.ts`
2. Add an entry like this:

```typescript
{
  id: 'my-istanbul-trip',
  location: 'Istanbul',
  content: `During my trip to Istanbul in 2023, I discovered this amazing 
  rooftop restaurant with views of the Bosphorus. The food was incredible 
  and the sunset was unforgettable. I'd recommend going around 7pm for 
  the best experience.`,
  tags: ['istanbul', 'food', 'sunset', 'restaurant'],
  source: 'travel_notes',
}
```

3. Save and restart the app
4. Ask "Tell me about Istanbul" - the chatbot will use this context!

## Video Transcription Options

### Using OpenAI Whisper API:
```typescript
// Example: Add this to a utility file
async function transcribeVideo(audioFile: File) {
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper-1');
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  return data.text;
}
```

### Using YouTube Transcriptions:
1. Download video
2. Extract audio
3. Use transcription service
4. Add to knowledge base

## Tips

- **Be specific:** Detailed entries work better than vague ones
- **Use tags:** Help with matching queries
- **Update regularly:** Add new experiences as you travel
- **Organize by location:** Makes it easier to find relevant content

## Next Steps

1. Start adding content to `knowledgeBase.ts`
2. Test with queries about your experiences
3. If you have 50+ entries, consider upgrading to RAG
4. For videos, set up transcription pipeline
5. Eventually consider fine-tuning for consistent voice


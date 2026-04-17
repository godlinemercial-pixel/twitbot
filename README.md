# Twitter Intelligence Analyzer

Extract and analyze Twitter data to understand what content works - no posting required, uses free read-only API.

## What This Does

**Part 1: Elon Musk's Retweet Patterns**
- Analyzes last 100 tweets from Elon
- Identifies what he retweets most
- Categories: AI, Tech, Memes, Politics, Space, Tesla, Finance, etc.
- Media types, engagement metrics

**Part 2: Viral Tweet Analysis**
- Finds tweets with 5,000+ likes
- Topics: Nigeria, tech, AI, startups (customizable)
- Analyzes what makes them go viral
- Categories, formats, timing, account size vs virality

**Output:**
- `elon_retweets.csv` - What Elon retweets
- `viral_tweets.csv` - What goes viral
- `insights.json` - Strategic recommendations

---

## Setup (One-Time)

You already have Twitter API credentials from before. Same keys work here (free tier is fine).

### 1. Upload Files to GitHub

Replace your current `twitbot` repo with these files:
1. `index.js`
2. `analyzer.js`
3. `package.json`
4. `.env.example`

### 2. Update Environment Variables on Render

Your existing Twitter credentials work. Just make sure they're set in Render:
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

### 3. Deploy

Render will auto-deploy. Wait for:
```
🌐 Server running on port 10000
🚀 Running initial analysis...
📊 PART 1: Analyzing Elon Musk's Retweet Patterns...
✅ Analyzed X retweets from Elon
📊 PART 2: Analyzing Viral Tweets...
✅ Analysis Complete!
```

---

## How to Use

### Access Your Dashboard

Go to your Render URL: `https://twitbot-b7f7.onrender.com`

You'll see:
- Download links for CSV files
- Status of last analysis
- What's being tracked

### Download Data

Click the download links:
- **elon_retweets.csv** - Open in Excel/Google Sheets
- **viral_tweets.csv** - Analyze viral patterns
- **insights.json** - Read recommendations

### Analyze the Data

**Open in Excel/Google Sheets:**

1. **Elon's Retweet Patterns:**
   - Sort by "Categories" column
   - Count which categories appear most
   - Look at engagement metrics
   - **Action:** Tweet more of what Elon retweets

2. **Viral Tweets:**
   - Sort by "Likes" (highest first)
   - Filter by category
   - Check "Virality Ratio" (likes ÷ followers)
   - **Action:** Copy patterns from high virality tweets

3. **Find Overlap:**
   - Categories that appear in BOTH files = GOLD
   - These get Elon's attention AND go viral
   - **Action:** Focus your content here

---

## Schedule

**Automatic:** Runs daily at 3 AM WAT

**Manual:** Visit `https://your-url.onrender.com/run-now` to trigger immediately

---

## Customizing What to Analyze

### Change Viral Tweet Query

Edit `index.js`, line where `analyzeViralTweets` is called:

```javascript
// Current:
const viralData = await analyzeViralTweets('Nigeria OR tech OR AI OR startup', 5000);

// Examples:
// Focus on Nigeria only:
await analyzeViralTweets('Nigeria', 3000);

// Focus on crypto:
await analyzeViralTweets('bitcoin OR crypto OR web3', 10000);

// Focus on specific person:
await analyzeViralTweets('from:elonmusk', 5000);
```

### Change Categories

Edit `analyzer.js`, the `CATEGORIES` object at the top:

```javascript
const CATEGORIES = {
  // Add your own categories
  NIGERIA: ['nigeria', 'naija', 'lagos', 'abuja'],
  STARTUP: ['startup', 'founder', 'vc', 'funding'],
  // etc.
};
```

### Change Minimum Engagement

Edit the second parameter in `analyzeViralTweets`:

```javascript
// 5000 likes minimum (default)
await analyzeViralTweets('query', 5000);

// 10000 likes minimum (more viral)
await analyzeViralTweets('query', 10000);

// 1000 likes minimum (broader net)
await analyzeViralTweets('query', 1000);
```

---

## Reading the Insights

### insights.json Structure

```json
{
  "elon_retweet_patterns": {
    "top_categories": [
      { "category": "AI", "count": 15 },
      { "category": "TECH", "count": 12 }
    ]
  },
  "viral_tweet_patterns": {
    "top_categories": [
      { "category": "AI", "count": 25 },
      { "category": "MEME", "count": 18 }
    ]
  },
  "recommendations": [
    {
      "type": "CATEGORY_MATCH",
      "message": "Focus on: AI, TECH - these topics get both Elon's attention AND go viral"
    }
  ]
}
```

**How to use this:**
1. Check `CATEGORY_MATCH` recommendations
2. These are topics that BOTH:
   - Elon retweets
   - Go viral naturally
3. **Create content in these categories**

---

## Strategy Guide

### Week 1: Collect Data
- Let it run for 7 days
- Download CSV files daily
- Build a spreadsheet tracking trends

### Week 2: Analyze Patterns
- What categories show up most?
- What time do viral tweets post?
- What's the average virality ratio?
- Do verified accounts perform better?

### Week 3: Test Content
- Create 20 tweets based on top categories
- Match formats of high-performing tweets
- Post at similar times
- Track your own performance

### Week 4: Iterate
- Compare your results to the data
- Double down on what works
- Cut what doesn't
- Refine your categories

---

## API Limits (Free Tier)

**Twitter Free API:**
- 10,000 tweets/month read access
- 1,500 requests/month

**This analyzer uses:**
- ~200 tweets per run (100 from Elon + 100 viral)
- 2-3 requests per run
- Daily = ~6,000 tweets/month, 90 requests/month

**You're well within limits.** ✅

---

## Troubleshooting

### "Rate limit exceeded"
- Wait 15 minutes
- Reduce analysis frequency
- Lower the number of tweets analyzed

### "No data in CSV files"
- Check Render logs
- Verify Twitter credentials
- Make sure free tier API is active

### "Analysis takes too long"
- Normal - takes 2-3 minutes
- Free tier has slower rate limits
- Be patient

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Twitter API (read-only) | ₦0 |
| Hosting (Render free tier) | ₦0 |
| Your time analyzing data | Priceless |

**Total: ₦0 per month**

---

## Pro Tips

1. **Track Over Time:** Download CSVs daily, build a historical database
2. **Cross-Reference:** Compare Nigerian viral tweets vs global
3. **A/B Test:** Create tweets in different categories, see what works
4. **Automate:** Feed the CSV data into your own analysis scripts
5. **Iterate:** Update search queries weekly based on trends

---

## Next Steps

1. ✅ Deploy to Render
2. ✅ Wait for first analysis (2-3 min)
3. ✅ Download CSV files
4. ✅ Open in Excel/Sheets
5. ✅ Identify top 3 categories
6. ✅ Create content in those categories
7. ✅ Post and track results
8. ✅ Iterate weekly

---

**Built to extract intelligence, not post tweets.** 

Your Twitter API free tier is perfect for this. No $100/month required. Just pure data extraction and analysis.

Questions? Check the logs on Render or review this README.

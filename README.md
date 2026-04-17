# Twitter Auto-Poster Bot

Autonomous Twitter bot that posts tweets on schedule. **Zero ongoing AI costs** - built once with Claude, runs forever for free.

## What This Does

- Posts tweets automatically based on your schedule
- Runs 24/7 on free hosting
- No need to be online or in chat
- Add tweets whenever you want via simple JSON file or CLI
- Checks every 5 minutes for tweets to post

## Setup (One-Time)

### 1. Get Twitter API Access

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign up for a developer account (free)
3. Create a new Project and App
4. Go to your app's "Keys and tokens" tab
5. Generate:
   - **API Key and Secret** (Consumer Keys)
   - **Access Token and Secret** (with Read and Write permissions)
6. Save all 4 credentials - you'll need them next

**Important:** Make sure your app has "Read and Write" permissions. If it only has "Read", go to Settings → User authentication settings → enable OAuth 1.0a with Read and Write.

### 2. Install Locally (First Time)

```bash
# Clone or download this folder
cd twitter-bot

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Edit .env and add your Twitter credentials
nano .env  # or use any text editor
```

Your `.env` should look like:
```
TWITTER_API_KEY=abc123...
TWITTER_API_SECRET=xyz789...
TWITTER_ACCESS_TOKEN=123-abc...
TWITTER_ACCESS_SECRET=def456...
```

### 3. Test Locally

```bash
# Run the bot
npm start
```

You should see:
```
Twitter bot started at 2026-04-17T12:00:00.000Z
Bot is running. Checking for tweets every 5 minutes...
```

**Test with a tweet in the next 5 minutes:**
1. Edit `tweets.json`
2. Set `scheduledTime` to 2 minutes from now
3. Wait and watch the console

## Adding Tweets

### Option 1: Use the CLI (Easy)

```bash
npm run add-tweet
```

Follow the prompts:
```
📝 Add New Tweet

Tweet content: Just shipped a new feature! 🚀
Schedule date (YYYY-MM-DD, or leave empty for today): 2026-04-20
Schedule time (HH:MM in 24hr format, e.g., 14:30): 09:00

✅ Tweet added successfully!
Scheduled for: 4/20/2026, 9:00:00 AM
```

### Option 2: Edit JSON Directly

Edit `tweets.json`:

```json
{
  "tweets": [
    {
      "id": 1,
      "content": "Your tweet text here",
      "scheduledTime": "2026-04-20T09:00:00Z",
      "posted": false,
      "tags": ["optional", "tags"]
    }
  ]
}
```

**Date format:** Use ISO 8601 format with timezone:
- `"2026-04-20T09:00:00Z"` = 9 AM UTC
- `"2026-04-20T14:30:00+01:00"` = 2:30 PM WAT (Nigeria time)

### Option 3: Bulk Generate with Claude

Ask Claude Desktop:
```
Generate 10 tweets about [your topic] in JSON format for my tweets.json file, 
scheduled at 9am, 2pm, and 7pm over the next week
```

Copy the JSON into `tweets.json`.

## Deploy for Free (Forever)

### Option A: Render.com (Recommended)

1. **Create account:** https://render.com (sign up with GitHub)

2. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Twitter bot"
   git remote add origin [your-repo-url]
   git push -u origin main
   ```

3. **Create Web Service on Render:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Name:** twitter-bot
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

4. **Add Environment Variables:**
   - Go to "Environment" tab
   - Add all 4 Twitter credentials from your `.env`

5. **Deploy:** Click "Create Web Service"

Done! Your bot runs 24/7 for free.

### Option B: Railway.app

1. Go to https://railway.app
2. "Start a New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Add environment variables (Twitter credentials)
5. Deploy

### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. `fly launch` (follow prompts)
3. `fly secrets set TWITTER_API_KEY=... TWITTER_API_SECRET=... ...`
4. `fly deploy`

## Free Tier Limits

All platforms have free tiers sufficient for this bot:

| Platform | Free Tier | Good For |
|----------|-----------|----------|
| Render.com | 750 hours/mo, goes to sleep after 15min inactivity | Best for scheduled posting (wakes up every 5min) |
| Railway.app | $5 credit/mo, ~500 hours | Good for continuous running |
| Fly.io | 3 VMs free | Most generous but more complex |

**Recommendation:** Start with Render. It's easiest and perfect for this use case.

## Managing Your Bot

### View Posted Tweets
Check `tweets.json` - posted tweets have `"posted": true` and `"postedAt"` timestamp.

### Add More Tweets
1. **Locally:** Edit `tweets.json` or use `npm run add-tweet`
2. **On Render:** Update GitHub repo, Render auto-deploys

### Pause Bot
On Render: Dashboard → Your Service → "Suspend"

### Check Logs
On Render: Dashboard → Your Service → "Logs" tab

## Scheduling Tips

### Nigeria Time (WAT = UTC+1)
```json
"scheduledTime": "2026-04-20T08:00:00Z"  // 9 AM WAT
"scheduledTime": "2026-04-20T13:00:00Z"  // 2 PM WAT
"scheduledTime": "2026-04-20T18:00:00Z"  // 7 PM WAT
```

### Best Posting Times (Nigeria)
- **Morning:** 8-9 AM WAT (commute time)
- **Lunch:** 1-2 PM WAT (lunch scroll)
- **Evening:** 6-8 PM WAT (after work)

### Bulk Schedule Example
Generate 30 tweets with Claude, schedule them:
- Mon/Wed/Fri at 9 AM
- Tue/Thu at 2 PM
- Weekends at 11 AM

## Troubleshooting

### "Invalid credentials"
- Check your `.env` has correct Twitter API keys
- Verify app has "Read and Write" permissions
- Regenerate tokens if needed

### "Tweet not posting"
- Check `scheduledTime` is in the future
- Verify time format: `"2026-04-20T09:00:00Z"`
- Check bot logs for errors

### "Rate limit exceeded"
- Free Twitter API: 50 tweets/day, 1,500/month
- Space out your tweets
- Current limit is very generous for normal use

### Bot sleeping (Render)
- Free tier sleeps after 15min inactivity
- Wakes up automatically when cron runs
- This is normal and doesn't affect scheduling

## Cost Breakdown

| Item | Cost |
|------|------|
| Claude Pro (you already have) | ₦0 extra |
| Twitter API (free tier) | ₦0 |
| Hosting (Render/Railway) | ₦0 |
| **Total monthly cost** | **₦0** |

## Next Steps

1. ✅ Generate 20-30 tweets with Claude Desktop
2. ✅ Add them to `tweets.json` with your schedule
3. ✅ Deploy to Render
4. ✅ Forget about it - tweets post automatically
5. ✅ Add more tweets whenever you want

## Advanced: Tweet Templates

Create templates with variables (do this manually or with Claude):

```json
{
  "id": 10,
  "content": "Day {DAY_NUMBER} of building in public:\n\n{INSIGHT}",
  "scheduledTime": "...",
  "posted": false
}
```

Use Claude Desktop to generate variations:
```
Generate 7 variations of this template for my week, 
with different insights for each day
```

---

**Built with Claude Pro. Runs without AI forever.** 🚀

Questions? Issues? Just ping Claude Desktop for help.

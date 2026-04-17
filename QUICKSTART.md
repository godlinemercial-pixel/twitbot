# Quick Start (5 Minutes)

## 1. Get Twitter API Keys
- Go to https://developer.twitter.com/en/portal/dashboard
- Create app → Get 4 keys (API Key, API Secret, Access Token, Access Secret)
- Make sure app has "Read and Write" permissions

## 2. Local Setup
```bash
npm install
cp .env.example .env
# Edit .env with your 4 Twitter keys
npm start
```

## 3. Add Your First Tweet
```bash
npm run add-tweet
```

## 4. Deploy Free (Render.com)
```bash
# Push to GitHub first
git init
git add .
git commit -m "init"
git push

# Then:
# 1. Go to render.com
# 2. New Web Service → Connect GitHub repo
# 3. Add your 4 Twitter keys as environment variables
# 4. Deploy
```

Done! Your bot posts tweets automatically forever.

---

**Commands:**
- `npm start` - Run bot
- `npm run add-tweet` - Add new tweet
- `npm run list` - View scheduled/posted tweets

**File Structure:**
- `index.js` - Main bot logic
- `tweets.json` - Your tweet schedule (edit this)
- `.env` - Your Twitter credentials (keep secret)

Read full README.md for details.

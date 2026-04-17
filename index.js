require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs').promises;
const cron = require('node-cron');

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = client.readWrite;

// Load tweets from JSON file
async function loadTweets() {
  try {
    const data = await fs.readFile('./tweets.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading tweets:', error);
    return { tweets: [] };
  }
}

// Save updated tweets back to file
async function saveTweets(data) {
  try {
    await fs.writeFile('./tweets.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving tweets:', error);
  }
}

// Post a tweet
async function postTweet(tweetData) {
  try {
    const result = await rwClient.v2.tweet(tweetData.content);
    console.log(`✓ Posted tweet at ${new Date().toISOString()}: "${tweetData.content.substring(0, 50)}..."`);
    return result;
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
}

// Check and post scheduled tweets
async function checkAndPostTweets() {
  const data = await loadTweets();
  const now = new Date();
  let updated = false;

  for (const tweet of data.tweets) {
    if (tweet.posted) continue;

    const scheduledTime = new Date(tweet.scheduledTime);
    
    // If scheduled time has passed and not posted yet
    if (scheduledTime <= now) {
      try {
        await postTweet(tweet);
        tweet.posted = true;
        tweet.postedAt = now.toISOString();
        updated = true;
      } catch (error) {
        console.error(`Failed to post tweet "${tweet.content.substring(0, 30)}...":`, error.message);
      }
    }
  }

  if (updated) {
    await saveTweets(data);
  }
}

// Run immediately on start
console.log('Twitter bot started at', new Date().toISOString());
checkAndPostTweets();

// Schedule to check every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Checking for tweets to post...');
  checkAndPostTweets();
});

// Keep the process alive
console.log('Bot is running. Checking for tweets every 5 minutes...');

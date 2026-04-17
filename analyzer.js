require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs').promises;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Initialize Twitter client (read-only)
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || {
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const roClient = client.readOnly;

// Elon Musk's user ID
const ELON_USER_ID = '44196397';

// Categories for classification
const CATEGORIES = {
  AI: ['ai', 'artificial intelligence', 'chatgpt', 'llm', 'neural', 'machine learning', 'grok'],
  TECH: ['tech', 'technology', 'coding', 'software', 'startup', 'innovation'],
  POLITICS: ['government', 'election', 'president', 'congress', 'senate', 'policy', 'democrat', 'republican'],
  MEME: ['meme', 'lol', 'lmao', 'funny', '😂', '🤣'],
  SPACE: ['spacex', 'starship', 'rocket', 'mars', 'space', 'falcon'],
  TESLA: ['tesla', 'ev', 'electric vehicle', 'model', 'cybertruck'],
  TWITTER: ['twitter', 'x.com', 'tweet', 'social media'],
  NEWS: ['breaking', 'report', 'announced', 'sources say', 'according to'],
  FINANCE: ['bitcoin', 'crypto', 'stock', 'market', 'economy', 'inflation', 'fed'],
};

// Categorize tweet content
function categorizeTweet(text) {
  const lowerText = text.toLowerCase();
  const categories = [];
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      categories.push(category);
    }
  }
  
  return categories.length > 0 ? categories : ['OTHER'];
}

// Analyze media type
function analyzeMediaType(tweet) {
  if (!tweet.attachments) return 'TEXT_ONLY';
  
  const media = tweet.attachments.media_keys || [];
  if (media.length === 0) return 'TEXT_ONLY';
  
  // Would need to check media details - simplified for now
  return 'HAS_MEDIA';
}

// Part 1: Analyze Elon's Retweets
async function analyzeElonRetweets() {
  console.log('\n📊 PART 1: Analyzing Elon Musk\'s Retweet Patterns...\n');
  
  try {
    // Get Elon's recent timeline
    const timeline = await roClient.v2.userTimeline(ELON_USER_ID, {
      max_results: 100,
      'tweet.fields': ['created_at', 'public_metrics', 'referenced_tweets', 'entities'],
      expansions: ['referenced_tweets.id', 'referenced_tweets.id.author_id'],
    });
    
    const retweets = [];
    
    for await (const tweet of timeline) {
      // Check if it's a retweet
      const isRetweet = tweet.referenced_tweets?.some(ref => ref.type === 'retweeted');
      
      if (isRetweet) {
        const categories = categorizeTweet(tweet.text);
        const mediaType = analyzeMediaType(tweet);
        
        retweets.push({
          tweet_id: tweet.id,
          text: tweet.text.substring(0, 200), // First 200 chars
          categories: categories.join(', '),
          media_type: mediaType,
          created_at: tweet.created_at,
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
        });
      }
    }
    
    // Save to CSV
    const csvWriter = createCsvWriter({
      path: './data/elon_retweets.csv',
      header: [
        { id: 'tweet_id', title: 'Tweet ID' },
        { id: 'text', title: 'Text' },
        { id: 'categories', title: 'Categories' },
        { id: 'media_type', title: 'Media Type' },
        { id: 'created_at', title: 'Created At' },
        { id: 'likes', title: 'Likes' },
        { id: 'retweets', title: 'Retweets' },
        { id: 'replies', title: 'Replies' },
      ]
    });
    
    await csvWriter.writeRecords(retweets);
    
    // Calculate patterns
    const categoryCount = {};
    retweets.forEach(rt => {
      rt.categories.split(', ').forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });
    
    console.log(`✅ Analyzed ${retweets.length} retweets from Elon\n`);
    console.log('Top Categories:');
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} retweets`);
      });
    
    return { retweets, categoryCount };
    
  } catch (error) {
    console.error('Error analyzing Elon retweets:', error);
    throw error;
  }
}

// Part 2: Analyze Viral Tweets
async function analyzeViralTweets(query = 'Nigeria OR tech OR AI', minLikes = 10000) {
  console.log('\n📊 PART 2: Analyzing Viral Tweets...\n');
  console.log(`Query: "${query}"`);
  console.log(`Min engagement: ${minLikes} likes\n`);
  
  try {
    // Search for viral tweets
    const searchResults = await roClient.v2.search({
      query: `${query} -is:retweet min_faves:${minLikes}`,
      max_results: 100,
      'tweet.fields': ['created_at', 'public_metrics', 'entities', 'author_id'],
      expansions: ['author_id'],
      'user.fields': ['verified', 'public_metrics'],
    });
    
    const viralTweets = [];
    
    for await (const tweet of searchResults.tweets) {
      const categories = categorizeTweet(tweet.text);
      const mediaType = analyzeMediaType(tweet);
      
      // Get author info
      const author = searchResults.includes?.users?.find(u => u.id === tweet.author_id);
      
      viralTweets.push({
        tweet_id: tweet.id,
        text: tweet.text.substring(0, 200),
        categories: categories.join(', '),
        media_type: mediaType,
        created_at: tweet.created_at,
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
        engagement_rate: ((tweet.public_metrics?.like_count || 0) + (tweet.public_metrics?.retweet_count || 0)) / 1000,
        author_verified: author?.verified || false,
        author_followers: author?.public_metrics?.followers_count || 0,
        virality_ratio: (tweet.public_metrics?.like_count || 0) / Math.max(author?.public_metrics?.followers_count || 1, 1000),
      });
    }
    
    // Save to CSV
    const csvWriter = createCsvWriter({
      path: './data/viral_tweets.csv',
      header: [
        { id: 'tweet_id', title: 'Tweet ID' },
        { id: 'text', title: 'Text' },
        { id: 'categories', title: 'Categories' },
        { id: 'media_type', title: 'Media Type' },
        { id: 'created_at', title: 'Created At' },
        { id: 'likes', title: 'Likes' },
        { id: 'retweets', title: 'Retweets' },
        { id: 'replies', title: 'Replies' },
        { id: 'engagement_rate', title: 'Engagement Rate' },
        { id: 'author_verified', title: 'Author Verified' },
        { id: 'author_followers', title: 'Author Followers' },
        { id: 'virality_ratio', title: 'Virality Ratio' },
      ]
    });
    
    await csvWriter.writeRecords(viralTweets);
    
    // Calculate patterns
    const categoryCount = {};
    viralTweets.forEach(vt => {
      vt.categories.split(', ').forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });
    
    console.log(`✅ Analyzed ${viralTweets.length} viral tweets\n`);
    console.log('Top Viral Categories:');
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} tweets`);
      });
    
    // Top performing tweets
    console.log('\nTop 3 Most Viral:');
    viralTweets
      .sort((a, b) => b.virality_ratio - a.virality_ratio)
      .slice(0, 3)
      .forEach((tweet, i) => {
        console.log(`  ${i + 1}. ${tweet.likes.toLocaleString()} likes - "${tweet.text.substring(0, 60)}..."`);
      });
    
    return { viralTweets, categoryCount };
    
  } catch (error) {
    console.error('Error analyzing viral tweets:', error);
    throw error;
  }
}

// Generate insights report
async function generateInsights(elonData, viralData) {
  console.log('\n📈 GENERATING INSIGHTS REPORT...\n');
  
  const insights = {
    timestamp: new Date().toISOString(),
    elon_retweet_patterns: {
      total_analyzed: elonData.retweets.length,
      top_categories: Object.entries(elonData.categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, count]) => ({ category: cat, count })),
    },
    viral_tweet_patterns: {
      total_analyzed: viralData.viralTweets.length,
      top_categories: Object.entries(viralData.categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, count]) => ({ category: cat, count })),
      avg_engagement: Math.round(
        viralData.viralTweets.reduce((sum, t) => sum + t.engagement_rate, 0) / viralData.viralTweets.length
      ),
    },
    recommendations: [],
  };
  
  // Generate recommendations
  const topElonCats = insights.elon_retweet_patterns.top_categories.map(c => c.category);
  const topViralCats = insights.viral_tweet_patterns.top_categories.map(c => c.category);
  
  // Find overlap
  const overlap = topElonCats.filter(cat => topViralCats.includes(cat));
  
  if (overlap.length > 0) {
    insights.recommendations.push({
      type: 'CATEGORY_MATCH',
      message: `Focus on: ${overlap.join(', ')} - these topics get both Elon's attention AND go viral`,
    });
  }
  
  insights.recommendations.push({
    type: 'ELON_FAVORITES',
    message: `Elon retweets most: ${topElonCats.slice(0, 3).join(', ')}`,
  });
  
  insights.recommendations.push({
    type: 'VIRAL_WINNERS',
    message: `Most viral categories: ${topViralCats.slice(0, 3).join(', ')}`,
  });
  
  // Save insights
  await fs.writeFile('./data/insights.json', JSON.stringify(insights, null, 2));
  
  console.log('✅ Insights Report Generated\n');
  console.log('📌 KEY RECOMMENDATIONS:\n');
  insights.recommendations.forEach(rec => {
    console.log(`  • ${rec.message}`);
  });
  
  return insights;
}

// Main execution
async function run() {
  console.log('🚀 Twitter Intelligence Analyzer Starting...\n');
  console.log('=' .repeat(60));
  
  try {
    // Create data directory
    await fs.mkdir('./data', { recursive: true });
    
    // Run analyses
    const elonData = await analyzeElonRetweets();
    const viralData = await analyzeViralTweets('Nigeria OR tech OR AI OR startup', 5000);
    
    // Generate insights
    await generateInsights(elonData, viralData);
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Analysis Complete!');
    console.log('\n📁 Files generated:');
    console.log('  • data/elon_retweets.csv');
    console.log('  • data/viral_tweets.csv');
    console.log('  • data/insights.json');
    console.log('\n💡 Download these files to analyze patterns!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  run();
}

module.exports = { run, analyzeElonRetweets, analyzeViralTweets };

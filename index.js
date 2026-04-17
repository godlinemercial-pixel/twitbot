require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { run } = require('./analyzer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from data directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Home page with download links
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Twitter Intelligence Analyzer</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #1DA1F2; }
        .status { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .downloads { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .downloads a { display: block; margin: 10px 0; color: #1DA1F2; text-decoration: none; font-weight: bold; }
        .downloads a:hover { text-decoration: underline; }
        .info { color: #666; font-size: 14px; }
        .run-now { background: #1DA1F2; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .run-now:hover { background: #0d8bd9; }
      </style>
    </head>
    <body>
      <h1>🐦 Twitter Intelligence Analyzer</h1>
      
      <div class="status">
        <h2>✅ Bot Status: Running</h2>
        <p>Analysis runs automatically every day at 3 AM WAT</p>
        <p class="info">Next run: Check logs for schedule</p>
      </div>
      
      <div class="downloads">
        <h2>📥 Download Analysis Data</h2>
        <a href="/data/elon_retweets.csv" download>⬇️ Elon's Retweet Patterns (CSV)</a>
        <a href="/data/viral_tweets.csv" download>⬇️ Viral Tweets Analysis (CSV)</a>
        <a href="/data/insights.json" download>⬇️ Insights Report (JSON)</a>
        <p class="info">Files update after each analysis run</p>
      </div>
      
      <div>
        <h2>🎯 What This Analyzes</h2>
        <h3>Part 1: Elon's Retweet Patterns</h3>
        <ul>
          <li>What categories does Elon retweet most? (AI, Tech, Memes, Politics, etc.)</li>
          <li>Media types: text-only vs images/videos</li>
          <li>Engagement patterns on his retweets</li>
        </ul>
        
        <h3>Part 2: Viral Tweet Patterns</h3>
        <ul>
          <li>Tweets with 5,000+ likes about Nigeria, tech, AI, startups</li>
          <li>What categories go viral most often?</li>
          <li>Engagement rates and virality ratios</li>
          <li>Verified vs non-verified performance</li>
        </ul>
        
        <h3>Output: Strategy Recommendations</h3>
        <ul>
          <li>Categories that overlap (Elon likes + goes viral)</li>
          <li>Best topics to focus on</li>
          <li>Data-driven content strategy</li>
        </ul>
      </div>
      
      <div class="info">
        <p><strong>Note:</strong> This uses Twitter's free read-only API. No posting capabilities needed.</p>
        <p>Analysis data updates daily. Download CSV files to track trends over time.</p>
      </div>
    </body>
    </html>
  `);
});

// Manual trigger endpoint
app.get('/run-now', async (req, res) => {
  res.send('Analysis started! Check logs for progress. Refresh the home page in 2-3 minutes to download results.');
  
  // Run analysis in background
  run().catch(err => console.error('Manual analysis error:', err));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', running: true, service: 'twitter-intelligence' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📊 Access dashboard at: http://localhost:${PORT}`);
  console.log('');
});

// Run analysis immediately on startup
console.log('🚀 Running initial analysis...\n');
run().catch(err => {
  console.error('Initial analysis error:', err);
  console.log('Will retry on next scheduled run...\n');
});

// Schedule daily analysis at 3 AM WAT (2 AM UTC)
cron.schedule('0 2 * * *', () => {
  console.log('\n⏰ Scheduled analysis triggered at', new Date().toISOString());
  run().catch(err => console.error('Scheduled analysis error:', err));
});

console.log('✅ Twitter Intelligence Analyzer is running!');
console.log('📅 Scheduled to run daily at 3 AM WAT');
console.log('');

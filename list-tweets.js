const fs = require('fs').promises;

async function listTweets() {
  try {
    const data = JSON.parse(await fs.readFile('./tweets.json', 'utf8'));
    
    const pending = data.tweets.filter(t => !t.posted);
    const posted = data.tweets.filter(t => t.posted);
    
    console.log('\n📅 SCHEDULED TWEETS\n');
    console.log('='.repeat(80));
    
    if (pending.length === 0) {
      console.log('No tweets scheduled. Add some with: npm run add-tweet\n');
    } else {
      pending
        .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
        .forEach(tweet => {
          const scheduledDate = new Date(tweet.scheduledTime);
          const now = new Date();
          const isPast = scheduledDate < now;
          
          console.log(`\nID: ${tweet.id}`);
          console.log(`Scheduled: ${scheduledDate.toLocaleString()} ${isPast ? '⚠️  OVERDUE' : '⏰'}`);
          console.log(`Content: "${tweet.content.substring(0, 100)}${tweet.content.length > 100 ? '...' : ''}"`);
          if (tweet.tags && tweet.tags.length > 0) {
            console.log(`Tags: ${tweet.tags.join(', ')}`);
          }
          console.log('-'.repeat(80));
        });
    }
    
    if (posted.length > 0) {
      console.log('\n\n✅ POSTED TWEETS\n');
      console.log('='.repeat(80));
      
      posted
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
        .slice(0, 10) // Show last 10
        .forEach(tweet => {
          console.log(`\nPosted: ${new Date(tweet.postedAt).toLocaleString()}`);
          console.log(`Content: "${tweet.content.substring(0, 100)}${tweet.content.length > 100 ? '...' : ''}"`);
          console.log('-'.repeat(80));
        });
        
      if (posted.length > 10) {
        console.log(`\n... and ${posted.length - 10} more posted tweets`);
      }
    }
    
    console.log(`\n📊 Summary: ${pending.length} scheduled, ${posted.length} posted\n`);
    
  } catch (error) {
    console.error('Error reading tweets:', error);
  }
}

listTweets();

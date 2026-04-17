const fs = require('fs').promises;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function addTweet() {
  try {
    // Load existing tweets
    const data = JSON.parse(await fs.readFile('./tweets.json', 'utf8'));
    
    console.log('\n📝 Add New Tweet\n');
    
    const content = await question('Tweet content: ');
    const dateInput = await question('Schedule date (YYYY-MM-DD, or leave empty for today): ');
    const timeInput = await question('Schedule time (HH:MM in 24hr format, e.g., 14:30): ');
    
    // Parse date
    let scheduledDate;
    if (dateInput.trim()) {
      scheduledDate = new Date(dateInput);
    } else {
      scheduledDate = new Date();
    }
    
    // Parse time
    if (timeInput.trim()) {
      const [hours, minutes] = timeInput.split(':');
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    // Create new tweet object
    const newTweet = {
      id: data.tweets.length > 0 ? Math.max(...data.tweets.map(t => t.id)) + 1 : 1,
      content: content,
      scheduledTime: scheduledDate.toISOString(),
      posted: false,
      tags: []
    };
    
    // Add to tweets array
    data.tweets.push(newTweet);
    
    // Save
    await fs.writeFile('./tweets.json', JSON.stringify(data, null, 2));
    
    console.log('\n✅ Tweet added successfully!');
    console.log(`Scheduled for: ${scheduledDate.toLocaleString()}`);
    console.log(`Content: "${content.substring(0, 60)}${content.length > 60 ? '...' : ''}"`);
    
  } catch (error) {
    console.error('Error adding tweet:', error);
  } finally {
    rl.close();
  }
}

addTweet();

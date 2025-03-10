const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('./src/data/ADV_DPP.json'));
  
  // Log top-level keys
  console.log('Top-level keys:', Object.keys(data));
  
  // Check for physics module
  if (data.JEE_ADV_PHY_MODULES) {
    console.log('\nPhysics module structure:', Object.keys(data.JEE_ADV_PHY_MODULES));
    
    // Check for chapters
    if (data.JEE_ADV_PHY_MODULES.chapters && data.JEE_ADV_PHY_MODULES.chapters.length > 0) {
      const firstChapter = data.JEE_ADV_PHY_MODULES.chapters[0];
      console.log('\nFirst chapter keys:', Object.keys(firstChapter));
      console.log('First chapter title:', firstChapter.title);
      
      // Check for sections
      if (firstChapter.sections && firstChapter.sections.length > 0) {
        const firstSection = firstChapter.sections[0];
        console.log('\nFirst section keys:', Object.keys(firstSection));
        
        // Check for questions
        if (firstSection.questions && firstSection.questions.length > 0) {
          const firstQuestion = firstSection.questions[0];
          console.log('\nFirst question keys:', Object.keys(firstQuestion));
          console.log('\nQuestion structure:', {
            question: firstQuestion.question,
            type: firstQuestion.type,
            level: firstQuestion.level,
            options: firstQuestion.options ? firstQuestion.options.length : 0,
            solution: firstQuestion.solution ? 'Available' : 'Not available'
          });
        }
      }
    }
  }
} catch (error) {
  console.error('Error parsing JSON:', error);
} 
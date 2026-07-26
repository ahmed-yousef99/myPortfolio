const fs = require('fs');
const path = require('path');

const filesToFix = [
  'why-work-with-me.tsx',
  'services.tsx',
  'process.tsx',
  'pricing.tsx',
  'featured-projects.tsx',
  'faq.tsx',
  'contact.tsx'
];

filesToFix.forEach(filename => {
  const filepath = path.join(__dirname, 'src/sections', filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  // Remove whileInView, initial, viewport from container
  content = content.replace(/variants=\{containerVariants\}\s*initial="hidden"\s*whileInView="visible"\s*viewport=\{\{\s*once:\s*false,\s*margin:\s*'-50px'\s*\}\}/g, 
    '');

  // Change container motion.div to div
  // Actually, some are motion.ul or motion.div. It's safe to just remove the motion props.
  
  // Update itemVariants or cardVariants to accept custom index for delay
  content = content.replace(/visible:\s*\{\s*opacity:\s*1,\s*y:\s*0,\s*transition:\s*\{\s*duration:\s*([\d.]+),([^}]+)\}\s*\}/g, 
    'visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: $1, delay: i * 0.1,$2} })');
    
  // Also fix variants with opacity: 1, x: 0
  content = content.replace(/visible:\s*\{\s*opacity:\s*1,\s*x:\s*0,\s*transition:\s*\{\s*duration:\s*([\d.]+),([^}]+)\}\s*\}/g, 
    'visible: (i: number = 0) => ({ opacity: 1, x: 0, transition: { duration: $1, delay: i * 0.1,$2} })');

  // Now, add initial, whileInView, viewport, custom to the child mapping
  // We need to find the map function: map((key, index) => (
  // or map((key) => (
  
  // Replace .map((key) => with .map((key, index) =>
  content = content.replace(/\.map\(\((key|project|step)\)\s*=>/g, '.map(($1, index) =>');
  // Also for map(key =>
  content = content.replace(/\.map\((key|project|step)\s*=>/g, '.map(($1, index) =>');

  // Now find variants={cardVariants} or variants={itemVariants} and inject the props
  content = content.replace(/(variants=\{[^}]+\})/g, 
    '$1\n            custom={typeof index !== "undefined" ? index : 0}\n            initial="hidden"\n            whileInView="visible"\n            viewport={{ once: false, margin: \'-50px\' }}');

  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed', filename);
});

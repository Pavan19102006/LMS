const fs = require('fs');
const path = require('path');

// Copy video file to build folder after build
const srcVideo = path.join(__dirname, 'public', '83274-581386222.mp4');
const destVideo = path.join(__dirname, 'build', '83274-581386222.mp4');

if (fs.existsSync(srcVideo)) {
  try {
    fs.copyFileSync(srcVideo, destVideo);
    console.log('✅ Video file copied to build folder successfully');
  } catch (error) {
    console.error('❌ Error copying video file:', error);
  }
} else {
  console.warn('⚠️ Video file not found in public folder');
}

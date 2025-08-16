require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// تحديد المسار الصحيح للملفات الثابتة
app.use(express.static(__dirname));

// خدمة الملفات للجميع المسارات
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 Server running on port ${PORT}
  📞 WhatsApp: 967734607101
  📢 Telegram: @crazys7
  `);
});

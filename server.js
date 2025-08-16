require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// تحديد المسار الحالي للملفات الثابتة (بدون مجلد public)
app.use(express.static(__dirname));

// جميع المسارات ترجع index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ✅ Server running on port ${PORT}
  📞 WhatsApp: 967734607101
  📢 Telegram: @crazys7
  `);
});

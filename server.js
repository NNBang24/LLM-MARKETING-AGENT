const express = require('express');
const cors = require('cors');
require('dotenv').config();

const contentRoutes = require('./routes/contentRoutes');
const apiRouter = require('./routes/historyRouter');

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 DÒNG QUYẾT ĐỊNH
app.use('/api', contentRoutes);
app.use('/api', apiRouter);

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

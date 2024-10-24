import express from 'express';
import ticketRoutes from './src/routes/ticketRoutes.js'

const app = express()
const port = 3000;

app.use(express.json())

app.use('/ticket', ticketRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Ticket Purchase App is listening on port ${port}`)
})
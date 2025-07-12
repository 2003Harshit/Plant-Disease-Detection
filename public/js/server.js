const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000; // You can choose any available port

// Endpoint to start the Streamlit server
app.get('/start-streamlit', (req, res) => {
    exec('streamlit run your_app.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting Streamlit: ${error}`);
            return res.status(500).send('Error starting Streamlit');
        }
        console.log(`Streamlit output: ${stdout}`);
        res.send('Streamlit server started');
    });
});

// Serve static files if needed
app.use(express.static('public')); // Adjust according to your HTML/CSS/JS structure

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Switch,
  FormControlLabel,
  CssBaseline,
  createTheme,
  ThemeProvider,
  MenuItem,
  Select,
} from "@mui/material";
import { saveAs } from "file-saver";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [style, setStyle] = useState("medium");
  const [history, setHistory] = useState([]);

  // Dark/Light mode theme
  const theme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
  });

  // Handle Summarization
  const handleSummarize = async () => {
    if (!text.trim()) {
      setSummary("⚠️ Please enter some text before summarizing.");
      return;
    }
    setLoading(true);
    setSummary("");

    // Adjust summary length by style
    let maxLen = 100;
    let minLen = 30;
    if (style === "short") {
      maxLen = 60;
      minLen = 20;
    } else if (style === "detailed") {
      maxLen = 200;
      minLen = 80;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/summarize", {
        text,
        max_length: maxLen,
        min_length: minLen,
      });
      const newSummary = response.data.summary;
      setSummary(newSummary);
      setHistory([{ text, summary: newSummary }, ...history]); // save history
    } catch (error) {
      console.error(error);
      setSummary("❌ Error connecting to backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert("✅ Summary copied to clipboard!");
  };

  // Download as text file
  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "summary.txt");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Typography variant="h3" align="center" gutterBottom>
          📝 AI Text Summarizer
        </Typography>

        {/* Dark Mode Toggle */}
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label="Dark Mode"
          style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
        />

        {/* Input Box */}
        <TextField
          label="Enter your text"
          multiline
          rows={8}
          variant="outlined"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        {/* Word Count + Style Selector */}
        <Typography variant="body2" align="right" gutterBottom>
          Word Count: {text.trim() === "" ? 0 : text.trim().split(/\s+/).length}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Summary Style:
        </Typography>
        <Select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          fullWidth
          style={{ marginBottom: "20px" }}
        >
          <MenuItem value="short">Short</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="detailed">Detailed</MenuItem>
        </Select>

        {/* Summarize Button */}
        <Button variant="contained" color="primary" fullWidth onClick={handleSummarize}>
          Summarize
        </Button>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: "center", margin: "20px" }}>
            <CircularProgress />
            <Typography variant="body2" style={{ marginTop: "10px" }}>
              Generating summary...
            </Typography>
          </div>
        )}

        {/* Summary Output */}
        {summary && !loading && (
          <Card style={{ marginTop: "20px" }}>
            <CardContent>
              <Typography variant="h5">Summary:</Typography>
              <Typography variant="body1">{summary}</Typography>
              <div style={{ marginTop: "15px" }}>
                <Button variant="outlined" color="success" onClick={handleCopy} style={{ marginRight: "10px" }}>
                  Copy
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleDownload}>
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <Typography variant="h6">History</Typography>
            {history.map((item, index) => (
            <Card
  key={index}
  style={{ marginTop: "10px" }}
  sx={{
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "grey.800" : "grey.100",
  }}
>
    <CardContent>
    <Typography variant="body2" color="textSecondary">
      Input: {item.text.slice(0, 100)}...
    </Typography>
    <Typography variant="body1">Summary: {item.summary}</Typography>
  </CardContent>
</Card>
            ))}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;

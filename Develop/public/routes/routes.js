const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const notesFile = path.join(__dirname, "notes.json");
const uuid = require("uuid/v4");
const noteId = uuid();
console.log(noteId);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("An error occurred while reading the file");
    }

    res.send(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("An error occurred while reading the file");
    }

    const notes = JSON.parse(data);
    const newNote = { id: Date.now(), ...req.body };
    notes.push(newNote);

    fs.writeFile(notesFile, JSON.stringify(notes), (err) => {
      if (err) {
        return res.status(500).send("An error occurred while writing the file");
      }

      res.status(201).send(newNote);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("An error occurred while reading the file");
    }

    const notes = JSON.parse(data);
    const newNotes = notes.filter(
      (note) => note.id !== parseInt(req.params.id)
    );

    fs.writeFile(notesFile, JSON.stringify(newNotes), (err) => {
      if (err) {
        return res.status(500).send("An error occurred while writing the file");
      }

      res.send();
    });
  });
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/notes", (req, res) => {
  const newNote = { ...req.body, id: uuid() };

  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred while reading the db.json file" });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) {
          return res.status(500).json({
            message: "An error occurred while writing to the db.json file",
          });
        }

        return res.json(newNote);
      }
    );
  });
});

app.get("/api/notes", (req, res) => {
  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .send(`An error occurred while a GET request was being made.`);
    }

    res.send(JSON.parse(data));
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

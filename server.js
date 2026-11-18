
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Project = require("./models/Project");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get all projects
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Database error" });
    }
});

// Add new project
app.post("/api/projects", async (req, res) => {
    try {
        const project = await Project.create({
            title: req.body.title,
            description: req.body.description,
            technologies: req.body.technologies
                ? req.body.technologies.split(",").map(x => x.trim())
                : []
        });

        res.status(201).json(project);

    } catch (error) {
        res.status(400).json({ message: "Unable to add project" });
    }
});

// Delete project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project deleted successfully" });

    } catch (error) {
        res.status(400).json({ message: "Invalid project ID" });
    }
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running at http://localhost:5000");
        });
    })
    .catch(error => {
        console.log("Database connection failed:", error.message);
    });


const projectList = document.getElementById("projectList");
const form = document.getElementById("projectForm");
const message = document.getElementById("message");

async function loadProjects() {
    try {
        const response = await fetch("/api/projects");
        const projects = await response.json();

        projectList.innerHTML = "";

        if (projects.length === 0) {
            projectList.textContent = "No projects added yet.";
            return;
        }

        projects.forEach(project => {
            const card = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = project.title;

            const description = document.createElement("p");
            description.textContent = project.description;

            const technologies = document.createElement("p");
            technologies.textContent =
                "Technologies: " +
                (project.technologies || []).join(", ");

            card.append(title, description, technologies);
            projectList.appendChild(card);
        });

    } catch (error) {
        projectList.textContent = "Unable to load projects.";
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const project = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        technologies: document.getElementById("technologies").value
    };

    try {
        const response = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = "Project added successfully!";
        form.reset();
        loadProjects();

    } catch (error) {
        message.textContent = error.message;
    }
});

loadProjects();

document.addEventListener('DOMContentLoaded', () => {
    // --- TABS ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            let activePane = null;

            tabPanes.forEach(pane => {
                if (pane.id === tab) {
                    pane.classList.add('active');
                    activePane = pane;
                } else {
                    pane.classList.remove('active');
                }
            });

            if (activePane) {
                activePane.classList.add('tab-fade');
                activePane.addEventListener(
                    'animationend',
                    () => {
                        activePane.classList.remove('tab-fade');
                    },
                    { once: true }
                );
            }
        });
    });

    // --- SOCIALS ---
    fetch('socials.json')
        .then(response => response.json())
        .then(data => {
            const socialsContainer = document.getElementById('socials-container');
            data.forEach(social => {
                const link = document.createElement('a');
                link.href = social.url;
                link.target = '_blank';
                link.classList.add('social-link');
                link.innerHTML = `<i class="${social.icon}"></i>`;
                socialsContainer.appendChild(link);
            });
        });

    // --- PROJECTS ---
    let projects = [];
    let projectsToShow = 3;
    let projectsShown = 0;

    const projectsContainer = document.getElementById('projects-container');
    const showMoreButton = document.getElementById('show-more');

    function renderProjects() {
        const projectsToRender = projects.slice(projectsShown, projectsShown + projectsToShow);
        projectsToRender.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('project');
            projectElement.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <a href="${project.repo_link}" target="_blank">
                    <button>View Repo</button>
                </a>
            `;
            projectsContainer.appendChild(projectElement);
        });

        projectsShown += projectsToRender.length;

        if (projectsShown >= projects.length || projectsShown >= 9) {
            showMoreButton.style.display = 'none';
        }
    }

    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data;
            renderProjects();
        });

    showMoreButton.addEventListener('click', renderProjects);

    // --- SKILLS ---
    fetch('skills.json')
        .then(response => response.json())
        .then(data => {
            const skillsContainer = document.getElementById('skills-container');
            data.forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.classList.add('skill');
                skillElement.innerHTML = `
                    <i class="${skill.icon}"></i>
                    <span>${skill.name}</span>
                `;
                skillsContainer.appendChild(skillElement);
            });
        });



    // --- OPEN-TO-WORK INDICATOR ---
    fetch('status.json')
        .then(response => response.json())
        .then(status => {
            const profileContainer = document.querySelector('.profile-info-container');
            if (!profileContainer) return;

            const wrapper = document.createElement('div');
            wrapper.classList.add('open-to-work-wrapper');

            const link = document.createElement('a');
            link.classList.add('open-to-work-link');
            link.href = `mailto:${status.email}`;

            const dot = document.createElement('span');
            dot.classList.add('status-dot');
            dot.classList.add(status.openToWork ? 'status-open' : 'status-closed');

            const text = document.createElement('span');
            text.textContent = status.openToWork
                ? (status.openText || 'Open to work')
                : (status.closedText || 'Not open to work');

            link.appendChild(dot);
            link.appendChild(text);
            wrapper.appendChild(link);
            profileContainer.appendChild(wrapper);
        });
});

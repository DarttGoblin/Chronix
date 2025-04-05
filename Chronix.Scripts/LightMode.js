const light_mode = document.querySelector('.light-mode');
const footer = document.getElementsByTagName('footer')[0];

// localStorage.clear();
ModeState();
light_mode.onclick = ChangeMode;

function ModeState() {
    const mode = localStorage.getItem('mode');
    if (mode == 'dark') {DarkMode();}
}

function ChangeMode() {
    const mode = localStorage.getItem('mode');

    if (mode == 'light' || mode == null) DarkMode();
    else LightMode();
}

function LightMode() {
    document.documentElement.style.setProperty('color', 'rgb(0, 0, 0)');
    document.documentElement.style.setProperty('background-color', 'rgb(255, 255, 255)');
    localStorage.setItem('mode', 'light');
    light_mode.className = '';
    light_mode.classList.add('chronix-header-icon', 'light-mode', 'fa', 'fa-moon');
    footer.style.backgroundColor = 'rgb(200, 200, 200)';
    contact_icon.forEach(icon => {icon.style.color = 'black';});
    portfolio_logo.style.backgroundColor = 'rgb(200, 200, 200)';
    portfolio_logo.src = "Chronix.Media/logo-no-bg-black.png";
    IconHover('black', 'white', 'rgb(200, 200, 200)', 'white', 'Chronix.Media/logo-no-bg-black.png');
}

function DarkMode() {
    document.documentElement.style.setProperty('color', 'rgb(255, 255, 255)');
    document.documentElement.style.setProperty('background-color', 'rgb(0, 0, 0)');
    localStorage.setItem('mode', 'dark');
    light_mode.className = '';
    light_mode.classList.add('chronix-header-icon', 'light-mode', 'fa', 'fa-sun');
    footer.style.backgroundColor = 'rgb(50, 50, 50)';
    contact_icon.forEach(icon => {icon.style.color = 'white';});
    portfolio_logo.style.backgroundColor = 'rgb(50, 50, 50)';
    portfolio_logo.src = "Chronix.Media/logo-no-bg-white.png";
    IconHover('white', 'white', 'rgb(50, 50, 50)', 'black', 'Chronix.Media/logo-no-bg-white.png');
}

function IconHover(color, hover_color, background, hover_background, image) {
    contact_icon.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            icon.style.color = hover_color;
        });
        icon.addEventListener('mouseleave', function() {
            icon.style.color = color;
        });
    });

    portfolio_logo.addEventListener('mouseenter', function() {
        portfolio_logo.style.backgroundColor = hover_background;
        portfolio_logo.src = image;
    });

    portfolio_logo.addEventListener('mouseleave', function() {
        portfolio_logo.style.backgroundColor = background;
        portfolio_logo.src = image;
    });
}
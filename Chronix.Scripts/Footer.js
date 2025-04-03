const contact_icon = document.querySelectorAll('.contact-icon');
const portfolio_logo = document.querySelector('.portfolio-logo');

const links = [
    "https://www.linkedin.com/in/yassine-bazgour-178b73305/",
    "https://github.com/DarttGoblin",
    "https://www.instagram.com/yassine_bazgour/",
    "https://web.facebook.com/yassine.bazgour.5/",
];

contact_icon.forEach((icon, index) => {
    icon.onclick = function() {
        window.open(links[index], '_blank')
    }
});

portfolio_logo.onclick = function() {
    window.open('https://portfolio-git-main-yassinebazgourgmailcoms-projects.vercel.app/', '_blank');
}
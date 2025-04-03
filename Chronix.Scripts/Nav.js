const settings = document.querySelector('.settings');
const light_mode = document.querySelector('.light-mode');
const section_titles = document.querySelectorAll('.section-title');
const sections = document.querySelectorAll('.section');
const chronix_header_title = document.querySelector('.chronix-header-title');
const about_section = document.querySelector('.about-section');

window.onload = adjustHeight;

section_titles.forEach((title, section_index) => {
    title.onclick = function() {
        section_titles.forEach(title => {title.classList.remove('active-section-title');});
        title.classList.add('active-section-title');
        sections.forEach(section => {section.classList.remove('active-section');});
        sections[section_index].classList.add('active-section');
        adjustHeight();
    }
});

settings.onclick = light_mode.onclick = function() {
    alert('Yayks! Not available now, check back later.');
}

chronix_header_title.onclick = function() {
    about_section.click();
}

function adjustHeight() {
    const active_section = document.querySelector('.active-section');
    document.documentElement.style.height = active_section.scrollHeight + 45 + 'px';
    document.body.style.height = active_section.scrollHeight + 45 + 'px';
}
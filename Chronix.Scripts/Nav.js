const settings = document.querySelector('.settings');
const light_mode = document.querySelector('.light-mode');
const section_titles = document.querySelectorAll('.section-title');
const sections = document.querySelectorAll('.section');

section_titles.forEach((title, section_index) => {
    title.onclick = function() {
        section_titles.forEach(title => {title.classList.remove('active-section-title');});
        title.classList.add('active-section-title');
        sections.forEach(section => {section.classList.remove('active-section');});
        sections[section_index].classList.add('active-section');
    }
});

settings.onclick = light_mode.onclick = function() {
    alert('Yayks! Not available now, check back later.');
}
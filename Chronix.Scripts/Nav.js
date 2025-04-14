const settings = document.querySelector('.settings');
const section_titles = document.querySelectorAll('.section-title');
const sections = document.querySelectorAll('.section');
const chronix_header_title = document.querySelector('.chronix-header-title');
const active_section_title = document.querySelector('.active-section-title');

window.onload = AdjustHeight;

section_titles.forEach((title, section_index) => {
    title.onclick = function() {
        section_titles.forEach(title => {title.classList.remove('active-section-title');});
        title.classList.add('active-section-title');
        sections.forEach(section => {section.classList.remove('active-section');});
        sections[section_index].classList.add('active-section');
        AdjustHeight();
    }

    chronix_header_title.onclick = function() {
        section_titles.forEach(title => {title.classList.remove('active-section-title');});
        section_titles[4].classList.add('active-section-title');
        sections.forEach(section => {section.classList.remove('active-section');});
        sections[4].classList.add('active-section');
        AdjustHeight();
    }
});

function AdjustHeight() {
    const active_section = document.querySelector('.active-section');
    document.documentElement.style.height = active_section.scrollHeight + 45 + 'px';
    document.body.style.height = active_section.scrollHeight + 45 + 'px';
}
console.log("dashboard loaded");

function openCity(evt, tab) {
    var i, dashboard_section_2, dashboard_section_1__tabs__button;
    dashboard_section_2 = document.getElementsByClassName("dashboard-section-2");
    for (i = 0; i < dashboard_section_2.length; i++) {
        dashboard_section_2[i].style.display = "none";
    }
    dashboard_section_1__tabs__button = document.getElementsByClassName("dashboard-section-1__tabs__button");
    for (i = 0; i < dashboard_section_1__tabs__button.length; i++) {
        dashboard_section_1__tabs__button[i].className = dashboard_section_1__tabs__button[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}
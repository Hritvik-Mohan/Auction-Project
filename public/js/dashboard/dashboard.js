console.log("dashboard loaded");

currentUser = JSON.parse(currentUser);
console.log(currentUser);

const username = document.getElementById("username");
const verified = document.getElementById("verified");
const joinedDate = document.getElementById("joinedDate");
const myListings = document.getElementById("myListings");
const activeListings = document.getElementById("activeListings");
const successfulListings = document.getElementById("successfulListings");
const unsuccessfulListings = document.getElementById("unsuccessfulListings");

const myBids = document.getElementById("myBids");
const wonBids = document.getElementById("wonBids");
const lostBids = document.getElementById("lostBids");


username.textContent = currentUser.firstName;
verified.innerHTML = currentUser.verified ? "Verified" : `<a style="color: red;" href="/users/verification">Verify your account</a>`;
joinedDate.textContent = new Intl.DateTimeFormat(
    'en-US', 
    { year: 'numeric', month: 'long', day: '2-digit' })
    .format(new Date(currentUser.createdAt)
);
myListings.textContent = currentUser.products.length;
activeListings.textContent = currentUser.liveAuctions.length;
successfulListings.textContent = currentUser.successfulProducts.length;
unsuccessfulListings.textContent = currentUser.unsuccessfulProducts.length;

myBids.textContent = currentUser.bids.length;
wonBids.textContent = currentUser.bidsWon.length
lostBids.textContent = currentUser.bidsLost.length




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
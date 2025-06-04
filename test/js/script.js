// js/script.js

// Globale Supabase client (ervan uitgaande dat supabaseClient.js deze globaal beschikbaar maakt)
// const supabase = window.supabase; // Wordt al geïnitialiseerd in supabaseClient.js

/**
 * Haalt de huidige ingelogde gebruiker op.
 * @returns {Promise<object|null>} Het user object of null als niet ingelogd.
 */
async function getCurrentUser() {
    if (!supabase) {
        console.error("Supabase client is niet beschikbaar in script.js.");
        return null;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Fout bij ophalen sessie:", error);
        return null;
    }
    if (session) {
        return session.user;
    }
    return null;
}

/**
 * Logt de huidige gebruiker uit.
 */
async function handleLogout() {
    if (!supabase) {
        console.error("Supabase client is niet beschikbaar.");
        alert("Uitloggen mislukt, Supabase is niet bereikbaar.");
        return;
    }
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Fout bij uitloggen:', error);
            alert(`Uitloggen mislukt: ${error.message}`);
        } else {
            console.log('Gebruiker succesvol uitgelogd.');
            // Stuur door naar de homepage of loginpagina
            window.location.href = 'index.html';
        }
    } catch (err) {
        console.error('Onverwachte fout bij uitloggen:', err);
        alert("Er is een onverwachte fout opgetreden bij het uitloggen.");
    }
}

/**
 * Past de navigatiebalk aan op basis van de inlogstatus van de gebruiker.
 * @param {object|null} user - Het user object of null.
 */
function updateUserNav(user) {
    const navLoginRegister = document.getElementById('navLoginRegister'); // ID voor Login/Register link/knop
    const navUserProfile = document.getElementById('navUserProfile');     // ID voor Mijn Profiel link
    const navAddSpot = document.getElementById('navAddSpot');         // ID voor Spot Toevoegen link
    const navLogoutButton = document.getElementById('navLogoutButton');   // ID voor Uitloggen knop

    // Maak ID's voor de navigatie-elementen in je HTML, bijvoorbeeld:
    // <a href="login.html" id="navLoginRegister" class="...">Login/Register</a>
    // <a href="profile.html" id="navUserProfile" class="...">Mijn Profiel</a>
    // <a href="add-spot.html" id="navAddSpot" class="...">Spot Toevoegen</a>
    // <button id="navLogoutButton" class="...">Uitloggen</button>

    if (user) { // Gebruiker is ingelogd
        if (navLoginRegister) navLoginRegister.classList.add('hidden');
        if (navUserProfile) navUserProfile.classList.remove('hidden');
        if (navAddSpot) navAddSpot.classList.remove('hidden');
        if (navLogoutButton) {
            navLogoutButton.classList.remove('hidden');
            // Zorg ervoor dat er maar één event listener is, of verwijder de oude eerst
            const newLogoutButton = navLogoutButton.cloneNode(true);
            navLogoutButton.parentNode.replaceChild(newLogoutButton, navLogoutButton);
            newLogoutButton.addEventListener('click', handleLogout);
        }
    } else { // Gebruiker is niet ingelogd
        if (navLoginRegister) navLoginRegister.classList.remove('hidden');
        if (navUserProfile) navUserProfile.classList.add('hidden');
        if (navAddSpot) navAddSpot.classList.add('hidden');
        if (navLogoutButton) navLogoutButton.classList.add('hidden');
    }
}

/**
 * Beschermt een pagina zodat alleen ingelogde gebruikers deze kunnen zien.
 * Stuurt niet-ingelogde gebruikers naar de loginpagina.
 * @param {string} [redirectTo='login.html'] - De pagina waarnaar doorgestuurd wordt.
 */
async function protectPage(redirectTo = 'login.html') {
    const user = await getCurrentUser();
    if (!user) {
        console.log("Gebruiker niet ingelogd, doorsturen naar login.");
        window.location.href = redirectTo;
    }
    return user; // Geef de gebruiker terug voor verder gebruik op de pagina
}


document.addEventListener('DOMContentLoaded', async () => {
    // Update copyright year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Controleer de inlogstatus en pas de navigatie aan
    if (typeof supabase !== 'undefined') { // Controleer of Supabase client bestaat
        const user = await getCurrentUser();
        updateUserNav(user);

        // Specifieke logica voor beschermde pagina's
        // Voeg hier de bestandsnamen toe van pagina's die beschermd moeten zijn
        const protectedPages = ['profile.html', 'add-spot.html', 'edit-spot.html']; // edit-spot.html is voor later
        const currentPage = window.location.pathname.split('/').pop();

        if (protectedPages.includes(currentPage)) {
            await protectPage(); // protectPage zal doorsturen als gebruiker niet ingelogd is
        }

        // Event listener voor Supabase auth state changes (optioneel, maar handig)
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Supabase auth state change:', event, session);
            updateUserNav(session ? session.user : null);
            // Als de gebruiker uitlogt op een beschermde pagina, stuur ze weg
            if (event === 'SIGNED_OUT' && protectedPages.includes(currentPage)) {
                window.location.href = 'login.html';
            }
        });

    } else {
        console.warn("Supabase client is niet geladen op DOMContentLoaded. Navigatie en paginabescherming werken mogelijk niet.");
        // Val terug op standaard navigatie tonen (login/register)
        updateUserNav(null);
    }

    // Voorbeeld: Initialize a map if on a page with a map element (bestaande code)
    // const mapElement = document.getElementById('map');
    // if (mapElement) {
    //     const map = L.map('map').setView([51.505, -0.09], 13);
    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(map);
    // }
});
// js/supabaseClient.js

    // Vervang SUPABASE_URL en SUPABASE_ANON_KEY met jouw daadwerkelijke Supabase project URL en anon key.
    const SUPABASE_URL = 'https://fxcuhmmsbherogjpsnsg.supabase.co'; // Bijvoorbeeld: 'https://xyzabcdefghijklmnop.supabase.co'
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Y3VobW1zYmhlcm9nanBzbnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODUyMDAsImV4cCI6MjA2NDU2MTIwMH0._yHljhu1FI5ZMmqcpgiz5Pst1848tT59laIVcDIV-20'; // De lange 'anon' key

    // Controleer of de variabelen zijn ingevuld
    if (SUPABASE_URL === 'https://fxcuhmmsbherogjpsnsg.supabase.co' || SUPABASE_ANON_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Y3VobW1zYmhlcm9nanBzbnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODUyMDAsImV4cCI6MjA2NDU2MTIwMH0._yHljhu1FI5ZMmqcpgiz5Pst1848tT59laIVcDIV-20') {
        console.warn('Supabase URL of Anon Key is nog niet ingesteld in js/supabaseClient.js. Vul deze in om Supabase te gebruiken.');
        // Je kunt hier eventueel een alert tonen of de functionaliteit beperken
        // alert('Supabase configuratie ontbreekt. Functionaliteit is beperkt.');
    }

    // Maak de Supabase client aan
    // Zorg ervoor dat je de Supabase JS library hebt geladen in je HTML bestanden,
    // bijvoorbeeld via een CDN: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    // Of als je een module bundler gebruikt, kun je het importeren: import { createClient } from '@supabase/supabase-js'

    let supabase;
    try {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client geïnitialiseerd.');
        } else {
            console.error('Supabase JS library (supabase-js) is niet geladen. Voeg de CDN link toe aan je HTML of importeer de module.');
        }
    } catch (error) {
        console.error('Fout bij het initialiseren van de Supabase client:', error);
    }

    // Exporteer de client zodat andere scripts deze kunnen gebruiken (als je modules gebruikt)
    // Voor nu, gaan we ervan uit dat 'supabase' globaal beschikbaar is via het window object
    // of dat je het direct in andere scripts gebruikt na het laden van dit bestand.

    // Voorbeeld van hoe je het zou kunnen exporteren met ES modules (vereist type="module" in je script tag):
    // export { supabase };
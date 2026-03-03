import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase
const SUPABASE_URL = 'https://dedxsbgrruwnrhzcevjg.supabase.co' // Replace
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZHhzYmdycnV3bnJoemNldmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODA1OTMsImV4cCI6MjA4ODA1NjU5M30.DJR7EO9mzeLqwf2RnL0W2abXvohieY5qDnf_tdf8xBI' // Replace

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Simple password protection (change this!)
const ADMIN_PASSWORD = 'RogueCoyote2026!@#' // CHANGE THIS!

// Check password
window.checkPassword = function() {
    const password = document.getElementById('password').value
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginForm').classList.add('hidden')
        document.getElementById('adminSection').classList.remove('hidden')
        loadRSVPs()
    } else {
        document.getElementById('loginError').style.display = 'block'
    }
}

// Load RSVPs from Supabase
async function loadRSVPs() {
    const { data: rsvps, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })
    
    if (error) {
        console.error('Error loading RSVPs:', error)
        return
    }
    
    // Calculate stats
    const totalRsvps = rsvps.length
    const attending = rsvps.filter(r => r.attending).length
    const notAttending = rsvps.filter(r => !r.attending).length
    const totalGuests = rsvps
        .filter(r => r.attending)
        .reduce((sum, r) => sum + r.number_of_guests, 0)
    const dinnerGuests = rsvps.reduce(
        (total, r) => total + (r.attend_dinner ? r.number_of_guests : 0), 0
    );
    // const dinnerGuests = rsvps.filter(r => r.attend_dinner).length
    
    // Update stats
    document.getElementById('totalRsvps').textContent = totalRsvps
    document.getElementById('attending').textContent = attending
    document.getElementById('notAttending').textContent = notAttending
    document.getElementById('totalGuests').textContent = totalGuests
    document.getElementById('dinnerGuests').textContent = dinnerGuests
    
    // Display RSVPs in table
    const tbody = document.getElementById('rsvpTableBody')
    tbody.innerHTML = ''
    
    rsvps.forEach(rsvp => {
        // format the guest names
        let guestNames = '-';
        if (rsvp.plus_one_name && Array.isArray(rsvp.plus_one_name)) {
            guestNames = rsvp.plus_one_name.join(', ');
        } else if (rsvp.plus_one_name) {
            guestNames = rsvp.plus_one_name;
        }


        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${rsvp.full_name}</td>
            <td>${rsvp.email}</td>
            <td class="${rsvp.attending ? 'attending-yes' : 'attending-no'}">
                ${rsvp.attending ? 'YES' : 'NO'}
            </td>
            <td>${rsvp.number_of_guests}</td>
            <td>${guestNames}</td>
            <td>${rsvp.dietary_restrictions || '-'}</td>
            <td>${rsvp.message || '-'}</td>
            <td>${rsvp.attend_dinner ? 'YES' : 'NO'}</td>
            <td>${new Date(rsvp.created_at).toLocaleDateString()}</td>
        `
        tbody.appendChild(row)
    })
}

// Export to CSV
window.exportToCSV = async function() {
    const { data: rsvps, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })
    
    if (error) {
        console.error('Error:', error)
        return
    }
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Attending', 'Guests', 'Plus One', 'Dietary', 'Message', 'Date']
    const rows = rsvps.map(r => [
        r.full_name,
        r.email,
        r.attending ? 'YES' : 'NO',
        r.number_of_guests,
        r.plus_one_name || '',
        r.dietary_restrictions || '',
        r.message || '',
        new Date(r.created_at).toLocaleDateString()
    ])
    
    let csvContent = headers.join(',') + '\n'
    rows.forEach(row => {
        csvContent += row.map(field => `"${field}"`).join(',') + '\n'
    })
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
}
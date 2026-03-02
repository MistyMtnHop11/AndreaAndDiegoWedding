import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase
const SUPABASE_URL = 'https://dedxsbgrruwnrhzcevjg.supabase.co' // Replace
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZHhzYmdycnV3bnJoemNldmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODA1OTMsImV4cCI6MjA4ODA1NjU5M30.DJR7EO9mzeLqwf2RnL0W2abXvohieY5qDnf_tdf8xBI' // Replace

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Open modal
window.openRSVPModal = function() {
    document.getElementById('rsvpModal').style.display = 'block'
    document.body.style.overflow = 'hidden' // Prevent background scrolling
}

// Close modal
window.closeRSVPModal = function() {
    document.getElementById('rsvpModal').style.display = 'none'
    document.body.style.overflow = '' // Re-enable scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('rsvpModal')
    if (event.target === modal) {
        closeRSVPModal()
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeRSVPModal()
    }
})

// Handle form submission
const form = document.getElementById('modal-rsvp-form')
const submitBtn = document.getElementById('modalSubmitBtn')
const successMessage = document.getElementById('modalSuccessMessage')
const errorMessage = document.getElementById('modalErrorMessage')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Disable submit button
    submitBtn.disabled = true
    submitBtn.textContent = 'Submitting...'
    
    // Hide messages
    successMessage.style.display = 'none'
    errorMessage.style.display = 'none'
    
    // Get form data
    const formData = new FormData(form)
    const rsvpData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        attending: formData.get('attending') === 'true',
        number_of_guests: parseInt(formData.get('number_of_guests')),
        plus_one_name: formData.get('plus_one_name') || null,
        dietary_restrictions: formData.get('dietary_restrictions') || null,
        message: formData.get('message') || null
    }
    
    // Insert into Supabase
    const { data, error } = await supabase
        .from('rsvps')
        .insert([rsvpData])
    
    if (error) {
        console.error('Error:', error)
        errorMessage.style.display = 'block'
        submitBtn.disabled = false
        submitBtn.textContent = 'Submit RSVP'
    } else {
        console.log('Success:', data)
        successMessage.style.display = 'block'
        form.reset()
        submitBtn.textContent = 'Submit RSVP'
        
        // Close modal after 3 seconds
        setTimeout(() => {
            closeRSVPModal()
            successMessage.style.display = 'none'
            submitBtn.disabled = false
        }, 3000)
    }
})
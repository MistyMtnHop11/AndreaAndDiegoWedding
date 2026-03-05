import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const number_of_guests = document.getElementById('modal_number_of_guests');
const guestsNamesFields = document.getElementById('guestsNamesFields');
const dinner_guests = document.getElementById('dinnerpop');

const selectList = document.getElementById('modal_number_of_guests');
const dinnerList = document.getElementById('dinnerpop');
const maxGuests = 10; // Set maximum number of guests
let numberOfGuests = 0;
let numberOfDinnerGuests = 0;

// Default PlaceHolder option
const placeholderOption = document.createElement('option');
placeholderOption.value = '';
placeholderOption.textContent = 'Please Select...';
placeholderOption.disabled = true;
placeholderOption.selected = true;
selectList.appendChild(placeholderOption);
dinnerList.appendChild(placeholderOption);

for (let i = 1; i <= maxGuests; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectList.appendChild(option);
}

modal_attending.addEventListener('change', function() {
    if (this.value === 'true') {
        $('#acceptRSVP').show();
        $('#modal_number_of_guests').attr('required', true);
        $('#modal_dinner').attr('required', true);
        $('#dinnerpop').attr('required', true);
    } else {
        $('#modal_number_of_guests').attr('required', false);
        $('#modal_dinner').attr('required', false);
        $('#dinnerpop').attr('required', false);
        $('#modal_number_of_guests').val('');
        $('#acceptRSVP').hide();
    }
});

modal_dinner.addEventListener('change', function() {
    if (this.value === 'true'){
        $('#dinnerpop').prop("disabled", false);
    } else {
        $('#dinnerpop').prop("disabled", true);
    }
})



number_of_guests.addEventListener('change', function() {
    //clear previous fields
    guestsNamesFields.innerHTML = '';

    const selectedValue = this.value;
    let newFields = '';

    for (let i = 0; i < selectedValue; i++) {
        const isFirstGuest = i === 0;
        newFields += `
            <div class="form-group">
                <label for="guest_name_${i}">Guest Name ${i+1}${isFirstGuest ? ' (You)' : ''}</label>
                <input class="guest-name-input" 
                    type="text" 
                    id="guest_name_${i}" 
                    name="guest_name_${i}" 
                    ${isFirstGuest ? 'readonly' : ''}
                    required>
            </div>
        `;
    }
    guestsNamesFields.innerHTML = newFields;
    numberOfGuests = selectedValue;

    syncFullNameToFirstGuest();
    
    dinnerList.innerHTML = '';
    dinnerList.appendChild(placeholderOption.cloneNode(true));
    
    for (let i = 1; i <= numberOfGuests; i++){
        // console.log(i);
        const optionDinner = document.createElement('option');
        optionDinner.value = i;
        optionDinner.textContent = i;
        dinnerList.appendChild(optionDinner);
    }

});

function syncFullNameToFirstGuest() {
    const fullNameInput = document.getElementById('modal_full_name');
    const firstGuestInput = document.getElementById('guest_name_0');
    
    if (firstGuestInput && fullNameInput) {
        firstGuestInput.value = fullNameInput.value;
    }
}

// Sync when full name changes
const fullNameInput = document.getElementById('modal_full_name');
if (fullNameInput) {
    fullNameInput.addEventListener('input', syncFullNameToFirstGuest);
}

dinner_guests.addEventListener('change', function() {
    numberOfDinnerGuests = this.value;
    console.log(numberOfDinnerGuests);
})



// Initialize Supabase
const SUPABASE_URL = 'https://dedxsbgrruwnrhzcevjg.supabase.co' // Replace
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZHhzYmdycnV3bnJoemNldmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODA1OTMsImV4cCI6MjA4ODA1NjU5M30.DJR7EO9mzeLqwf2RnL0W2abXvohieY5qDnf_tdf8xBI' // Replace

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function resetRSVPForm() {
  // Reset the form fields
  form.reset();

  // Clear dynamic guest name inputs
  guestsNamesFields.innerHTML = '';

  // Reset counters
  numberOfGuests = 0;
  numberOfDinnerGuests = 0;

  // Reset dinner dropdown completely
  dinnerList.innerHTML = '';
  
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Please Select...';
  placeholder.disabled = true;
  placeholder.selected = true;
  dinnerList.appendChild(placeholder);

  // Disable dinner select again
  $('#dinnerpop')
    .prop('disabled', true)
    .prop('required', false);

  // Remove required flags
  $('#modal_number_of_guests').prop('required', false).val('');
  $('#modal_dinner').prop('required', false);

  // Hide conditional section
  $('#acceptRSVP').hide();

  // Reset submit button + messages
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit RSVP';
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
}




// Open modal
window.openRSVPModal = function() {
    document.getElementById('rsvpModal').style.display = 'block'
    document.body.style.overflow = 'hidden' // Prevent background scrolling
}

// Close modal
window.closeRSVPModal = function() {
    document.getElementById('rsvpModal').style.display = 'none'
    document.body.style.overflow = '' // Re-enable scrolling
    resetRSVPForm();
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

    const guestInputs = document.querySelectorAll('.guest-name-input')
    const guestNames = Array.from(guestInputs).map(input => input.value.trim()).filter(name => name !== '')

    const rsvpData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        attending: formData.get('attending') === 'true',
        number_of_guests: parseInt(numberOfGuests) || 0,
        plus_one_name: guestNames.length > 0 ? guestNames : null,
        dietary_restrictions: formData.get('dietary_restrictions') || null,
        message: formData.get('message') || null,
        attend_dinner: formData.get('attend_dinner') === 'true',
        dinner_pop: parseInt(numberOfDinnerGuests) || 0
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

    // $('#modal_number_of_guests').attr('required', false);
    // $('#modal_dinner').attr('required', false);
    // $('#dinnerpop').attr('required', false);
    // $('#modal_number_of_guests').val('');
    // $('#acceptRSVP').hide();

})


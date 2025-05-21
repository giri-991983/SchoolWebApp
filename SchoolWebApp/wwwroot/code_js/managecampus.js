'use strict';


$(function () { Seclect2Initilizer(); });

////window.initGoogleMaps = function () {
////    console.log('Google Maps API loaded');
////    initAutocomplete();
////};


//// Initialize Google Maps Places Autocomplete
////function initAutocomplete() {
////    const localityInput = document.getElementById('LocalityAutocompleteElement');
////    if (!localityInput) {
////        console.error('Locality input not found');
////        return;
////    }

////    const autocomplete = new google.maps.places.Autocomplete(localityInput, {
////        types: ['geocode'], // Allows localities, cities, etc.
////        fields: ['address_components', 'name', 'formatted_address']
////    });
////    // Prevent form submission on Enter key in the Locality input
////    localityInput.addEventListener('keydown', (e) => {
////        if (e.key === 'Enter') {
////            e.preventDefault();
////        }
////    });


////    autocomplete.addListener('place_changed', function () {
////        const place = autocomplete.getPlace();
////        if (!place.address_components) {
////            console.error('No address components found for selected place:', place);
////            return;
////        }

////        let countryName = '', stateName = '', cityName = '', localityName = place.name;

////        // Extract address components
////        place.address_components.forEach(component => {
////            const types = component.types;
////            if (types.includes('country')) {
////                countryName = component.long_name;
////            } else if (types.includes('administrative_area_level_1')) {
////                stateName = component.long_name;
////            } else if (types.includes('locality')) {
////                cityName = component.long_name;
////            } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
////                // Use sublocality as city if locality is not present
////                cityName = cityName || component.long_name;
////            }
////        });

////        // Fallback: If cityName is empty, use localityName or formatted_address
////        if (!cityName) {
////            cityName = localityName;
////            console.warn(`No locality/sublocality found, using localityName: ${cityName}`);
////        }

////        // Update Locality input
////        $('#Locality').val(localityName);
////        console.log(`Selected place: ${localityName}, Country: ${countryName}, State: ${stateName}, City: ${cityName}`);

////        // Update dropdowns
////        updateDropdowns(countryName, stateName, cityName);
////    });
////}

////// Update Country, State, and City dropdowns based on names
////function updateDropdowns(countryName, stateName, cityName) {
////    if (!countryName) {
////        console.error('Country name is empty');
////        $('#CountryID').val('').trigger('change');
////        $('#StateID').val('').trigger('change');
////        $('#CityID').val('').trigger('change');
////        return;
////    }

////    // Step 1: Find CountryID
////    $.ajax({
////        url: '/Campus/Index?handler=SearchCountryByName',
////        type: 'GET',
////        data: { name: countryName },
////        headers: {
////            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
////        },
////        success: function (response) {
////            if (response.success && response.country) {
////                const countryId = response.country.CountryID;
////                $('#CountryID').val(countryId).trigger('change'); // Trigger loadStates
////                console.log(`Country matched: ${countryName} -> ID: ${countryId}`);
////                // Load states immediately
////                loadStates(countryId);

////                // Step 2: Find StateID
////                if (stateName) {
////                    $.ajax({
////                        url: '/Campus/Index?handler=SearchStateByName',
////                        type: 'GET',
////                        data: { name: stateName, countryId: countryId },
////                        headers: {
////                            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
////                        },
////                        success: function (response) {
////                            if (response.success && response.state) {
////                                const stateId = response.state.StateID;
////                                console.log(`State matched: ${stateName} -> ID: ${stateId}`);

////                                // Load States to ensure dropdown is populated
////                                loadStates(countryId);

////                                // Set StateID after a short delay
////                                setTimeout(() => {
////                                    $('#StateID').val(stateId).trigger('change'); // Trigger loadCities

////                                    // Step 3: Find CityID
////                                    if (cityName) {
////                                        $.ajax({
////                                            url: '/Campus/Index?handler=SearchCityByName',
////                                            type: 'GET',
////                                            data: { name: cityName, countryId: countryId, stateId: stateId },
////                                            headers: {
////                                                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
////                                            },
////                                            success: function (response) {
////                                                if (response.success && response.city) {
////                                                    const cityId = response.city.CityID;
////                                                    console.log(`City matched: ${cityName} -> ID: ${cityId}`);

////                                                    // Load Cities to ensure dropdown is populated
////                                                    loadCities(stateId);

////                                                    // Set CityID after a short delay
////                                                    setTimeout(() => {
////                                                        $('#CityID').val(cityId);
////                                                    }, 500);
////                                                } else {
////                                                    console.warn(`City not found: ${cityName}`);
////                                                    $('#CityID').val('');
////                                                }
////                                            },
////                                            error: function (xhr) {
////                                                console.error(`Failed to search city ${cityName}:`, xhr.status, xhr.responseText);
////                                                $('#CityID').val('');
////                                            }
////                                        });
////                                    } else {
////                                        $('#CityID').val('');
////                                    }
////                                }, 500);
////                            } else {
////                                console.warn(`State not found: ${stateName}`);
////                                $('#StateID').val('');
////                                $('#CityID').val('');
////                            }
////                        },
////                        error: function (xhr) {
////                            console.error(`Failed to search state ${stateName}:`, xhr.status, xhr.responseText);
////                            $('#StateID').val('');
////                            $('#CityID').val('');
////                        }
////                    });
////                } else {
////                    $('#StateID').val('');
////                    $('#CityID').val('');
////                }
////            } else {
////                console.warn(`Country not found: ${countryName}`);
////                $('#CountryID').val('');
////                $('#StateID').val('');
////                $('#CityID').val('');
////            }
////        },
////        error: function (xhr) {
////            console.error(`Failed to search country ${countryName}:`, xhr.status, xhr.responseText);
////            $('#CountryID').val('');
////            $('#StateID').val('');
////            $('#CityID').val('');
////        }
////    });
////}
//-----------------------------------------------------------------------------------------------------------------------------------------------------

//// Initialize Google Maps Places Autocomplete using PlaceAutocompleteElement
////window.initGoogleMaps = function () {
////    console.log('Google Maps API loaded');
////    if (!window.google || !google.maps || !google.maps.places) {
////        console.error('Google Maps Places API not loaded');
////        return;
////    }
////    initAutocomplete(); // <-- Call it here


////};

////function initAutocomplete() {
////    console.log('Initializing Google Maps PlaceAutocompleteElement');
////    const autocompleteElement = document.getElementById('LocalityAutocomplete');
////    const localityInput = document.getElementById('Locality');
////    if (!autocompleteElement || !localityInput) {
////        console.error('LocalityAutocomplete or Locality input not found');
////        return;
////    }

////    try {
////        autocompleteElement.type = 'cities';
////        autocompleteElement.addEventListener('input', (e) => {
////            console.log('Typing in LocalityAutocomplete:', e.target.value);
////        });
////        autocompleteElement.addEventListener('gmp-placeselect', (event) => {
////            const place = event.detail;
////            console.log('Place selected:', place);

////            let localityName = place.displayName || '';
////            let countryName = '', stateName = '', cityName = '';

////            if (place.addressComponents) {
////                place.addressComponents.forEach(component => {
////                    const types = component.types;
////                    if (types.includes('country')) {
////                        countryName = component.longName;
////                    } else if (types.includes('administrative_area_level_1')) {
////                        stateName = component.longName;
////                    } else if (types.includes('locality')) {
////                        cityName = component.longName;
////                        localityName = component.longName;
////                    } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
////                        cityName = cityName || component.longName;
////                    }
////                });
////                if (!cityName) cityName = localityName;
////            }

////            localityInput.value = localityName;
////            console.log(`Locality set to: ${localityName}, Country: ${countryName}, State: ${stateName}, City: ${cityName}`);
////            updateDropdowns(countryName, stateName, cityName);
////        });

////        autocompleteElement.addEventListener('keydown', (e) => {
////            if (e.key === 'Enter') e.preventDefault();
////        });
////    } catch (error) {
////        console.error('Error initializing autocomplete:', error);
////    }
////}


////function updateDropdowns(countryName, stateName, cityName) {
////    console.log('Updating dropdowns with:', { countryName, stateName, cityName });
////    if (!countryName) {
////        console.error('Country name is empty');
////        $('#CountryID').val('').trigger('change');
////        $('#StateID').val('').trigger('change');
////        $('#CityID').val('').trigger('change');
////        return;
////    }

////    $.ajax({
////        url: '/Campus/Create?handler=SearchCountryByName',
////        type: 'GET',
////        data: { name: countryName },
////        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
////        success: function (response) {
////            console.log('Country search response:', response);
////            if (response.success && response.country) {
////                const countryId = response.country.CountryID;
////                $('#CountryID').val(countryId).trigger('change');
////                console.log(`Country matched: ${countryName} -> ID: ${countryId}`);
////                loadStates(countryId);

////                if (stateName) {
////                    setTimeout(() => {
////                        $.ajax({
////                            url: '/Campus/Create?handler=SearchStateByName',
////                            data: { name: stateName, countryId: countryId },
////                            success: function (response) {
////                                console.log('State search response:', response);
////                                if (response.success && response.state) {
////                                    const stateId = response.state.StateID;
////                                    $('#StateID').val(stateId).trigger('change');
////                                    console.log(`State matched: ${stateName} -> ID: ${stateId}`);
////                                    loadCities(stateId);

////                                    if (cityName) {
////                                        setTimeout(() => {
////                                            $.ajax({
////                                                url: '/Campus/Create?handler=SearchCityByName',
////                                                data: { name: cityName, countryId: countryId, stateId: stateId },
////                                                success: function (response) {
////                                                    console.log('City search response:', response);
////                                                    if (response.success && response.city) {
////                                                        const cityId = response.city.CityID;
////                                                        $('#CityID').val(cityId).trigger('change');
////                                                        console.log(`City matched: ${cityName} -> ID: ${cityId}`);
////                                                    }
////                                                },
////                                                error: function (xhr) {
////                                                    console.error(`City search failed: ${xhr.status} ${xhr.responseText}`);
////                                                }
////                                            });
////                                        }, 1000);
////                                    }
////                                }
////                            },
////                            error: function (xhr) {
////                                console.error(`State search failed: ${xhr.status} ${xhr.responseText}`);
////                            }
////                        });
////                    }, 1000);
////                }
////            }
////        },
////        error: function (xhr) {
////            console.error(`Country search failed: ${xhr.status} ${xhr.responseText}`);
////        }
////    });
////}

// Function to initialize boarding type checkboxes for both Create and Edit forms

// Load Zones based on InstitutionID
function loadZones(institutionId, campusId = null) {
    const zoneSelectId = campusId ? `editZoneID_${campusId}` : 'ZoneID';
    if (!institutionId || institutionId <= 0) {
        $(`#${zoneSelectId}`).html('');
        $(`#${zoneSelectId}`).val('').trigger('change');
        return;
    }
    $.ajax({
        url: '/Campus/Index?handler=LoadComponent',
        type: 'GET',
        data: { id: institutionId },
        success: function (response) {
            $(`#${zoneSelectId}`).html(response);
            $(`#${zoneSelectId}`).val('').trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading zones:', error);
            $(`#${zoneSelectId}`).html('<option value="">Error loading zones</option>');
            $(`#${zoneSelectId}`).val('').trigger('change');
        }
    });
}

// Load States based on CountryID
function loadStates(countryId, campusId = null) {
    const stateSelectId = campusId ? `editStateID_${campusId}` : 'StateID';
    const citySelectId = campusId ? `editCityID_${campusId}` : 'CityID';
    if (!countryId) {
        $(`#${stateSelectId}`).html('');
        $(`#${stateSelectId}`).val('').trigger('change');
        $(`#${citySelectId}`).html('');
        $(`#${citySelectId}`).val('').trigger('change');
        return;
    } else {
        $.ajax({
            url: '/Campus/Index?handler=LoadLocation',
            type: 'GET',
            data: { id: countryId, locationType: 'States' },
            success: function (response) {
                $(`#${stateSelectId}`).html(response);
                $(`#${stateSelectId}`).val('').trigger('change');
                $(`#${citySelectId}`).html('');
                $(`#${citySelectId}`).val('').trigger('change');
            },
            error: function (xhr, status, error) {
                console.error('Error loading states:', error);
                $(`#${stateSelectId}`).html('<option value="">Error loading states</option>');
                $(`#${stateSelectId}`).val('').trigger('change');
                $(`#${citySelectId}`).html('<option value="">Select a state first</option>');
                $(`#${citySelectId}`).val('').trigger('change');
            }

        });
    }
}

// Load Cities based on StateID
function loadCities(stateId, campusId = null) {
    const countrySelectId = campusId ? `editCountryID_${campusId}` : 'CountryID';
    const citySelectId = campusId ? `editCityID_${campusId}` : 'CityID';
    const countryId = $(`#${countrySelectId}`).val();
    if (!countryId || countryId <= 0 || !stateId || stateId <= 0) {
        $(`#${citySelectId}`).html('');
        $(`#${citySelectId}`).val('').trigger('change');
        return;
    }
    $.ajax({
        url: '/Campus/Index?handler=LoadLocation',
        type: 'GET',
        data: { id: `${countryId},${stateId}`, locationType: 'Cities' },
        success: function (response) {
            $(`#${citySelectId}`).html(response);
            $(`#${citySelectId}`).val('').trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading cities:', error);
            $(`#${citySelectId}`).html('<option value="">Error loading cities</option>');
            $(`#${citySelectId}`).val('').trigger('change');
        }
    });
}

function initializeSelectPickers() {
    //console.log(`[2025-05-15T15:08:00+05:30] Initializing selectpickers`);
    $('select.selectpicker').each(function () {
        const $select = $(this);
        // Destroy existing selectpicker if initialized
        if ($select.hasClass('selectpicker-initialized')) {
            $select.selectpicker('destroy').removeClass('selectpicker-initialized');

        }

        const preSelectedValues = $select.find('option[selected]').map(function () {
            return $(this).val();
        }).get();


        $select.selectpicker({
            liveSearch: true,
            selectedTextFormat: 'count > 2',
            noneSelectedText: 'Select Boarding Types',
            style: 'btn btn-outline-secondary form-control', // Consistent styling
            // Full width
            dropupAuto: false // Prevent dropdown direction issues
        }).addClass('selectpicker-initialized');

        // Explicitly set pre-selected values
        if (preSelectedValues.length > 0) {
            $select.selectpicker('val', preSelectedValues);
            console.log(`[2025-05-15T15:08:00+05:30] Set pre-selected values for ${$select.attr('id')}:`, preSelectedValues);
        }

        $select.selectpicker('refresh');
        console.log(`[2025-05-15T15:08:00+05:30] Selectpicker initialized for ${$select.attr('id')}, values:`, $select.val());
    });
}


$(document).ready(function () {



    //  Zone DataTable Initialization
    $('#CampusTable').DataTable({

        order: [[0, 'asc']],
        displayLength: 20,
        dom:
            // Datatable DOM positioning
            '<"row pb-2 pb-md-0"' +
            '<"col-md-2"<l>>' +
            '<"col-md-10"<"dt-action-buttons d-flex align-items-center justify-content-end flex-md-row flex-column gap-md-3 mb-3 mb-md-0"fB>>' +
            '>t' +
            '<"row"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
        lengthMenu: [20, 25, 30, 35],
        language: {
            sLengthMenu: '_MENU_',
            search: '',
            searchPlaceholder: 'Search Campus',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },
        // Buttons with Dropdown
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle me-4 waves-effect waves-light',
                text: '<i class="ri-download-line ri-16px me-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                    {
                        extend: 'print',
                        title: 'Campus Data',
                        text: '<i class="ri-printer-line me-1" ></i>Print',
                        className: 'dropdown-item',
                        customize: function (win) {
                            //customize print view for dark
                            $(win.document.body)
                                .css('color', config.colors.headingColor)
                                .css('border-color', config.colors.borderColor)
                                .css('background-color', config.colors.body);

                            $(win.document.body)
                                .find('table')
                                .addClass('compact')
                                .css('color', 'inherit')
                                .css('border-color', 'inherit')
                                .css('background-color', 'inherit');

                            // Center the title "Users Data"
                            $(win.document.body).find('h1').css('text-align', 'center');
                        },
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Campus Data',
                        text: '<i class="ri-file-text-line me-1" ></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Campus Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Campus Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Campus Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    }
                ]
            },
            {
                // For Create User Button (Add New )
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Campus</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createCampusOffcanvas'
                }
            }
        ],
        responsive: true,

    });


});

//Filter Form styles to default size after DataTable initialization
setTimeout(() => {
    $('.dataTables_filter input').addClass('ms-0');
    $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
    $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
}, 300);

// Get the Create for validation
const createNewCampusForm = document.getElementById('createCampusForm');
if (createNewCampusForm) {
    const fv = FormValidation.formValidation(createNewCampusForm, {
        fields: {
            'CampusVM.Campus.InstitutionID': {
                validators: { notEmpty: { message: 'Please select an Institution' } }
            },
            'CampusVM.Campus.ZoneID': {
                validators: { notEmpty: { message: 'Please select a Zone' } }
            },
            'CampusVM.Campus.CampuseName': {
                validators: {
                    notEmpty: { message: 'Please enter the Campus Name' },
                    stringLength: { max: 100, message: 'Campus Name must be less than 100 characters' }
                }
            },
            'CampusVM.Campus.AffiliationNo': {
                validators: {
                    notEmpty: { message: 'Please enter Affiliation No' },
                    stringLength: { max: 50, message: 'Affiliation No must be less than 50 characters' }
                }
            },
            'CampusVM.Campus.SchoolCode': {
                validators: {
                    notEmpty: { message: 'Please enter School Code' },
                    stringLength: { max: 50, message: 'School Code must be less than 50 characters' }
                }
            },
            'CampusVM.Campus.CampusTypeID': {
                validators: { notEmpty: { message: 'Please select a Campus Type' } }
            },
            'CampusVM.BoardingTypeIDs': {
                validators: { notEmpty: { message: 'Please select a Boarding Type' } }
            },
            'CampusVM.Campus.PhoneNos': {
                validators: {
                    notEmpty: { message: 'Please enter Phone Number(s)' },
                    stringLength: { max: 100, message: 'Phone Numbers must be less than 100 characters' }
                }
            },
            'CampusVM.Campus.Address': {
                validators: { stringLength: { max: 500, message: 'Address must be less than 500 characters' } }
            },
            'CampusVM.Campus.Locality': {
                validators: { stringLength: { max: 100, message: 'Locality must be less than 200 characters' } }
            },

            'CampusVM.Campus.PinCode': {
                validators: { stringLength: { max: 50, message: 'Pin Code must be less than 50 characters' } }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: 'is-valid',

                rowSelector: function (field, ele) {
                    return '.mb-5';
                }
            }),
            submitButton: new FormValidation.plugins.SubmitButton({
                button: '[type="submit"]'
            }),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
    })
        .on('core.form.valid', function () {
            console.log('Form validated, submitting');
            CreateNewCampusData(createNewCampusForm);
        })
        .on('core.form.invalid', function () {
            // if fields are invalid
            return;
        });
}

function CreateNewCampusData(form) {
    console.log('Submitting form');
    var formData = new FormData(form);
    console.log('Form data:', formData);
    $.ajax({
        url: '/Campus/Index?handler=CreateCampus',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Sending create AJAX request');
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Processing...',
                    text: 'Processing...',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    // allowEscapeKey: false,
                    didOpen: () => Swal.showLoading()
                });
            }
        },
        success: function (response) {
            console.log('Create AJAX success:', response);

            if (response.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Created Successfully',
                        text: response.message || 'Campus created successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {

                        $('#createCampusOffcanvas').offcanvas('hide');
                        window.location.reload();
                    });
                }
                else { window.location.reload(); }
            }
            else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'An error occurred while creating the campus.',
                        confirmButtonText: 'OK'
                    });
                }
            }

            //  Swal.close();
        },
        error: function (xhr, status, error) {
            //Swal.close();
            console.error('Create AJAX error:', { status, error, responseText: xhr.responseText });
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to create the Campus: ' + (xhr.responseText || error),
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

function showDeleteConfirmation(campusId) {
    //  event.preventDefault(); // prevent form submit
    debugger;
    const CampusName = document.querySelector(`.camp-name-full-${campusId}`).innerText;

    Swal.fire({
        title: 'Delete Campus Name',
        // Show the user the user name to be deleted
        html: `<p>Are you sure you want to delete Campus ?<br><br><span class="fw-medium text-danger">${CampusName}</span></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'btn btn-primary waves-effect waves-light me-3',
            cancelButton: 'btn btn-label-secondary waves-effect waves-light'
        }
    }).then(result => {
        if (result.isConfirmed) {
            DeleteCampusData(campusId);
        }
        else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${CampuseName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}
function DeleteCampusData(campusId) {
    debugger;
    $.ajax({
        url: '/Campus/Index?handler=DeleteCampus',
        type: 'POST',
        data: { id: campusId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            console.log('Sending delete AJAX request for ID:', campusId);
            Swal.fire({
                title: 'Processing...',
                text: '',
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            console.log('Delete AJAX success:', response);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted Successfully',
                    text: response.message || 'Campus deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${campusId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function') {
                            $('#CampusTable').DataTable().draw(false);
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the Zone.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Delete AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the Zone: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
function editCampus(campusId) {
    console.log('Edit button clicked for Campus ID:', campusId);
    $.ajax({
        url: '/Campus/Index?handler=EditCampusForm', // Keeping the original URL
        type: 'GET',
        data: { id: campusId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },

        success: function (response) {
            console.log('Edit campus form loaded successfully');
            $('#editFormContainer').html(response);
            $('#editCampusOffcanvas').offcanvas('show');
            //$('#editCampusOffcanvas').one('shown.bs.offcanvas', function () {
            //    initializeSelectPickers();

            //    // Ensure selectpicker is initialized
            //    const boardingTypeSelect = $(`#editBoardingTypeID_${campusId}`);
            //    if (boardingTypeSelect.length) {
            //        console.log(`[${new Date().toISOString()}] BoardingTypeID selectpicker refreshed for editBoardingTypeID_${campusId}`);
            //        console.log(`[${new Date().toISOString()}] Final selected values:`, boardingTypeSelect.val());
            //    }
            //});


            // Edit form change handlers
            $(`#editInstitutionID_${campusId}`).on('change', function () {
                const institutionId = $(this).val();
                loadZones(institutionId, campusId);
            });

            $(`#editCountryID_${campusId}`).on('change', function () {
                const countryId = $(this).val();
                loadStates(countryId, campusId);
            });

            $(`#editStateID_${campusId}`).on('change', function () {
                const stateId = $(this).val();
                loadCities(stateId, campusId);
            });


            Seclect2Initilizer();

            // Initialize FormValidation for the dynamically loaded edit form
            const editCampusForm = document.getElementById(`editCampusForm_${campusId}`);

            if (editCampusForm) {
                console.log('Edit campus form found, initializing FormValidation');
                FormValidation.formValidation(editCampusForm, {
                    fields: {
                        'CampusVM.Campus.InstitutionID': {
                            validators: { notEmpty: { message: 'Please select an Institution' } }
                        },
                        'CampusVM.Campus.ZoneID': {
                            validators: { notEmpty: { message: 'Please select a Zone' } }
                        },
                        'CampusVM.Campus.CampuseName': {
                            validators: {
                                notEmpty: { message: 'Please enter the Campus Name' },
                                stringLength: { max: 100, message: 'Campus Name must be less than 100 characters' }
                            }
                        },
                        'CampusVM.Campus.AffiliationNo': {
                            validators: {
                                notEmpty: { message: 'Please enter Affiliation No' },
                                stringLength: { max: 50, message: 'Affiliation No must be less than 50 characters' }
                            }
                        },
                        'CampusVM.Campus.SchoolCode': {
                            validators: {
                                notEmpty: { message: 'Please enter School Code' },
                                stringLength: { max: 50, message: 'School Code must be less than 50 characters' }
                            }
                        },
                        'CampusVM.Campus.CampusTypeID': {
                            validators: { notEmpty: { message: 'Please select a Campus Type' } }
                        },
                        'CampusVM.BoardingTypeIDs': {
                            validators: { notEmpty: { message: 'Please select a Boarding Type' } }
                        },
                        'CampusVM.Campus.PhoneNos': {
                            validators: {
                                notEmpty: { message: 'Please enter Phone Number(s)' },
                                stringLength: { max: 100, message: 'Phone Numbers must be less than 100 characters' }
                            }
                        },
                        'CampusVM.Campus.Address': {
                            validators: { stringLength: { max: 500, message: 'Address must be less than 500 characters' } }
                        },
                        'CampusVM.Campus.Locality': {
                            validators: { stringLength: { max: 100, message: 'Locality must be less than 200 characters' } }
                        },

                        'CampusVM.Campus.PinCode': {
                            validators: { stringLength: { max: 50, message: 'Pin Code must be less than 50 characters' } }
                        }
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap5: new FormValidation.plugins.Bootstrap5({
                            eleValidClass: 'is-valid',
                            rowSelector: function (field, ele) {
                                return '.mb-5';
                            }
                        }),
                        submitButton: new FormValidation.plugins.SubmitButton({
                            button: '[type="submit"]'
                        }),
                        autoFocus: new FormValidation.plugins.AutoFocus()
                    }
                })
                    .on('core.form.valid', function () {
                        console.log('Edit campus form valid, submitting');
                        UpdateNewCampusData(editCampusForm, campusId);
                    })
                    .on('core.form.invalid', function () {
                        console.log('Edit campus form invalid');
                    });
            } else {
                console.error('Edit campus form not found');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading edit campus form:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load the edit campus form. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function UpdateNewCampusData(form, campusId) {
    console.log('Edit campus form validated for Campus ID:', campusId);
    var formData = new FormData(form);

    console.log('Edit campus form data:', Array.from(formData.entries()));

    $.ajax({
        url: '/Campus/Index?handler=EditCampus', // Updated to match the original form submission URL
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Sending edit campus AJAX request');
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Processing...',
                    text: 'Processing...',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
            }
        },
        success: function (response) {
            console.log('Edit campus AJAX success:', response);

            if (response.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated Successfully',
                        text: response.message || 'Campus updated successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        $('#editCampusOffcanvas').offcanvas('hide');
                        window.location.reload();
                    });
                } else {
                    window.location.reload();
                }
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'An error occurred while creating the institution.',
                        confirmButtonText: 'OK'
                    });
                }
            }

            //  Swal.close();
        },
        error: function (xhr, status, error) {
            console.error('Edit campus AJAX error:', { status, error, responseText: xhr.responseText });
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to update the campus: ' + (xhr.responseText || error),
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

function Seclect2Initilizer()
{
    const select2 = $('.select2');
    // Default
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            select2Focus($this);
            $this.wrap('<div class="position-relative"></div>').select2({
                placeholder: 'Select Boarding Type',
                dropdownParent: $this.parent()
            });
        });
    }
}

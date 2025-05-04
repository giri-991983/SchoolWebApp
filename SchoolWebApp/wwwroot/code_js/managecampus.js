'use strict';



function loadZones(institutionId) {
    debugger;
    //const zoneSelect = document.getElementById("ZoneID");
    //zoneSelect.innerHTML = '<option value="">Loading...</option>';

    //fetch(`/Campus/CampusIndex?handler=ZonesByInstitution&institutionId=${institutionId}`)
    //    .then(response => response.json())
    //    .then(data => {
    //        zoneSelect.innerHTML = '<option value="">Select Zone</option>';
    //        data.forEach(zone => {
    //            const option = document.createElement("option");
    //            option.value = zone.zoneID;
    //            option.text = zone.zoneName;
    //            zoneSelect.appendChild(option);
    //        });
    //    })
    //    .catch(error => {
    //        console.error("Error loading zones:", error);
    //        zoneSelect.innerHTML = '<option value="">Error loading zones</option>';
    //    });


    $.ajax({
        url: '/Campus/Index?handler=LoadComponent',
        type: 'GET',
        data: { id: institutionId },
        success: function (response) {
            $('#ZoneID').html(response);
        }
    });

    //$.ajax({
    //    url: '/MasterData/LoadComponent',
    //    type: 'GET',
    //    data: { id: institutionId },
    //    success: function (response) {
    //        $('#ZoneID').html(response);
    //    }
    //});
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
const fv = FormValidation.formValidation(createNewCampusForm, {
    fields: {
        'Campus.InstitutionID': {
            validators: {
                notEmpty: { message: 'Please select an Institution' }
            }
        },
        'Campus.ZoneID': {
            validators: {
                notEmpty: { message: 'Please select a Zone' }
            }
        },
        'Campus.CGUID': {
            validators: {
                notEmpty: { message: 'Please enter a CGUID' },
                stringLength: {
                    min: 1,
                    max: 50,
                    message: 'CGUID must be between 1 and 50 characters'
                }
            }
        },
        'Campus.CampuseName': {
            validators: {
                notEmpty: { message: 'Please enter the Campus Name' },
                stringLength: {
                    min: 3,
                    max: 100,
                    message: 'Campus Name must be between 3 and 100 characters'
                }
            }
        },
        'Campus.AffiliationNo': {
            validators: {
                notEmpty: { message: 'Please enter Affiliation No' },
                stringLength: {
                    max: 50,
                    message: 'Affiliation No must be less than 50 characters'
                }
            }
        },
        'Campus.SchoolCode': {
            validators: {
                notEmpty: { message: 'Please enter School Code' },
                stringLength: {
                    max: 20,
                    message: 'School Code must be less than 20 characters'
                }
            }
        },
        'Campus.CampuseType': {
            validators: {
                notEmpty: { message: 'Please select Campus Type' }
            }
        },
        'Campus.PhoneNos': {
            validators: {
                notEmpty: { message: 'Please enter Phone Number(s)' },
                stringLength: {
                    max: 100,
                    message: 'Phone numbers must be less than 100 characters'
                }
            }
        },
        'Campus.Address': {
            validators: {
                stringLength: {
                    max: 200,
                    message: 'Address must be less than 200 characters'
                }
            }
        },
        'Campus.Locality': {
            validators: {
                stringLength: {
                    max: 100,
                    message: 'Locality must be less than 100 characters'
                }
            }
        },
        'Campus.PinCode': {
            validators: {
                stringLength: {
                    max: 50,
                    message: 'Pin Code must be less than 50 characters'
                }
            }
        },
        'Campus.Status': {
            validators: {
                notEmpty: { message: 'Please select a Status' }
            }
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
            // Specify the selector for your submit button
            button: '[type="submit"]'
        }),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus()
    }
})
    .on('core.form.valid', function () {
        // if fields are valid then
        // submitFormAndSetSuccessFlag(createNewUserForm, 'newUserFlag');
        CreateNewCampusData(createNewCampusForm)
    })
    .on('core.form.invalid', function () {
        // if fields are invalid
        return;
    });

function CreateNewCampusData(form) {
    debugger;
    console.log('Create form validated');
    var formData = new FormData(form);
    console.log('Create form data:', Array.from(formData.entries()));

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
                        text: response.message || 'An error occurred while creating the institution.',
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
                    text: 'Failed to create the institution: ' + (xhr.responseText || error),
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

function showDeleteConfirmation(campusId) {
    //  event.preventDefault(); // prevent form submit
    debugger;
    const CampusName = document.querySelector(`.inst-name-full-${campusId}`).innerText;

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



const EditCampusForm = document.getElementById('editCampusForm');

const fv122 = FormValidation.formValidation(EditCampusForm, {
    fields: {
        'Campus.InstitutionID': {
            validators: {
                notEmpty: { message: 'Please select an Institution' }
            }
        },
        'Campus.ZoneID': {
            validators: {
                notEmpty: { message: 'Please select a Zone' }
            }
        },
        'Campus.CGUID': {
            validators: {
                notEmpty: { message: 'Please enter a CGUID' },
                stringLength: {
                    min: 1,
                    max: 50,
                    message: 'CGUID must be between 1 and 50 characters'
                }
            }
        },
        'Campus.CampuseName': {
            validators: {
                notEmpty: { message: 'Please enter the Campus Name' },
                stringLength: {
                    min: 3,
                    max: 100,
                    message: 'Campus Name must be between 3 and 100 characters'
                }
            }
        },
        'Campus.AffiliationNo': {
            validators: {
                notEmpty: { message: 'Please enter Affiliation No' },
                stringLength: {
                    max: 50,
                    message: 'Affiliation No must be less than 50 characters'
                }
            }
        },
        'Campus.SchoolCode': {
            validators: {
                notEmpty: { message: 'Please enter School Code' },
                stringLength: {
                    max: 20,
                    message: 'School Code must be less than 20 characters'
                }
            }
        },
        'Campus.CampuseType': {
            validators: {
                notEmpty: { message: 'Please select Campus Type' }
            }
        },
        'Campus.PhoneNos': {
            validators: {
                notEmpty: { message: 'Please enter Phone Number(s)' },
                stringLength: {
                    max: 100,
                    message: 'Phone numbers must be less than 100 characters'
                }
            }
        },
        'Campus.Address': {
            validators: {
                stringLength: {
                    max: 200,
                    message: 'Address must be less than 200 characters'
                }
            }
        },
        'Campus.Locality': {
            validators: {
                stringLength: {
                    max: 100,
                    message: 'Locality must be less than 100 characters'
                }
            }
        },
        'Campus.PinCode': {
            validators: {
                stringLength: {
                    max: 50,
                    message: 'Pin Code must be less than 50 characters'
                }
            }
        },
        'Campus.Status': {
            validators: {
                notEmpty: { message: 'Please select a Status' }
            }
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
            // Specify the selector for your submit button
            button: '[type="submit"]'
        }),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus()
    }
})
    .on('core.form.valid', function () {

        UpdateNewCampusData(EditCampusForm)
    })
    .on('core.form.invalid', function () {
        return;
    });

function UpdateNewCampusData(form) {
    debugger;
    console.log('Create form validated');
    var formData = new FormData(form);
    console.log('Create form data:', Array.from(formData.entries()));

    $.ajax({
        url: '/Campus/Index?handler=EditCampus',
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
                        title: 'Updated Successfully',
                        text: response.message || 'Campus Updated successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {

                        $('#editCampusOffcanvas_').offcanvas('hide');
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
                        text: response.message || 'An error occurred while creating the Campus.',
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





































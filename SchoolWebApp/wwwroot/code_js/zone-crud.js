'use strict';

// Zone DataTable initialization
$(document).ready(function () {
    $('#ZoneTable').DataTable({
        order: [[1, 'asc']],
        displayLength: 20,
        dom:
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
            searchPlaceholder: 'Search Zone',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle me-4 waves-effect waves-light',
                text: '<i class="ri-download-line ri-16px me-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                    {
                        extend: 'print',
                        title: 'Zone Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Zone Data',
                        text: '<i class="ri-file-text-line me-1"></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Zone Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Zone Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Zone Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
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
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Zone</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                action: function () {
                    var offcanvas = document.getElementById('createZoneOffcanvas');
                    var bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
                    bsOffcanvas.show();
                }
            }
        ],
        responsive: true
    });
   
});

// Filter Form styles to default size after DataTable initialization
setTimeout(() => {
    $('.dataTables_filter input').addClass('ms-0');
    $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
    $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
}, 300);
function FilterZones() {

    /*   $('#filterButton').on('click', function () {*/
    var institutionId = $('#InstitutionID').val();

   
    $.ajax({
        url: '/Zone/Index?handler=ZonesByInstitution',
        type: 'GET',
        data: { institutionId: institutionId },
        success: function (partialView) {
           
            $('#ZoneTable tbody').html(partialView);
        },
        error: function () {
            alert('Failed to load zone data.');
        }
    });
}
// Get the Create form for validation
const createZoneForm = document.getElementById('createZoneForm');

// Initialize FormValidation for create zone form
const fv = FormValidation.formValidation(createZoneForm, {
    fields: {
        'Zone.InstitutionID': {
            validators: {
                notEmpty: { message: 'Please select an Institution' }
            }
        },
        'Zone.ZoneName': {
            validators: {
                notEmpty: { message: 'Please enter a Zone Name' },
                stringLength: { min: 1, max: 100, message: 'The Zone Name must be between 1 and 100 characters' }
            }
        },
        'Zone.ShortCode': {
            validators: {
                stringLength: { max: 10, message: 'The Short Code must be less than 10 characters' }
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
            button: '[type="submit"]'
        }),
        autoFocus: new FormValidation.plugins.AutoFocus()
    }
})
    .on('core.form.valid', function () {
        CreateNewZoneData(createZoneForm);
    })
    .on('core.form.invalid', function () {
        return;
    });

function CreateNewZoneData(form) {
    console.log('Create form validated');
    var formData = new FormData(form);
    console.log('Create form data:', Array.from(formData.entries()));

    $.ajax({
        url: '/Zone/Index?handler=CreateZone',
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
                        text: response.message || 'Zone created successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        $('#createZoneOffcanvas').offcanvas('hide');
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
                        text: response.message || 'An error occurred while creating the zone.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        },
        error: function (xhr, status, error) {
            console.error('Create AJAX error:', { status, error, responseText: xhr.responseText });
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to create the zone: ' + (xhr.responseText || error),
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

function showDeleteConfirmation(zoneId) {

    const ZoneName = document.querySelector(`.zone-name-full-${zoneId}`).innerText;
    Swal.fire({
        title: 'Delete Zone Name',
        html: `<p>Are you sure you want to delete Zone?<br><br><span class="fw-medium text-danger">${ZoneName}</span></p>`,
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
            DeleteZoneData(zoneId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${ZoneName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}

function DeleteZoneData(zoneId) {
    $.ajax({
        url: '/Zone/Index?handler=DeleteZone',
        type: 'POST',
        data: { id: zoneId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            console.log('Sending delete AJAX request for ID:', zoneId);
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
                    text: response.message || 'Zone deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${zoneId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function') {
                            $('#ZoneTable').DataTable().draw(false);
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the zone.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Delete AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the zone: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function editZone(zoneId) {
    console.log('Edit button clicked for Zone ID:', zoneId);
    $.ajax({
        url: '/Zone/Index?handler=EditZoneForm',
        type: 'GET',
        data: { id: zoneId },
        success: function (response) {
            console.log('Edit form loaded successfully');
            $('#editFormContainer').html(response);
            $('#editZoneOffcanvas').offcanvas('show');

            // Initialize FormValidation for the dynamically loaded edit form
            const editZoneForm = document.getElementById('editZoneForm');
            if (editZoneForm) {
                console.log('Edit form found, initializing FormValidation');
                FormValidation.formValidation(editZoneForm, {
                    fields: {
                        'Zone.InstitutionID': {
                            validators: {
                                notEmpty: { message: 'Please select an Institution' }
                            }
                        },
                        'Zone.ZoneName': {
                            validators: {
                                notEmpty: { message: 'Please enter a Zone Name' },
                                stringLength: { min: 1, max: 100, message: 'The Zone Name must be between 1 and 100 characters' }
                            }
                        },
                        'Zone.ShortCode': {
                            validators: {
                                stringLength: { max: 10, message: 'The Short Code must be less than 10 characters' }
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
                            button: '[type="submit"]'
                        }),
                        autoFocus: new FormValidation.plugins.AutoFocus()
                    }
                })
                    .on('core.form.valid', function () {
                        console.log('Edit form valid, submitting');
                        UpdateZoneData(editZoneForm, zoneId);
                    })
                    .on('core.form.invalid', function () {
                        console.log('Edit form invalid');
                    });
            } else {
                console.error('Edit form not found');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading edit form:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load the edit form. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    });
}

function UpdateZoneData(form) {
    console.log('Edit form validated');
    var formData = new FormData(form);
    console.log('Edit form data:', Array.from(formData.entries()));

    $.ajax({
        url: '/Zone/Index?handler=EditZone',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Sending edit AJAX request');
            Swal.fire({
                title: 'Processing...',
                text: 'Processing...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            console.log('Edit AJAX success:', response);
            if (response.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated Successfully',
                        text: response.message || 'Zone updated successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        $('#editZoneOffcanvas').offcanvas('hide');
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
                        text: response.message || 'An error occurred while updating the zone.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        },
        error: function (xhr, status, error) {
            console.error('Edit AJAX error:', { status, error, responseText: xhr.responseText });
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to update the zone: ' + (xhr.responseText || error),
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}
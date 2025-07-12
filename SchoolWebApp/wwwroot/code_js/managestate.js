

'use strict';


  

    // create form validation
    const createStateForm = document.getElementById('addStateForm');
    if (createStateForm) {
        FormValidation.formValidation(createStateForm, {
            fields: {
                'State.StateName': {
                    validators: {
                        notEmpty: { message: 'Please enter the State Name' },
                        stringLength: {
                            max: 100,
                            message: 'State Name must be less than 100 characters'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'State name must not contain special characters or numbers'
                        }
                    }
                },
                'State.CountryID': {
                    validators: {
                        notEmpty: { message: 'Please select a Country' }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: 'is-valid',
                    eleInvalidClass: 'is-invalid',
                    rowSelector: '.form-floating'
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus()
            }
        })
            .on('core.form.valid', function () {
                CreateState(createStateForm);
            })
             .on('core.form.invalid', function () {
                 return;
             });
    }

   
   


function initializeStateDataTable() {
    if (!$('#StateTable').length) return;

    if ($.fn.DataTable.isDataTable('#StateTable')) {
        $('#StateTable').DataTable().destroy();
    }

    $('#StateTable').DataTable({
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
            searchPlaceholder: 'Search State',
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
                        title: 'State Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'csv',
                        title: 'State Data',
                        text: '<i class="ri-file-text-line me-1"></i>CSV',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'excel',
                        title: 'State Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'pdf',
                        title: 'State Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>PDF',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'copy',
                        title: 'State Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add State</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createStateOffcanvas'
                },
                action: function () {
                    $('#addStateForm')[0].reset();
                    $('#StateName').removeClass('is-valid is-invalid').next('.text-danger').text('').hide();
                    $('#CountryID').removeClass('is-valid is-invalid').next('.text-danger').text('').hide();
                    $('#stateNameValidationMessage').text('').hide();
                }
            }
        ],
        responsive: true
    });

    setTimeout(() => {
        $('.dataTables_filter input').addClass('ms-0');
        $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
        $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
    }, 300);
}
$(document).ready(function () {
    const stateFilterForm = document.getElementById('filterForm');

    if (stateFilterForm) {
        FormValidation.formValidation(stateFilterForm, {
            fields: {
                CountryID: {
                    validators: {
                        notEmpty: { message: 'Please select a Country.' }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: 'is-valid',

                    rowSelector: '.form-floating'
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus()
            }
        })
            .on('core.form.valid', function () {
                filterStates(stateFilterForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    } else {
        console.error('boardFilterForm not found');
    }

    $('#CountryID').on('change', function () {
        $('#FilterTable').hide();
    });
});

function filterStates(form) {
    const countryId = form.querySelector('#CountryID').value;

    $.ajax({
        url: '/MasterPages/State/Index?handler=StatesByCountry',
        type: 'GET',
        data: { countryId: countryId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        success: function (partialView) {
            Swal.close();
            $('#FilterTable').html(partialView).show();
            if ($('#StateTable').length) {
                initializeStateDataTable();
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load states: ' + (xhr.responseText || error || 'Unknown error')
            });
        }
    });
}

function CreateState(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/State/Index?handler=CreateState',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Processing...',
                text: 'Saving State...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Created Successfully',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $('#createStateOffcanvas').offcanvas('hide');
                    filterStates(document.getElementById('filterForm'));
                });
            } else {
                // Field-level validation for duplicate state name
                if (response.message && response.message.includes('already exists')) {
                    $('#StateName').removeClass('is-valid').addClass('is-invalid');
                    $('#stateNameValidationMessage').text(response.message).show();
                } else {
                    Swal.fire({
                        icon: response.message?.toLowerCase().includes('exists') ? 'warning' : 'error',
                        title: response.message?.toLowerCase().includes('exists') ? 'Warning' : 'Error',
                        text: response.message || 'Failed to create state.'
                    });
                }
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to create the state: ' + (xhr.responseText || error)
            });
        }
    });
}

function editState(stateId) {
    $.ajax({
        url: '/MasterPages/State/Index?handler=EditForm',
        type: 'GET',
        data: { id: stateId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching state details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (typeof response === 'string') {
                $('#editStateFormContainer').html(response);
                // Clear any existing validation classes
                $('#EditStateName').removeClass('is-valid is-invalid');
                $('#EditCountryID').removeClass('is-valid is-invalid');
                $('#editStateNameValidationMessage').text('').hide();
                const editForm = document.getElementById('editStateForm');
                if (editForm) {
                    FormValidation.formValidation(editForm, {
                        fields: {
                            'StateName': {
                                validators: {
                                    notEmpty: { message: 'State name is required' },
                                    stringLength: {
                                        max: 100,
                                        message: 'State name must be less than 100 characters'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z\s]+$/,
                                        message: 'State name must not contain special characters or numbers'
                                    }
                                }
                            },
                            'CountryID': {
                                validators: {
                                    notEmpty: { message: 'Please select a Country' }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap5: new FormValidation.plugins.Bootstrap5({
                                eleValidClass: 'is-valid',
                                eleInvalidClass: 'is-invalid',
                                rowSelector: '.form-floating'
                            }),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            autoFocus: new FormValidation.plugins.AutoFocus()
                        }
                    }).on('core.form.valid', function () {
                        submitEditState(editForm);
                    });
                }
                $('#editStateOffcanvas').offcanvas('show');
            } else {
                Swal.fire('Error', 'Failed to load the form.', 'error');
            }
        },
        error: function (xhr) {
            Swal.close();
            Swal.fire('Error', 'Failed to load the form: ' + (xhr.responseText || 'Unknown error'), 'error');
        }
    });
}

function submitEditState(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/State/Index?handler=EditState',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Processing...',
                text: 'Saving changes...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (response.success) {
                $('#editStateOffcanvas').offcanvas('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: response.message || 'State updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    filterStates(document.getElementById('filterForm'));
                });
            } else {
                // Field-level validation for duplicate state name
                if (response.message && response.message.includes('already exists')) {
                    $('#EditStateName').removeClass('is-valid').addClass('is-invalid');
                    $('#editStateNameValidationMessage').text(response.message).show();
                } else {
                    Swal.fire({
                        icon: response.message?.toLowerCase().includes('exists') ? 'warning' : 'error',
                        title: response.message?.toLowerCase().includes('exists') ? 'Warning' : 'Error',
                        text: response.message || 'Failed to update state.'
                    });
                }
            }
        },
        error: function (xhr) {
            Swal.close();
            Swal.fire('Error', 'Failed to update state: ' + (xhr.responseText || 'Unknown error'), 'error');
        }
    });
}

function showDeleteStateConfirmation(stateId) {
    const stateName = document.querySelector(`.state-name-${stateId}`)?.innerText || 'this state';

    Swal.fire({
        title: 'Delete State',
        html: `<p>Are you sure you want to delete this State?<br><br><span class="fw-medium text-danger">${stateName}</span></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'btn btn-danger me-3',
            cancelButton: 'btn btn-outline-secondary'
        }
    }).then(result => {
        if (result.isConfirmed) {
            deleteStateData(stateId);
        }
    });
}

function deleteStateData(stateId) {
    $.ajax({
        url: '/MasterPages/State/Index?handler=DeleteState',
        type: 'POST',
        data: { id: stateId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Processing...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted Successfully',
                    text: response.message || 'State deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${stateId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if ($.fn.DataTable && $('#StateTable').length) {
                            $('#StateTable').DataTable().draw(false);
                        }
                        filterStates(document.getElementById('filterForm'));
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the state.'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the state: ' + (xhr.responseText || error)
            });
        }
    });
}


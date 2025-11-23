'use strict';
$(document).ready(function () {
    initializeCountryDataTable();

    const createCountryForm = document.getElementById('addCountryForm');
    if (createCountryForm) {
        FormValidation.formValidation(createCountryForm, {
            fields: {
                'Country.CountryName': {
                    validators: {
                        notEmpty: { message: 'Please enter the Country Name' },
                        stringLength: {
                            max: 100,
                            message: 'Country Name must be less than 100 characters'
                        }, regexp: {
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'Country name must not contain special characters or numbers'
                        }
                    }
                },
                'Country.CurrencyCode': {
                    validators: {
                        stringLength: {
                            max: 3,
                            message: 'Currency Code must be at most 3 characters'
                        },
                        regexp: {
                            regexp: /^[A-Z]{0,3}$/,
                            message: 'Use uppercase currency code (e.g., USD)'
                        }
                    }
                },
                'Country.CurrencyDecimal': {
                    validators: {
                        digits: { message: 'Currency Decimal must be a number ' },
                        lessThan: {
                            value: 5,
                            inclusive: true,
                            message: 'Currency Decimal should be 0–4'
                        }
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
                CreateCountry(createCountryForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    }
});

function CreateCountry(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/Country/Index?handler=CreateCountry',
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
                text: 'Saving Country...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Created Successfully',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    window.location.reload();
                });
            } else {
                if (response.message && response.message.toLowerCase().includes('already exists')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: response.message || 'This country already exists.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-warning waves-effect waves-light'
                        }
                    });
                }
                else {
                    // Generic error fallback
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Failed to update country.',
                        confirmButtonText: 'OK'
                    });
                }


            }
        },
        error: function (xhr, status, error) {
            const errorMsg = xhr.responseText || error;
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to create the country: ' + errorMsg,
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            });

            $('#countryValidationMessage').text('Failed to create the country: ' + errorMsg).show();
            $('#CountryName').addClass('is-invalid');
        }
    });
}
// Show confirmation dialog for deleting a Country
function showDeleteCountryConfirmation(countryId) {
    const countryName = document.querySelector(`.country-name-${countryId}`)?.innerText || 'this country';

    Swal.fire({
        title: 'Delete Country',
        html: `<p>Are you sure you want to delete this Country?<br><br><span class="fw-medium text-danger">${countryName}</span></p>`,
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
            deleteCountryData(countryId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${countryName}</span> is not deleted!</p>`,
                icon: 'info',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            });
        }
    });
}

// Perform the actual AJAX delete request
function deleteCountryData(countryId) {
    $.ajax({
        url: '/MasterPages/Country/Index?handler=DeleteCountry',
        type: 'POST',
        data: { id: countryId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Processing...',
                text: '',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted Successfully',
                    text: response.message || 'Country deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Remove row from DataTable
                    $(`tr[data-id="${countryId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if ($.fn.DataTable && $('#CountryTable').length) {
                            $('#CountryTable').DataTable().draw(false);
                        }
                        window.location.reload();
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the country.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the country: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
function editCountry(countryId) {
    $.ajax({
        url: '/MasterPages/Country/Index?handler=EditForm',
        type: 'GET',
        data: { id: countryId },
        headers: {
            RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching country details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();

            if (typeof response === 'string') {
                $('#editCountryFormContainer').html(response);
                const editForm = document.getElementById('editCountryForm');


                if (editForm) {
                    FormValidation.formValidation(editForm, {
                        fields: {
                            'Country.CountryName': {
                                validators: {
                                    notEmpty: { message: 'Country name is required' },
                                    stringLength: {
                                        max: 100,
                                        message: 'Country name must be less than 100 characters'
                                    }, regexp: {
                                        regexp: /^[a-zA-Z\s]+$/,
                                        message: 'Country name must not contain special characters or numbers'
                                    }
                                }
                            },
                            'Country.CurrencyCode': {
                                validators: {
                                    stringLength: {
                                        max: 3,
                                        message: 'Currency code must be at most 3 characters'
                                    },
                                    regexp: {
                                        regexp: /^[A-Z]{0,3}$/,
                                        message: 'Use uppercase currency code (e.g., USD)'
                                    }
                                }
                            },
                            'Country.CurrencyDecimal': {
                                validators: {
                                    digits: { message: 'Currency Decimal must be digits' },
                                    lessThan: {
                                        value: 5,
                                        inclusive: true,
                                        message: 'Decimal should be between 0–4'
                                    }
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
                            submitEditCountry(editForm);
                        });
                }

                $('#editCountryOffcanvas').offcanvas('show');
            }
        },
        error: function () {
            Swal.fire('Error', 'Failed to load the form.', 'error');
        }
    });
}

function submitEditCountry(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/Country/Index?handler=EditCountry',
        type: 'POST',
        data: formData,
        headers: {
            RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        processData: false,
        contentType: false,
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
                $('#editCountryOffcanvas').offcanvas('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: response.message || 'Country updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });
            } else {
                if (response.message && response.message.toLowerCase().includes('already exists')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: response.message || 'This country already exists.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-warning waves-effect waves-light'
                        }
                    });


                } else {
                    // Generic error fallback
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Failed to update country.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        },
        error: function (xhr) {
            Swal.fire('Error', 'Failed to update country: ' + xhr.responseText, 'error');
        }
    });
}

function initializeCountryDataTable() {
    if (!$('#CountryTable').length) {
        console.error('Error: #CountryTable element not found in the DOM');
        return;
    }

    if ($.fn.DataTable.isDataTable('#CountryTable')) {
        $('#CountryTable').DataTable().destroy();
    }

    $('#CountryTable').DataTable({
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
            searchPlaceholder: 'Search Country',
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
                        title: 'Country Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        customize: function (win) {
                            $(win.document.body)
                                .css('color', '#000')
                                .css('border-color', '#ccc')
                                .css('background-color', '#fff');

                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('color', 'inherit')
                                .css('border-color', 'inherit')
                                .css('background-color', 'inherit');

                            $(win.document.body).find('h1').css('text-align', 'center');
                        },
                        exportOptions: {
                            columns: [1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Country Data',
                        text: '<i class="ri-file-text-line me-1"></i>CSV',
                        className: 'dropdown-item',
                        exportOptions: { columns: [1, 2, 3, 4] }
                    },
                    {
                        extend: 'excel',
                        title: 'Country Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: { columns: [1, 2, 3, 4] }
                    },
                    {
                        extend: 'pdf',
                        title: 'Country Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>PDF',
                        className: 'dropdown-item',
                        exportOptions: { columns: [1, 2, 3, 4] }
                    },
                    {
                        extend: 'copy',
                        title: 'Country Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: { columns: [1, 2, 3, 4] }
                    }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Country</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createCountryOffcanvas'
                },
                action: function () {
                    $('#addCountryForm')[0].reset();
                    $('#countryValidationMessage').text('').hide();
                }
            }
        ],
        responsive: true
    });

    // Apply additional styles
    setTimeout(() => {
        $('.dataTables_filter input').addClass('ms-0');
        $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
        $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
    }, 300);
}
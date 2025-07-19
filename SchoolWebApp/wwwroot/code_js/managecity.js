'use strict';

const cityFilterForm = document.getElementById('filterForm');

if (cityFilterForm) {
    FormValidation.formValidation(cityFilterForm, {
        fields: {
            CountryID: {
                validators: {
                    notEmpty: { message: 'Please select a Country.' }
                }
            },
            StateID: {
                validators: {
                    notEmpty: { message: 'Please select a State.' }
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
            filterCities(cityFilterForm);
        })
        .on('core.form.invalid', function () {
            return;
        });
} else {
    console.error('cityFilterForm not found');
}

function loadStates(countryId, targetStateId = 'StateID') {
    const $stateSelect = $(`#${targetStateId}`);

    if (!countryId || countryId <= 0) {
        $stateSelect.html('<option value="">Select State</option>').prop('disabled', true);
        return;
    }

    $.ajax({
        url: '/MasterPages/City/Index?handler=StatesByCountry',
        type: 'GET',
        data: { countryId: countryId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        success: function (response) {
            $stateSelect.html(response).prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading states:', error);
            $stateSelect.html('<option value="">Error loading states</option>').prop('disabled', true);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load states: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function initializeCityDataTable() {
    if (!$('#CityTable').length) return;

    if ($.fn.DataTable.isDataTable('#CityTable')) {
        $('#CityTable').DataTable().destroy();
    }

    $('#CityTable').DataTable({
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
            searchPlaceholder: 'Search City',
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
                        title: 'City Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'csv',
                        title: 'City Data',
                        text: '<i class="ri-file-text-line me-1"></i>CSV',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'excel',
                        title: 'City Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'pdf',
                        title: 'City Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>PDF',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    },
                    {
                        extend: 'copy',
                        title: 'City Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: { columns: [0, 1, 2] }
                    }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add City</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createCityOffcanvas'
                },
                action: function () {
                    $('#addCityForm')[0].reset();
                    $('#CityName').removeClass('is-valid is-invalid').next('.text-danger').text('').hide();
                    $('#StateID').removeClass('is-valid is-invalid').next('.text-danger').text('').hide();
                    $('#cityNameValidationMessage').text('').hide();
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
    const createCityForm = document.getElementById('addCityForm');
    if (createCityForm) {
        FormValidation.formValidation(createCityForm, {
            fields: {
                'City.CityName': {
                    validators: {
                        notEmpty: { message: 'Please enter the City Name' },
                        stringLength: {
                            max: 100,
                            message: 'City Name must be less than 100 characters'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'City name must not contain special characters or numbers'
                        }
                    }
                },
                'City.StateID': {
                    validators: {
                        notEmpty: { message: 'Please select a State' }
                    }
                },
                'City.CountryID': {
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
                CreateCity(createCityForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    } else {
        console.error('addCityForm not found');
    }

   
    // Hide table when Country or State is not selected
    $('#CountryFilterID, #StateID').on('change', function () {
        
            $('#FilterTable').hide();
        
    });

    // On page load, hide if country or state is not selected
    const initialCountry = $('#CountryFilterID').val();
    const initialState = $('#StateID').val();
    if (!initialCountry || !initialState) {
        $('#FilterTable').hide();
    }

});
function filterCities(form) {
    const countryId = form.querySelector('#CountryFilterID').value ;
    const stateId = form.querySelector('#StateID').value;

    if (!countryId || !stateId) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Selection',
            text: 'Please select both Country and State before filtering.'
        });
        return;
    }

    $.ajax({
        url: '/MasterPages/City/Index?handler=CitiesByState',
        type: 'GET',
        data: { countryId: countryId, stateId: stateId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        success: function (partialView) {
            Swal.close();
            $('#FilterTable').html(partialView).show();
            if ($('#CityTable').length) {
                initializeCityDataTable();
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load cities: ' + (xhr.responseText || error || 'Unknown error')
            });
        }
    });
}

function CreateCity(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/City/Index?handler=CreateCity',
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
                text: 'Saving City...',
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
                    $('#createCityOffcanvas').offcanvas('hide');
                    $('#addCityForm')[0].reset();
                 
                    filterCities(document.getElementById('filterForm'));
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message ,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light me-3',
                        cancelButton: 'btn btn-label-secondary waves-effect waves-light'
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to create the city: ' + (xhr.responseText || error)
            });
        }
    });
}

function editCity(cityId) {
    $.ajax({
        url: '/MasterPages/City/Index?handler=EditForm',
        type: 'GET',
        data: { id: cityId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching city details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (typeof response === 'string') {
                $('#editCityFormContainer').html(response);
                $('#EditCityName_' + cityId).removeClass('is-valid is-invalid');
                $('#EditStateID_' + cityId).removeClass('is-valid is-invalid');
                $('#editCityNameValidationMessage_' + cityId).text('').hide();
                const editForm = document.getElementById('editCityForm');
                if (editForm) {
                    $(`#EditCountryID_${cityId}`).on('change', function () {
                        const countryId = $(this).val();
                        loadStates(countryId, cityId);
                    });
                    FormValidation.formValidation(editForm, {
                        fields: {
                            CityName: {
                                validators: {
                                    notEmpty: { message: 'City name is required' },
                                    stringLength: {
                                        max: 100,
                                        message: 'City name must be less than 100 characters'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z\s]+$/,
                                        message: 'City name must not contain special characters or numbers'
                                    }
                                }
                            },
                            StateID: {
                                validators: {
                                    notEmpty: { message: 'Please select a State' }
                                }
                            },
                            CountryID: {
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
                        submitEditCity(editForm);
                    });
                }
                $('#editCityOffcanvas').offcanvas('show');
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

function submitEditCity(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/City/Index?handler=EditCity',
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
                $('#editCityOffcanvas').offcanvas('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: response.message || 'City updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    filterCities(document.getElementById('filterForm'));
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to update City',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light me-3',
                        cancelButton: 'btn btn-label-secondary waves-effect waves-light'
                    }
                });
            }
        },
        error: function (xhr) {
            Swal.close();
            Swal.fire('Error', 'Failed to update city: ' + (xhr.responseText || 'Unknown error'), 'error');
        }
    });
}

function showDeleteCityConfirmation(cityId) {
    const cityName = document.querySelector(`.city-name-${cityId}`)?.innerText || 'this city';

    Swal.fire({
        title: 'Delete City',
        html: `<p>Are you sure you want to delete this City?<br><br><span class="fw-medium text-danger">${cityName}</span></p>`,
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
            deleteCityData(cityId);
        }
    });
}

function deleteCityData(cityId) {
    $.ajax({
        url: '/MasterPages/City/Index?handler=DeleteCity',
        type: 'POST',
        data: { id: cityId },
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
                    text: response.message || 'City deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${cityId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if ($.fn.DataTable && $('#CityTable').length) {
                            $('#CityTable').DataTable().draw(false);
                        }
                        filterCities(document.getElementById('filterForm'));
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the city.'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the city: ' + (xhr.responseText || error)
            });
        }
    });
}
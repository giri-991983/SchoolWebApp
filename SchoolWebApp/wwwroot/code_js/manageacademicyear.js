'use strict';

$(document).ready(function () {
    initializeDataTable();

    const createAcademicYearForm = document.getElementById('addAcademicYearForm');
    if (createAcademicYearForm) {
        FormValidation.formValidation(createAcademicYearForm, {
            fields: {
                AcademicYear: {
                    validators: {
                        notEmpty: { message: 'Please enter an Academic Year' },
                        stringLength: { max: 50, message: 'The Academic Year must be less than 50 characters' },
                        regexp: { regexp: /^\d{4}-\d{4}$/, message: 'Academic Year must be in the format "YYYY-YYYY" (e.g., 2025-2026)' },
                        callback: {
                            message: 'Academic Year must be a range between 1900 and 2100 with start year less than end year.',
                            callback: function (input) {
                                const years = input.value.split('-');
                                const startYear = parseInt(years[0]);
                                const endYear = parseInt(years[1]);
                                return startYear >= 1900 && endYear <= 2100 && startYear < endYear;
                            }
                        }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: 'is-valid',
                    rowSelector: '.mb-3'
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus()
            }
        })
            .on('core.form.valid', function () {
                CreateNewAcademicYearData(createAcademicYearForm);
            });
    }
});

function initializeDataTable() {
    if (!$('#AcademicYearTable').length) {
        console.error('Error: #AcademicYearTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#AcademicYearTable')) {
        $('#AcademicYearTable').DataTable().destroy();
    }
    $('#AcademicYearTable').DataTable({
        order: [[0, 'asc']],
        displayLength: 20,
        dom: '<"row pb-2 pb-md-0"<"col-md-2"<l>><"col-md-10"<"dt-action-buttons d-flex align-items-center justify-content-end flex-md-row flex-column gap-md-3 mb-3 mb-md-0"fB>>>' +
            't<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [20, 25, 30, 35],
        language: {
            sLengthMenu: '_MENU_',
            search: '',
            searchPlaceholder: 'Search Academic Year',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },
        buttons: [
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Academic Year</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                action: function () {
                    var modal = document.getElementById('addAcademicYearModal');
                    var bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                    $('#addAcademicYearForm')[0].reset();
                    $('#academicYearValidationMessage').text('').hide();
                    $('#academicYear').removeClass('is-invalid');
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

function CreateNewAcademicYearData(form) {
    var formData = new FormData(form);
    // Explicitly map the input field to match server-side model binding
    var academicYearValue = form.querySelector('#academicYear').value;
    formData.set('AcademicYear.AcademicYear', academicYearValue);
    formData.delete('AcademicYear'); // Remove the original field to avoid conflicts

    $.ajax({
        url: '/MasterPages/AcademicYears/Index?handler=CreateAcademicYear',
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
                text: 'Processing...',
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
                    $('#addAcademicYearModal').modal('hide');
                    window.location.reload();
                });
            } else {
                var errorMessage = response.message || 'An error occurred while creating the academic year.';
                if (response.errors && Array.isArray(response.errors)) {
                    errorMessage = response.errors.join(', ');
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    }
                });
                $('#academicYearValidationMessage').text(errorMessage).show();
                $('#academicYear').addClass('is-invalid');
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to create the academic year: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            });
            $('#academicYearValidationMessage').text('Failed to create the academic year: ' + (xhr.responseText || error)).show();
            $('#academicYear').addClass('is-invalid');
        }
    });
}

function academicYearEdit(academicYearId) {
    $.ajax({
        url: '/MasterPages/AcademicYears/Index?handler=EditAcademicYearForm',
        type: 'GET',
        data: { academicYearId: academicYearId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching Academic Year details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (typeof response === 'string') {
                $('#editAcademicYearFormContainer').html(response);
                $('#editAcademicYearModal').modal('show');

                const editAcademicYearForm = document.getElementById('editAcademicYearForm');
                if (editAcademicYearForm) {
                    FormValidation.formValidation(editAcademicYearForm, {
                        fields: {
                            'AcademicYear.AcademicYear': {
                                validators: {
                                    notEmpty: { message: 'Please enter an Academic Year' },
                                    stringLength: { max: 50, message: 'The Academic Year must be less than 50 characters' },
                                    regexp: { regexp: /^\d{4}-\d{4}$/, message: 'Academic Year must be in the format "YYYY-YYYY" (e.g., 2025-2026)' },
                                    callback: {
                                        message: 'Academic Year must be a range between 1900 and 2100 with start year less than end year.',
                                        callback: function (input) {
                                            const years = input.value.split('-');
                                            const startYear = parseInt(years[0]);
                                            const endYear = parseInt(years[1]);
                                            return startYear >= 1900 && endYear <= 2100 && startYear < endYear;
                                        }
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap5: new FormValidation.plugins.Bootstrap5({
                                eleValidClass: 'is-valid',
                                rowSelector: '.mb-3'
                            }),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            autoFocus: new FormValidation.plugins.AutoFocus()
                        }
                    })
                        .on('core.form.valid', function () {
                            UpdateAcademicYearData(editAcademicYearForm, academicYearId);
                        });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to load the edit form.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load the edit form: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            });
        }
    });
}

function UpdateAcademicYearData(form, academicYearId) {
    var formData = new FormData(form);
    $.ajax({
        url: '/MasterPages/AcademicYears/Index?handler=EditAcademicYear',
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
                text: 'Processing...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated Successfully',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $('#editAcademicYearModal').modal('hide');
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'An error occurred while updating the academic year.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    }
                });
                $('#editacademicYearValidationMessage').text(response.message || 'An error occurred while updating the academic year.').show();
                $('#editAcademicYear').addClass('is-invalid');
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to update the academic year: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            });
            $('#editacademicYearValidationMessage').text('Failed to update the academic year: ' + (xhr.responseText || error)).show();
            $('#editAcademicYear').addClass('is-invalid');
        }
    });
}

function showDeleteConfirmation(academicYearId) {
    const academicYear = document.querySelector(`.academicyear-name-full-${academicYearId}`)?.innerText || 'this academic year';
    Swal.fire({
        title: 'Delete Academic Year',
        html: `<p>Are you sure you want to delete <span class="fw-medium text-danger">${academicYear}</span>?</p>`,
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
            DeleteAcademicYearData(academicYearId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${academicYear}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}

function DeleteAcademicYearData(academicYearId) {
    $.ajax({
        url: '/MasterPages/AcademicYears/Index?handler=DeleteAcademicYear',
        type: 'POST',
        data: { academicYearId: academicYearId },
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
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${academicYearId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        $('#AcademicYearTable').DataTable().draw(false);
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the academic year.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the academic year: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            });
        }
    });
}
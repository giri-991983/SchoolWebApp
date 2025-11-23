'use strict';

$(document).ready(function () {
    initializeDataTable();

    const createAcademicYearForm = document.getElementById('addAcademicYearForm');
    if (createAcademicYearForm) {
        FormValidation.formValidation(createAcademicYearForm, {
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
                    rowSelector: '.form-floating'
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus()
            }
        })
            .on('core.form.valid', function () {
                CreateNewAcademicYearData(createAcademicYearForm);
            }).on('core.form.invalid', function () {
                return;
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
            searchPlaceholder: 'Search Academic Year',
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
                        title: 'Academic Year Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        customize: function (win) {
                            $(win.document.body)
                                .css('color', config.colors.headingColor)
                                .css('border-color', config.colors.borderColor)
                                .css('background-color', config.colors.body);
                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('color', 'inherit')
                                .css('border-color', 'inherit')
                                .css('background-color', 'inherit');
                            $(win.document.body).find('h1').css('text-align', 'center');
                        },
                        exportOptions: {
                            columns: [1, 2, 3, 4],
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Academic Year Data',
                        text: '<i class="ri-file-text-line me-1"></i>CSV',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4],
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Academic Year Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4],
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Academic Year Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>PDF',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4],
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Academic Year Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4],
                        }
                    }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Academic Year</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createAcademicYearOffcanvas'
                },
                action: function () {
                    $('#addAcademicYearForm')[0].reset();
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
                   
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to add AcademicYear.',
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
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to create the academic year: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            });
         
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
                                rowSelector: '.form-floating'
                            }),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            autoFocus: new FormValidation.plugins.AutoFocus()
                        }
                    })
                        .on('core.form.valid', function () {
                            UpdateAcademicYearData(editAcademicYearForm);
                        });
                }
                $('#editAcademicYearOffcanvas').offcanvas('show');

            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message,
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

function UpdateAcademicYearData(form) {
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
                    $('#editAcademicYearOffcanvas').modal('hide');
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
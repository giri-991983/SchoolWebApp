'use strict';

$(document).ready(function () {
    initializeDataTable();

    const createCampusTypeForm = document.getElementById('addCampusTypeForm');
    if (createCampusTypeForm) {
        FormValidation.formValidation(createCampusTypeForm, {
            fields: {
                CampusTypeName: {
                    validators: {
                        notEmpty: { message: 'Please enter a Campus Type Name' },
                        stringLength: { max: 50, message: 'The Campus Type Name must be less than 50 characters' }
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
                CreateNewCampusTypeData(createCampusTypeForm);
            }).on('core.form.invalid', function () {
                return;
            });
    }
});

function initializeDataTable() {
    if (!$('#CampusTypeTable').length) {
        console.error('Error: #CampusTypeTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#CampusTypeTable')) {
        $('#CampusTypeTable').DataTable().destroy();
    }
    $('#CampusTypeTable').DataTable({
        order: [[0, 'asc']],
        displayLength: 20,
        dom: '<"row pb-2 pb-md-0"<"col-md-2"<l>><"col-md-10"<"dt-action-buttons d-flex align-items-center justify-content-end flex-md-row flex-column gap-md-3 mb-3 mb-md-0"fB>>>' +
            't<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [20, 25, 30, 35],
        language: {
            sLengthMenu: '_MENU_',
            search: '',
            searchPlaceholder: 'Search Campus Type',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },
        buttons: [
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Campus Type</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createCampusTypeOffcanvas'
                },

                action: function () {
                  
                    $('#addCampusTypeForm')[0].reset();
                    $('#campusTypeNameValidationMessage').text('').hide();
                    $('#campusTypeName').removeClass('is-invalid');
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

function CreateNewCampusTypeData(form) {
    var formData = new FormData(form);
    $.ajax({
        url: '/MasterPages/CampusType/Index?handler=CreateCampusType',
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
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'An error occurred while creating the campus type.',
                    confirmButtonText: 'OK'
                });
                $('#campusTypeNameValidationMessage').text(response.message).show();
                $('#campusTypeName').addClass('is-invalid');
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to create the campus type: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function campusTypeEdit(campusTypeId) {
    $.ajax({
        url: '/MasterPages/CampusType/Index?handler=EditCampusTypeForm',
        type: 'GET',
        data: { campusTypeId: campusTypeId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching Campus Type details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (typeof response === 'string') {
                $('#editCampusTypeFormContainer').html(response);
              

                const editCampusTypeForm = document.getElementById('editCampusTypeForm');
                if (editCampusTypeForm) {
                    FormValidation.formValidation(editCampusTypeForm, {
                        fields: {
                            'CampusType.CampusTypeName': {
                                validators: {
                                    notEmpty: { message: 'Please enter a Campus Type Name' },
                                    stringLength: { max: 50, message: 'The Campus Type Name must be less than 50 characters' }
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
                            UpdateCampusTypeData(editCampusTypeForm, campusTypeId);
                        });
                }
                $('#editCampusTypeOffcanvas').offcanvas('show');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to load the edit form.'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load the edit form: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function UpdateCampusTypeData(form, campusTypeId) {
    var formData = new FormData(form);
    $.ajax({
        url: '/MasterPages/CampusType/Index?handler=EditCampusType',
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
                    $('#editCampusTypeOffcanvas').modal('hide');

                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'An error occurred while updating the campus type.',
                    confirmButtonText: 'OK'
                });
                $('#editcampusTypeNameValidationMessage').text(response.message).show();
                $('#editCampusTypeName').addClass('is-invalid');
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to update the campus type: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function showDeleteConfirmation(campusTypeId) {
    const campusTypeName = document.querySelector(`.campustype-name-full-${campusTypeId}`).innerText;
    Swal.fire({
        title: 'Delete Campus Type',
        html: `<p>Are you sure you want to delete <span class="fw-medium text-danger">${campusTypeName}</span>?</p>`,
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
            DeleteCampusTypeData(campusTypeId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${campusTypeName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}

function DeleteCampusTypeData(campusTypeId) {
    $.ajax({
        url: '/MasterPages/CampusType/Index?handler=DeleteCampusType',
        type: 'POST',
        data: { campusTypeId: campusTypeId },
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
                    $(`tr[data-id="${campusTypeId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        $('#CampusTypeTable').DataTable().draw(false);
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the campus type.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the campus type: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
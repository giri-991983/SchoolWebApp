'use strict';

$(document).ready(function () {
    initializeBoardingTypeDataTable();

    const createForm = document.getElementById('addBoardingTypeForm');
    if (createForm) {
        FormValidation.formValidation(createForm, {
            fields: {
                'BoardingType.BoardingType': {
                    validators: {
                        notEmpty: { message: 'Please enter the Boarding Type' },
                        stringLength: {
                            max: 50,
                            message: 'Boarding Type must be less than 50 characters'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'Only alphabets and spaces are allowed'
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
        }).on('core.form.valid', function () {
            createBoardingType(createForm);
        });
    }
});

function createBoardingType(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/BoardingTypes/Index?handler=CreateBoardingType',
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
                text: 'Saving boarding type...',
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
                }).then(() => window.location.reload());
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to add BoardingType.',
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
            Swal.fire('Error', 'Failed to create: ' + xhr.responseText, 'error');
        }
    });
}

function showDeleteBoardingTypeConfirmation(id) {
    const name = document.querySelector(`.boardingtype-name-${id}`)?.innerText || 'this item';

    Swal.fire({
        title: 'Delete Boarding Type',
        html: `<p>Are you sure you want to delete <strong class="text-danger">${name}</strong>?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'btn btn-danger me-2',
            cancelButton: 'btn btn-outline-secondary'
        }
    }).then(result => {
        if (result.isConfirmed) deleteBoardingType(id);
    });
}

function deleteBoardingType(id) {
    $.ajax({
        url: '/MasterPages/BoardingTypes/Index?handler=DeleteBoardingType',
        type: 'POST',
        data: { id },
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
                    title: 'Deleted',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${id}"]`).fadeOut(500, function () {
                        $(this).remove();
                        $('#BoardingTypeTable').DataTable().draw(false);
                        window.location.reload();
                    });
                });
            } else {
                Swal.fire('Error', response.message || 'Deletion failed', 'error');
            }
        },
        error: function (xhr) {
            Swal.fire('Error', 'Failed to delete: ' + xhr.responseText, 'error');
        }
    });
}

function editBoardingType(id) {
    $.ajax({
        url: '/MasterPages/BoardingTypes/Index?handler=EditForm',
        type: 'GET',
        data: { id },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            $('#editBoardingTypeFormContainer').html(response);

            
            const form = document.getElementById('editBoardingTypeForm');
            if (form) {
                FormValidation.formValidation(form, {
                    fields: {
                        'BoardingType.BoardingType': {
                            validators: {
                                notEmpty: { message: 'Boarding Type is required' },
                                stringLength: {
                                    max: 50,
                                    message: 'Must be less than 50 characters'
                                },
                                regexp: {
                                    regexp: /^[a-zA-Z\s]+$/,
                                    message: 'Only alphabets and spaces allowed'
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
                }).on('core.form.valid', function () {
                    submitEditBoardingType(form);
                });

                $('#editBoardingTypeOffcanvas').offcanvas('show');
            }
        },
        error: function () {
            Swal.fire('Error', 'Could not load form.', 'error');
        }
    });
}

function submitEditBoardingType(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/BoardingTypes/Index?handler=EditBoardingType',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Updating...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (response.success) {
                $('#editBoardingTypeOffcanvas').offcanvas('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => window.location.reload());
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to edit BoardingType.',
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
            Swal.fire('Error', 'Failed to update: ' + xhr.responseText, 'error');
        }
    });
}

function initializeBoardingTypeDataTable() {
    if (!$('#boardingTypeTable').length) {
        console.error('Error: #boardingTypeTable element not found in the DOM');
        return;
    }

    if ($.fn.DataTable.isDataTable('#boardingTypeTable')) {
        $('#boardingTypeTable').DataTable().destroy();
    }

    $('#boardingTypeTable').DataTable({
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
            searchPlaceholder: 'Search Boarding Type',
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
                        title: 'Boarding Type Data',
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
                            columns: [1]
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Boarding Type Data',
                        text: '<i class="ri-file-text-line me-1"></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1]
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Boarding Type Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1]
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Boarding Type Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1]
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Boarding Type Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1]
                        }
                    }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Boarding Type</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createBoardingTypeOffcanvas'
                },
                action: function () {
                    $('#addBoardingTypeForm')[0].reset();
                }
            }
        ],
        responsive: true
    });
}

'use strict';

try {
    console.log('Script loaded');
    console.log('jQuery version:', $.fn.jquery);

    $(document).ready(function () {
        console.log('Document ready - jQuery is working');

        // Check dependencies
        console.log('jQuery Validate available:', typeof $.fn.validate === 'function');
        console.log('SweetAlert2 available:', typeof Swal !== 'undefined');
        console.log('DataTables available:', typeof $.fn.DataTable === 'function');

        // Validation rules and messages
        var validationRules = {
            "Institution.InstitutionName": { required: true, maxlength: 100 },
            "Institution.Description": { required: true, maxlength: 500 },
            "Institution.ShortCode": { required: true, maxlength: 50 },
            "Institution.IGUID": { required: true, maxlength: 50 },
            "Institution.PackageType": { required: true },
            "Institution.Status": { required: true },
            "Institution.CreatedDate": { required: true },
            "LogoFile": { accept: "image/*" }
        };

        var validationMessages = {
            "Institution.InstitutionName": {
                required: "Institution name is required.",
                maxlength: "Institution name cannot exceed 100 characters."
            },
            "Institution.Description": {
                required: "Description is required.",
                maxlength: "Description cannot exceed 500 characters."
            },
            "Institution.ShortCode": {
                required: "Short code is required.",
                maxlength: "Short code cannot exceed 50 characters."
            },
            "Institution.IGUID": {
                required: "IGUID is required.",
                maxlength: "IGUID cannot exceed 50 characters."
            },
            "Institution.PackageType": "Please select a package type.",
            "Institution.Status": "Please select a status.",
            "Institution.WebsiteUrl": {
                maxlength: "Website URL cannot exceed 200 characters.",
                url: "Please enter a valid URL."
            },
            "Institution.CreatedDate": "Created date is required.",
            "LogoFile": { accept: "Only image files are allowed." }
        };

        // Handle Edit Form Submission
        if (typeof $.fn.validate === 'function') {
            $('form[id^="editInstitutionForm_"]').each(function () {
                var $form = $(this);
                var institutionId = $form.data('id');
                console.log('Found edit form with ID:', institutionId);

                $form.validate({
                    rules: validationRules,
                    messages: validationMessages,
                    errorPlacement: function (error, element) {
                        error.appendTo(element.closest('.form-floating').find('.text-danger'));
                    },
                    highlight: function (element) {
                        $(element).addClass('is-invalid');
                    },
                    unhighlight: function (element) {
                        $(element).removeClass('is-invalid');
                    },
                    submitHandler: function (form) {
                        console.log('Edit form validated for ID:', institutionId);
                        var formData = new FormData(form);
                        console.log('Edit form data:', Array.from(formData.entries()));

                        $.ajax({
                            url: '/Admin/InstitutionIndex?handler=EditInstitution',
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            headers: {
                                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                            },
                            beforeSend: function () {
                                console.log('Sending edit AJAX request for ID:', institutionId);
                                if (typeof Swal !== 'undefined') {
                                    Swal.fire({
                                        title: 'Processing...',
                                        text: 'Please wait.',
                                        allowOutsideClick: false,
                                        didOpen: () => Swal.showLoading()
                                    });
                                }
                            },
                            success: function (response) {
                                console.log('Edit AJAX success:', response);
                                if (response.success) {
                                    if (typeof Swal !== 'undefined') {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Updated Successfully',
                                            text: response.message || 'Institution updated successfully!',
                                            timer: 1500,
                                            showConfirmButton: false
                                        }).then(() => {
                                            $('#editInstitutionOffcanvas_' + institutionId).offcanvas('hide');
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
                                            text: response.message || 'An error occurred while updating the institution.',
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
                                        text: 'Failed to update the institution: ' + (xhr.responseText || error),
                                        confirmButtonText: 'OK'
                                    });
                                }
                            }
                        });
                    }
                });

                $('.edit-submit-btn[data-id="' + institutionId + '"]').on('click', function (e) {
                    e.preventDefault();
                    if ($form.valid()) {
                        console.log('Edit form is valid, submitting for ID:', institutionId);
                        $form.submit();
                    } else {
                        console.log('Edit form validation failed for ID:', institutionId);
                    }
                });
            });
        } else {
            console.error('jQuery Validate not loaded');
        }

        // Handle Create Form Submission
        var $createForm = $('#createInstitutionForm');
        if ($createForm.length) {
            console.log('Create form found');
            if (typeof $.fn.validate === 'function') {
                $createForm.validate({
                    rules: validationRules,
                    messages: validationMessages,
                    errorPlacement: function (error, element) {
                        error.appendTo(element.closest('.form-floating').find('.text-danger'));
                    },
                    highlight: function (element) {
                        $(element).addClass('is-invalid');
                    },
                    unhighlight: function (element) {
                        $(element).removeClass('is-invalid');
                    },
                    submitHandler: function (form) {
                        console.log('Create form validated');
                        var formData = new FormData(form);
                        console.log('Create form data:', Array.from(formData.entries()));

                        $.ajax({
                            url: '/Admin/InstitutionIndex?handler=CreateInstitution',
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
                                        text: 'Please wait.',
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
                                            text: response.message || 'Institution created successfully!',
                                            timer: 1500,
                                            showConfirmButton: false
                                        }).then(() => {
                                            $('#createInstitutionOffcanvas').offcanvas('hide');
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
                            },
                            error: function (xhr, status, error) {
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
                });

                $('#submitInstitutionBtn').on('click', function (e) {
                    e.preventDefault();
                    if ($createForm.valid()) {
                        console.log('Create form is valid, submitting');
                        $createForm.submit();
                    } else {
                        console.log('Create form validation failed');
                    }
                });
            } else {
                console.error('jQuery Validate not loaded for create form');
            }
        } else {
            console.error('Create form not found in DOM');
        }

        // DataTable Initialization
        var $dataTable = $('#InstitutionTable');
        if ($dataTable.length) {
            console.log('DataTable found');
            if (typeof $.fn.DataTable === 'function') {
                $dataTable.DataTable({
                    order: [[0, 'asc']],
                    pageLength: 7,
                    dom:
                        '<"row pb-2 pb-md-0"' +
                        '<"col-md-2"<l>>' +
                        '<"col-md-10"<"dt-action-buttons d-flex align-items-center justify-content-end flex-md-row flex-column gap-md-3 mb-3 mb-md-0"fB>>' +
                        '>t' +
                        '<"row"' +
                        '<"col-sm-12 col-md-6"i>' +
                        '<"col-sm-12 col-md-6"p>' +
                        '>',
                    lengthMenu: [7, 10, 15, 20],
                    language: {
                        lengthMenu: '_MENU_',
                        search: '',
                        searchPlaceholder: 'Search Institutions',
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
                                { extend: 'print', title: 'Institution Data', text: '<i class="ri-printer-line me-1"></i>Print', className: 'dropdown-item', exportOptions: { columns: ':visible:not(:last-child)' } },
                                { extend: 'csv', title: 'Institutions', text: '<i class="ri-file-text-line me-1"></i>CSV', className: 'dropdown-item', exportOptions: { columns: ':visible:not(:last-child)' } },
                                { extend: 'excel', title: 'Institutions', text: '<i class="ri-file-excel-line me-1"></i>Excel', className: 'dropdown-item', exportOptions: { columns: ':visible:not(:last-child)' } },
                                { extend: 'pdf', title: 'Institutions', text: '<i class="ri-file-pdf-line me-1"></i>PDF', className: 'dropdown-item', exportOptions: { columns: ':visible:not(:last-child)' } },
                                { extend: 'copy', title: 'Institutions', text: '<i class="ri-file-copy-line me-1"></i>Copy', className: 'dropdown-item', exportOptions: { columns: ':visible:not(:last-child)' } }
                            ]
                        },
                        {
                            text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Institution</span>',
                            className: 'add-new btn btn-primary waves-effect waves-light',
                            attr: { 'data-bs-toggle': 'offcanvas', 'data-bs-target': '#createInstitutionOffcanvas' }
                        }
                    ],
                    responsive: true,
                    columnDefs: [
                        { targets: 0, searchable: false, orderable: false, render: function () { return ''; } },
                        { targets: -1, searchable: false, orderable: false }
                    ],
                    initComplete: function () {
                        console.log('DataTable initialized');
                    }
                });
            } else {
                console.error('DataTables not loaded');
            }
        } else {
            console.error('DataTable not found in DOM');
        }

        // Delete Confirmation
        window.showDeleteConfirmation = function (institutionId) {
            console.log('Delete confirmation triggered for ID:', institutionId);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to delete this institution? This action cannot be undone.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel',
                    confirmButtonColor: '#dc3545',
                    cancelButtonColor: '#6c757d'
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('Delete confirmed for ID:', institutionId);
                        $.ajax({
                            url: '/Admin/InstitutionIndex?handler=DeleteInstitution',
                            type: 'POST',
                            data: { id: institutionId },
                            headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
                            beforeSend: function () {
                                console.log('Sending delete AJAX request for ID:', institutionId);
                                Swal.fire({
                                    title: 'Processing...',
                                    text: 'Please wait.',
                                    allowOutsideClick: false,
                                    didOpen: () => Swal.showLoading()
                                });
                            },
                            success: function (response) {
                                console.log('Delete AJAX success:', response);
                                if (response.success) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Deleted Successfully',
                                        text: response.message || 'Institution deleted successfully!',
                                        timer: 1500,
                                        showConfirmButton: false
                                    }).then(() => {
                                        $(`tr[data-id="${institutionId}"]`).fadeOut(500, function () {
                                            $(this).remove();
                                            if (typeof $.fn.DataTable === 'function') {
                                                $('#InstitutionTable').DataTable().draw(false);
                                            }
                                        });
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: response.message || 'Failed to delete the institution.',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error('Delete AJAX error:', { status, error, responseText: xhr.responseText });
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Deletion Failed',
                                    text: 'Failed to delete the institution: ' + (xhr.responseText || error),
                                    confirmButtonText: 'OK'
                                });
                            }
                        });
                    }
                });
            } else {
                console.error('SweetAlert2 not loaded for delete confirmation');
            }
        };
    });
} catch (error) {
    console.error('Script error:', error);
}
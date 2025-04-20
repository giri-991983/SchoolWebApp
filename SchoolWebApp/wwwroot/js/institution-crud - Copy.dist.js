'use strict';

$(document).ready(function () {
    console.log('jQuery initialized');

    // Dependency Checks
    if (typeof $.fn.dataTable === 'undefined') console.error('DataTables not loaded');
    if (typeof $.fn.validate === 'undefined') console.error('jQuery Validate not loaded');
    if (typeof Swal === 'undefined') console.error('SweetAlert2 not loaded');

    // DataTable Initialization (unchanged)
    let borderColor, bodyBg, headingColor;
    if (typeof isDarkStyle !== 'undefined' && isDarkStyle) {
        borderColor = config.colors_dark.borderColor;
        bodyBg = config.colors_dark.bodyBg;
        headingColor = config.colors_dark.headingColor;
    } else {
        borderColor = config.colors.borderColor;
        bodyBg = config.colors.bodyBg;
        headingColor = config.colors.headingColor;
    }

    const dataTable = $('#InstitutionTable').DataTable({
        order: [[0, 'asc']],
        displayLength: 7,
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
            sLengthMenu: '_MENU_',
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
                    {
                        extend: 'print',
                        title: 'Institution Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        customize: function (win) {
                            $(win.document.body)
                                .css('color', headingColor)
                                .css('border-color', borderColor)
                                .css('background-color', bodyBg);
                            $(win.document.body)
                                .find('table')
                                .addClass('compact')
                                .css('color', 'inherit')
                                .css('border-color', 'inherit')
                                .css('background-color', 'inherit');
                            $(win.document.body).find('h1').css('text-align', 'center');
                        },
                        exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
                    },
                    { extend: 'csv', title: 'Institutions', text: '<i class="ri-file-text-line me-1"></i>CSV', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
                    { extend: 'excel', title: 'Institutions', text: '<i class="ri-file-excel-line me-1"></i>Excel', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
                    { extend: 'pdf', title: 'Institutions', text: '<i class="ri-file-pdf-line me-1"></i>PDF', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] } },
                    { extend: 'copy', title: 'Institutions', text: '<i class="ri-file-copy-line me-1"></i>Copy', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8] } }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Institution</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: { 'data-bs-toggle': 'offcanvas', 'data-bs-target': '#createInstitutionOffcanvas' }
            }
        ]
      
    });

    

    // Validation Setup Function
    function setupValidation(formId) {
        const $form = $(formId);
        if (!$form.length) {
            console.warn('Form not found:', formId);
            return;
        }

        console.log('Setting up validation for:', formId);

        // Custom validation methods for file type and size
        $.validator.addMethod("validFileType", function (value, element) {
            if (element.files.length === 0) return true; // Not required, so allow empty value
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            return allowedTypes.includes(element.files[0].type);
        }, "Only JPG, PNG, and GIF files are allowed");

        $.validator.addMethod("validFileSize", function (value, element) {
            if (element.files.length === 0) return true; // Not required, so allow empty value
            return element.files[0].size <= 2 * 1024 * 1024; // 2MB limit
        }, "File size must be 2MB or less");

        $form.validate({
            rules: {
                'Institution.InstitutionName': { required: true, minlength: 3, maxlength: 100 },
                'Institution.Description': { required: true, minlength: 5 },
                'Institution.ShortCode': { required: true, maxlength: 50 },
                'Institution.IGUID': { required: true, maxlength: 50 },
                'Institution.PackageType': { required: true },
                'Institution.Status': { required: true },
                'Institution.CreatedDate': { required: true },
                'Institution.WebsiteUrl': { maxlength: 200, url: true },
                'LogoFile': { validFileType: true, validFileSize: true } // Not required but validated if provided
            },
            messages: {
                'Institution.InstitutionName': {
                    required: 'Please Enter Institution Name',
                    minlength: 'At least 3 characters',
                    maxlength: 'Max 100 characters'
                },
                'Institution.Description': {
                    required: 'Please Enter Description',
                    minlength: 'At least 5 characters'
                },
                'Institution.ShortCode': {
                    required: 'Please Enter Short Code',
                    maxlength: 'Max 50 characters'
                },
                'Institution.IGUID': {
                    required: 'Please Enter IGUID',
                    maxlength: 'Max 50 characters'
                },
                'Institution.PackageType': { required: 'Select a package type' },
                'Institution.Status': { required: 'Select a status' },
                'Institution.CreatedDate': { required: 'Please Enter Created Date' },
                'Institution.WebsiteUrl': {
                    maxlength: 'Max 200 characters',
                    url: 'Enter a valid URL (e.g., https://example.com)'
                },
                'LogoFile': {
                    validFileType: 'Only JPG, PNG, and GIF files are allowed',
                    validFileSize: 'File size must be 2MB or less'
                }
            },
            errorPlacement: function (error, element) {
                const $errorSpan = element.closest('.form-floating').find('.text-danger');
                console.log('Placing error for:', element.attr('name'), 'Message:', error.text());
                if ($errorSpan.length) {
                    $errorSpan.html(error).css({ 'display': 'block', 'font-size': '0.875rem', 'margin-top': '5px' });
                } else {
                    error.addClass('text-danger small').insertAfter(element);
                }
            },
            highlight: function (element) {
                $(element).addClass('is-invalid');
            },
            unhighlight: function (element) {
                $(element).removeClass('is-invalid');
                $(element).closest('.form-floating').find('.text-danger').html('').hide();
            },
            invalidHandler: function (event, validator) {
                console.log('Form invalid, errors:', validator.errorList);
            }
        });

        // Reset form and validation state
        $form[0].reset();
        $form.validate().resetForm();
        console.log('Form reset and validation initialized');
    }


    // Apply validation when offcanvas is shown
    $(document).on('shown.bs.offcanvas', '#createInstitutionOffcanvas', function () {
        console.log('Offcanvas shown, setting up validation');
        setupValidation('#createInstitutionForm');
    });

    // Submission Handler
    $(document).on('click', '#submitInstitutionBtn', function (e) {
        e.preventDefault();
        console.log('Submit button clicked');

        const $form = $('#createInstitutionForm');
        if (!$form.length) {
            console.warn('Form not found');
            return;
        }

        console.log('Checking form validity');
        if (!$form.valid()) {
            console.log('Form validation failed');
            return;
        }

        console.log('Form is valid, preparing submission');
        const formData = new FormData($form[0]);
        console.log('Form data:', Array.from(formData.entries()));

        $.ajax({
            url: '/Admin/InstitutionIndex?handler=CreateInstitution',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
            beforeSend: function () {
                console.log('AJAX request starting');
            },
            success: function (response) {
                console.log('AJAX success, response:', response);
                const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
                if (jsonResponse.success) {
                    console.log('Institution created successfully');
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Success',
                            text: jsonResponse.message || 'Institution created successfully!',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            $('#createInstitutionOffcanvas').offcanvas('hide');
                            window.location.reload();
                            // Optionally reload table: dataTable.ajax.reload();
                        });
                    } else {
                        alert('Institution created successfully!');
                        $('#createInstitutionOffcanvas').offcanvas('hide');
                    }
                } else {
                    console.log('Creation failed:', jsonResponse.message);
                    if (typeof Swal !== 'undefined') {
                        Swal.fire('Error', jsonResponse.message || 'Creation failed', 'error');
                    } else {
                        alert('Creation failed: ' + (jsonResponse.message || 'Unknown error'));
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', { status: xhr.status, responseText: xhr.responseText, error });
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Error', 'Submission failed: ' + (xhr.responseText || error), 'error');
                } else {
                    alert('AJAX error: ' + (xhr.responseText || error));
                }
            }
        });
    });
    // Edit validation 
    $(document).on('shown.bs.offcanvas', '[id^="editInstitutionOffcanvas_"]', function () {
        const institutionId = $(this).attr('id').replace('editInstitutionOffcanvas_', '');
        console.log(`Edit offcanvas shown for ID: ${institutionId}, setting up validation`);
        setupValidation(`#editInstitutionForm_${institutionId}`);
    });
    // Edit Institution handler
    $(document).on('click', '.edit-submit-btn', function (e) {
        e.preventDefault();
        var institutionId = $(this).data('id');
        var $form = $('#editInstitutionForm_' + institutionId);

        if (!$form.valid()) {
            console.error('Edit form validation failed');
            return;
        }

        // Create FormData properly
        var formData = new FormData($form[0]);

        $.ajax({
            url: '/Admin/InstitutionIndex?handler=EditInstitution',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
            success: function (response) {
                console.log('AJAX success:', response);
                var jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
                if (jsonResponse.success) {
                    Swal.fire({
                        title: 'Success',
                        text: jsonResponse.message || 'Institution updated successfully!',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        $('#editInstitutionOffcanvas_' + institutionId).offcanvas('hide');
                        window.location.reload();
                    });
                } else {
                    console.error('Update failed:', jsonResponse.message);
                    Swal.fire('Error', jsonResponse.message || 'Update failed', 'error');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', { status: xhr.status, responseText: xhr.responseText, error });
                Swal.fire('Error', 'Submission failed: ' + (xhr.responseText || error), 'error');
            }
        });
    });

    // Delete Institution (unchanged)
    window.showDeleteConfirmation = function (institutionId) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.', 
            icon: 'warning',
            showCancelButton: true, // ✅  only one cancel button
            confirmButtonText: 'Yes, delete it!', // ✅ Confirm button
            cancelButtonText: 'Cancel', // ✅ Only one cancel button (not duplicate "No")
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            customClass: {
                confirmButton: 'btn btn-danger me-3',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/Admin/InstitutionIndex?handler=DeleteInstitution',
                    type: 'POST',
                    data: { id: institutionId },
                    headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
                    success: function (response) {
                        const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
                        if (jsonResponse.success) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Institution deleted successfully.',
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => window.location.reload());
                        } else {
                            Swal.fire('Error', jsonResponse.message || 'Deletion failed', 'error');
                        }
                    },
                    error: function (xhr) {
                        Swal.fire('Error', 'Failed to delete: ' + xhr.responseText, 'error');
                    }
                });
            }
        });
    };


});
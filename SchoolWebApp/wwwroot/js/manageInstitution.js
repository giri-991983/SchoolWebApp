'use strict';

// User DataTable initialization
$(document).ready(function () {
    //let borderColor, bodyBg, headingColor;

    //if (isDarkStyle) {
    //    borderColor = config.colors_dark.borderColor;
    //    bodyBg = config.colors_dark.bodyBg;
    //    headingColor = config.colors_dark.headingColor;
    //} else {
    //    borderColor = config.colors.borderColor;
    //    bodyBg = config.colors.bodyBg;
    //    headingColor = config.colors.headingColor;
    //}

    // User List DataTable Initialization (For User CRUD Page)
    $('#InstitutionTable').DataTable({
        order: [[9, 'desc']],
        displayLength: 20,
        dom:
            // Datatable DOM positioning
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
            searchPlaceholder: 'Search Institution',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },
        // Buttons with Dropdown
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle me-4 waves-effect waves-light',
                text: '<i class="ri-download-line ri-16px me-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                    {
                        extend: 'print',
                        title: 'Institution Data',
                        text: '<i class="ri-printer-line me-1" ></i>Print',
                        className: 'dropdown-item',
                        customize: function (win) {
                            //customize print view for dark
                            $(win.document.body)
                                .css('color', config.colors.headingColor)
                                .css('border-color', config.colors.borderColor)
                                .css('background-color', config.colors.body);

                            $(win.document.body)
                                .find('table')
                                .addClass('compact')
                                .css('color', 'inherit')
                                .css('border-color', 'inherit')
                                .css('background-color', 'inherit');

                            // Center the title "Users Data"
                            $(win.document.body).find('h1').css('text-align', 'center');
                        },
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    //if (column === 1) {
                                    //    var $content = $(data);
                                    //    // Extract the value of data-user-name attribute (User Name)
                                    //    var userName = $content.find('[class^="user-name-full-"]').text();
                                    //    return userName;
                                    //} else if (column === 3) {
                                    //    // Extract the value of data-is-verified attribute (Is Verified)
                                    //    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                                    //    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                                    //}
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Institution Data',
                        text: '<i class="ri-file-text-line me-1" ></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    //if (column === 1) {
                                    //    var $content = $(data);
                                    //    // Extract the value of data-user-name attribute (User Name)
                                    //    var userName = $content.find('[class^="user-name-full-"]').text();
                                    //    return userName;
                                    //} else if (column === 3) {
                                    //    // Extract the value of data-is-verified attribute (Is Verified)
                                    //    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                                    //    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                                    //}
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Institution Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    //if (column === 1) {
                                    //    var $content = $(data);
                                    //    // Extract the value of data-user-name attribute (User Name)
                                    //    var userName = $content.find('[class^="user-name-full-"]').text();
                                    //    return userName;
                                    //} else if (column === 3) {
                                    //    // Extract the value of data-is-verified attribute (Is Verified)
                                    //    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                                    //    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                                    //}
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Institution Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    //if (column === 1) {
                                    //    var $content = $(data);
                                    //    // Extract the value of data-user-name attribute (User Name)
                                    //    var userName = $content.find('[class^="user-name-full-"]').text();
                                    //    return userName;
                                    //} else if (column === 3) {
                                    //    // Extract the value of data-is-verified attribute (Is Verified)
                                    //    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                                    //    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                                    //}
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Institution Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    //if (column === 1) {
                                    //    var $content = $(data);
                                    //    // Extract the value of data-user-name attribute (User Name)
                                    //    var userName = $content.find('[class^="user-name-full-"]').text();
                                    //    return userName;
                                    //} else if (column === 3) {
                                    //    // Extract the value of data-is-verified attribute (Is Verified)
                                    //    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                                    //    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                                    //}
                                    return data;
                                }
                            }
                        }
                    }
                ]
            },
            {
                // For Create User Button (Add New )
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Institution</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createInstitutionOffcanvas'
                }
            }
        ],
        responsive: true,
        //// For responsive popup
        //rowReorder: {
        //    selector: 'td:nth-child(4)'
        //},
        //// For responsive popup button and responsive priority for user name
        //columnDefs: [
        //    {
        //        // For Responsive Popup Button (plus icon)
        //        className: 'control',
        //        searchable: false,
        //        orderable: false,
        //        responsivePriority: 2,
        //        targets: 0,
        //        render: function (data, type, full, meta) {
        //            return '';
        //        }
        //    },
        //    {
        //        // For Id
        //        targets: 1,
        //        responsivePriority: 4
        //    },
        //    {
        //        // For User Name
        //        targets: 2,
        //        responsivePriority: 3
        //    },
        //    {
        //        // For Email
        //        targets: 3,
        //        responsivePriority: 9
        //    },
        //    {
        //        // For Is Verified
        //        targets: 4,
        //        responsivePriority: 5
        //    },
        //    {
        //        // For Contact Number
        //        targets: 5,
        //        responsivePriority: 7
        //    },
        //    {
        //        // For Role
        //        targets: 6,
        //        responsivePriority: 6
        //    },
        //    {
        //        // For Plan
        //        targets: 7,
        //        responsivePriority: 8
        //    },
        //    {
        //        // For Actions
        //        targets: -1,
        //        searchable: false,
        //        orderable: false,
        //        responsivePriority: 1
        //    }
        //],
        //responsive: {
        //    details: {
        //        display: $.fn.dataTable.Responsive.display.modal({
        //            header: function (row) {
        //                var data = row.data();
        //                var $content = $(data[2]);
        //                // Extract the value of data-user-name attribute (User Name)
        //                var userName = $content.find('[class^="user-name-full-"]').text();
        //                return 'Details of ' + userName;
        //            }
        //        }),
        //        type: 'column',
        //        renderer: function (api, rowIdx, columns) {
        //            var data = $.map(columns, function (col, i) {
        //                // Exclude the last column (Action)
        //                if (i < columns.length - 1) {
        //                    return col.title !== ''
        //                        ? '<tr data-dt-row="' +
        //                        col.rowIndex +
        //                        '" data-dt-column="' +
        //                        col.columnIndex +
        //                        '">' +
        //                        '<td>' +
        //                        col.title +
        //                        ':' +
        //                        '</td> ' +
        //                        '<td>' +
        //                        col.data +
        //                        '</td>' +
        //                        '</tr>'
        //                        : '';
        //                }
        //                return '';
        //            }).join('');

        //            return data ? $('<table class="table mt-3"/><tbody />').append(data) : false;
        //        }
        //    }
        //}
    });


});

//Filter Form styles to default size after DataTable initialization
setTimeout(() => {
    $('.dataTables_filter input').addClass('ms-0');
    $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
    $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
}, 300);


// Get the Create for validation
const createNewrForm = document.getElementById('createInstitutionForm');

// Initialize FormValidation for create user form
const fv = FormValidation.formValidation(createNewrForm, {
    fields: {
        'Institution.InstitutionName': {
            validators: {
                notEmpty: { message: 'Please enter a InstitutionName' },
                stringLength: { min: 6, max: 200, message: 'The InstitutionName must be more than 6 and less than 200 characters long' }
            }
        },
        'Institution.Description': {
            validators: {
                notEmpty: { message: 'Please enter a Description' }
                // stringLength: { min: 10, max: 200, message: 'The InstitutionName must be more than 6 and less than 20 characters long' }
            }
        },
        'Institution.ShortCode': {
            validators: {
                notEmpty: { message: 'Please enter a ShortCode' },
                stringLength: { min: 0, max: 10, message: 'The Institution Short Code must be less than 10 characters' }
            }
        },
        'Institution.PackageType': {
            validators: {
                notEmpty: { message: 'Please enter a PackageTypes' }
                // stringLength: { min: 10, max: 200, message: 'The InstitutionName must be more than 6 and less than 20 characters long' }
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
            // Specify the selector for your submit button
            button: '[type="submit"]'
        }),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus()
    }
})
    .on('core.form.valid', function () {
        // if fields are valid then
        // submitFormAndSetSuccessFlag(createNewUserForm, 'newUserFlag');
        CreateNewInstituionDtaa(createNewrForm)
    })
    .on('core.form.invalid', function () {
        // if fields are invalid
        return;
    });
function CreateNewInstituionDtaa(form) {
    debugger;
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
                    text: 'Processing...',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    // allowEscapeKey: false,
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
                }
                else { window.location.reload(); }
            }
            else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'An error occurred while creating the institution.',
                        confirmButtonText: 'OK'
                    });
                }
            }

            //  Swal.close();
        },
        error: function (xhr, status, error) {
            //Swal.close();
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

function showDeleteConfirmation(institutionId) {
    //  event.preventDefault(); // prevent form submit
    debugger;
    const InstitutionName = document.querySelector(`.inst-name-full-${institutionId}`).innerText;
    Swal.fire({
        title: 'Delete Institution Name',
        // Show the user the user name to be deleted
        html: `<p>Are you sure you want to delete Institution ?<br><br><span class="fw-medium text-danger">${InstitutionName}</span></p>`,
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
            DeleteInstitutionData(institutionId);
        }
        else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${InstitutionName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}
function DeleteInstitutionData(institutionId) {
    debugger;
    $.ajax({
        url: '/Admin/InstitutionIndex?handler=DeleteInstitution',
        type: 'POST',
        data: { id: institutionId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            console.log('Sending delete AJAX request for ID:', institutionId);
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



const EdiNewrForm = document.getElementById('editInstitutionForm');

const fv122 = FormValidation.formValidation(EdiNewrForm, {
    fields: {
        'Institution.InstitutionName': {
            validators: {
                notEmpty: { message: 'Please enter a InstitutionName' },
                stringLength: { min: 6, max: 200, message: 'The InstitutionName must be more than 6 and less than 200 characters long' }
            }
        },
        'Institution.Description': {
            validators: {
                notEmpty: { message: 'Please enter a Description' }
                // stringLength: { min: 10, max: 200, message: 'The InstitutionName must be more than 6 and less than 20 characters long' }
            }
        },
        'Institution.ShortCode': {
            validators: {
                notEmpty: { message: 'Please enter a ShortCode' },
                stringLength: { min: 0, max: 10, message: 'The Institution Short Code must be less than 10 characters' }
            }
        },
        'Institution.PackageType': {
            validators: {
                notEmpty: { message: 'Please enter a PackageTypes' }
                // stringLength: { min: 10, max: 200, message: 'The InstitutionName must be more than 6 and less than 20 characters long' }
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
            // Specify the selector for your submit button
            button: '[type="submit"]'
        }),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus()
    }
})
    .on('core.form.valid', function () {
        
        UpdateNewInstituionDtaa(EdiNewrForm)
    })
    .on('core.form.invalid', function () {       
        return;
    });

function UpdateNewInstituionDtaa(form) {
    debugger;
    console.log('Create form validated');
    var formData = new FormData(form);
    console.log('Create form data:', Array.from(formData.entries()));

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
            console.log('Sending create AJAX request');
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Processing...',
                    text: 'Processing...',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    // allowEscapeKey: false,
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
                        title: 'Updated Successfully',
                        text: response.message || 'Institution Updated successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {

                        $('#editInstitutionOffcanvas_').offcanvas('hide');
                        window.location.reload();
                    });
                }
                else { window.location.reload(); }
            }
            else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'An error occurred while creating the institution.',
                        confirmButtonText: 'OK'
                    });
                }
            }

            //  Swal.close();
        },
        error: function (xhr, status, error) {
            //Swal.close();
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


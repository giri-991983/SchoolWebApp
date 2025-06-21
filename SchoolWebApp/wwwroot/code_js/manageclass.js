

function initializeDataTable() {
    if (!$('#ClassTable').length) {
        console.error('Error: #ClassTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#ClassTable')) {
        $('#ClassTable').DataTable().destroy();
    }
    $('#ClassTable').DataTable({

        order: [[5, 'asc']],
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
            searchPlaceholder: 'Search Campus',
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
                        title: 'Class Data',
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

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Class Data',
                        text: '<i class="ri-file-text-line me-1" ></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Class Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Class Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Campus Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {

                                    return data;
                                }
                            }
                        }
                    }
                ]
            },
            {
                // For Create User Button (Add New )
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Class</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#addClassModal'
                },
                action: function () {
                    // Validate InstitutionID and CampusID
                    var campusId = $('#CampusID').val();
                    var institutionId = $('#InstitutionID').val();

                    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning',
                            text: 'Please select an Institution and Campus before adding a class.',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }

                   
                  
                    $('#addClassForm')[0].reset();
                    $('#masterClassesContainer').html('<p class="text-muted">Select a board to view associated stages and classes.</p>');

                    // Populate hidden fields
                    $('#ModalCampusID').val(campusId);
                    $('#ModalInstitutionID').val(institutionId);

                    //// Open modal
                    //$('#addClassModal').modal('show');
                }
            }
        ],
        responsive: true,

    });



    //Filter Form styles to default size after DataTable initialization
    setTimeout(() => {
        $('.dataTables_filter input').addClass('ms-0');
        $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
        $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
    }, 300);

}
// Check box for Class Stages with Seecting BoardId
function fetchMasterClasses(boardId) {


    $.ajax({
        url: '/Class/Index?handler=MasterClasses',
        type: 'GET',
        data: { boardId: boardId },
        beforeSend: function () {
            $('#masterClassesContainer').html('<p class="text-muted">Loading...</p>');
        },
        success: function (partialView) {
            $('#masterClassesContainer').html(partialView);
           
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load master classes: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });

        }
    });
}
// Geting dropdown for Campus with Seletcing Institution
function loadCampuses(institutionId) {
    let campusSelectId = 'CampusID';
    $(`#${campusSelectId}`).html('<option value="">Select Campus</option>').prop('disabled', true);

    if (!institutionId || institutionId <= 0) {
        $(`#${campusSelectId}`).val('').trigger('change');
        $(`#${campusSelectId}`).prop('disabled', false);
        return;
    }

    $.ajax({
        url: '/Class/Index?handler=LoadCampusesByInstitution',
        type: 'GET',
        data: { institutionId: institutionId },
        success: function (response) {
            $(`#${campusSelectId}`).html(response);
            $(`#${campusSelectId}`).prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading campuses:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load campuses: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            $(`#${campusSelectId}`).prop('disabled', false);
        }
    });
}

function toggleStageSelection(checkbox) {
    var stageNo = $(checkbox).closest('.form-check-label').find('.master-class-id').first().data('stage');
    var masterClassInputs = $(checkbox).closest('.form-check-label').find(`.master-class-id[data-stage="${stageNo}"]`);

    if (checkbox.checked) {
        masterClassInputs.prop('disabled', false);
    } else {
        masterClassInputs.prop('disabled', true);
    }
   

}

$(document).ready(function () {

    const classFilterForm = document.getElementById('filterForm');

    if (classFilterForm) {


        // for Filter Table  and Validation
        FormValidation.formValidation(classFilterForm, {
            fields: {
                CampusID: {
                    validators: {
                        notEmpty: {
                            message: 'Please select a Campus.'
                        }
                    }
                },
                InstitutionID: {
                    validators: {
                        notEmpty: {
                            message: 'Please select a Institution.'
                        }
                    }
                },
                BoardID: {
                    validators: {
                        notEmpty: {
                            message: 'Please select a Board.'
                        }
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
                filterClasses(classFilterForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    } else {
        console.error('ClassFilterForm not found');
    }
    // Hide table on InstitutionID change
    $('#InstitutionID').on('change', function () {

        $('#FilterTable').hide();

    });

    // Hide table on CampusID change
    $('#CampusID').on('change', function () {

        $('#FilterTable').hide();

    });
    // Hide table on BoardID change
    $('#BoardID').on('change', function () {
        $('#FilterTable').hide();
    });
});


function filterClasses(form) {
    const campusId = form.querySelector('#CampusID').value;
    const institutionId = form.querySelector('#InstitutionID').value;
    const boardId = form.querySelector('#BoardID').value;

    $.ajax({
        url: '/Class/Index?handler=ClassesByCampusAddInstitution',
        type: 'GET',
        data: { campusId: campusId, institutionId: institutionId, boardId: boardId },
        success: function (partialView) {
            $('#FilterTable').html(partialView).show();
            if ($('#ClassTable').length) {
                initializeDataTable(); // Reinitialize DataTable on the new table
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load class data: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
// Validation and Add Classs
const addclassForm = document.getElementById('addClassForm');
if (addclassForm) {
    console.log('FormValidation initializing for addClassForm...');
    FormValidation.formValidation(addclassForm, {
        fields: {

            BoardID: {
                validators: {
                    notEmpty: { message: 'Please select a Board' }
                }
            },
            SelectedMasterStageIDs: {
                validators: {
                    callback: {
                        message: 'Please select at least one stage.',
                        callback: function (input) {
                            const checkboxes = addclassForm.querySelectorAll('input[name="SelectedMasterStageIDs"]:checked');
                            const isValid = checkboxes.length > 0;
                            console.log('SelectedMasterStageIDs validation:', {
                                checkedCount: checkboxes.length,
                                isValid: isValid,
                                checkboxesFound: addclassForm.querySelectorAll('input[name="SelectedMasterStageIDs"]').length
                            });
                            return isValid;
                        }
                    }
                }
            }

        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: 'is-valid',
                rowSelector: function (field, ele) {
                    return '.mb-3';
                }
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
    })
        .on('core.form.valid', function () {
            console.log('Add class form valid, submitting...');
            submitAddClassesForm(addclassForm);
        })
        .on('core.form.invalid', function () {
            return;
        });
       
} else {
    console.error('addClassForm not found');
}

// Submit form via AJAX
function submitAddClassesForm(form) {
    const formData = new FormData(form);
    console.log('Form data:', formData);
    $.ajax({
        url: '/Class/Index?handler=AddClasses',
        type: 'POST',
        data: formData,
        processData: false, // Required for FormData
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Sending create AJAX request');
            Swal.fire({
                title: 'Processing...',
                text: 'Processing...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            console.log('Form submission response:', response);
            Swal.close();
            if (response.success) {
                $('#addClassModal').modal('hide');
                filterClasses(document.getElementById('filterForm'));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Classes added successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'warning', // Change to warning for clarity
                    title: 'Warning',
                    text: response.message || 'Failed to add classes.',
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
            console.error('Error submitting form:', { status, error, responseText: xhr.responseText });
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add classes: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}


function classEdit(classId) {
    console.log('Edit button clicked for Class ID:', classId);
    $.ajax({
        url: '/Class/Index?handler=EditClassForm',
        type: 'GET',
        data: { classId: classId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Loading edit class form...');
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching class details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            console.log('Edit class form loaded successfully');
            Swal.close();
          
            if (typeof response === 'string') {
                $('#editClassFormContainer').html(response);

               
                $('#editClassModal').modal('show');

              //validation

                const editClassForm = document.getElementById('editClassForm');

                if (editClassForm) {
                    FormValidation.formValidation(editClassForm, {
                        fields: {

                            className: {
                                validators: {
                                    notEmpty: {
                                        message: 'Class name is required'
                                    },
                                    stringLength: {
                                        max: 100,
                                        message: 'Max 100 characters allowed'
                                    }
                                  }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger({
                                event: {
                                    className: 'blur keyup change'// You can also try 'blur change keyup'
                                }
                            }),

                            bootstrap5: new FormValidation.plugins.Bootstrap5({
                                eleValidClass: 'is-valid',
                                rowSelector: function (field, ele) {
                                    return '.mb-3';
                                }
                            }),
                            submitButton: new FormValidation.plugins.SubmitButton({
                                button: '[type="submit"]'
                            }),
                            autoFocus: new FormValidation.plugins.AutoFocus()
                        }
                    })
                        .on('core.form.valid', function () {
                            console.log('Edit class form valid, submitting');
                            UpdateNewClassData(editClassForm, $('#editClassId').val());

                        })
                        .on('core.form.invalid', function () {
                            const firstInvalidField = editClassForm.querySelector('.is-invalid');
                            if (firstInvalidField) firstInvalidField.focus();
                        })


                } else {
                    console.error('Edit class form not found');
                }
                // Delay to ensure DOM is updated
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to load the edit form.'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading edit class form:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load the edit class form. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Function to handle the Editform submit
function UpdateNewClassData(form, classId) {
    console.log('Edit class form validated for Class ID:', classId);
    var formData = new FormData(form);

    console.log('Edit class form data:', Array.from(formData.entries()));

    $.ajax({
        url: '/Class/Index?handler=EditClass',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Sending edit class AJAX request');
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Processing...',
                    text: 'Processing...',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
            }
        },
        success: function (response) {
            Swal.close();

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message || 'Class updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $('#editClassModal').modal('hide');
                    filterClasses(document.getElementById('filterForm'));
                });
            } else {
                //   🔴 Field-level validation message for "Class name already exists"
                if (response.message && response.message.includes('already exists')) {
                    $('#editClassName').addClass('is-invalid');
                    $('#classNameValidationMessage').text(response.message).show();
                }
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to update the class: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}


function showDeleteConfirmation(classId) {
    //  event.preventDefault(); // prevent form submit
   
    const ClassName = document.querySelector(`.class-name-full-${classId}`).innerText;

    Swal.fire({
        title: 'Delete Class Name',
        // Show the user the user name to be deleted
        html: `<p>Are you sure you want to delete Class ?<br><br><span class="fw-medium text-danger">${ClassName}</span></p>`,
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
            DeleteClassData(classId);
        }
        else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${ClassName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}
function DeleteClassData(classId) {

    $.ajax({
        url: '/Class/Index?handler=DeleteClass',
        type: 'POST',
        data: { classId: classId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            console.log('Sending delete AJAX request for ID:', classId);
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
                    text: response.message || 'Class deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${classId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function') {
                            $('#ClassTable').DataTable().draw(false);
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the Zone.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Delete AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the Campus: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
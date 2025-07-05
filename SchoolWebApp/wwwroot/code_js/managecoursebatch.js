function initializeCourseBatchDataTable() {
    if (!$('#courseBatchTable').length) {
        console.error('Error: #courseBatchTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#courseBatchTable')) {
        $('#courseBatchTable').DataTable().destroy();
    }

    $('#courseBatchTable').DataTable({
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
            searchPlaceholder: 'Search Course Batch',
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
                        title: 'Course Batch Data',
                        text: '<i class="ri-printer-line me-1"></i>Print',
                        className: 'dropdown-item',
                        customize: function (win) {
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
                            $(win.document.body).find('h1').css('text-align', 'center');
                        },
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Course Batch Data',
                        text: '<i class="ri-file-text-line me-1"></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Course Batch Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Course Batch Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Course Batch Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
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
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Course Batch</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#addCourseBatchModal'
                },
                action: function () {
                    const institutionId = $('#InstitutionID').val();
                    const campusId = $('#CampusID').val();

                    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning',
                            text: 'Please select Institution and Campus before adding a Course Batch.',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }

                    $('#addCourseBatchForm')[0].reset();
                 
                    $('#CourseYearID').html('<option value="">Select Course Year</option>');
                    $('#courseBatchValidationMessage').text('').hide();

                    // Populate ModalCourseID dropdown and pre-select the course
                    loadCourses(institutionId, campusId, 'ModalCourseID');
                }
            }
        ],
        responsive: true,
    });
}



// Load Campuses for CourseBatch
function loadCampuses(institutionId) {
    let campusSelectId = 'CampusID';
    $(`#${campusSelectId}`).html('<option value="">Select Campus</option>').prop('disabled', true);
    $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);

    if (!institutionId || institutionId <= 0) {
        $(`#${campusSelectId}`).val('').trigger('change').prop('disabled', true);
        return;
    }

    $.ajax({
        url: '/CourseBatch/Index?handler=LoadCampusesByInstitution',
        type: 'GET',
        data: { institutionId: institutionId },
        success: function (response) {
            $(`#${campusSelectId}`).html(response).prop('disabled', false).trigger('change');
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
// Load Boards for CourseBatch
function loadBoards(institutionId, campusId, targetDropdownId = 'BoardID') {
    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0) {
        $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);
        return;
    }

    $.ajax({
        url: '/CourseBatch/Index?handler=LoadBoardsByInstitutionAndCampus',
        type: 'GET',
        data: { institutionId: institutionId, campusId: campusId },
        success: function (html) {
            const $dropdown = $(`#${targetDropdownId}`);
            $dropdown.html(html).prop('disabled', false);
            $dropdown.trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading boards:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load boards: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            $('#BoardID').prop('disabled', false);
        }
    });
}
function loadCourses(institutionId, campusId, targetDropdownId = 'CourseID') {
    const $targetDropdown = $(`#${targetDropdownId}`);
    $targetDropdown.html('<option value="">Select Course</option>').prop('disabled', true);

    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0) return;

    $.ajax({
        url: '/CourseBatch/Index?handler=LoadCoursesByInstitutionAndCampus',
        type: 'GET',
        data: { institutionId: institutionId, campusId: campusId },
        success: function (response) {
            $targetDropdown.html(response).prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading courses:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load courses: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            $targetDropdown.prop('disabled', false);
        }
    });
}
// Fetch Course Years based on CourseID
function fetchCourseYears(courseId) {
    if (!courseId) {
        $('#CourseYearID').html('<option value="">Select Course Year</option>');
        return;
    }

    $.ajax({
        url: '/CourseBatch/Index?handler=CourseYears',
        type: 'GET',
        data: { courseId: courseId },
        beforeSend: function () {
            $('#CourseYearID').html('<option value="">Loading...</option>');
        },
        success: function (response) {
            $('#CourseYearID').html(response);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load course years: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            $('#CourseYearID').html('<option value="">Select Course Year</option>');
        }
    });
}
$(document).ready(function () {

    const courseBatchFilterForm = document.getElementById('CourseBatchFilterForm');

    if (courseBatchFilterForm) {
        console.log('FormValidation initializing for CourseBatchFilterForm...');

        FormValidation.formValidation(courseBatchFilterForm, {
            fields: {
                InstitutionID: {
                    validators: {
                        notEmpty: {
                            message: 'Please select an Institution.'
                        }
                    }
                },
                CampusID: {
                    validators: {
                        notEmpty: {
                            message: 'Please select a Campus.'
                        }
                    }
                },
                CourseID: {
                    validators: {
                        notEmpty: {
                            message: 'Please select a Course.'
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
                filterCourseBatches(courseBatchFilterForm); // Custom filter function for Course Batches
            })
            .on('core.form.invalid', function () {
                return;
            });

    } else {
        console.error('CourseBatchFilterForm not found');
    }

    // Hide table when filters change
    $('#InstitutionID, #CampusID, #CourseID').on('change', function () {
        $('#CourseBatchFilterTable').hide();
    });

   

});

// CourseBatch Filter Function
function filterCourseBatches(form) {
    const institutionId = form.querySelector('#InstitutionID').value;
    const campusId = form.querySelector('#CampusID').value;
    const courseId = form.querySelector('#CourseID').value;

    $.ajax({
        url: '/CourseBatch/Index?handler=CourseBatchesByCampusAndInstitution',
        type: 'GET',
        data: {
            institutionId: institutionId,
            campusId: campusId,
            courseId: courseId
        },
        beforeSend: function () {
            $('#CourseBatchFilterTable').html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading...</div>');
        },
        success: function (partialView) {
            $('#CourseBatchFilterTable').html(partialView).show();
            if ($('#courseBatchTable').length) {
                initializeCourseBatchDataTable(); // Initialize datatable if needed
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load course batch data: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

// Initialize CourseBatch form validation
const addcourseBatchForm = document.getElementById('addCourseBatchForm');
if (addcourseBatchForm) {
    console.log('FormValidation initializing for addCourseBatchForm...');
    FormValidation.formValidation(addcourseBatchForm, {
        fields: {
            'CourseBatch.CourseID': {
                validators: {
                    notEmpty: { message: 'Please select a course.' }
                }
            },
            'CourseBatch.CourseYearID': {
                validators: {
                    notEmpty: { message: 'Please select a course year.' }
                }
            },
            'CourseBatch.AcademicYearID': {
                validators: {
                    notEmpty: { message: 'Please select an academic year.' }
                }
            },
            'CourseBatch.BatchName': {
                validators: {
                    notEmpty: { message: 'Please enter a batch name.' },
                    stringLength: { max: 50, message: 'Batch name must not exceed 50 characters.' }
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
            console.log('addCourseBatchForm is valid, submitting...');
            submitAddCourseBatchForm(addcourseBatchForm);
        })
        .on('core.form.invalid', function () {
            console.warn('addCourseBatchForm validation failed.');
        });
} else {
    console.error('addCourseBatchForm not found in the DOM');
}


// Submit CourseBatch form via AJAX
function submitAddCourseBatchForm(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/CourseBatch/Index?handler=AddCourseBatch',
        type: 'POST',
        data: formData,
        headers: {
            RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        processData: false,
        contentType: false,
        beforeSend: function () {
            console.log('Submitting AddCourseBatch AJAX request...');
            Swal.fire({
                title: 'Processing...',
                text: 'Submitting...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            console.log('AddCourseBatch AJAX response:', response);

            if (response.success) {
                $('#addCourseBatchModal').modal('hide');
                $('#addCourseBatchForm')[0].reset();
                filterCourseBatches(document.getElementById('CourseBatchFilterForm'));
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Course batch added successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to add course batch.',
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
            console.error('AddCourseBatch AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add course batch: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
// Show confirmation dialog for deleting a Course Batch
function showDeleteCourseBatchConfirmation(courseBatchId) {

    const courseBatchName = document.querySelector(`.course-batch-name-${courseBatchId}`).innerText;

    Swal.fire({
        title: 'Delete Course Batch',
        html: `<p>Are you sure you want to delete this Course Batch?<br><br><span class="fw-medium text-danger">${courseBatchName}</span></p>`,
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
            deleteCourseBatchData(courseBatchId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${courseBatchName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}
// Delete Course Batch via AJAX
function deleteCourseBatchData(courseBatchId) {

    $.ajax({
        url: '/CourseBatch/Index?handler=DeleteCourseBatch',
        type: 'POST',
        data: { courseBatchId: courseBatchId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            console.log('Sending delete AJAX request for CourseBatch ID:', courseBatchId);
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
            console.log('Delete CourseBatch AJAX success:', response);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted Successfully',
                    text: response.message || 'Course Batch deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    $(`tr[data-id="${courseBatchId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function' && $('#CourseBatchTable').length) {
                            $('#CourseBatchTable').DataTable().draw(false);
                        }
                    });

                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the Course Batch.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Delete CourseBatch AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the Course Batch: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

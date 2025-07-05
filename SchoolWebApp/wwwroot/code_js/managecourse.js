// Initialize DataTable for Course
function initializeCourseDataTable() {
    if (!$('#courseTable').length) {
        console.error('Error: #courseTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#courseTable')) {
        $('#courseTable').DataTable().destroy();
    }
    $('#courseTable').DataTable({
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
            searchPlaceholder: 'Search Course',
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
                        title: 'Course Data',
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
                        title: 'Course Data',
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
                        title: 'Course Data',
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
                        title: 'Course Data',
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
                        title: 'Course Data',
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
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Course</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#addCourseModal'
                },
                action: function () {
                    const institutionId = $('#InstitutionID').val();
                    const campusId = $('#CampusID').val();
                    const boardId = $('#BoardID').val();
                    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0 || !boardId || boardId <= 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning',
                            text: 'Please select an Institution, Campus, and Board before adding a course.',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
                    $('#addCourseForm')[0].reset();
                    $('#ModalInstitutionID').val(institutionId);
                    $('#ModalCampusID').val(campusId);
                    $('#ModalBoardID').val(boardId);
                    loadBoards(institutionId, campusId, 'ModalBoardID');
                    $('#addCourseModal').modal('show');
                }
            }
        ],
        responsive: true
    });
}

$(document).ready(function () {
   
    // Form validation for filterCourseForm
    const filterCourseForm = document.getElementById('filterCourseForm');
    if (filterCourseForm) {
        console.log('FormValidation initializing for filterCourseForm...');
        FormValidation.formValidation(filterCourseForm, {
            fields: {
                InstitutionID: {
                    validators: {
                        notEmpty: { message: 'Please select an Institution.' }
                    }
                },
                CampusID: {
                    validators: {
                        notEmpty: { message: 'Please select a Campus.' }
                    }
                },
                BoardID: {
                    validators: {
                        notEmpty: { message: 'Please select a Board.' }
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
                filterCourses(filterCourseForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    } else {
        console.error('filterCourseForm not found');
    }

    // Hide course table on InstitutionID, CampusID, or BoardID change
    $('#InstitutionID, #CampusID, #BoardID').on('change', function () {
        $('#CourseFilterTable').hide();
    });
    loadInstitutionsByCampusType($('#CampusTypeID').val() );
  
});

// Load Campuses
function loadCampuses(institutionId) {
    let campusSelectId = 'CampusID';
    $(`#${campusSelectId}`).html('<option value="">Select Campus</option>').prop('disabled', true);
    $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);
   
    if (!institutionId || institutionId <= 0) {
        $(`#${campusSelectId}`).val('').trigger('change').prop('disabled', true);
        return;
    }

    $.ajax({
        url: '/Course/Index?handler=LoadCampusesByInstitution',
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

// Load Boards
function loadBoards(institutionId, campusId, targetDropdownId = 'BoardID') {
    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0) {
        $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);
       
        return;
    }

    $.ajax({
        url: '/Course/Index?handler=LoadBoardsByInstitutionAndCampus',
        type: 'GET',
        data: { institutionId: institutionId, campusId: campusId },
        success: function (html) {
            const $dropdown = $(`#${targetDropdownId}`);
            $dropdown.html(html).prop('disabled', false);
            $dropdown.trigger('change'); // Trigger change if needed by the caller
            
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

// Filter Courses
function filterCourses(form) {
    const institutionId = form.querySelector('#InstitutionID').value;
    const campusId = form.querySelector('#CampusID').value;
    const boardId = form.querySelector('#BoardID').value;

    $.ajax({
        url: '/Course/Index?handler=FilterCourses',
        type: 'GET',
        data: {
            institutionId: institutionId,
            campusId: campusId,
            boardId: boardId
        },
        beforeSend: function () {
            $('#CourseFilterTable').html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading...</div>');
        },
        success: function (partialView) {
            $('#CourseFilterTable').html(partialView).show();
            if ($('#courseTable').length) {
                initializeCourseDataTable();
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load courses: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

// Fetch Master Courses
function fetchMasterCourses(boardId) {
    const masterCoursesContainer = $('#masterCoursesContainer');
    masterCoursesContainer.html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading...</div>');

    if (!boardId || boardId <= 0) {
        masterCoursesContainer.html('<p class="text-muted">Select a board to view associated master courses.</p>');
        return;
    }

    $.ajax({
        url: '/Course/Index?handler=MasterCourses',
        type: 'GET',
        data: { boardId: boardId },
        success: function (response) {
            masterCoursesContainer.html(response);
            fv.addField('SelectedMasterCourseIDs', {
                selector: 'input[name="SelectedMasterCourseIDs"]',
                validators: {
                    callback: {
                        message: ' ',
                        callback: function (input) {
                            const checkboxes = document.querySelectorAll('input[name="SelectedMasterCourseIDs"]:checked');
                            return checkboxes.length > 0;
                        }
                    }
                }
            });

        },
        error: function (xhr, status, error) {
            console.error('Error loading master courses:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load master courses: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            masterCoursesContainer.html('<p class="text-muted">No master courses available for this board.</p>');
            
        }
    });
}

let fv;
// Form validation for addCourseForm
const addCourseForm = document.getElementById('addCourseForm');
if (addCourseForm) {
    fv= FormValidation.formValidation(addCourseForm, {
        fields: {

            'Course.BoardID': {
                validators: {
                    notEmpty: { message: 'Board is required.' },

                }
            }
        
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: 'is-valid',
               
                rowSelector: function (field, ele) {
                    return field === 'SelectedMasterCourseIDs' ? '#masterCourseCheckboxWrapper' : '.form-floating';
                }
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
    })
        .on('core.form.valid', function () {
            submitAddCourseForm(addCourseForm);
        })
        .on('core.form.invalid', function (e) {

            const validationMessageDiv = document.getElementById('selectedMasterCourseIDsValidationMessage');
            const boardId = document.getElementById('ModalBoardID').value;
            const checkboxes = document.querySelectorAll('input[name="SelectedMasterCourseIDs"]:checked');

            if (boardId && boardId > 0) {
                if (checkboxes.length === 0) {
                    validationMessageDiv.textContent = 'Please select at least one course.';
                    validationMessageDiv.style.display = 'block';

                } else {
                    validationMessageDiv.textContent = '';
                    validationMessageDiv.style.display = 'none';
                }
            } else {
                validationMessageDiv.textContent = '';
                validationMessageDiv.style.display = 'none';
            }
        });

    
} else {
    console.error('addCourseForm not found');
}

// Submit Add Course Form
function submitAddCourseForm(form) {
    

    var formData = new FormData(form);
   

    $.ajax({
        url: '/Course/Index?handler=AddCourse',
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
                text: 'Submitting...',
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
                    title: 'Success',
                    text: response.message || 'Course(s) and years added successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $('#addCourseModal').modal('hide');
                    filterCourses(document.getElementById('filterCourseForm'));
                });
            } else {
                Swal.fire({
                    icon: 'warning', // Change to warning for clarity
                    title: 'Warning',
                    text: response.message || 'Failed to add course.',
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
            console.error('Add course AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to add course: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}


// Show confirmation to delete CourseYear
function showDeleteCourseYearConfirmation(courseYearId) {
    // Find the row based on CourseYearID
    const row = $(`tr[data-courseyear-id="${courseYearId}"]`);

    // Get Course Name (2nd column)
    const courseName = row.find('td:nth-child(2)').text().trim();

    // Get Course Year Name (3rd column)
    const courseYearName = row.find('td:nth-child(3)').text().trim();

    Swal.fire({
        title: 'Delete Course',
        html: `<p>Are you sure you want to delete this?<br><br>
               <span class="fw-medium text-danger">Course:</span> <span class="fw-medium text-primary">${courseName}</span><br>
               <span class="fw-medium text-danger">Year:</span> <span class="fw-medium text-primary">${courseYearName}</span></p>`,
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
            deleteCourseYearData(courseYearId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${courseName} - ${courseYearName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}
// Perform AJAX deletion of CourseYear
function deleteCourseYearData(courseYearId) {
    $.ajax({
        url: '/Course/Index?handler=DeleteCourseYear', 
        type: 'POST',
        data: { courseYearId: courseYearId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
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
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deletion Successful',
                    text: response.message || 'Course Year deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Remove the deleted row
                    $(`tr[data-courseyear-id="${courseYearId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function' && $('#courseTable').length) {
                            $('#courseTable').DataTable().draw(false);
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Deletion Failed',
                    text: response.message || 'Failed to delete the Course Year.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Delete CourseYear AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the Course Year: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

// Edit Course
function courseEdit(courseId, courseYearId) {
    $.ajax({
        url: '/Course/Index?handler=EditCourseForm',
        type: 'GET',
        data: { courseId: courseId, courseYearId: courseYearId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching course details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (typeof response === 'string') {
                $('#editCourseFormContainer').html(response);
                $('#editCourseModal').modal('show');

                const editCourseForm = document.getElementById('editCourseForm');
                if (editCourseForm) {
                    FormValidation.formValidation(editCourseForm, {
                        fields: {
                            'Course.CourseName': {
                                validators: {
                                    notEmpty: { message: 'Course name is required' },
                                    stringLength: { max: 100, message: 'Max 100 characters allowed' }
                                }
                            },
                            'CourseYearName': {
                                validators: {
                                    notEmpty: { message: 'Course year name is required' },
                                    stringLength: { max: 100, message: 'Max 100 characters allowed' }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap5: new FormValidation.plugins.Bootstrap5({
                                eleValidClass: 'is-valid',
                                rowSelector: '.mb-3'
                            }),
                            submitButton: new FormValidation.plugins.SubmitButton({
                                button: '[type="submit"]'
                            }),
                            autoFocus: new FormValidation.plugins.AutoFocus()
                        }
                    })
                        .on('core.form.valid', function () {
                            console.log('Form validated successfully');
                            updateCourseData(editCourseForm);
                        }).on('core.form.invalid', function () {
                            const firstInvalidField = editCourseForm.querySelector('.is-invalid');
                            if (firstInvalidField) firstInvalidField.focus();
                        })

                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to load the edit form.'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load the edit course form. Please try again.'
            });
        }
    });
}
function updateCourseData(form) {
    var formData = new FormData(form);

    $.ajax({
        url: '/Course/Index?handler=EditCourse',
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
                text: 'Updating course details...',
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
                    title: 'Success',
                    text: response.message || 'Course updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $('#editCourseModal').modal('hide');
                    filterCourses(document.getElementById('filterCourseForm'));
                });
            } else {
                if (response.field === "CourseName") {
                    $('#courseNameValidationMessage').text(response.message).addClass('text-danger');
                    $('#editCourseName').addClass('is-invalid').focus();
                } else if (response.field === "CourseYearName") {
                    $('#courseYearNameValidationMessage').text(response.message).addClass('text-danger');
                    $('#editCourseYearName').addClass('is-invalid').focus();
                }

            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to update the course: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
// DropDown Institutions by Campus Type
function loadInstitutionsByCampusType(campusTypeId) {
    $('#InstitutionID').html('<option value="">Select Institution</option>').prop('disabled', true);
    $('#CampusID').html('<option value="">Select Campus</option>').prop('disabled', true);
    $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);
  
    if (!campusTypeId || campusTypeId <= 0) {
        $('#InstitutionID').prop('disabled', false);
        return;
    }

    $.ajax({
        url: '/Class/Index?handler=LoadInstitutionsByCampusType',
        type: 'GET',
        data: { campusTypeId: campusTypeId },
        success: function (response) {
            $('#InstitutionID').html(response).prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading institutions:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load institutions: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            $('#InstitutionID').prop('disabled', false);
        }
    });
}

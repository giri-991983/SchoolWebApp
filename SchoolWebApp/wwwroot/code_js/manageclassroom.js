

function initializeClassRoomDataTable() {
    if (!$('#ClassRoomTable').length) {
        console.error('Error: #ClassRoomTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#ClassRoomTable')) {
        $('#ClassRoomTable').DataTable().destroy();
    }
    $('#ClassRoomTable').DataTable({
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
            searchPlaceholder: 'Search Class Room',
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
                        title: 'Class Room Data',
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
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'csv',
                        title: 'Class Room Data',
                        text: '<i class="ri-file-text-line me-1"></i>Csv',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'excel',
                        title: 'Class Room Data',
                        text: '<i class="ri-file-excel-line me-1"></i>Excel',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'pdf',
                        title: 'Class Room Data',
                        text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            format: {
                                body: function (data, row, column, node) {
                                    return data;
                                }
                            }
                        }
                    },
                    {
                        extend: 'copy',
                        title: 'Class Room Data',
                        text: '<i class="ri-file-copy-line me-1"></i>Copy',
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Class Room</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#addClassRoomModal'
                },
                action: function () {
                    const institutionId = $('#InstitutionID').val();
                    const campusId = $('#CampusID').val();
                    const boardId = $('#BoardID').val();
                    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0 || !boardId || boardId <= 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning',
                            text: 'Please select an Institution, Campus, and Board before adding a class room.',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
                    $('#addClassRoomForm')[0].reset();
                    $('#ModalInstitutionID').val(institutionId);
                    $('#ModalCampusID').val(campusId);
                    $('#ModalBoardID').val(boardId);
                    $('#addClassRoomModal').modal('show');
                    // Trigger loadClasses to populate GradeID based on BoardID
                    loadClasses(boardId, institutionId, campusId);
                }
            }
        ],
        responsive: true,
    });
}

$(document).ready(function () {
 

const classroomFilterForm = document.getElementById('ClassRoomFilterForm');

if (classroomFilterForm) {
    console.log('FormValidation initializing for ClassRoomFilterForm...');

    FormValidation.formValidation(classroomFilterForm, {
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
                        message: 'Please select an Institution.'
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
            filterClassRooms(classroomFilterForm); // Your custom function to filter classrooms
        })
        .on('core.form.invalid', function () {
            return;
        });

} else {
    console.error('ClassRoomFilterForm not found');
    }
    // Hide table on InstitutionID change
    $('#InstitutionID').on('change', function () {
     
        $('#ClassRoomFilterTable').hide();
       
    });

    // Hide table on CampusID change
    $('#CampusID').on('change', function () {
       
        $('#ClassRoomFilterTable').hide();
      
    });
    // Hide table on BoardID change
    $('#BoardID').on('change', function () {
        $('#ClassRoomFilterTable').hide();
    });
});

//Filteration of Table
function filterClassRooms(form) {
    const campusId = form.querySelector('#CampusID').value;
    const institutionId = form.querySelector('#InstitutionID').value;
    const boardId = form.querySelector('#BoardID').value;

    $.ajax({
        url: '/ClassRoom/Index?handler=ClassRoomsByCampusAndInstitution',
        type: 'GET',
        data: {
            campusId: campusId,
            institutionId: institutionId,
            boardId: boardId
        },
        success: function (partialView) {
            $('#ClassRoomFilterTable').html(partialView).show();
            if ($('#ClassRoomTable').length) {
                initializeClassRoomDataTable(); 
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load classroom data: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
       
// DropDown Campus With Selecting Institution
function loadCampuses(institutionId) {
    let campusSelectId = 'CampusID';
    $(`#${campusSelectId}`).html('<option value="">Select Campus</option>').prop('disabled', true);

    if (!institutionId || institutionId <= 0) {
        $(`#${campusSelectId}`).val('').trigger('change');
        $(`#${campusSelectId}`).prop('disabled', false);
        return;
    }

    $.ajax({
        url: '/ClassRoom/Index?handler=LoadCampusesByInstitution',
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

// DropDown Boarding With Selecting Institution and Campus

function loadBoards(institutionId, campusId) {
    if (!institutionId || institutionId <= 0 || !campusId || campusId <= 0) {
        $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);
        return;
    }

    $.ajax({
        url: '/ClassRoom/Index?handler=LoadBoardsByInstitutionAndCampus',
        type: 'GET',
        data: { institutionId: institutionId, campusId: campusId },
        success: function (html) {
            $('#BoardID').html(html).prop('disabled', false);
            $('#BoardID').trigger('change'); // Trigger change to load classes if needed
        },
        error: function () {
            alert('Failed to load boards.');
            $('#BoardID').html('<option value="">Select Board</option>').prop('disabled', true);
        }
    });
}

function loadClasses(boardId, institutionId, campusId) {
    const gradeSelectId = 'GradeID';
    const $gradeSelect = $(`#${gradeSelectId}`);

    $gradeSelect.html('<option value="">Select Grade</option>').prop('disabled', true);

    if (!boardId || boardId <= 0) {
        $gradeSelect.val('').trigger('change').prop('disabled', false);
        return;
    }

    institutionId = parseInt(institutionId) || 0;
    campusId = parseInt(campusId) || 0;

    $.ajax({
        url: '/ClassRoom/Index?handler=LoadClassesByBoard',
        type: 'GET',
        data: {
            boardId: boardId,
            institutionId: institutionId,
            campusId: campusId
        },
        success: function (response) {
            $gradeSelect.html(response);
            $gradeSelect.prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading classes:', { status, error, responseText: xhr.responseText });
            let errorMessage = 'An error occurred while loading classes.';
            try {
                const errorObj = JSON.parse(xhr.responseText);
                errorMessage = errorObj.message || errorMessage;
            } catch (e) {
                // Use generic message if responseText is not JSON
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonText: 'OK'
            });
            $gradeSelect.prop('disabled', false);
        }
    });
}


// Initialize ClassRoom form validation
const addClassRoomForm = document.getElementById('addClassRoomForm');
if (addClassRoomForm) {
    console.log('FormValidation initializing for addClassRoomForm...');
    FormValidation.formValidation(addClassRoomForm, {
        fields: {
            'ClassRoom.ClassRoomName': {
                validators: {
                    notEmpty: { message: 'Please enter a class room name.' },
                    stringLength: { max: 50, message: 'Class room name must not exceed 50 characters.' }
                }
            },
            'ClassRoom.GradeID': {
                validators: {
                    notEmpty: { message: 'Please select a grade.' }
                }
            },
            'ClassRoom.SeatingCapacity': {
                validators: {
                    notEmpty: { message: 'Please enter a seating capacity.' },
                    numeric: { message: 'Seating capacity must be a number.' },
                     greaterThanOrEqual: {
                        value: 1,
                        message: 'Available seats must be 0 or greater.'
                    },
                }
            },
            'ClassRoom.AvailableSeats': {
                validators: {
                    notEmpty: { message: 'Please enter available seats.' },
                    numeric: { message: 'Available seats must be a number.' },
                    greaterThanOrEqual: {
                        value: 0,
                        message: 'Available seats must be 0 or greater.'
                    },
                    callback: {
                        message: 'Available seats cannot exceed seating capacity.',
                        callback: function (input) {
                            const capacity = parseInt(document.getElementById('SeatingCapacity')?.value) || 0;
                            const available = parseInt(input.value) || 0;
                            return available <= capacity;
                        }
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
            console.log('addClassRoomForm is valid, submitting...');
            submitAddClassRoomForm(addClassRoomForm);
        })
        .on('core.form.invalid', function () {
            console.warn('addClassRoomForm validation failed.');
        });
} else {
    console.error('addClassRoomForm not found in the DOM');
}


// Submit ClassRoom form via AJAX
function submitAddClassRoomForm(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/ClassRoom/Index?handler=AddClassRoom',
        type: 'POST',
        data: formData,
        headers: {
            RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        processData: false,
        contentType: false,
        beforeSend: function () {
            console.log('Submitting AddClassRoom AJAX request...');
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
            console.log('AddClassRoom AJAX response:', response);

            if (response.success) {
                $('#addClassRoomModal').modal('hide');
                $('#addClassRoomForm')[0].reset();
                filterClassRooms(document.getElementById('ClassRoomFilterForm'));// Refresh the data
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Class room added successfully!',
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
            Swal.close();
            console.error('AddClassRoom AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add class room: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
// Show confirmation dialog for deleting a Class Room
function showDeleteClassRoomConfirmation(classRoomId) {
    
    const classRoomName = document.querySelector(`.class-room-name-${classRoomId}`).innerText;

    Swal.fire({
        title: 'Delete Class Room',
        html: `<p>Are you sure you want to delete this Class Room?<br><br><span class="fw-medium text-danger">${classRoomName}</span></p>`,
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
            DeleteClassRoomData(classRoomId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${classRoomName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}

// Delete Class Room via AJAX
function DeleteClassRoomData(classRoomId) {
    

    $.ajax({
        url: '/ClassRoom/Index?handler=DeleteClassRoom',
        type: 'POST',
        data: { classRoomId: classRoomId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            console.log('Sending delete AJAX request for ClassRoom ID:', classRoomId);
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
            console.log('Delete ClassRoom AJAX success:', response);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted Successfully',
                    text: response.message || 'Class Room deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    
                    $(`tr[data-id="${classRoomId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function' && $('#ClassRoomTable').length) {
                            $('#ClassRoomTable').DataTable().draw(false);
                        }
                    });

                
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the Class Room.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Delete ClassRoom AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the Class Room: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function classRoomEdit(classroomId) {
    console.log('Edit button clicked for Class ID:', classroomId);
    $.ajax({
        url: '/ClassRoom/Index?handler=EditClassRoomForm',
        type: 'GET',
        data: { classroomId: classroomId },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        beforeSend: function () {
            console.log('Loading edit class room form...');
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching class room details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();

            if (typeof response === 'string') {
                $('#editClassRoomFormContainer').html(response);
                $('#editClassRoomModal').modal('show');

                const editClassRoomForm = document.getElementById('editClassRoomForm');
                if (editClassRoomForm) {
                    console.log('FormValidation initializing for editClassRoomForm...');
                    FormValidation.formValidation(editClassRoomForm, {
                        fields: {
                            'ClassRoom.ClassRoomName': {
                                validators: {
                                    notEmpty: { message: 'Please enter a class room name.' },
                                    stringLength: { max: 50, message: 'Class room name must not exceed 50 characters.' }
                                }
                            },
                            'ClassRoom.GradeID': {
                                validators: {
                                    notEmpty: { message: 'Please select a grade.' }
                                }
                            },
                            'ClassRoom.SeatingCapacity': {
                                validators: {
                                    notEmpty: { message: 'Please enter a seating capacity.' },
                                    numeric: { message: 'Seating capacity must be a number.' },
                                    greaterThanOrEqual: {
                                        value: 1,
                                        message: 'Seating capacity must be 1 or greater.'
                                    }
                                }
                            },
                            'ClassRoom.AvailableSeats': {
                                validators: {
                                    notEmpty: { message: 'Please enter available seats.' },
                                    numeric: { message: 'Available seats must be a number.' },
                                    greaterThanOrEqual: {
                                        value: 0,
                                        message: 'Available seats must be 0 or greater.'
                                    },
                                    callback: {
                                        message: 'Available seats cannot exceed seating capacity.',
                                        callback: function (input) {
                                            const capacity = parseInt(document.getElementById('EditSeatingCapacity')?.value) || 0;
                                            const available = parseInt(input.value) || 0;
                                            return available <= capacity;
                                        }
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
                            console.log('editClassRoomForm is valid, submitting...');
                            submitEditClassRoomForm(editClassRoomForm);
                        })
                        .on('core.form.invalid', function () {
                            console.warn('editClassRoomForm validation failed.');
                        });
                } else {
                    console.error('editClassRoomForm not found in the DOM');
                }
            }
        },
        error: function (xhr) {
            Swal.close();
            console.error('Failed to load Edit form:', xhr.responseText);
            Swal.fire('Error', 'Unable to fetch edit form. Please try again.', 'error');
        }
    });
}

// Submit Edit Class Room Form via AJAX
function submitEditClassRoomForm(form) {
    const formData = new FormData(form);

    $.ajax({
        url: '/ClassRoom/Index?handler=EditClassRoom',
        type: 'POST',
        data: formData,
        headers: {
            RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        processData: false,
        contentType: false,
        beforeSend: function () {
            console.log('Submitting EditClassRoom AJAX request...');
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
            console.log('EditClassRoom AJAX response:', response);
            if (response.success) {
                $('#editClassRoomModal').modal('hide');
                $('#editClassRoomForm')[0].reset();
                filterClassRooms(document.getElementById('ClassRoomFilterForm'));
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Class Room updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            else {
                //   🔴 Field-level validation message for "Class name already exists"
                if (response.message && response.message.includes('already exists')) {
                    $('#EditClassRoomName').addClass('is-invalid');
                    $('#classRoomNameValidationMessage').text(response.message).show();
                }
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            console.error('EditClassRoom AJAX error:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update Class Room: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

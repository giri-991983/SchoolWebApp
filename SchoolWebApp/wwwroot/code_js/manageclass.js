$(document).ready(function () {

    //  Zone DataTable Initialization
    $('#ClassTable').DataTable({

        order: [[7, 'asc']],
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

                    // Reset form
                    $('#addClassForm')[0].reset();
                    $('.select2').val('').trigger('change');
                    $('#masterClassesContainer').html('<p class="text-muted">Select a board to view associated stages and classes.</p>');

                    // Populate hidden fields
                    $('#ModalCampusID').val(campusId);
                    $('#ModalInstitutionID').val(institutionId);

                    // Open modal
                    $('#addClassModal').modal('show');
                }
            }
        ],
        responsive: true,

    });


});

//Filter Form styles to default size after DataTable initialization
setTimeout(() => {
    $('.dataTables_filter input').addClass('ms-0');
    $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
    $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
}, 300);


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
function loadInstitutions(campusId) {
    let institutionSelectId = 'InstitutionID';
    $(`#${institutionSelectId}`).html('<option value="">Select Institution</option>').prop('disabled', true);

    if (!campusId || campusId <= 0) {
        $(`#${institutionSelectId}`).val('').trigger('change');
        $(`#${institutionSelectId}`).prop('disabled', false);
        return;
    }

    $.ajax({
        url: '/Class/Index?handler=LoadComponent',
        type: 'GET',
        data: { id: campusId },
        success: function (response) {
            $(`#${institutionSelectId}`).html(response);
            $(`#${institutionSelectId}`).prop('disabled', false).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Error loading institutions:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load institutions: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
            $(`#${institutionSelectId}`).prop('disabled', false);
        }
    });
} 
function filterClasses() {
    var campusId = $('#CampusID').val() || 0;
    var institutionId = $('#InstitutionID').val() || 0;
    var boardId = $('#BoardID').val() || 0;

    $.ajax({
        url: '/Class/Index?handler=ClassesByCampusAddInstitution',
        type: 'GET',
        data: { campusId: campusId, institutionId: institutionId, boardId: boardId },
        success: function (partialView) {
            $('#ClassTable tbody').html(partialView);
           
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
function submitAddClassesForm() {
    var form = $('#addClassForm');
    console.log('Submitting form:', form.serialize());
    $.ajax({
        url: '/Class/Index?handler=AddClasses',
        type: 'POST',
        data: form.serialize(),
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
            console.log('Form submission response:', response);
            if (response.success) {
                $('#addClassModal').modal('hide');
                filterClasses();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Classes added successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to add classes.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error submitting form:', { status, error, responseText: xhr.responseText });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add classes: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
function showDeleteConfirmation(classId) {
    //  event.preventDefault(); // prevent form submit
    debugger;
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
    debugger;
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
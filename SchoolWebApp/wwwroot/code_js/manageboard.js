function initializeDataTable() {
    if (!$('#BoardTable').length) {
        console.error('Error: #BoardTable element not found in the DOM');
        return;
    }
    if ($.fn.DataTable.isDataTable('#BoardTable')) {
        $('#BoardTable').DataTable().destroy();
    }
    $('#BoardTable').DataTable({
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
            searchPlaceholder: 'Search Boards',
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
                    { extend: 'print', title: 'Board Data', text: '<i class="ri-printer-line me-1"></i>Print', className: 'dropdown-item' },
                    { extend: 'csv', title: 'Board Data', text: '<i class="ri-file-text-line me-1"></i>Csv', className: 'dropdown-item' },
                    { extend: 'excel', title: 'Board Data', text: '<i class="ri-file-excel-line me-1"></i>Excel', className: 'dropdown-item' },
                    { extend: 'pdf', title: 'Board Data', text: '<i class="ri-file-pdf-line me-1"></i>Pdf', className: 'dropdown-item' },
                    { extend: 'copy', title: 'Board Data', text: '<i class="ri-file-copy-line me-1"></i>Copy', className: 'dropdown-item' }
                ]
            },
            {
                text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add Board</span>',
                className: 'add-new btn btn-primary waves-effect waves-light',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createBoardOffcanvas'
                } ,

                action: function () {
                    $('#addBoardForm')[0].reset();
                    $('#boardNameValidationMessage').text('').hide();
                    $('#campusTypeValidationMessage').text('').hide();

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

$(document).ready(function () {
    const boardFilterForm = document.getElementById('filterForm');

    if (boardFilterForm) {
        FormValidation.formValidation(boardFilterForm, {
            fields: {
                CampusTypeID: {
                    validators: {
                        notEmpty: { message: 'Please select a Campus Type.' }
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
                filterBoards(boardFilterForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    } else {
        console.error('boardFilterForm not found');
    }

    $('#CampusTypeID').on('change', function () {
        $('#FilterTable').hide();
    });
});

function filterBoards(form) {
    const campusTypeId = form.querySelector('#CampusTypeID').value;

    $.ajax({
        url: '/MasterPages/Boards/Index?handler=BoardsByCampusType',
        type: 'GET',
        data: { campusTypeId: campusTypeId },
        success: function (partialView) {
            $('#FilterTable').html(partialView).show();
            if ($('#BoardTable').length) {
                initializeDataTable();
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load board data: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

const addBoardForm = document.getElementById('addBoardForm');
if (addBoardForm) {
    FormValidation.formValidation(addBoardForm, {
        fields: {
            campusTypeId: {
                validators: {
                    notEmpty: { message: 'Please select a Campus Type in the filter form.' }
                }
            },
            boardName: {
                validators: {
                    notEmpty: { message: 'Board Name is required.' },
                    stringLength: { max: 200, message: 'Board Name cannot exceed 200 characters.' }
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
            submitAddBoardForm(addBoardForm);
        })
        .on('core.form.invalid', function () {
            return;
        });
}

function submitAddBoardForm(form) {
    const formData = new FormData(form);
    $.ajax({
        url: '/MasterPages/Boards/Index?handler=AddBoard',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
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
            Swal.close();
            if (response.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message || 'Board added successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    const offcanvasEl = document.getElementById('createBoardOffcanvas');
                    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                    if (offcanvas) {
                        offcanvas.hide();
                    }

                    filterBoards(document.getElementById('filterForm'));
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to add board.',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add board: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function boardEdit(boardId) {
    $.ajax({
        url: '/MasterPages/Boards/Index?handler=EditBoardForm',
        type: 'GET',
        data: { boardId: boardId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching board details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },
        success: function (response) {
            Swal.close();
            if (typeof response === 'string') {
                $('#editBoardFormContainer').html(response);
               
                const editBoardForm = document.getElementById('editBoardForm');
                if (editBoardForm) {
                   
                    FormValidation.formValidation(editBoardForm, {
                        fields: {
                            boardName: {
                                validators: {
                                    notEmpty: { message: 'Board Name is required.' },
                                    stringLength: { max: 200, message: 'Board Name cannot exceed 200 characters.' }
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
                            UpdateBoardData(editBoardForm);
                        })
                        .on('core.form.invalid', function () {
                            return;
                        });
                }
                $('#editBoardOffcanvas').offcanvas('show');
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
                text: 'Failed to load the edit board form: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function UpdateBoardData(form) {
    const formData = new FormData(form);
    $.ajax({
        url: '/MasterPages/Boards/Index?handler=EditBoard',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
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
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message || 'Board updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $('#editBoardOffcanvas').modal('hide');
                    filterBoards(document.getElementById('filterForm'));
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: response.message || 'Failed to update board.',
                    confirmButtonText: 'OK'
                });
                }
            
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to update the board: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}

function showDeleteConfirmation(boardId, boardName) {
    Swal.fire({
        title: 'Delete Board',
        html: `<p>Are you sure you want to delete Board?<br><br><span class="fw-medium text-danger">${boardName}</span></p>`,
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
            DeleteBoardData(boardId);
        } else {
            Swal.fire({
                title: 'Cancelled',
                html: `<p><span class="fw-medium text-primary">${boardName}</span> is not deleted!</p>`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-success waves-effect waves-light'
                }
            });
        }
    });
}

function DeleteBoardData(boardId) {
    $.ajax({
        url: '/MasterPages/Boards/Index?handler=DeleteBoard',
        type: 'POST',
        data: { boardId: boardId },
        headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
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
                    text: response.message || 'Board deleted successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    $(`tr[data-id="${boardId}"]`).fadeOut(500, function () {
                        $(this).remove();
                        if (typeof $.fn.DataTable === 'function') {
                            $('#BoardTable').DataTable().draw(false);
                        }
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete the board.',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete the board: ' + (xhr.responseText || error),
                confirmButtonText: 'OK'
            });
        }
    });
}
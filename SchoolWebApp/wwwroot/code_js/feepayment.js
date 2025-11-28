'use strict';

$(document).ready(function () {

    initializeFeePaymentTable();

    const addFeePaymentForm = document.getElementById('addFeePaymentForm');
    if (addFeePaymentForm) {
        FormValidation.formValidation(addFeePaymentForm, {
            fields: {
                feePaymentMode: {
                    validators: {
                        notEmpty: { message: 'Fee Payment Mode is required.' },
                        stringLength: {
                            max: 50,
                            message: 'Fee Payment Mode must be less than 50 characters'
                        }, regexp: {
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'Fee Payment Mode must not contain special characters or numbers'
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
                submitAddFeePaymentMode(addFeePaymentForm);
            })
            .on('core.form.invalid', function () {
                return;
            });
    }

});



function initializeFeePaymentTable() {

    if (!$('#FeePaymentTable').length) {
        console.error('Error: #FeePaymentTable not found in DOM');
        return;
    }

    if ($.fn.DataTable.isDataTable('#FeePaymentTable')) {
        $('#FeePaymentTable').DataTable().destroy();
    }

    $('#FeePaymentTable').DataTable({
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
            searchPlaceholder: 'Search Payment Modes',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },

        buttons: [
            {
                text:
                    '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i>' +
                    '<span class="d-none d-sm-inline-block">Add </span>',
                className: 'btn btn-primary waves-effect waves-light add-new',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#createFeePaymentOffcanvas'
                },
                action: function () {
                    $('#addFeePaymentForm')[0].reset();
                    $('#feePaymentModeValidationMessage').text('').hide();
                }
            }
        ],

        responsive: true
    });

    // Styling adjustments for DataTable UI
    setTimeout(() => {
        $('.dataTables_filter input').addClass('ms-0');
        $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
        $('div.dataTables_wrapper div.dataTables_info').addClass(
            'text-start text-sm-center text-md-start'
        );
    }, 300);
}




function submitAddFeePaymentMode(form) {

    const formData = new FormData(form);

    $.ajax({
        url: '/MasterPages/FeePaymentMode?handler=AddFeePaymentMode', 
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken':
                $('input[name="__RequestVerificationToken"]').val()
        },

        beforeSend: function () {
            Swal.fire({
                title: 'Processing...',
                text: 'Saving Payment Mode...',
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
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    //const offcanvasEl = document.getElementById('createFeePaymentOffcanvas');
                    //const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                    //if (offcanvas) offcanvas.hide();

                    window.location.reload();
                });
            } else {
                if (response.message && response.message.toLowerCase().includes('already exists')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: response.message || 'This FeePaymentMode already exists.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-warning waves-effect waves-light'
                        }
                    });
                }

                else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: response.message,
                        confirmButtonText: 'OK'
                    });
                }
            }
        },

        error: function (xhr, status, error) {
            const errorMsg = xhr.responseText || error;
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to add Payment Mode: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                 customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                }
            
            });
        }
    });
}


function feePaymentEdit(id) {

    $.ajax({
        url: '/MasterPages/FeePaymentMode/Index?handler=EditFeePaymentForm',   
        type: 'GET',
        data: { id: id },
        headers: {
            RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },

        beforeSend: function () {
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching Payment Mode details...',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },

        success: function (response) {
            Swal.close();

           
            if (typeof response === "string") {

                $("#editFeePaymentFormContainer").html(response);  

                //const offcanvasEl = document.getElementById('editFeePaymentOffcanvas');
                //const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
                //offcanvas.show();

                const editForm = document.getElementById('editFeePaymentForm');

                if (editForm) {

                    
                    FormValidation.formValidation(editForm, {
                        fields: {
                            'FeePayment.FeePaymentMode': {
                                validators: {
                                    notEmpty: { message: "Fee Payment Mode is required" },
                                    stringLength: {
                                        max: 50,
                                        message: 'Fee Payment Mode must be less than 50 characters'
                                    }, regexp: {
                                        regexp: /^[a-zA-Z\s]+$/,
                                        message: 'Fee Payment Mode must not contain special characters or numbers'
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
                    }).on("core.form.valid", function () {
                        submitEditFeePaymentMode(editForm);
                    });

                }
                $('#editFeePaymentOffcanvas').offcanvas('show');

        //    } else {
        //        Swal.fire({
        //            icon: "error",
        //            title: "Error",
        //            text: response.message || "Unable to load edit form."
        //        });
           }
        },

        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load edit form: " + (xhr.responseText || error)
            });
        }
    });
}




function submitEditFeePaymentMode(form) {

    const formData = new FormData(form);  
    $.ajax({
        url: '/MasterPages/FeePaymentMode/Index?handler=EditFeePaymentMode',  
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },

        beforeSend: function () {
            Swal.fire({
                title: "Processing...",
                text: "Updating Payment Mode...",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
        },

        success: function (response) {
            Swal.close();

            if (response.success) {

                Swal.fire({
                    icon: "success",
                    title: "Updated Successfully",
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => window.location.reload());

            } else {
                if (response.message?.toLowerCase().includes('already exists')) {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: response.message|| 'This FeePaymentMode already exists.', 
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-warning waves-effect waves-light'
                    }

                });

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Failed to update.'
                    });
                }

                //$("#EditFeePaymentModeInput").addClass("is-invalid");
                //$('#editFeePaymentValidationMessage').text(response.message);
            }
        },

        error: function (xhr, status, error) {
           
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update: " + (xhr.responseText || error)
            });
        }
    });
} function feePaymentDelete(id) {

    //  confirmation message
    const modeName = document.querySelector(`tr[data-id="${id}"] td:nth-child(2)`)?.innerText || "this payment mode";

    Swal.fire({
        title: "Delete Payment Mode",
        html: `<p>Are you sure you want to delete <span class="fw-medium text-danger">${modeName}</span>?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: "btn btn-danger me-3",
            cancelButton: "btn btn-secondary"
        }
    }).then(result => {
        if (result.isConfirmed) {
            deleteFeePaymentMode(id);
        } else {
            Swal.fire({
                title: "Cancelled",
                html: `<p><span class="fw-medium text-primary">${modeName}</span> is not deleted!</p>`,
                icon: "info",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            });
        }
    });
}

function deleteFeePaymentMode(id) {

    $.ajax({
        url: '/MasterPages/FeePaymentMode?handler=DeleteFeePaymentMode',  
        type: 'POST',
        data: { id: id },
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },

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
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {

                    // Remove row with animation
                    $(`tr[data-id="${id}"]`).fadeOut(500, function () {
                        $(this).remove();

                        // Redraw DataTable after removal
                        $('#FeePaymentTable').DataTable().draw(false);
                    });

                });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to delete Payment Mode.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    }
                });

            }
        },

        error: function (xhr, status, error) {

            Swal.fire({
                icon: 'error',
                title: 'Deletion Failed',
                text: 'Failed to delete Payment Mode: ' + (xhr.responseText || error),
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });

        }
    });

}

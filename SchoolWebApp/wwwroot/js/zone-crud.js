'use strict';

$(document).ready(function () {
    console.log('jQuery initialized for Zone management');

    // Dependency Checks
    if (typeof $.fn.dataTable === 'undefined') console.error('DataTables not loaded');
    if (typeof $.fn.validate === 'undefined') console.error('jQuery Validate not loaded');
    if (typeof Swal === 'undefined') console.error('SweetAlert2 not loaded');

    // DataTable Initialization
    const $dataTable = $('#ZoneTable');
    let dataTable = null;
    if ($dataTable.length) {
        console.log('DataTable found');
        if (typeof $.fn.DataTable === 'function') {
            dataTable = $dataTable.DataTable({
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
                    searchPlaceholder: 'Search Zones',
                    paginate: {
                        next: '<i class="ri-arrow-right-s-line"></i>',
                        previous: '<i class="ri-arrow-left-s-line"></i>'
                    }
                },
                buttons: [
                    {
                        extend: 'collection',
                        className: 'btn btn-outline-secondary dropdown-toggle me-4 waves-effect waves-light',
                        text: '<i class="ri-download-line ri-16px me-1"></i><span class="d-none d-sm-inline-block">Export</span>',
                        buttons: [
                            { extend: 'print', title: 'Zone Data', text: '<i class="ri-printer-line me-1"></i>Print', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] } },
                            { extend: 'csv', title: 'Zones', text: '<i class="ri-file-text-line me-1"></i>CSV', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] } },
                            { extend: 'excel', title: 'Zones', text: '<i class="ri-file-excel-line me-1"></i>Excel', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] } },
                            { extend: 'pdf', title: 'Zones', text: '<i class="ri-file-pdf-line me-1"></i>PDF', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] } },
                            { extend: 'copy', title: 'Zones', text: '<i class="ri-file-copy-line me-1"></i>Copy', className: 'dropdown-item', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] } }
                        ]
                    },
                    {
                        text: '<i class="ri-add-line ri-16px me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add Zone</span>',
                        className: 'add-new btn btn-primary waves-effect waves-light',
                        attr: { 'data-bs-toggle': 'offcanvas', 'data-bs-target': '#createZoneOffcanvas' }
                    }
                ],
                responsive: true,
                columnDefs: [
                    { targets: 0, responsivePriority: 1 }, // ZoneID
                    { targets: 1, responsivePriority: 2 }, // ZoneName
                    { targets: 2, responsivePriority: 3 }, // ZGUID
                    { targets: 3, responsivePriority: 4 }, // Institution
                    { targets: 4, responsivePriority: 5 }, // ShortCode
                    { targets: 5, responsivePriority: 6 }, // Status
                    { targets: 6, responsivePriority: 7 }, // CreatedDate
                    {
                        targets: -1, // Actions
                        searchable: false,
                        orderable: false,
                        responsivePriority: 1,
                        render: data => data // Preserve HTML
                    }
                ],
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: row => 'Details of ' + row.data()[1]
                        }),
                        type: 'column',
                        renderer: (api, rowIdx, columns) => {
                            const data = $.map(columns, (col, i) => {
                                if (i < columns.length - 1) {
                                    return `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                                                <td><strong>${col.title}:</strong></td>
                                                <td>${col.data}</td>
                                            </tr>`;
                                }
                                return '';
                            }).join('');
                            return data ? $('<table class="table mt-3"/>').append(`<tbody>${data}</tbody>`) : false;
                        }
                    }
                },
                drawCallback: () => $('.dropdown-toggle').dropdown()
            });
        } else {
            console.error('DataTables not loaded');
        }
    } else {
        console.error('ZoneTable not found in DOM');
    }

    // Validation Setup Function
    function setupValidation(formId) {
        const $form = $(formId);
        if (!$form.length) {
            console.warn(`Form not found: ${formId}`);
            return;
        }

        console.log(`Setting up validation for: ${formId}`);
        $form.validate({
            rules: {
                'Zone.InstitutionID': { required: true },
                'Zone.ZGUID': { required: true, maxlength: 50 },
                'Zone.ZoneName': { required: true, maxlength: 100 },
                'Zone.ShortCode': { maxlength: 10 },
                'Zone.Status': { required: true },
                'Zone.CreatedDate': { required: true }
            },
            messages: {
                'Zone.InstitutionID': 'Select Institution Name',
                'Zone.ZGUID': { required: 'Please enter ZGUID', maxlength: 'Max 50 characters' },
                'Zone.ZoneName': { required: 'Please enter Zone Name', maxlength: 'Max 100 characters' },
                'Zone.ShortCode': 'Max 10 characters',
                'Zone.Status': 'Please enter Status',
                'Zone.CreatedDate': 'Please enter Created Date'
            },
            errorPlacement: (error, element) => {
                const $errorSpan = element.closest('.form-floating').find('.text-danger');
                console.log(`Placing error for ${element.attr('name')}: ${error.text()}`);
                if ($errorSpan.length) {
                    $errorSpan.html(error).css({ display: 'block', 'font-size': '0.875rem', 'margin-top': '5px' });
                } else {
                    error.addClass('text-danger small').insertAfter(element);
                }
            },
            highlight: element => {
                $(element).addClass('is-invalid');
                console.log(`Highlighted invalid field: ${element.name}`);
            },
            unhighlight: element => {
                $(element).removeClass('is-invalid');
                $(element).closest('.form-floating').find('.text-danger').html('').hide();
                console.log(`Unhighlighted field: ${element.name}`);
            },
            invalidHandler: (event, validator) => console.log('Form invalid, errors:', validator.errorList),
            onfocusout: element => $(element).valid(),
            onkeyup: element => $(element).valid(),
            onchange: element => $(element).valid()
        });
        console.log(`Validation initialized for: ${formId}`);
    }

    // Create Form Submission
    $('#createZoneForm').on('submit', function (e) {
        e.preventDefault();
        const $form = $(this);
        if (!$form.valid()) {
            console.log('Create form validation failed');
            return;
        }

        $.ajax({
            url: '/Zone/ZoneIndex?handler=CreateZone',
            type: 'POST',
            data: $form.serialize(),
            headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
            success: response => {
                if (response.success) {
                    Swal.fire({
                        title: 'Success',
                        text: response.message || 'Zone created successfully!',
                        icon: 'success',
                        showConfirmButton: false, // Remove OK button
                        timer: 1500 // Auto-dismiss after 1.5 seconds
                    }).then(() => {
                        $('#createZoneOffcanvas').offcanvas('hide');
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', response.message || 'Failed to create zone', 'error');
                }
            },
            error: xhr => {
                console.error('Create AJAX error:', xhr.responseText);
                Swal.fire('Error', `Failed to create zone: ${xhr.responseText}`, 'error');
            }
        });
    });

    // Edit Form Submission
    $(document).on('submit', '[id^="editZoneForm_"]', function (e) {
        e.preventDefault();
        const $form = $(this);
        const zoneId = this.id.replace('editZoneForm_', '');
        if (!$form.valid()) {
            console.log(`Edit form validation failed for Zone ID: ${zoneId}`);
            return;
        }

        $.ajax({
            url: '/Zone/ZoneIndex?handler=EditZone',
            type: 'POST',
            data: $form.serialize(),
            headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
            success: response => {
                if (response.success) {
                    Swal.fire({
                        title: 'Success',
                        text: response.message || 'Zone updated successfully!',
                        icon: 'success',
                        showConfirmButton: false, // Remove OK button
                        timer: 1500 // Auto-dismiss after 1.5 seconds
                    }).then(() => {
                        $(`#editZoneOffcanvas_${zoneId}`).offcanvas('hide');
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', response.message || 'Failed to update zone', 'error');
                }
            },
            error: xhr => {
                console.error('Edit AJAX error:', xhr.responseText);
                Swal.fire('Error', `Failed to update zone: ${xhr.responseText}`, 'error');
            }
        });
    });

    // Delete Confirmation
    window.showDeleteConfirmation = function (zoneId) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            customClass: {
                confirmButton: 'btn btn-danger me-3',
                cancelButton: 'btn btn-secondary'
            },
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/Zone/ZoneIndex?handler=DeleteZone',
                    type: 'POST',
                    data: { id: zoneId },
                    headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() },
                    success: response => {
                        if (response.success) {
                            Swal.fire({
                                title: 'Deleted',
                                text: response.message || 'Zone deleted successfully!',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                if (dataTable) {
                                    dataTable.row($(`tr[data-id="${zoneId}"]`)).remove().draw(false);
                                } else {
                                    location.reload();
                                }
                            });
                        } else {
                            Swal.fire('Error', response.message || 'Deletion failed', 'error');
                        }
                    },
                    error: xhr => {
                        console.error('Delete AJAX error:', xhr.responseText);
                        Swal.fire('Error', `Failed to delete: ${xhr.responseText}`, 'error');
                    }
                });
            }
        });
    };

    // Initialize Validation on Offcanvas Show
    $(document).on('shown.bs.offcanvas', '#createZoneOffcanvas', () => {
        console.log('Create offcanvas shown, setting up validation');
        setupValidation('#createZoneForm');
    });

    $(document).on('shown.bs.offcanvas', '[id^="editZoneOffcanvas_"]', function () {
        const zoneId = this.id.replace('editZoneOffcanvas_', '');
        console.log(`Edit offcanvas shown for ID: ${zoneId}, setting up validation`);
        setupValidation(`#editZoneForm_${zoneId}`);
    });
});
/**
 * User CRUD JS
 */

'use strict';

// Functions to handle the Delete User Sweet Alerts (Delete Confirmation)
function showDeleteConfirmation(userId) {
  event.preventDefault(); // prevent form submit
  const userName = document.querySelector(`.user-name-full-${userId}`).innerText;
  Swal.fire({
    title: 'Delete User',
    // Show the user the user name to be deleted
    html: `<p>Are you sure you want to delete user ?<br><br><span class="fw-medium text-danger">${userName}</span></p>`,
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
      const form = document.getElementById(userId + '-deleteForm');
      if (form) {
        submitFormAndSetSuccessFlag(form, 'successFlag');
      } else {
        console.error('Form element not found');
      }
    } else {
      Swal.fire({
        title: 'Cancelled',
        // Show the user that the user has not been deleted.
        html: `<p><span class="fw-medium text-primary">${userName}</span> is not deleted!</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'btn btn-success waves-effect waves-light'
        }
      });
    }
  });
}

// Function to submit the form and set the success flag (Set success flags for delete, create and update)
function submitFormAndSetSuccessFlag(form, flagName) {
  form.submit();
  sessionStorage.setItem(flagName, 'true');
}

(function () {
  // Function to set element attributes (asp-for)
  function setElementAttributes(element, attribute, value) {
    element.setAttribute(attribute, value);
  }

  // Function to set form attributes (route and action)
  function setFormAttributes(form, userId, handler) {
    const routeAttribute = 'asp-route-id';
    setElementAttributes(form, routeAttribute, userId);
    form.action = `/CRUD/UserCRUD?handler=${handler}&id=${userId}`;
  }

  // Sweet Alert Success Function (User Deleted/Created/Updated)
  function showSuccessAlert(message) {
    var name = message[0].toUpperCase() + message.slice(1);
    Swal.fire({
      title: name,
      text: `User ${message} Successfully!`,
      icon: 'success',
      confirmButtonText: 'Ok',
      confirmButton: false,
      customClass: {
        confirmButton: 'btn btn-success waves-effect waves-light'
      }
    });
  }

  // Function to submit the form and set the success flag (Set success flags for delete, create and update)
  function submitFormAndSetSuccessFlag(form, flagName) {
    form.submit();
    sessionStorage.setItem(flagName, 'true');
  }

  // Function to check for success flag and display success message
  function checkAndShowSuccessAlert(flagName, successMessage) {
    const flag = sessionStorage.getItem(flagName);
    if (flag === 'true') {
      showSuccessAlert(successMessage);
      sessionStorage.removeItem(flagName);
    }
  }

  // Function to handle the "Edit User" Offcanvas Modal
  const handleEditUserModal = editButton => {
    // Get the user details from the table
    const userId = editButton.id.split('-')[0];
    const userName = document.querySelector(`.user-name-full-${userId}`).innerText;
    const userEmail = document.getElementById(`${userId}-editUser`).parentElement.parentElement.children[3].innerText;
    const isVerified = document.querySelector(`.user-verified-${userId}`).dataset.isVerified;
    const userContactNumber = document.getElementById(`${userId}-editUser`).parentElement.parentElement.children[5]
      .innerText;
    const userSelectedRole = document.getElementById(`${userId}-editUser`).parentElement.parentElement.children[6]
      .innerText;
    const userSelectedPlan = document.getElementById(`${userId}-editUser`).parentElement.parentElement.children[7]
      .innerText;

    // Set the form attributes (route and action)
    const editForm = document.getElementById('editUserForm');
    setFormAttributes(editForm, userId, 'EditOrUpdate');

    // Set the input asp-for attributes (for model binding)
    setElementAttributes(document.getElementById('EditUser_UserName'), 'asp-for', `Users[${userId}].UserName`);
    setElementAttributes(document.getElementById('EditUser_Email'), 'asp-for', `Users[${userId}].Email`);
    setElementAttributes(document.getElementById('EditUser_IsVerified'), 'asp-for', `Users[${userId}].IsVerified`);
    setElementAttributes(
      document.getElementById('EditUser_ContactNumber'),
      'asp-for',
      `Users[${userId}].ContactNumber`
    );
    setElementAttributes(document.getElementById('EditUser_SelectedRole'), 'asp-for', `Users[${userId}].SelectedRole`);
    setElementAttributes(document.getElementById('EditUser_SelectedPlan'), 'asp-for', `Users[${userId}].SelectedPlan`);

    // Set the input values (for value binding)
    document.getElementById('EditUser_UserName').value = userName;
    document.getElementById('EditUser_Email').value = userEmail;
    document.getElementById('EditUser_IsVerified').checked = JSON.parse(isVerified.toLowerCase());
    document.getElementById('EditUser_ContactNumber').value = userContactNumber;
    document.getElementById('EditUser_SelectedRole').value = userSelectedRole.toLowerCase();
    document.getElementById('EditUser_SelectedPlan').value = userSelectedPlan.toLowerCase();
  };

  // Attach event listeners for "Edit User" buttons (pencil icon)
  const editUserButtons = document.querySelectorAll("[id$='-editUser']");
  editUserButtons.forEach(editButton => {
    editButton.addEventListener('click', () => handleEditUserModal(editButton));
  });

  // Check and Call the functions to check and display success messages on page reload (for delete, create and update)
  checkAndShowSuccessAlert('successFlag', 'Deleted');
  checkAndShowSuccessAlert('newUserFlag', 'Created');
  checkAndShowSuccessAlert('editUserFlag', 'Updated');

  // Get the Create for validation
  const createNewUserForm = document.getElementById('createUserForm');

  // Initialize FormValidation for create user form
  const fv = FormValidation.formValidation(createNewUserForm, {
    fields: {
      'NewUser.UserName': {
        validators: {
          notEmpty: {
            message: 'Please enter a user name'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: 'The user name must be more than 6 and less than 20 characters long'
          }
        }
      },
      'NewUser.Email': {
        validators: {
          notEmpty: {
            message: 'Please enter an email address'
          },
          emailAddress: {
            message: 'Please enter a valid email address'
          },
          stringLength: {
            max: 50,
            message: 'The email address must be less than 50 characters long'
          }
        }
      },
      'NewUser.ContactNumber': {
        validators: {
          notEmpty: {
            message: 'Please enter a contact number'
          },
          phone: {
            country: 'US',
            message: 'Please enter a valid phone number'
          },
          stringLength: {
            min: 12,
            message: 'The contact number must be 10 characters long'
          }
        }
      },
      'NewUser.SelectedRole': {
        validators: {
          notEmpty: {
            message: 'Please select a role'
          }
        }
      },
      'NewUser.SelectedPlan': {
        validators: {
          notEmpty: {
            message: 'Please select a plan'
          }
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
      submitFormAndSetSuccessFlag(createNewUserForm, 'newUserFlag');
    })
    .on('core.form.invalid', function () {
      // if fields are invalid
      return;
    });

  // For phone number input mask with cleave.js (US phone number)
  const phoneMaskList = document.querySelectorAll('.phone-mask');
  if (phoneMaskList) {
    phoneMaskList.forEach(function (phoneMask) {
      new Cleave(phoneMask, {
        phone: true,
        phoneRegionCode: 'US'
      });
    });
  }

  // Get the Edit form validation
  const editUserForm = document.getElementById('editUserForm');

  // Initialize FormValidation for edit user form
  const fv2 = FormValidation.formValidation(editUserForm, {
    fields: {
      'user.UserName': {
        validators: {
          notEmpty: {
            message: 'Please enter a user name'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: 'The user name must be more than 6 and less than 20 characters long'
          }
        }
      },
      'user.Email': {
        validators: {
          notEmpty: {
            message: 'Please enter an email address'
          },
          emailAddress: {
            message: 'Please enter a valid email address'
          },
          stringLength: {
            max: 50,
            message: 'The email address must be less than 50 characters long'
          }
        }
      },
      'user.ContactNumber': {
        validators: {
          notEmpty: {
            message: 'Please enter a contact number'
          },
          phone: {
            country: 'US',
            message: 'Please enter a valid phone number'
          },
          stringLength: {
            min: 12,
            message: 'The contact number must be 10 characters long'
          }
        }
      },
      'user.SelectedRole': {
        validators: {
          notEmpty: {
            message: 'Please select a role'
          }
        }
      },
      'user.SelectedPlan': {
        validators: {
          notEmpty: {
            message: 'Please select a plan'
          }
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
      submitFormAndSetSuccessFlag(editUserForm, 'editUserFlag');
    })
    .on('core.form.invalid', function () {
      // if fields are invalid
      return;
    });
})();

// User DataTable initialization
$(document).ready(function () {
  let borderColor, bodyBg, headingColor;

  if (isDarkStyle) {
    borderColor = config.colors_dark.borderColor;
    bodyBg = config.colors_dark.bodyBg;
    headingColor = config.colors_dark.headingColor;
  } else {
    borderColor = config.colors.borderColor;
    bodyBg = config.colors.bodyBg;
    headingColor = config.colors.headingColor;
  }

  // User List DataTable Initialization (For User CRUD Page)
  $('#userTable').DataTable({
    order: [[1, 'desc']],
    displayLength: 7,
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
    lengthMenu: [7, 10, 15, 20],
    language: {
      sLengthMenu: '_MENU_',
      search: '',
      searchPlaceholder: 'Search User',
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
            title: 'Users Data',
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
              columns: [1, 2, 3, 4, 5, 6, 7],
              format: {
                body: function (data, row, column, node) {
                  if (column === 1) {
                    var $content = $(data);
                    // Extract the value of data-user-name attribute (User Name)
                    var userName = $content.find('[class^="user-name-full-"]').text();
                    return userName;
                  } else if (column === 3) {
                    // Extract the value of data-is-verified attribute (Is Verified)
                    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                  }
                  return data;
                }
              }
            }
          },
          {
            extend: 'csv',
            title: 'Users',
            text: '<i class="ri-file-text-line me-1" ></i>Csv',
            className: 'dropdown-item',
            exportOptions: {
              columns: [1, 2, 3, 4, 5, 6, 7],
              format: {
                body: function (data, row, column, node) {
                  if (column === 1) {
                    var $content = $(data);
                    // Extract the value of data-user-name attribute (User Name)
                    var userName = $content.find('[class^="user-name-full-"]').text();
                    return userName;
                  } else if (column === 3) {
                    // Extract the value of data-is-verified attribute (Is Verified)
                    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                  }
                  return data;
                }
              }
            }
          },
          {
            extend: 'excel',
            title: 'Users',
            text: '<i class="ri-file-excel-line me-1"></i>Excel',
            className: 'dropdown-item',
            exportOptions: {
              columns: [1, 2, 3, 4, 5, 6, 7],
              format: {
                body: function (data, row, column, node) {
                  if (column === 1) {
                    var $content = $(data);
                    // Extract the value of data-user-name attribute (User Name)
                    var userName = $content.find('[class^="user-name-full-"]').text();
                    return userName;
                  } else if (column === 3) {
                    // Extract the value of data-is-verified attribute (Is Verified)
                    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                  }
                  return data;
                }
              }
            }
          },
          {
            extend: 'pdf',
            title: 'Users',
            text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
            className: 'dropdown-item',
            exportOptions: {
              columns: [1, 2, 3, 4, 5, 6, 7],
              format: {
                body: function (data, row, column, node) {
                  if (column === 1) {
                    var $content = $(data);
                    // Extract the value of data-user-name attribute (User Name)
                    var userName = $content.find('[class^="user-name-full-"]').text();
                    return userName;
                  } else if (column === 3) {
                    // Extract the value of data-is-verified attribute (Is Verified)
                    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                  }
                  return data;
                }
              }
            }
          },
          {
            extend: 'copy',
            title: 'Users',
            text: '<i class="ri-file-copy-line me-1"></i>Copy',
            className: 'dropdown-item',
            exportOptions: {
              columns: [1, 2, 3, 4, 5, 6, 7],
              format: {
                body: function (data, row, column, node) {
                  if (column === 1) {
                    var $content = $(data);
                    // Extract the value of data-user-name attribute (User Name)
                    var userName = $content.find('[class^="user-name-full-"]').text();
                    return userName;
                  } else if (column === 3) {
                    // Extract the value of data-is-verified attribute (Is Verified)
                    var isVerified = /data-is-verified="(.*?)"/.exec(data)[1];
                    return isVerified === 'True' ? 'Verified' : 'Not Verified';
                  }
                  return data;
                }
              }
            }
          }
        ]
      },
      {
        // For Create User Button (Add New User)
        text: '<i class="ri-add-line ri-16px me-0 me-sm-1_5"></i><span class="d-none d-sm-inline-block">Add User</span>',
        className: 'add-new btn btn-primary waves-effect waves-light',
        attr: {
          'data-bs-toggle': 'offcanvas',
          'data-bs-target': '#createUserOffcanvas'
        }
      }
    ],
    responsive: true,
    // For responsive popup
    rowReorder: {
      selector: 'td:nth-child(2)'
    },
    // For responsive popup button and responsive priority for user name
    columnDefs: [
      {
        // For Responsive Popup Button (plus icon)
        className: 'control',
        searchable: false,
        orderable: false,
        responsivePriority: 2,
        targets: 0,
        render: function (data, type, full, meta) {
          return '';
        }
      },
      {
        // For Id
        targets: 1,
        responsivePriority: 4
      },
      {
        // For User Name
        targets: 2,
        responsivePriority: 3
      },
      {
        // For Email
        targets: 3,
        responsivePriority: 9
      },
      {
        // For Is Verified
        targets: 4,
        responsivePriority: 5
      },
      {
        // For Contact Number
        targets: 5,
        responsivePriority: 7
      },
      {
        // For Role
        targets: 6,
        responsivePriority: 6
      },
      {
        // For Plan
        targets: 7,
        responsivePriority: 8
      },
      {
        // For Actions
        targets: -1,
        searchable: false,
        orderable: false,
        responsivePriority: 1
      }
    ],
    responsive: {
      details: {
        display: $.fn.dataTable.Responsive.display.modal({
          header: function (row) {
            var data = row.data();
            var $content = $(data[2]);
            // Extract the value of data-user-name attribute (User Name)
            var userName = $content.find('[class^="user-name-full-"]').text();
            return 'Details of ' + userName;
          }
        }),
        type: 'column',
        renderer: function (api, rowIdx, columns) {
          var data = $.map(columns, function (col, i) {
            // Exclude the last column (Action)
            if (i < columns.length - 1) {
              return col.title !== ''
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }
            return '';
          }).join('');

          return data ? $('<table class="table mt-3"/><tbody />').append(data) : false;
        }
      }
    }
  });
});

// For Modal to close on edit button click
var editUserOffcanvas = $('#editUserOffcanvas');

// Event listener for the "Edit" offcanvas opening
editUserOffcanvas.on('show.bs.offcanvas', function () {
  // Close any open modals
  $('.modal').modal('hide');
});

// Filter Form styles to default size after DataTable initialization
setTimeout(() => {
  $('.dataTables_filter input').addClass('ms-0');
  $('div.dataTables_wrapper .dataTables_filter').addClass('mt-0 mt-md-5');
  $('div.dataTables_wrapper div.dataTables_info').addClass('text-start text-sm-center text-md-start');
}, 300);
// creating Student Submission
$(document).ready(function () {
    $("#studentForm").submit(function (event) {
        event.preventDefault();
        let studentData = {
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            lastName: $("#lastName").val(),
            dob: $("#dob").val(),
            gender: $("#gender").val(),
            mobile: $("#mobile").val(),
            studentCode: $("#studentCode").val(),
            enquiryNo: $("#enquiryNo").val(),
            applicationNo: $("#applicationNo").val(),
            boardingType: $("#boardingType").val(),
            adharNo: $("#adharNo").val(),
            isActive: $("#isActive").prop("checked")
        };

        console.log("Student Data:", studentData);
        alert("Form submitted successfully!");
        $("#studentForm")[0].reset();
    });
});
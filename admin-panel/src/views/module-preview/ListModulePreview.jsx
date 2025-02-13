import React, { useState, useEffect, useRef, useMemo, } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import TextEditor from "./TextEditor";
import { FaCopy, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import Modal from "react-bootstrap/Modal";
import deleteIcon from "./../../assets/images/delete.png";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const ListModulePreview = () => {
  const page_url = window.location.pathname.split('/')[1];
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [searchClass, setSearchClass] = useState(["search-input"]);
  const [headerCheckbox, setHeaderCheckbox] = useState(false);
  const [columns, setColumns] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose1 = async () => {
    setFormValues('');
    setItemIdToDelete('');
    setShow1(false);
  }
  const [optionscat, setOptions] = useState([]);

  const [formValues, setFormValues] = useState({});
  const [fields, setFields] = useState([]);
  const [pages, setRows] = useState();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  // const [formValues, setFormValues] = useState({
  //   [fields.fields_name]: new Date()// Default to current date or null
  // });

  const { id } = useParams();
  const isEdit = id;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchOnHandler = () => {
    // Logic for handling search input interactions
  };


  const handleChange = (id) => {
    setData((prevRows) =>
      prevRows.map((row) =>
        row.srNo === id ? { ...row, switchState: !row.switchState } : row
      )
    );
  };

  // Initialize row checkboxes with srNo as unique identifier
  const [rowCheckboxes, setRowCheckboxes] = useState(
    data.map((row) => ({ id: row.srNo, checked: false }))
  );

  const handleHeaderCheckboxChange = () => {
    const newHeaderCheckboxState = !headerCheckbox;
    setHeaderCheckbox(newHeaderCheckboxState);

    const updatedRowCheckboxes = rowCheckboxes.map((row) => ({
      ...row,
      checked: newHeaderCheckboxState,
    }));
    setRowCheckboxes(updatedRowCheckboxes);
  };

  const handleRowCheckboxChange = (id) => {
    const updatedRowCheckboxes = rowCheckboxes.map((row) =>
      row.id === id ? { ...row, checked: !row.checked } : row
    );
    setRowCheckboxes(updatedRowCheckboxes);

    const allChecked = updatedRowCheckboxes.every((row) => row.checked);
    setHeaderCheckbox(allChecked);
  };

  const handlemodal = (id) => {
    setShow1(true);
  }

  function capitalizeFirstLetter(string) {
    if (!string) return ""; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange2 = (selected) => {
    setSelectedOptions(selected); // Store full object for UI
  }
  const multipleOptions = [
    { value: "Number", label: "Number" },
    { value: "Text", label: "Text" },
    { value: "Password", label: "Password" },
  ];
  //add content of created module 
  const [errors, setErrors] = useState({});
  const custid = localStorage.getItem("custid");

  const options = [
    { value: "Number", label: "Number" },
    { value: "Text", label: "Text" },
    { value: "Password", label: "Password" },
  ];

  //Add 
  const handlesubmitbtn = async (e) => {
    e.preventDefault();
    const newErrors = {};
    fields.forEach(field => {
      const value = formValues[field.fields_name];
      if (!value && field.fields_validation == 'Required') {
        newErrors[field.fields_name] = `${formatString(field.fields_name)}  is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const id = itemIdToDelete;
      if (id) {
        try {
          const custid = localStorage.getItem("custid");
          const formData = new FormData();
          formData.append("user_id", custid);
          formData.append("page_name", pages);
          formData.append("content", formValues["content"]); // CKEditor content

          fields.forEach((field) => {
            const fieldName = field.fields_name;
            const value = formValues[fieldName];
            if (field.fields_type === "file" && value instanceof File) {
              formData.append(`fields[${fieldName}]`, value);
            } else {
              formData.append(`fields[${fieldName}]`, value);
            }
          });
          const response = await fetch(`http://localhost:5000/api/crud/updatedata/${id}`, {
            method: "PATCH",
            body: formData,

          });
          const res_data = await response.json();

          if (response.ok == true) {
            handleClose1();
            toast.success(`${pages} Update succesfully`);
            setErrors('');
            setFormValues('');
            fetchData();
          } else {
            toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.msg);
          }
        } catch (error) {
          console.log("Add ", error);
        }
      } else {
        try {
          const custid = localStorage.getItem("custid");
          const formData = new FormData();
          formData.append("user_id", custid);
          formData.append("page_name", pages);
          formData.append("content", formValues["content"]); // CKEditor content
          fields.forEach((field) => {
            const fieldName = field.fields_name;
            const value = formValues[fieldName];
            if (field.fields_type === "file" && value instanceof File) {
              formData.append(`fields[${fieldName}]`, value);
            } else {
              formData.append(`fields[${fieldName}]`, value);
            }
          });
          const response = await fetch(`http://localhost:5000/api/crud/add`, {
            method: "POST",
            body: formData,

          });
          const res_data = await response.json();

          if (response.ok == true) {
            handleClose1();
            toast.success(`${pages} added succesfully`);
            setErrors('');
            setFormValues('');
            fetchData();
          } else {
            toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.msg);
          }
        } catch (error) {
          console.log("Add ", error);
        }
      }
    }
  }
  const handleDelete = (par) => {
    setShow(par);
  }
  //delete
  const handleyesno = async (id) => {
    try {
      const user_id = localStorage.getItem("custid");
      const page_url = window.location.pathname.split("/")[1];
      const page_name = capitalizeFirstLetter(page_url);
      const response = await fetch(`http://localhost:5000/api/crud/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ page_name, user_id }),
      });
      const data = await response.json();
      if (response.ok == true) {
        setShow('');
        toast.success('Selected data Deleted Successfully');
        setData((prevItems) => prevItems.filter((row) => row._id !== id));

      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }
  //for edit fetch data
  const handleedit = async (id) => {

    try {

      const custid = isEdit;
      const page_url = window.location.pathname.split("/")[1];
      const page_name = capitalizeFirstLetter(page_url);

      const response = await fetch(
        `http://localhost:5000/api/crud/getdataByid/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page_name }),
        }
      );
      const data = await response.json();
      setFormValues(data.msg[0]);
      setShow1(true);
      setItemIdToDelete(data.msg[0]._id)
    } catch (error) {
      console.log(error);
    }
  }



  const fetchOptions = async (param) => {
    try {
      const user_id = localStorage.getItem("custid");

      const response = await fetch(`http://localhost:5000/api/crud/getcatOptions/${param}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
      });

      const res_data = await response.json();
      const options = Array.isArray(res_data.msg)
        ? res_data.msg.map((page) => ({
          value: page._id,
          label: page["category_name "]?.trim() || page.category_name, // Handle space issue
        }))
        : [];
      setOptions(options);



    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchfields = async () => {
    const page_url = window.location.pathname.split('/')[1];
    setRows(capitalizeFirstLetter(page_url));

    try {
      const response = await fetch(`http://localhost:5000/api/form/getfieldbyurl/${page_url}`, {
        method: "GET",
      });
      const data = await response.json();

      // setRows(data.page[0].page_name);
      setFields(data.fields);

      const dropdownField = data.fields.find(field => field.fields_type === 'Single Select' || field.fields_type === 'Multi Select');
      if (dropdownField) {
        fetchOptions(dropdownField.dropdown); // Assuming dropdown field contains the necessary info for options
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };
  // Fetch Data
  const fetchData = async () => {
    try {
      const custid = localStorage.getItem("custid");
      const page_url = window.location.pathname.split("/")[1];
      const page_name = capitalizeFirstLetter(page_url);

      const response = await fetch(
        `http://localhost:5000/api/crud/getdata/${custid}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page_name }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result.msg);
      if (result.msg.length > 0) {
        // Extract dynamic column names (excluding '_id', 'srNo', 'switchState')
        const columnKeys = Object.keys(result.msg[0]).filter(
          (key) => key !== "_id" && key !== "srNo" && key !== "switchState"
        );
        // Create dynamic columns
        const limitedColumns = columnKeys.slice(0, 1);

        // Create dynamic columns for the first two columns
        const dynamicColumns = limitedColumns.map((col) => ({
          name: col.toUpperCase(),
          selector: (row) =>
            Array.isArray(row[col]) ? row[col][1] || "N/A" : row[col],
          sortable: true,
        }));
        // Define Static Columns (Sr No & Actions)
        setColumns([
          {
            name: "Sr No #",
            selector: (row, index) => index + 1,
            sortable: true,
            width: "100px",
          },
          ...dynamicColumns, // Append dynamically generated columns
          {
            name: "Actions",
            cell: (row) => (
              <div className="module-action">
                <button
                  onClick={() => handleedit(row._id)}
                  className="btn btn-action"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-action"
                  title="Delete"
                  onClick={() => handleDelete(row._id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ),
            style: { textAlign: "right" },
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchfields();
    fetchOptions("blogcategory");
  }, []);

  const filteredRows = useMemo(() => {
    return (data || []).filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);
  const customStyles = {
    rows: {
      style: {
        minHeight: "20px",
      },
    },
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#e3f2fd",
      },
    },
    pagination: {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px",
      },
      pageButtonsStyle: {
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        padding: "8px",
        margin: "0 5px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  };
  const formatString = (str) => {
    if (!str) return "";

    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Container className="list-module-preview">
      <Row>
        <Col lg={12}>
          <Card className="create_new_page_card add-module module-list">
            <Card.Header>
              <Row className="justify-content-between">
                <Col md={12}>
                  <h3>{pages}</h3>
                </Col>
                <Col md={6}>
                  <div className="dt-buttons btn-group">
                    <Button onClick={handlemodal} className="btn btn-outline-secondary">
                      Add {pages}
                    </Button>
                  </div>
                </Col>
                <Col md={6} className="text-end">
                  <div className="data_tableHeader">
                    <div id="main-search" className={searchClass.join(" ")}>
                      <div className="input-group" onClick={searchOnHandler}>
                        <span
                          onKeyDown={searchOnHandler}
                          role="button"
                          tabIndex="0"
                          className="input-group-append search-btn"
                          style={{ borderRadius: "50%", marginRight: 15 }}
                        >
                          <i className="feather icon-search input-group-text" />
                        </span>
                        <Form.Control
                          type="text"
                          id="m-search"
                          placeholder={`Search ${pages}`}
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={filteredRows}
                customStyles={customStyles}
                pagination
                responsive
                striped
                paginationComponentOptions={{
                  rowsPerPageText: "Rows per page:",
                  rangeSeparatorText: "of",
                  // selectAllRowsItem: true,
                  // selectAllRowsItemText: "All",
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={show1} onHide={handleClose1} className="other-icon-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>

          <h3>{itemIdToDelete ? 'Edit' : 'Add'} {pages}</h3>

          <form onSubmit={handlesubmitbtn}>
            <Row>
              {fields.map((field, index) => {
                return (
                  <React.Fragment key={index}>
                    {field.fields_type === 'Text' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control
                            value={formValues[field.fields_name] || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                [field.fields_name]: e.target.value,
                              })
                            }
                            type="text"
                            placeholder={`Enter ${formatString(field.fields_name)}`}
                          />
                        </div>
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                    {field.fields_type === 'Password' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control required type="password"
                            value={formValues[field.fields_name] || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                [field.fields_name]: e.target.value,
                              })
                            }
                          />
                        </div>
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                    {field.fields_type === 'Number' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control required type="number"
                            value={formValues[field.fields_name] || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                [field.fields_name]: e.target.value,
                              })
                            }
                          />
                        </div>
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                    {field.fields_type === 'DatePicker' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <div className="w-100">
                            <DatePicker
                              className="form-control"
                              onChange={(date) =>
                                setFormValues({
                                  ...formValues,
                                  [field.fields_name]: new Date(date), // Using 'value' correctly
                                })
                              }
                              selected={formValues[field.fields_name] ? new Date(formValues[field.fields_name]) : null}

                            />
                          </div>
                          {errors?.[field.fields_name] && (
                            <span className="text-danger">{errors[field.fields_name]}</span>
                          )}
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Single Select' && field.dropdown != ' ' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Select
                            options={optionscat}

                           
                            value={optionscat.find(option => option.value === formValues[field.fields_name]) || null}
                            onChange={(selectedOption) =>
                              setFormValues({
                                ...formValues,
                                [field.fields_name]: selectedOption ? selectedOption.value : "",
                              })
                            }
                          />
                        </div>
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                    {field.fields_type === 'Multi Select' && (
                      <Col md={6}>
                      <div className="mb-3">
                        <Form.Label>{formatString(field.fields_name)}</Form.Label>
                        <Select
                          options={optionscat}
                          isMulti // Only enable isMulti for 'Multi Select' type

                          value={optionscat.filter(option => formValues[field.fields_name]?.includes(option.value)) || []}

                          
                          onChange={(selectedOption) =>
                            setFormValues({
                              ...formValues,
                              [field.fields_name]: selectedOption ? selectedOption.map(option => option.value) : [], // Store selected values as an array
                            })
                          }
                        />
                      </div>
                      {errors?.[field.fields_name] && (
                        <span className="text-danger">{errors[field.fields_name]}</span>
                      )}
                    </Col>
                    )}
                    {field.fields_type === 'Textarea' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control as="textarea" rows={3}
                            value={formValues[field.fields_name] || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                [field.fields_name]: e.target.value,
                              })
                            }
                          />
                        </div>
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                    {field.fields_type === 'file' && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="PageName">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control type="file" placeholder="Page Name"
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                [field.fields_name]: e.target.files[0],
                              })
                            }
                          />
                          {/* <img src={`http://localhost:5000/adminmodules/${formValues[field.fields_name]}`} alt="" srcset="" /> */}
                          {/* Image Preview */}
                          {formValues[field.fields_name] && (
                            <div className="mb-2">
                              <img
                                src={`http://localhost:5000/adminmodules/${formValues[field.fields_name]}`}
                                alt="Preview"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            </div>
                          )}
                        </Form.Group>
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                    {field.fields_type === 'CheckBox' && (
                      <Col md={6}>
                        <div className="Checkboxes-left mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              inline
                              label={formatString(field.fields_name)}
                              name={field.fields_name}
                              type="checkbox"
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  [field.fields_name]: e.target.checked,
                                })
                              }
                              checked={formValues[field.fields_name] || false}
                            />
                            {/* <Form.Check
                              inline
                              label="Checkbox checked"
                              name="group1"
                              type="checkbox"
                              defaultChecked
                              id="checkbox-2"
                            /> */}
                          </div>
                          {errors?.[field.fields_name] && (
                            <span className="text-danger">{errors[field.fields_name]}</span>
                          )}
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Radio' && (
                      <Col md={6}>
                        <div className="Checkboxes-left mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              inline
                              label={formatString(field.fields_name)}
                              name={field.fields_name}
                              type="radio"
                              id={`${field.fields_name}`}
                              // value={option.value}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  [field.fields_name]: e.target.value,
                                })
                              }
                            // checked={formValues[field.fields_name] === option.value}
                            />
                            {/* <Form.Check
                              inline
                              label="Radio checked"
                              name="group1"
                              type="radio"
                              defaultChecked
                              id="radio-2"
                            /> */}
                          </div>
                          {errors?.[field.fields_name] && (
                            <span className="text-danger">{errors[field.fields_name]}</span>
                          )}
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Switch' && (
                      <Col md={6}>
                        <div className="switch mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <span className="toggle">
                            <input type="checkbox"
                              id={`${field.fields_name}-switch`}
                              checked={formValues[field.fields_name] || false}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  [field.fields_name]: e.target.checked,
                                })
                              }
                            />
                            <label htmlFor={`${field.fields_name}-switch`}></label> Toggle switch
                          </span>
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Data Editor' && (
                      <Col sm={12}>
                        <Form.Label>{formatString(field.fields_name)}</Form.Label>
                        <TextEditor
                          value={formValues[field.fields_name] || ""}

                          data={formValues[field.fields_name] || ""}

                          onChange={(value) => {
                            console.log("Editor Updated:", value); // Debugging
                            setFormValues((prev) => ({
                              ...prev,
                              [field.fields_name]: value,
                            }));
                          }}
                        />
                        {errors?.[field.fields_name] && (
                          <span className="text-danger">{errors[field.fields_name]}</span>
                        )}
                      </Col>
                    )}
                  </React.Fragment>
                );
              })}
            </Row>
            <div className="text-center mt-4">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h3>Do you really want to delete the file?</h3>
          <img src={deleteIcon} alt="Delete" />
          <div className="buttons">
            <button className="button-delete" onClick={() => handleyesno(show)}>Yes delete the file</button>
            <button className="button-cancel">Cancel this time</button>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </Container>
  );
};

export default ListModulePreview;
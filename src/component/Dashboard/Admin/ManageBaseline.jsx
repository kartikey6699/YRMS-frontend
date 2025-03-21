// ManageBaseline.jsx
import React, { useState, useEffect, useRef } from 'react';
import AddOptionModal from '../../helper/OptionalModal';
import DropdownWithSearchAndCheckbox from '../../helper/Dropdown';
import ProfileCard from '../../helper/ProfileCard';
import EmployeeTable from './EmployeTable';
const ManageBaseline = () => {
  const [activeSection, setActiveSection] = useState('view');
  const [modalField, setModalField] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const employees = [
    {
      name: 'John Doe',
      employeeId: 'EMP001',
      position: 'Software Engineer',
      phone: '(91) 9999988888',
      competency: 'Python',
      gender: 'male',
      experience: [{ technology: 'Python', years: '3' }],
      totalExperience: '3',
      communication: 'Fluent',
      status: 'Deployed',
      'Web Framework': ['Django'],
      'Data Library': ['Pandas'],
      'Database': ['MySQL'],
      'Frontend': ['React'],
      'Other': ['Docker'],
      'Cloud': ['AWS'],
      certification: [{ title: 'AWS Certified Developer', technology: 'AWS' }],
      currentStatus: 'Active',
      feedback: 'Good performance',
      opportunities: [],
    },
    {
      name: 'Jane Smith',
      employeeId: 'EMP002',
      position: 'Frontend Developer',
      phone: '(91) 9999988889',
      competency: 'JavaScript',
      gender: 'female',
      experience: [{ technology: 'JavaScript', years: '4' }],
      totalExperience: '4',
      communication: 'Medium',
      status: 'Pool',
      'Web Framework': ['Express'],
      'Data Library': ['TensorFlow'],
      'Database': ['MongoDB'],
      'Frontend': ['Vue'],
      'Other': ['GIT'],
      'Cloud': ['Azure'],
      certification: [{ title: 'Microsoft Azure Fundamentals', technology: 'Azure' }],
      currentStatus: 'On Bench',
      feedback: 'Needs improvement in communication',
      opportunities: [],
    },
    {
      name: 'Mike Johnson',
      employeeId: 'EMP003',
      position: 'Backend Developer',
      phone: '(91) 9999988880',
      competency: 'Java',
      gender: 'male',
      experience: [{ technology: 'Java', years: '5' }],
      totalExperience: '5',
      communication: 'Average',
      status: 'PIP',
      'Web Framework': ['Spring'],
      'Data Library': ['Numpy'],
      'Database': ['PostgreSQL'],
      'Frontend': ['Angular'],
      'Other': ['Kubernetes'],
      'Cloud': ['GCP'],
      certification: [{ title: 'Google Cloud Professional', technology: 'GCP' }],
      currentStatus: 'Under Review',
      feedback: 'Working on performance improvement',
      opportunities: [],
    },
  ];

  const [formData, setFormData] = useState({
    employeeName: employees[0].name,
    employeeId: employees[0].employeeId,
    position: employees[0].position,
    phone: employees[0].phone,
    competency: employees[0].competency,
    gender: employees[0].gender,
    experience: [{ technology: '', years: '' }],
    totalExperience: '',
    communication: '',
    status: '',
    'Web Framework': [],
    'Data Library': [],
    'Database': [],
    'Frontend': [],
    'Other': [],
    'Cloud': [],
    certification: [{ title: '', technology: '' }],
    currentStatus: '',
    feedback: '',
    opportunities: [],
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    'Web Framework': ['Django', 'Flask', 'Spring', 'Express'],
    'Data Library': ['Numpy', 'Pandas', 'TensorFlow', 'PyTorch'],
    'Database': ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
    'Frontend': ['React', 'Angular', 'Vue', 'Svelte'],
    'Other': ['CI/CD', 'GIT', 'Docker', 'Kubernetes'],
    'Cloud': ['AWS', 'Azure', 'GCP', 'Heroku'],
  });

  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpChange = (index, field, value) => {
    const updatedExp = [...formData.experience];
    updatedExp[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: updatedExp }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { technology: '', years: '' }],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleCertChange = (index, field, value) => {
    const updatedCert = [...formData.certification];
    updatedCert[index][field] = value;
    setFormData((prev) => ({ ...prev, certification: updatedCert }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certification: [...prev.certification, { title: '', technology: '' }],
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certification: prev.certification.filter((_, i) => i !== index),
    }));
  };

  const handleOpportunityChange = (index, field, value) => {
    const updatedOpps = [...formData.opportunities];
    updatedOpps[index][field] = value;
    setFormData((prev) => ({ ...prev, opportunities: updatedOpps }));
  };

  const addOpportunity = () => {
    setFormData((prev) => ({
      ...prev,
      opportunities: [
        ...prev.opportunities,
        {
          clientName: '',
          dateOfInterview: '',
          jd: '',
          totalRound: '',
          roundClear: '',
          result: '',
          clientFeedback: '',
        },
      ],
    }));
  };

  const removeOpportunity = (index) => {
    setFormData((prev) => ({
      ...prev,
      opportunities: prev.opportunities.filter((_, i) => i !== index),
    }));
  };

  const handleDropdownChange = (field, values) => {
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const addNewOption = (field, value) => {
    setDropdownOptions((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
  };

  const deleteOption = (field, option) => {
    setDropdownOptions((prev) => ({
      ...prev,
      [field]: prev[field].filter((opt) => opt !== option),
    }));
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((opt) => opt !== option),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.competency) {
      alert('Employee information is missing');
      return;
    }
    const submittedData = {
      ...formData,
      opportunity: formData.opportunities,
    };
    console.log('Submitted Data:', JSON.stringify(submittedData, null, 2));
    setFormData({
      employeeName: employees[0].name,
      employeeId: employees[0].employeeId,
      position: employees[0].position,
      phone: employees[0].phone,
      competency: employees[0].competency,
      gender: employees[0].gender,
      experience: [{ technology: '', years: '' }],
      totalExperience: '',
      communication: '',
      status: '',
      'Web Framework': [],
      'Data Library': [],
      'Database': [],
      'Frontend': [],
      'Other': [],
      'Cloud': [],
      certification: [{ title: '', technology: '' }],
      currentStatus: '',
      feedback: '',
      opportunities: [],
    });
    setSelectedEmployee(null);
    setIsOpportunitiesOpen(false);
    setActiveSection('view');
  };

  // Function to handle baselining an employee
  const handleBaseline = (employee) => {
    setFormData({
      employeeName: employee.name,
      employeeId: employee.employeeId,
      position: employee.position,
      phone: employee.phone,
      competency: employee.competency,
      gender: employee.gender,
      // Reset all other fields to their initial state
      experience: [{ technology: '', years: '' }],
      totalExperience: '',
      communication: '',
      status: '',
      'Web Framework': [],
      'Data Library': [],
      'Database': [],
      'Frontend': [],
      'Other': [],
      'Cloud': [],
      certification: [{ title: '', technology: '' }],
      currentStatus: '',
      feedback: '',
      opportunities: [],
    });
    setActiveSection('add');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fieldStyle =
    'p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700';
  const disabledFieldStyle =
    'w-64 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-700';

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        {/* Removed "Add Member" button */}
        {/* "View Baselining Details" button is already hidden when in view section */}
        {activeSection !== 'view' && (
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeSection === 'view'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-800'
            } hover:bg-red-600 hover:text-white transition-colors`}
            onClick={() => setActiveSection('view')}
          >
            View Baselining Details
          </button>
        )}
      </div>

      {activeSection === 'add' ? (
        <div>
          <ProfileCard
            employeeName={formData.employeeName}
            competency={formData.competency}
            gender={formData.gender}
          />

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Experience
                </label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={exp.technology}
                      onChange={(e) =>
                        handleExpChange(index, 'technology', e.target.value)
                      }
                      className={`${fieldStyle} w-64`}
                      placeholder="Technology"
                    />
                    <input
                      type="text"
                      value={exp.years}
                      onChange={(e) =>
                        handleExpChange(index, 'years', e.target.value)
                      }
                      className={`${fieldStyle} w-18`}
                      placeholder="Years"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm shadow-sm"
                >
                  Add New
                </button>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Certification
                </label>
                {formData.certification.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) =>
                        handleCertChange(index, 'title', e.target.value)
                      }
                      className={`${fieldStyle} w-64`}
                      placeholder="Certificate Title"
                    />
                    <input
                      type="text"
                      value={cert.technology}
                      onChange={(e) =>
                        handleCertChange(index, 'technology', e.target.value)
                      }
                      className={`${fieldStyle} w-18`}
                      placeholder="Tag"
                    />
                    {formData.certification.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCertification}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm shadow-sm"
                >
                  Add New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  name="totalExperience"
                  value={formData.totalExperience}
                  onChange={handleInputChange}
                  className={`${fieldStyle} w-64`}
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Communication
                </label>
                <select
                  name="communication"
                  value={formData.communication}
                  onChange={handleInputChange}
                  className={`${fieldStyle} w-64`}
                >
                  <option value="">Select Communication Level</option>
                  <option value="fluent">Average</option>
                  <option value="medium">Medium</option>
                  <option value="average">Fluent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`${fieldStyle} w-64`}
                >
                  <option value="">Select Status</option>
                  <option value="Pool">Pool</option>
                  <option value="Deployed">Deployed</option>
                  <option value="PIP">PIP</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
              <div>
                <DropdownWithSearchAndCheckbox
                  field="Web Framework"
                  selectedValues={formData['Web Framework']}
                  options={dropdownOptions['Web Framework']}
                  onChange={handleDropdownChange}
                  onAddNew={setModalField}
                  isOpen={openDropdown === 'Web Framework'}
                  setIsOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? 'Web Framework' : null)
                  }
                />
              </div>
              <div>
                <DropdownWithSearchAndCheckbox
                  field="Data Library"
                  selectedValues={formData['Data Library']}
                  options={dropdownOptions['Data Library']}
                  onChange={handleDropdownChange}
                  onAddNew={setModalField}
                  isOpen={openDropdown === 'Data Library'}
                  setIsOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? 'Data Library' : null)
                  }
                />
              </div>
              <div>
                <DropdownWithSearchAndCheckbox
                  field="Database"
                  selectedValues={formData['Database']}
                  options={dropdownOptions['Database']}
                  onChange={handleDropdownChange}
                  onAddNew={setModalField}
                  isOpen={openDropdown === 'Database'}
                  setIsOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? 'Database' : null)
                  }
                />
              </div>
              <div>
                <DropdownWithSearchAndCheckbox
                  field="Frontend"
                  selectedValues={formData['Frontend']}
                  options={dropdownOptions['Frontend']}
                  onChange={handleDropdownChange}
                  onAddNew={setModalField}
                  isOpen={openDropdown === 'Frontend'}
                  setIsOpen={(isOpen) =>
                    setOpenDropdown(isOpen ? 'Frontend' : null)
                  }
                />
              </div>
              <div>
                <DropdownWithSearchAndCheckbox
                  field="Other"
                  selectedValues={formData['Other']}
                  options={dropdownOptions['Other']}
                  onChange={handleDropdownChange}
                  onAddNew={setModalField}
                  isOpen={openDropdown === 'Other'}
                  setIsOpen={(isOpen) => setOpenDropdown(isOpen ? 'Other' : null)}
                />
              </div>
              <div>
                <DropdownWithSearchAndCheckbox
                  field="Cloud"
                  selectedValues={formData['Cloud']}
                  options={dropdownOptions['Cloud']}
                  onChange={handleDropdownChange}
                  onAddNew={setModalField}
                  isOpen={openDropdown === 'Cloud'}
                  setIsOpen={(isOpen) => setOpenDropdown(isOpen ? 'Cloud' : null)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Current Status
                </label>
                <input
                  type="text"
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  className={`${fieldStyle} w-64`}
                  placeholder="e.g., Upskill suggestion"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Feedback
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  className={`${fieldStyle} w-64`}
                  placeholder="Add Feedback"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Opportunities
                </label>
                <button
                  type="button"
                  onClick={() => setIsOpportunitiesOpen(!isOpportunitiesOpen)}
                  className={`${fieldStyle} w-64 flex justify-between items-center hover:bg-gray-100`}
                >
                  <span>Manage Opportunities</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isOpportunitiesOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isOpportunitiesOpen && (
                  <div className="mt-2">
                    {formData.opportunities.map((opp, index) => (
                      <div
                        key={index}
                        className="border p-3 rounded-md mb-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Opportunity {index + 1}
                          </h4>
                          {formData.opportunities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOpportunity(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <input
                            type="text"
                            value={opp.clientName}
                            onChange={(e) =>
                              handleOpportunityChange(
                                index,
                                'clientName',
                                e.target.value
                              )
                            }
                            className={`${fieldStyle} w-full`}
                            placeholder="Client Name"
                          />
                          <input
                            type="date"
                            value={opp.dateOfInterview}
                            onChange={(e) =>
                              handleOpportunityChange(
                                index,
                                'dateOfInterview',
                                e.target.value
                              )
                            }
                            className={`${fieldStyle} w-full`}
                          />
                          <input
                            type="text"
                            value={opp.jd}
                            onChange={(e) =>
                              handleOpportunityChange(index, 'jd', e.target.value)
                            }
                            className={`${fieldStyle} w-full`}
                            placeholder="JD"
                          />
                          <input
                            type="number"
                            value={opp.totalRound}
                            onChange={(e) =>
                              handleOpportunityChange(
                                index,
                                'totalRound',
                                e.target.value
                              )
                            }
                            className={`${fieldStyle} w-full`}
                            placeholder="Total Rounds"
                          />
                          <input
                            type="number"
                            value={opp.roundClear}
                            onChange={(e) =>
                              handleOpportunityChange(
                                index,
                                'roundClear',
                                e.target.value
                              )
                            }
                            className={`${fieldStyle} w-full`}
                            placeholder="Rounds Cleared"
                          />
                          <input
                            type="text"
                            value={opp.result}
                            onChange={(e) =>
                              handleOpportunityChange(
                                index,
                                'result',
                                e.target.value
                              )
                            }
                            className={`${fieldStyle} w-full`}
                            placeholder="Result"
                          />
                          <textarea
                            value={opp.clientFeedback}
                            onChange={(e) =>
                              handleOpportunityChange(
                                index,
                                'clientFeedback',
                                e.target.value
                              )
                            }
                            className={`${fieldStyle} w-full col-span-2`}
                            placeholder="Client Feedback"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOpportunity}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm shadow-sm"
                    >
                      Add Opportunity
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-32 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors shadow-sm"
              >
                Submit
              </button>
            </div>
          </form>

          {modalField && (
            <AddOptionModal
              field={modalField}
              options={dropdownOptions[modalField]}
              onAddOption={addNewOption}
              onDeleteOption={deleteOption}
              onClose={() => setModalField(null)}
            />
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-6 text-center">
            Baselining Details
          </h2>
          <EmployeeTable employees={employees} onBaseline={handleBaseline} />
        </div>
      )}
    </div>
  );
};

export default ManageBaseline;
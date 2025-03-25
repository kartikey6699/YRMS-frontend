import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileCard from "../../helper/ProfileCard";
import { FaArrowLeft, FaInfoCircle, FaTrash } from "react-icons/fa";
import { BaselineHistories } from "./BaselineHistory";
import AddOptionModal from "../../helper/OptionalModal";

const ManageBaseline = () => {
  const { state } = useLocation();
  const resource = state?.resource || {};
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("view");
  const [modalField, setModalField] = useState(null);
  const [baselineHistories, setBaselineHistories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const [formData, setFormData] = useState({
    employeeName: resource.employeeName || "",
    employeeId: resource.employeeId || "",
    position: resource.jobTitle || "",
    phone: resource.phoneNumber || "",
    competency: resource.competency || "",
    gender: resource.gender || "",
    experience: [{ technology: "", years: "" }],
    totalExperience: "",
    communication: "",
    status: "",
    techSkills: [],
    certification: [{ title: "", technology: "" }],
    currentStatus: "",
    feedback: "",
    totalRating: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    skillCategories: ["Web Framework", "Data Library", "Database", "Frontend", "Other", "Cloud"],
    technologies: {
      "Web Framework": ["Django", "Flask", "Spring", "Express"],
      "Data Library": ["Numpy", "Pandas", "TensorFlow", "PyTorch"],
      "Database": ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      "Frontend": ["React", "Angular", "Vue", "Svelte"],
      "Other": ["CI/CD", "GIT", "Docker", "Kubernetes"],
      "Cloud": ["AWS", "Azure", "GCP", "Heroku"],
    },
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
      experience: [...prev.experience, { technology: "", years: "" }],
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
      certification: [...prev.certification, { title: "", technology: "" }],
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certification: prev.certification.filter((_, i) => i !== index),
    }));
  };

  const handleTechSkillChange = (index, field, value) => {
    const updatedTechSkills = [...formData.techSkills];
    if (field === "technology" && value === "add-tech") {
      setModalField(updatedTechSkills[index].category);
    } else {
      updatedTechSkills[index][field] = value;
      setFormData((prev) => ({ ...prev, techSkills: updatedTechSkills }));
    }
  };

  const addTechSkill = () => {
    setFormData((prev) => ({
      ...prev,
      techSkills: [...prev.techSkills, { category: "", technology: "", rating: "" }],
    }));
  };

  const removeTechSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      techSkills: prev.techSkills.filter((_, i) => i !== index),
    }));
  };

  const addNewSkillCategory = (newCategory) => {
    setDropdownOptions((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCategory],
      technologies: { ...prev.technologies, [newCategory]: [] },
    }));
    setModalField(null);
  };

  const addNewTechnology = (category, value) => {
    setDropdownOptions((prev) => ({
      ...prev,
      technologies: {
        ...prev.technologies,
        [category]: [...prev.technologies[category], value],
      },
    }));
    setModalField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.communication || !formData.feedback) {
      alert("Required fields are missing");
      return;
    }
    const newHistory = {
      employeeId: formData.employeeId,
      communication: formData.communication,
      feedback: formData.feedback,
      techSkills: formData.techSkills.map((skill) => ({
        technology: skill.technology,
        rating: parseInt(skill.rating) || 0,
      })),
      totalRating: parseInt(formData.totalRating) || 0,
      timestamp: new Date().toISOString(),
    };
    setBaselineHistories((prev) => [...prev, newHistory]);
    setFormData({
      ...formData,
      experience: [{ technology: "", years: "" }],
      totalExperience: "",
      communication: "",
      status: "",
      techSkills: [],
      certification: [{ title: "", technology: "" }],
      currentStatus: "",
      feedback: "",
      totalRating: "",
    });
    setShowForm(false);
    setFormStep(1);
    setActiveSection("view");
  };

  const openAddForm = () => {
    setShowForm(true);
  };

  const closeAddForm = () => {
    setShowForm(false);
    setFormStep(1);
  };

  const nextStep = () => setFormStep(2);
  const prevStep = () => setFormStep(1);

  const CategoryDropdown = ({ index, selectedCategory, onChange, field, categoryForTech }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    const options = field === "category" ? dropdownOptions.skillCategories : dropdownOptions.technologies[categoryForTech] || [];
    const filteredOptions = options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (option) => {
      if (option === "add-category") {
        setModalField("skillCategories");
      } else if (option === "add-tech") {
        setModalField(categoryForTech);
      } else {
        onChange(index, field, option);
      }
      setIsOpen(false);
      setSearch("");
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
          setSearch("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div className="relative w-56" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 border border-gray-300 rounded-lg w-full text-left flex justify-between items-center bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{selectedCategory || `Select ${field === "category" ? "Category" : "Technology"}`}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="p-2 border-b">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
              />
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {opt}
                </div>
              ))}
              <div
                onClick={() => handleSelect(field === "category" ? "add-category" : "add-tech")}
                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm font-medium border-t border-gray-200 flex items-center justify-between"
              >
                <span>{field === "category" ? "Add Category" : `Add ${categoryForTech}`}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
      <button
        onClick={() => navigate("/manage-resources")}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      >
        <FaArrowLeft className="mr-2" /> Back to Resources
      </button>

      <ProfileCard
        employeeName={formData.employeeName}
        competency={formData.competency}
        gender={formData.gender}
      />

      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Baseline Management for {formData.employeeName}
      </h2>

      {activeSection === "view" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          <BaselineHistories
            histories={baselineHistories}
            employeeName={formData.employeeName}
            competency={formData.competency}
            gender={formData.gender}
          />
          <div
            onClick={openAddForm}
            className="rounded-xl shadow-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 flex items-center justify-center cursor-pointer transition-all duration-300 h-48 hover:shadow-xl hover:translate-y-[-4px]"
          >
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mx-auto mb-3 transition-transform duration-200 hover:scale-110">
                <FaInfoCircle className="text-blue-500 text-xl" />
              </div>
              <p className="text-blue-600 font-medium">Create New Baseline</p>
              <p className="text-gray-500 text-sm mt-1">Click to add a new baseline</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
            showForm ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
              showForm ? "scale-100" : "scale-95"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Create New Baseline (Step {formStep} of 2)</h3>
                <button
                  onClick={closeAddForm}
                  className="text-white hover:text-gray-200 text-xl cursor-pointer transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={exp.technology}
                          onChange={(e) => handleExpChange(index, "technology", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Technology"
                        />
                        <input
                          type="text"
                          value={exp.years}
                          onChange={(e) => handleExpChange(index, "years", e.target.value)}
                          className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Years"
                        />
                        {formData.experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addExperience}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      Add Experience
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                    {formData.certification.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => handleCertChange(index, "title", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Certificate Title"
                        />
                        <input
                          type="text"
                          value={cert.technology}
                          onChange={(e) => handleCertChange(index, "technology", e.target.value)}
                          className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Tag"
                        />
                        {formData.certification.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCertification}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      Add Certification
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience (Years)</label>
                    <input
                      type="number"
                      name="totalExperience"
                      value={formData.totalExperience}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Communication*</label>
                    <select
                      name="communication"
                      value={formData.communication}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select Communication Level</option>
                      <option value="Average">Average</option>
                      <option value="Medium">Medium</option>
                      <option value="Fluent">Fluent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Status</option>
                      <option value="Pool">Pool</option>
                      <option value="Deployed">Deployed</option>
                      <option value="PIP">PIP</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <input
                      type="text"
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Upskill suggestion"
                    />
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tech Skills</label>
                    <div className="space-y-3">
                      {formData.techSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                        >
                          <CategoryDropdown
                            index={index}
                            selectedCategory={skill.category}
                            onChange={handleTechSkillChange}
                            field="category"
                            categoryForTech={skill.category}
                          />
                          {skill.category && (
                            <CategoryDropdown
                              index={index}
                              selectedCategory={skill.technology}
                              onChange={handleTechSkillChange}
                              field="technology"
                              categoryForTech={skill.category}
                            />
                          )}
                          {skill.technology && skill.technology !== "add-tech" && (
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={skill.rating}
                                onChange={(e) => handleTechSkillChange(index, "rating", e.target.value)}
                                className="w-16 p-2 border border-gray-300 rounded-l-lg border-r-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="0-5"
                                min="0"
                                max="5"
                              />
                              <span className="px-2 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-r-lg border border-l-0 border-gray-300">
                                /5
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeTechSkill(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTechSkill}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Add Tech Skill
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Rating</label>
                    <input
                      type="number"
                      name="totalRating"
                      value={formData.totalRating}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0-5"
                      min="0"
                      max="5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback*</label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add feedback here"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between space-x-4 pt-6">
                {formStep === 1 ? (
                  <button
                    type="button"
                    onClick={closeAddForm}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium cursor-pointer"
                  >
                    Previous
                  </button>
                )}
                {formStep === 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium cursor-pointer hover:shadow-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium cursor-pointer hover:shadow-md"
                  >
                    Create Baseline
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {modalField && (
        <AddOptionModal
          field={modalField}
          options={
            modalField === "skillCategories"
              ? dropdownOptions.skillCategories
              : dropdownOptions.technologies[modalField] || []
          }
          onAddOption={modalField === "skillCategories" ? addNewSkillCategory : addNewTechnology}
          onDeleteOption={(category, option) => {
            setDropdownOptions((prev) => ({
              ...prev,
              technologies: {
                ...prev.technologies,
                [category]: prev.technologies[category].filter((opt) => opt !== option),
              },
            }));
          }}
          onClose={() => setModalField(null)}
        />
      )}
    </div>
  );
};

export default ManageBaseline;
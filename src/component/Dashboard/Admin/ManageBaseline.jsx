import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileCard from "../../helper/ProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";
import { BaselineHistories } from "./BaselineHistory";
import AddOptionModal from "../../helper/OptionalModal";

const ManageBaseline = () => {
  const { state } = useLocation();
  const resource = state?.resource || {};
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("view");
  const [modalField, setModalField] = useState(null);
  const [baselineHistories, setBaselineHistories] = useState([]);

  const [formData, setFormData] = useState({
    employeeName: resource.employeeName || "",
    employeeId: resource.employeeId || "",
    position: resource.jobTitle || "",
    phone: resource.phoneNumber || "",
    competency: resource.competency || "",
    gender: "",
    experience: [{ technology: "", years: "" }],
    totalExperience: "",
    communication: "",
    status: "",
    techSkills: [],
    certification: [{ title: "", technology: "" }],
    currentStatus: "",
    feedback: "",
    opportunities: [],
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

  const deleteTechnology = (category, option) => {
    setDropdownOptions((prev) => ({
      ...prev,
      technologies: {
        ...prev.technologies,
        [category]: prev.technologies[category].filter((opt) => opt !== option),
      },
    }));
    setFormData((prev) => ({
      ...prev,
      techSkills: prev.techSkills.map((skill) =>
        skill.category === category && skill.technology === option ? { ...skill, technology: "" } : skill
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.competency) {
      alert("Employee information is missing");
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
      timestamp: new Date().toISOString(),
    };
    setBaselineHistories((prev) => [...prev, newHistory]);
    console.log("Submitted Data:", JSON.stringify(formData, null, 2));
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
    });
    setActiveSection("view");
  };

  const handleBackToResource = () => {
    navigate("/manage-resources");
  };

  const fieldStyle =
    "p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full";

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
          className={`${fieldStyle} w-full text-left flex justify-between items-center bg-white text-gray-700`}
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
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg relative">
      <div className="flex justify-between mb-6">
        <button
          className="px-6 py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 transition-all transform hover:scale-105"
          onClick={handleBackToResource}
        >
          Back to Resource
        </button>
        <div className="flex space-x-4">
          {activeSection !== "view" && (
            <button
              className="px-6 py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              onClick={() => setActiveSection("view")}
            >
              View Baseline Histories
            </button>
          )}
        </div>
      </div>

      {/* Floating Plus Icon for Adding Baseline */}
      {activeSection === "view" && (
        <button
          onClick={() => setActiveSection("add")}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110 z-50"
          title="Add New Baseline"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      )}

      {activeSection === "add" ? (
        <div>
          <ProfileCard
            employeeName={formData.employeeName}
            competency={formData.competency}
            gender={formData.gender}
          />
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Experience</label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={exp.technology}
                      onChange={(e) => handleExpChange(index, "technology", e.target.value)}
                      className={fieldStyle}
                      placeholder="Technology"
                    />
                    <input
                      type="text"
                      value={exp.years}
                      onChange={(e) => handleExpChange(index, "years", e.target.value)}
                      className={`${fieldStyle} w-1/4`}
                      placeholder="Years"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors text-sm shadow-sm"
                >
                  Add New
                </button>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Certification</label>
                {formData.certification.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => handleCertChange(index, "title", e.target.value)}
                      className={fieldStyle}
                      placeholder="Certificate Title"
                    />
                    <input
                      type="text"
                      value={cert.technology}
                      onChange={(e) => handleCertChange(index, "technology", e.target.value)}
                      className={`${fieldStyle} w-1/4`}
                      placeholder="Tag"
                    />
                    {formData.certification.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCertification}
                  className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors text-sm shadow-sm"
                >
                  Add New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Total Experience (Years)</label>
                <input
                  type="number"
                  name="totalExperience"
                  value={formData.totalExperience}
                  onChange={handleInputChange}
                  className={fieldStyle}
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Communication</label>
                <select
                  name="communication"
                  value={formData.communication}
                  onChange={handleInputChange}
                  className={fieldStyle}
                >
                  <option value="">Select Communication Level</option>
                  <option value="Average">Average</option>
                  <option value="Medium">Medium</option>
                  <option value="Fluent">Fluent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={fieldStyle}
                >
                  <option value="">Select Status</option>
                  <option value="Pool">Pool</option>
                  <option value="Deployed">Deployed</option>
                  <option value="PIP">PIP</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Current Status</label>
                <input
                  type="text"
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  className={fieldStyle}
                  placeholder="e.g., Upskill suggestion"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Tech Skills</label>
                <div className="space-y-3">
                  {formData.techSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
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
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={skill.rating}
                            onChange={(e) => handleTechSkillChange(index, "rating", e.target.value)}
                            className="w-16 p-2 text-center bg-blue-50 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-blue-800 appearance-none"
                            placeholder="0-5"
                            min="0"
                            max="5"
                          />
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-r-lg h-9 flex items-center justify-center">
                            /5
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeTechSkill(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTechSkill}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-semibold shadow-sm"
                  >
                    Add Tech Skill
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Feedback</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  className={fieldStyle}
                  placeholder="Add Feedback"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>

          {modalField && (
            <AddOptionModal
              field={modalField}
              options={
                modalField === "skillCategories"
                  ? dropdownOptions.skillCategories
                  : dropdownOptions.technologies[modalField] || []
              }
              onAddOption={modalField === "skillCategories" ? addNewSkillCategory : addNewTechnology}
              onDeleteOption={deleteTechnology}
              onClose={() => setModalField(null)}
            />
          )}
        </div>
      ) : (
        <BaselineHistories
          histories={baselineHistories}
          employeeName={formData.employeeName}
          competency={formData.competency}
          gender={formData.gender}
        />
      )}
    </div>
  );
};

export default ManageBaseline;
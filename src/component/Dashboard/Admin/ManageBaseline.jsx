import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../helper/ProfileCard";
import { FaArrowLeft, FaInfoCircle, FaTrash, FaPlusCircle, FaEdit, FaCheckCircle, FaTimes, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { BaselineHistories } from "./BaselineHistory";
import AddOptionModal from "../../helper/OptionalModal";
import {
  fetchCertificationAuthorities,
  fetchTechnologyCategoriesStack,
  fetchBaselineHistories,
  createBaseline
} from "../../../features/baseline/baselineAction";
import { SuccessToast, ErrorToast } from "../../helper/ResourceToast";

const TechSkillSelector = ({ techSkills, setTechSkills, technologyCategoriesWithTech, loading, setModalField, setSelectedCategoryId }) => {
  const [openTechDropdowns, setOpenTechDropdowns] = useState({}); // Track open/closed state for each section

  const handleCategoryChange = (categoryId, cardIndex) => {
    const updatedTechSkills = [...techSkills];
    updatedTechSkills[cardIndex] = { ...updatedTechSkills[cardIndex], category: categoryId, technologies: [] };
    setTechSkills(updatedTechSkills);
  };

  const handleTechToggle = (techId, techName, cardIndex) => {
    const updatedTechSkills = [...techSkills];
    const card = updatedTechSkills[cardIndex];
    const existingTech = card.technologies.find(t => t.technology === techId);

    if (existingTech) {
      card.technologies = card.technologies.filter(t => t.technology !== techId);
    } else {
      card.technologies.push({ technology: techId, name: techName, rating: "" });
    }

    setTechSkills(updatedTechSkills);
  };

  const handleRatingChange = (techId, rating, cardIndex) => {
    const value = Math.min(parseInt(rating) || 0, 5); // Restrict to max 5
    const updatedTechSkills = [...techSkills];
    const card = updatedTechSkills[cardIndex];
    const tech = card.technologies.find(t => t.technology === techId);
    if (tech) {
      tech.rating = value.toString();
    }
    setTechSkills(updatedTechSkills);
  };

  const handleDeleteTech = (techId, cardIndex) => {
    const updatedTechSkills = [...techSkills];
    const card = updatedTechSkills[cardIndex];
    card.technologies = card.technologies.filter(t => t.technology !== techId);
    setTechSkills(updatedTechSkills);
  };

  const addCategorySection = () => {
    setTechSkills([...techSkills, { category: "", technologies: [] }]);
  };

  const removeCategorySection = (cardIndex) => {
    setTechSkills(techSkills.filter((_, i) => i !== cardIndex));
  };

  const openTechModal = (categoryId) => {
    setModalField("technology_stack");
    setSelectedCategoryId(categoryId);
  };

  const toggleTechDropdown = (cardIndex) => {
    setOpenTechDropdowns((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }));
  };

  return (
    <div className="space-y-4">
      {techSkills.map((card, cardIndex) => (
        <div
          key={cardIndex}
          className="relative bg-white p-4 rounded-xl shadow-md border border-gray-100 max-w-3xl transition-all duration-300 hover:shadow-lg"
        >
          {techSkills.length > 1 && (
            <button
              onClick={() => removeCategorySection(cardIndex)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-200"
              title="Remove Section"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Category Dropdown */}
            <div className="relative w-full lg:w-1/4">
              <select
                value={card.category}
                onChange={(e) => {
                  if (e.target.value === "add_category") {
                    setModalField("technology_category");
                  } else {
                    handleCategoryChange(e.target.value, cardIndex);
                  }
                }}
                className="w-full p-2 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 text-sm text-gray-700 max-h-40 overflow-y-auto appearance-none transition-all duration-200 hover:border-blue-300 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100"
                disabled={loading}
              >
                <option value="">Select Category</option>
                {technologyCategoriesWithTech.map((cat) => (
                  <option key={cat.publicId} value={cat.publicId}>
                    {cat.name}
                  </option>
                ))}
                <option value="add_category" className="font-semibold text-blue-600 text-sm">
                  + Add New Category
                </option>
              </select>
              <FaEdit className="absolute left-2 top-2.5 text-blue-500 w-4 h-4" />
            </div>

            {/* Technology Dropdown (Collapsible) */}
            {card.category && (
              <div className="w-full lg:w-1/3">
                <button
                  onClick={() => toggleTechDropdown(cardIndex)}
                  className="w-full flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-blue-100 transition-colors duration-200"
                >
                  <span>Select Technologies</span>
                  {openTechDropdowns[cardIndex] ? (
                    <FaChevronUp className="w-4 h-4 text-blue-500" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 text-blue-500" />
                  )}
                </button>
                {openTechDropdowns[cardIndex] && (
                  <div className="mt-1 bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto border border-gray-200 transition-all duration-300 ease-in-out">
                    {technologyCategoriesWithTech
                      .find((cat) => cat.publicId === card.category)?.technologies
                      .map((tech) => (
                        <div key={tech.publicId} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={card.technologies.some((t) => t.technology === tech.publicId)}
                            onChange={() => handleTechToggle(tech.publicId, tech.name, cardIndex)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-400"
                          />
                          <span className="text-sm text-gray-700 font-medium">{tech.name}</span>
                          {card.technologies.some((t) => t.technology === tech.publicId) && (
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={card.technologies.find((t) => t.technology === tech.publicId)?.rating || ""}
                                onChange={(e) => handleRatingChange(tech.publicId, e.target.value, cardIndex)}
                                className="w-12 p-1 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                placeholder="0-5"
                                min="0"
                                max="5"
                              />
                              <span className="px-1 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-r-lg border border-l-0 border-gray-200">
                                /5
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    <button
                      onClick={() => openTechModal(card.category)}
                      className="flex items-center w-full mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm"
                    >
                      <FaPlusCircle className="mr-1 w-3 h-3" />
                      Add New Technology
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Selected Technology Tags */}
            {card.technologies.length > 0 && (
              <div className="w-full lg:w-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                  Selected Technologies
                </h4>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 min-h-[60px] flex flex-wrap gap-1">
                  {card.technologies.map((tech) => (
                    <div
                      key={tech.technology}
                      className="flex items-center bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 hover:bg-blue-700 hover:scale-105 cursor-pointer"
                    >
                      <FaCheckCircle className="mr-1 w-2.5 h-2.5" />
                      <span>{tech.name} {tech.rating ? `(${tech.rating}/5)` : "(No rating)"}</span>
                      <button
                        onClick={() => handleDeleteTech(tech.technology, cardIndex)}
                        className="ml-1 text-white hover:text-red-300 transition-colors duration-200"
                        title="Remove Technology"
                      >
                        <FaTrash className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={addCategorySection}
        className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
      >
        <FaPlus className="mr-1 w-3 h-3" />
        Add Category Section
      </button>
    </div>
  );
};

const ManageBaseline = () => {
  const { publicId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    certificationAuthorities = [],
    technologyCategoriesWithTech = [],
    certificationAuthorityLoading = false,
    technologyCategoriesStackLoading = false,
    baselineHistories = [],
    baselineLoading = false
  } = useSelector((state) => state.baseline);

  const resourceDetails = useSelector((state) =>
    state.resource.resources.find(res => res.publicId === publicId) ||
    state.resource.resourceDetails
  );

  const [activeSection, setActiveSection] = useState("view");
  const [modalField, setModalField] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const [formData, setFormData] = useState({
    experience: [{ technology: "", years: "" }],
    totalExperience: "",
    communication: "",
    techSkills: [{ category: "", technologies: [] }],
    certification: [{ name: "", issuingAuthority: "" }],
    rating: "",
    feedback: "",
    upskillSuggestion: "",
  });

  useEffect(() => {
    if (!hasFetchedInitialData) {
      dispatch(fetchCertificationAuthorities());
      dispatch(fetchTechnologyCategoriesStack());
      dispatch(fetchBaselineHistories(publicId));
      setHasFetchedInitialData(true);
    }
  }, [dispatch, hasFetchedInitialData, publicId]);

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
      certification: [...prev.certification, { name: "", issuingAuthority: "" }],
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certification: prev.certification.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.communication || !formData.feedback || !formData.rating) {
      setToast(<ErrorToast message="Please fill all required fields" onClose={() => setToast(null)} />);
      return;
    }

    try {
      const getNameById = (publicId, collection) => {
        if (!publicId) return '';
        const item = collection?.find(item => item.publicId === publicId);
        return item?.name || publicId;
      };

      const technologyExperience = formData.experience
        .filter(exp => exp.technology && exp.years)
        .map(exp => ({
          technology: exp.technology,
          years: parseInt(exp.years) || 0
        }));

      const certification = formData.certification
        .filter(cert => cert.name && cert.issuingAuthority)
        .map(cert => ({
          title: cert.name,
          technology: getNameById(cert.issuingAuthority, certificationAuthorities)
        }));

      const technicalSkills = formData.techSkills
        .flatMap(skill => 
          skill.category && skill.technologies.length > 0
            ? skill.technologies
                .filter(tech => tech.technology && tech.rating)
                .map(tech => {
                  const categoryObj = technologyCategoriesWithTech.find(
                    cat => cat.publicId === skill.category
                  );
                  const categoryName = categoryObj?.name || skill.category;
                  return {
                    category: categoryName,
                    technology: tech.name,
                    rating: parseInt(tech.rating) || 0
                  };
                })
            : []
        );

      const baselineData = {
        technologyExperience,
        certification,
        totalExperience: parseInt(formData.totalExperience) || 0,
        communication: parseInt(formData.communication) || 0,
        technicalSkills,
        rating: parseInt(formData.rating) || 0,
        feedback: formData.feedback,
        upskillSuggestion: formData.upskillSuggestion,
        userId: publicId
      };

      await dispatch(createBaseline({ userId: publicId, baselineData })).unwrap();

      setFormData({
        experience: [{ technology: "", years: "" }],
        totalExperience: "",
        communication: "",
        techSkills: [{ category: "", technologies: [] }],
        certification: [{ name: "", issuingAuthority: "" }],
        rating: "",
        feedback: "",
        upskillSuggestion: "",
      });

      setShowForm(false);
      setFormStep(1);
      setActiveSection("view");
      setToast(<SuccessToast message="Baseline created successfully!" onClose={() => setToast(null)} />);
      dispatch(fetchBaselineHistories(publicId));
    } catch (error) {
      setToast(<ErrorToast message={error.message || "Failed to create baseline"} onClose={() => setToast(null)} />);
    }
  };

  const getModalOptions = (fieldName) => {
    switch (fieldName) {
      case "certification_authority":
        return certificationAuthorities;
      case "technology_category":
        return technologyCategoriesWithTech;
      case "technology_stack":
        if (!selectedCategoryId) return [];
        const category = technologyCategoriesWithTech?.find(
          cat => cat.publicId === selectedCategoryId
        );
        return category?.technologies || [];
      default:
        return [];
    }
  };

  const openAddForm = () => setShowForm(true);
  const closeAddForm = () => {
    setShowForm(false);
    setFormStep(1);
  };
  const nextStep = () => setFormStep(2);
  const prevStep = () => setFormStep(1);

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
      {toast}
      <button
        onClick={() => navigate("/manage-resources")}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      >
        <FaArrowLeft className="mr-2" /> Back to Resources
      </button>

      <ProfileCard
        publicId={publicId}
        employeeName={resourceDetails?.employeeName}
        designation={resourceDetails?.designation}
        email={resourceDetails?.email}
        phoneNumber={resourceDetails?.phoneNumber}
        status={resourceDetails?.status}
      />

      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Baseline Management for {resourceDetails?.employeeName || 'Resource'}
      </h2>

      {activeSection === "view" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          <BaselineHistories
            histories={baselineHistories}
            employeeName={resourceDetails?.employeeName}
            competency={resourceDetails?.competency}
            gender={resourceDetails?.gender}
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
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
              {formStep === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={exp.technology}
                          onChange={(e) => handleExpChange(index, "technology", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Technology"
                        />
                        <input
                          type="number"
                          value={exp.years}
                          onChange={(e) => handleExpChange(index, "years", e.target.value)}
                          className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Years"
                          min="0"
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
                          value={cert.name}
                          onChange={(e) => handleCertChange(index, "name", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Certification Name"
                        />
                        <select
                          value={cert.issuingAuthority}
                          onChange={(e) => {
                            if (e.target.value === "add_authority") {
                              setModalField("certification_authority");
                            } else {
                              handleCertChange(index, "issuingAuthority", e.target.value);
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Authority</option>
                          {certificationAuthorities.map((auth) => (
                            <option key={auth.publicId} value={auth.publicId}>
                              {auth.name}
                            </option>
                          ))}
                          <option value="add_authority" className="font-semibold text-blue-600">
                            + Add New Authority
                          </option>
                        </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience (Years)*</label>
                    <input
                      type="number"
                      name="totalExperience"
                      value={formData.totalExperience}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Communication Level*</label>
                    <select
                      name="communication"
                      value={formData.communication}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Communication Level</option>
                      <option value="1">Average</option>
                      <option value="2">Medium</option>
                      <option value="3">Fluent</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tech Skills*</label>
                    <TechSkillSelector
                      techSkills={formData.techSkills}
                      setTechSkills={(newTechSkills) => setFormData(prev => ({ ...prev, techSkills: newTechSkills }))}
                      technologyCategoriesWithTech={technologyCategoriesWithTech}
                      loading={technologyCategoriesStackLoading}
                      setModalField={setModalField}
                      setSelectedCategoryId={setSelectedCategoryId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating*</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0-5"
                      min="0"
                      max="5"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback*</label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add feedback here"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upskill Suggestion</label>
                    <input
                      type="text"
                      name="upskillSuggestion"
                      value={formData.upskillSuggestion}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Learn React"
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
                    disabled={baselineLoading}
                  >
                    {baselineLoading ? "Creating..." : "Create Baseline"}
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
          options={getModalOptions(modalField)}
          onClose={() => {
            setModalField(null);
            setSelectedCategoryId(null);
          }}
          setToast={setToast}
          categoryId={selectedCategoryId}
        />
      )}
    </div>
  );
};

export default ManageBaseline;
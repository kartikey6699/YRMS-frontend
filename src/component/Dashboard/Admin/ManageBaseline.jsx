import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../helper/ProfileCard";
import { FaArrowLeft, FaInfoCircle, FaTrash, FaPlusCircle, FaEdit, FaCheckCircle, FaTimes, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { BaselineHistories } from "./BaselineHistory";
import BaselineTimeline from "./BaselineTimeline";
import AddOptionModal from "../../helper/OptionalModal";
import {
  fetchCertificationAuthorities,
  fetchTechnologyCategoriesStack,
  fetchBaselineHistories,
  createBaseline,
} from "../../../features/baseline/baselineAction";
import { fetchTrainingTechnologies } from "../../../features/resource/resourceAction";
import { SuccessToast, ErrorToast } from "../../helper/ResourceToast";
import Select from "react-select";

const TechSkillSelector = ({ techSkills, setTechSkills, technologyCategoriesWithTech, loading, setModalField, setSelectedCategoryId }) => {
  const [openTechDropdowns, setOpenTechDropdowns] = useState({});
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((cardIndex) => {
        if (
          dropdownRefs.current[cardIndex] &&
          !dropdownRefs.current[cardIndex].contains(event.target)
        ) {
          setOpenTechDropdowns((prev) => ({
            ...prev,
            [cardIndex]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (categoryId, cardIndex) => {
    const updatedTechSkills = [...techSkills];
    updatedTechSkills[cardIndex] = { ...updatedTechSkills[cardIndex], category: categoryId, technologies: [] };
    setTechSkills(updatedTechSkills);
  };

  const handleTechToggle = (techId, techName, cardIndex) => {
    const updatedTechSkills = [...techSkills];
    const card = updatedTechSkills[cardIndex];
    const existingTech = card.technologies.find((t) => t.technology === techId);

    if (existingTech) {
      card.technologies = card.technologies.filter((t) => t.technology !== techId);
    } else {
      card.technologies.push({ technology: techId, name: techName, rating: "" });
    }

    setTechSkills(updatedTechSkills);
  };

  const handleRatingChange = (techId, rating, cardIndex) => {
    const value = Math.min(parseInt(rating) || 0, 5);
    const updatedTechSkills = [...techSkills];
    const card = updatedTechSkills[cardIndex];
    const tech = card.technologies.find((t) => t.technology === techId);
    if (tech) {
      tech.rating = value.toString();
    }
    setTechSkills(updatedTechSkills);
  };

  const handleDeleteTech = (techId, cardIndex) => {
    const updatedTechSkills = [...techSkills];
    const card = updatedTechSkills[cardIndex];
    card.technologies = card.technologies.filter((t) => t.technology !== techId);
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
          className="relative bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md"
        >
          {techSkills.length > 1 && (
            <button
              onClick={() => removeCategorySection(cardIndex)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove Section"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={card.category}
                  onChange={(e) => {
                    if (e.target.value === "add_category") {
                      setModalField("technology_category");
                    } else {
                      handleCategoryChange(e.target.value, cardIndex);
                    }
                  }}
                  className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {technologyCategoriesWithTech.map((cat) => (
                    <option key={cat.publicId} value={cat.publicId}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="add_category" className="text-blue-600 font-medium">
                    + Add New Category
                  </option>
                </select>
                <FaEdit className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2" ref={(el) => (dropdownRefs.current[cardIndex] = el)}>
              <label className="block text-sm font-medium text-gray-700">Technologies</label>
              <button
                onClick={() => toggleTechDropdown(cardIndex)}
                disabled={!card.category}
                className={`w-full flex items-center justify-between p-2.5 border rounded-lg text-sm ${card.category
                  ? "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <span>Select Technologies</span>
                {openTechDropdowns[cardIndex] ? (
                  <FaChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <FaChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {openTechDropdowns[cardIndex] && card.category && (
                <div className="mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {technologyCategoriesWithTech
                      .find((cat) => cat.publicId === card.category)
                      ?.technologies.map((tech) => (
                        <div key={tech.publicId} className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 w-full">
                            <input
                              type="checkbox"
                              checked={card.technologies.some((t) => t.technology === tech.publicId)}
                              onChange={() => handleTechToggle(tech.publicId, tech.name, cardIndex)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{tech.name}</span>
                          </label>
                          {card.technologies.some((t) => t.technology === tech.publicId) && (
                            <input
                              type="number"
                              value={card.technologies.find((t) => t.technology === tech.publicId)?.rating || ""}
                              onChange={(e) => handleRatingChange(tech.publicId, e.target.value, cardIndex)}
                              className="w-12 p-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              max="5"
                              placeholder="0-5"
                            />
                          )}
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => openTechModal(card.category)}
                    className="mt-2 w-full flex items-center justify-center px-2 py-1.5 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <FaPlusCircle className="mr-1.5 w-3 h-3" />
                    Add New Technology
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Selected ({card.technologies.length})
              </label>
              <div className="min-h-[42px] p-2 bg-gray-50 border border-gray-200 rounded-lg">
                {card.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {card.technologies.map((tech) => (
                      <div
                        key={tech.technology}
                        className="flex items-center bg-white px-2.5 py-1 rounded-full border border-blue-100 shadow-xs text-xs"
                      >
                        <span className="text-gray-700 mr-1">{tech.name}</span>
                        {tech.rating && (
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                            {tech.rating}/5
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteTech(tech.technology, cardIndex)}
                          className="ml-1 text-gray-400 hover:text-red-500"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No technologies selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCategorySection}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <FaPlus className="mr-2 w-3 h-3" />
        Add Another Category
      </button>
    </div>
  );
};

const TechExperienceSelector = ({ value, onChange, setModalField, loading, options, errors }) => {
  const handleAddNew = () => {
    setModalField("trainingtechnology");
  };

  const MenuList = (props) => {
    return (
      <div>
        {props.children}
        <div style={{
          position: "sticky",
          bottom: 0,
          background: "white",
          borderTop: "1px solid #eee",
          padding: "8px",
          zIndex: 1,
        }}>
          <button
            type="button"
            onClick={handleAddNew}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-300 flex items-center justify-center text-sm"
          >
            Add Technology
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        className={`basic-single ${errors ? "border-red-500" : ""}`}
        classNamePrefix="select"
        placeholder="Select technology..."
        isLoading={loading}
        components={{ MenuList }}
        styles={{
          menu: (provided) => ({
            ...provided,
            maxHeight: 200,
            overflowY: "auto",
          }),
        }}
      />
      {errors && (
        <p className="mt-1 text-sm text-red-600">{errors}</p>
      )}
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
    baselineLoading = false,

  } = useSelector((state) => state.baseline);

  const {  trainingTechnologies = [], trainingTechnologyLoading = false } = useSelector(
    (state) => state.resource
  );
  

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
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    experience: [{ technology: null, years: "" }],
    totalExperience: "",
    communication: "",
    techSkills: [{ category: "", technologies: [] }],
    certification: [{ name: "", issuingAuthority: "" }],
    rating: "",
    feedback: "",
    upskillSuggestion: "",
  });

  const technologyOptions = trainingTechnologies.map(tech => ({
    value: tech.publicId,
    label: tech.name,
  }));

  useEffect(() => {
    if (!hasFetchedInitialData) {
      dispatch(fetchCertificationAuthorities());
      dispatch(fetchTechnologyCategoriesStack());
      dispatch(fetchBaselineHistories(publicId));
      dispatch(fetchTrainingTechnologies());
      setHasFetchedInitialData(true);
    }
  }, [dispatch, hasFetchedInitialData, publicId]);

  const validateForm = () => {
    const newErrors = {};

    // Experience validations
    formData.experience.forEach((exp, index) => {
      if (!exp.technology) {
        newErrors[`experience[${index}].technology`] = "Technology is required";
      }
      if (!exp.years || parseInt(exp.years) <= 0) {
        newErrors[`experience[${index}].years`] = "Valid years (>0) required";
      }
    });

    // Total Experience
    if (!formData.totalExperience || parseInt(formData.totalExperience) < 0) {
      newErrors.totalExperience = "Valid total experience (≥0) is required";
    }

    // Communication
    if (!formData.communication) {
      newErrors.communication = "Communication level is required";
    }

    // Tech Skills
    formData.techSkills.forEach((skill, index) => {
      if (!skill.category) {
        newErrors[`techSkills[${index}].category`] = "Category is required";
      }
      if (skill.technologies.length === 0) {
        newErrors[`techSkills[${index}].technologies`] = "At least one technology required";
      }
      skill.technologies.forEach((tech, techIndex) => {
        if (!tech.rating || parseInt(tech.rating) <= 0 || parseInt(tech.rating) > 5) {
          newErrors[`techSkills[${index}].technologies[${techIndex}].rating`] = "Rating (1-5) required";
        }
      });
    });

    // Certifications
    formData.certification.forEach((cert, index) => {
      if (!cert.name) {
        newErrors[`certification[${index}].name`] = "Certification name required";
      }
      if (!cert.issuingAuthority) {
        newErrors[`certification[${index}].issuingAuthority`] = "Issuing authority required";
      }
    });

    // Rating
    if (!formData.rating || parseInt(formData.rating) < 0 || parseInt(formData.rating) > 5) {
      newErrors.rating = "Overall rating (0-5) required";
    }

    // Feedback
    if (!formData.feedback) {
      newErrors.feedback = "Feedback is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleExpChange = (index, field, value) => {
    const updatedExp = [...formData.experience];
    updatedExp[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: updatedExp }));
    setErrors((prev) => ({ ...prev, [`experience[${index}].${field}`]: null }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { technology: null, years: "" }],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach((key) => {
      if (key.startsWith(`experience[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };

  const handleCertChange = (index, field, value) => {
    const updatedCert = [...formData.certification];
    updatedCert[index][field] = value;
    setFormData((prev) => ({ ...prev, certification: updatedCert }));
    setErrors((prev) => ({ ...prev, [`certification[${index}].${field}`]: null }));
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
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach((key) => {
      if (key.startsWith(`certification[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast(<ErrorToast message="Please fill all required fields correctly" onClose={() => setToast(null)} />);
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
          technology: technologyOptions.find(opt => opt.value === exp.technology.value)?.label || exp.technology.label,
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
        experience: [{ technology: null, years: "" }],
        totalExperience: "",
        communication: "",
        techSkills: [{ category: "", technologies: [] }],
        certification: [{ name: "", issuingAuthority: "" }],
        rating: "",
        feedback: "",
        upskillSuggestion: "",
      });

      setErrors({});
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
      case "trainingtechnology":
        return trainingTechnologies;
      default:
        return [];
    }
  };

  const openAddForm = () => setShowForm(true);
  const closeAddForm = () => {
    setShowForm(false);
    setFormStep(1);
    setErrors({});
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
        <div className="mb-10">
          <BaselineHistories
            histories={baselineHistories}
            employeeName={resourceDetails?.employeeName}
            competency={resourceDetails?.competency}
            gender={resourceDetails?.gender}
            userId={resourceDetails?.publicId}
          />
          <div
            onClick={openAddForm}
            className="rounded-xl shadow-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 flex items-center justify-center cursor-pointer transition-all duration-300 h-40 hover:shadow-xl hover:translate-y-[-4px] mt-4"
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
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

            <div className="flex">
              <div className="w-full lg:w-2/3 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formStep === 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Experiencee <span className="text-red-500">*</span></label>
                        {formData.experience.map((exp, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Technology <span className="text-red-500">*</span></label>
                              <TechExperienceSelector
                                value={exp.technology}
                                onChange={(selected) => handleExpChange(index, "technology", selected)}
                                setModalField={setModalField}
                                loading={trainingTechnologyLoading}
                                options={technologyOptions}
                                errors={errors[`experience[${index}].technology`]}
                              />
                            </div>
                            <div className="w-1/4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Years <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                value={exp.years}
                                onChange={(e) => handleExpChange(index, "years", e.target.value)}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`experience[${index}].years`] ? "border-red-500" : "border-gray-300"}`}
                                placeholder="0"
                                min="0"
                              />
                              {errors[`experience[${index}].years`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`experience[${index}].years`]}</p>
                              )}
                            </div>
                            {formData.experience.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="text-red-500 hover:text-red-700 mt-6"
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
                          Add Tech Experience
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Certification Details <span className="text-red-500">*</span></label>
                        {formData.certification.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => handleCertChange(index, "name", e.target.value)}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`certification[${index}].name`] ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Enter certification name"
                              />
                              {errors[`certification[${index}].name`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`certification[${index}].name`]}</p>
                              )}
                            </div>
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Authority Name <span className="text-red-500">*</span></label>
                              <select
                                value={cert.issuingAuthority}
                                onChange={(e) => {
                                  if (e.target.value === "add_authority") {
                                    setModalField("certification_authority");
                                  } else {
                                    handleCertChange(index, "issuingAuthority", e.target.value);
                                  }
                                }}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`certification[${index}].issuingAuthority`] ? "border-red-500" : "border-gray-300"}`}
                              >
                                <option value="">Select Certification Authority</option>
                                {certificationAuthorities.map((auth) => (
                                  <option key={auth.publicId} value={auth.publicId}>
                                    {auth.name}
                                  </option>
                                ))}
                                <option value="add_authority" className="font-semibold text-blue-600">
                                  + Add New Authority
                                </option>
                              </select>
                              {errors[`certification[${index}].issuingAuthority`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`certification[${index}].issuingAuthority`]}</p>
                              )}
                            </div>
                            {formData.certification.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCertification(index)}
                                className="text-red-500 hover:text-red-700 mt-6"
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
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.totalExperience ? "border-red-500" : "border-gray-300"}`}
                          placeholder="e.g., 5"
                          min="0"
                          required
                        />
                        {errors.totalExperience && (
                          <p className="mt-1 text-sm text-red-600">{errors.totalExperience}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Communication Level* <span className="text-red-500">*</span></label>
                        <select
                          name="communication"
                          value={formData.communication}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.communication ? "border-red-500" : "border-gray-300"}`}
                          required
                        >
                          <option value="">Select Communication Level</option>
                          <option value="1">Average</option>
                          <option value="2">Medium</option>
                          <option value="3">Fluent</option>
                        </select>
                        {errors.communication && (
                          <p className="mt-1 text-sm text-red-600">{errors.communication}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Skills* <span className="text-red-500">*</span></label>
                        <TechSkillSelector
                          techSkills={formData.techSkills}
                          setTechSkills={(newTechSkills) => setFormData(prev => ({ ...prev, techSkills: newTechSkills }))}
                          technologyCategoriesWithTech={technologyCategoriesWithTech}
                          loading={technologyCategoriesStackLoading}
                          setModalField={setModalField}
                          setSelectedCategoryId={setSelectedCategoryId}
                        />
                        {formData.techSkills.map((skill, index) => (
                          <div key={index}>
                            {errors[`techSkills[${index}].category`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`techSkills[${index}].category`]}</p>
                            )}
                            {errors[`techSkills[${index}].technologies`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`techSkills[${index}].technologies`]}</p>
                            )}
                            {skill.technologies.map((tech, techIndex) => (
                              <div key={techIndex}>
                                {errors[`techSkills[${index}].technologies[${techIndex}].rating`] && (
                                  <p className="mt-1 text-sm text-red-600">{errors[`techSkills[${index}].technologies[${techIndex}].rating`]}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rating ? "border-red-500" : "border-gray-300"}`}
                          placeholder="0-5"
                          min="0"
                          max="5"
                        />
                        {errors.rating && (
                          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback <span className="text-red-500">*</span></label>
                        <textarea
                          name="feedback"
                          value={formData.feedback}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.feedback ? "border-red-500" : "border-gray-300"}`}
                          placeholder="Add feedback here"
                          rows="3"
                        />
                        {errors.feedback && (
                          <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upskill Suggestion</label>
                        <textarea
                          name="upskillSuggestion"
                          value={formData.upskillSuggestion}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Learn React"
                          rows={3} 
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

              <div className="hidden lg:block w-1/3 bg-gray-50 border-l p-6 overflow-y-auto">
                <BaselineTimeline 
                  histories={baselineHistories}
                  onSelect={(id) => {}}
                />
              </div>
            </div>
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
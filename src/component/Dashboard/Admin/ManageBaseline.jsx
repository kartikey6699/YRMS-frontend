import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../helper/ProfileCard";
import { FaArrowLeft, FaInfoCircle, FaTrash } from "react-icons/fa";
import { BaselineHistories } from "./BaselineHistory";
import Dropdown from "../../helper/Dropdown";
import AddOptionModal from "../../helper/OptionalModal";
import {
  fetchCertificationAuthorities,
  fetchTechnologyCategoriesStack,
  fetchBaselineHistories,
  createBaseline
} from "../../../features/baseline/baselineAction";
import { SuccessToast, ErrorToast } from "../../helper/ResourceToast";

const ManageBaseline = () => {
  const { publicId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
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

  // Local state
  const [activeSection, setActiveSection] = useState("view");
  const [modalField, setModalField] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // New state to track category for modal
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const [formData, setFormData] = useState({
    experience: [{ technology: "", years: "" }],
    totalExperience: "",
    communication: "",
    techSkills: [{ category: "", technology: "", rating: "" }],
    certification: [{ name: "", issuingAuthority: "" }],
    rating: "",
    feedback: "",
    upskillSuggestion: "",
  });

  // Fetch initial data
  useEffect(() => {
    if (!hasFetchedInitialData) {
      dispatch(fetchCertificationAuthorities());
      dispatch(fetchTechnologyCategoriesStack());
      dispatch(fetchBaselineHistories(publicId));
      setHasFetchedInitialData(true);
    }
  }, [dispatch, hasFetchedInitialData, publicId]);

  // Form handlers
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

  const handleTechSkillChange = (index, field, value) => {
    const updatedTechSkills = [...formData.techSkills];
    updatedTechSkills[index][field] = value;

    if (field === "category") {
      updatedTechSkills[index].technology = ""; // Reset technology when category changes
    }

    setFormData(prev => ({ ...prev, techSkills: updatedTechSkills }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.communication || !formData.feedback || !formData.rating) {
      setToast(<ErrorToast message="Please fill all required fields" onClose={() => setToast(null)} />);
      return;
    }

    try {
      // Helper function to find name by publicId
      const getNameById = (publicId, collection) => {
        if (!publicId) return '';
        const item = collection?.find(item => item.publicId === publicId);
        return item?.name || publicId; // Fallback to publicId if not found
      };

      // For technologyExperience (simple technologies)
      const technologyExperience = formData.experience
        .filter(exp => exp.technology && exp.years)
        .map(exp => ({
          technology: exp.technology, // Already using name
          years: parseInt(exp.years) || 0
        }));

      // For certification
      const certification = formData.certification
        .filter(cert => cert.name && cert.issuingAuthority)
        .map(cert => ({
          title: cert.name,
          technology: getNameById(cert.issuingAuthority, certificationAuthorities)
        }));

      // For technicalSkills
      const technicalSkills = formData.techSkills
        .filter(skill => skill.category && skill.technology && skill.rating)
        .map(skill => {
          // Find the category name
          const categoryObj = technologyCategoriesWithTech.find(
            cat => cat.publicId === skill.category
          );
          const categoryName = categoryObj?.name || skill.category;

          // Find the technology name
          let technologyName = skill.technology;
          if (categoryObj) {
            const techObj = categoryObj.technologies.find(
              tech => tech.publicId === skill.technology
            );
            if (techObj) technologyName = techObj.name;
          }

          return {
            category: categoryName,
            technology: technologyName,
            rating: parseInt(skill.rating) || 0
          };
        });

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

      console.log("Submitting baseline data:", baselineData); // For debugging

      await dispatch(createBaseline({ userId: publicId, baselineData })).unwrap();

      // Reset form and show success
      setFormData({
        experience: [{ technology: "", years: "" }],
        totalExperience: "",
        communication: "",
        techSkills: [{ category: "", technology: "", rating: "" }],
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
      case "designation":
        return designations;
      case "competency":
        return competencies;
      case "certification_authority":
        return certificationAuthorities;
      case "technology_category":
        return technologyCategoriesWithTech;
      case "technology_stack":
        if (!selectedCategoryId) {
          console.warn("No category ID selected for technology stack");
          return [];
        }
        const category = technologyCategoriesWithTech?.find(
          cat => cat.publicId === selectedCategoryId
        );
        console.log("Found category:", category);
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

  // Function to set modal field and category ID
  const openModalWithCategory = (field, categoryId) => {
    setModalField(field);
    setSelectedCategoryId(categoryId);
  };

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
            profileImage={resourceDetails?.profileImage}
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
                        <Dropdown
                          name="certification_authority"
                          value={cert.issuingAuthority}
                          options={certificationAuthorities}
                          onChange={(e) => handleCertChange(index, "issuingAuthority", e.target.value)}
                          setModalField={() => openModalWithCategory("certification_authority", null)}
                          loading={certificationAuthorityLoading}
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
                    <div className="space-y-3">
                      {formData.techSkills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
                          <Dropdown
                            name="Category"
                            value={skill.category}
                            options={technologyCategoriesWithTech}
                            onChange={(e) => handleTechSkillChange(index, "category", e.target.value)}
                            setModalField={() => setModalField("technology_category")}  // Set modalField correctly
                            loading={technologyCategoriesStackLoading}
                          />
                          <Dropdown
                            name="Technology"
                            value={skill.technology}
                            options={
                              technologyCategoriesWithTech.find(cat => cat.publicId === skill.category)?.technologies || []
                            }
                            onChange={(e) => handleTechSkillChange(index, "technology", e.target.value)}
                            setModalField={() => {
                              setModalField("technology_stack");
                              setSelectedCategoryId(skill.category); // Set the category ID here
                            }}
                            dependentValue={skill.category}
                            loading={technologyCategoriesStackLoading}
                          />
                          {skill.technology && (
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={skill.rating}
                                onChange={(e) => handleTechSkillChange(index, "rating", e.target.value)}
                                className="w-16 p-2 border border-gray-300 rounded-l-lg border-r-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0-5"
                                min="0"
                                max="5"
                                required
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
          categoryId={selectedCategoryId} // Pass the dynamically selected category ID
        />
      )}
    </div>
  );
};

export default ManageBaseline;
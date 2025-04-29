import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../helper/ProfileCard";
import { FaArrowLeft, FaInfoCircle, FaTrash, FaPlusCircle, FaCheckCircle, FaTimes, FaPlus, FaChevronDown, FaChevronUp, FaStar, FaChartLine } from "react-icons/fa"; // Added FaStar and FaChartLine imports
import AddOptionModal from "../../helper/OptionalModal";
import {
  fetchCertificationAuthorities,
  fetchTechnologyCategoriesStack,
  fetchBaselineHistories,
  createBaseline
} from "../../../features/baseline/baselineAction";
import { SuccessToast, ErrorToast } from "../../helper/ResourceToast";

const BaselineAccordion = ({ histories }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-600";
    if (rating >= 3) return "text-blue-600";
    if (rating >= 2) return "text-amber-600";
    return "text-red-600";
  };

  const getBgColor = (rating) => {
    if (rating >= 4) return "bg-emerald-50";
    if (rating >= 3) return "bg-blue-50";
    if (rating >= 2) return "bg-amber-50";
    return "bg-red-50";
  };

  const getBorderColor = (rating) => {
    if (rating >= 4) return "border-emerald-200";
    if (rating >= 3) return "border-blue-200";
    if (rating >= 2) return "border-amber-200";
    return "border-red-200";
  };

  return (
    <div className="space-y-2">
      {histories.map((baseline, index) => {
        const rating = parseFloat(baseline.rating) || 0;
        const roundedRating = Math.round(rating * 10) / 10;
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className={`border rounded-lg overflow-hidden ${getBorderColor(rating)} transition-all duration-200 ${isExpanded ? 'shadow-sm' : 'hover:shadow-xs'}`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full text-left p-4 flex justify-between items-center ${getBgColor(rating)} hover:bg-opacity-80 transition-colors duration-200`}
            >
              <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold ${getRatingColor(rating)}`}>
                  {roundedRating}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Baseline Assessment</h3>
                  <p className="text-xs text-gray-500">{formatDate(baseline.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium bg-white px-2 py-1 rounded border border-gray-200">
                  {baseline.communication || "N/A"}
                </span>
                {isExpanded ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <h4 className="flex items-center text-sm font-medium text-gray-700">
                      <FaInfoCircle className="mr-2 text-blue-500" />
                      Basic Info
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p>{baseline.totalExperience || 0} yrs</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Communication</p>
                        <p>{baseline.communication || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Rating</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} w-4 h-4`}
                            />
                          ))}
                          <span className="ml-2 font-medium">{roundedRating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technology Experience */}
                  <div className="space-y-2">
                    <h4 className="flex items-center text-sm font-medium text-gray-700">
                      <FaChartLine className="mr-2 text-blue-500" />
                      Tech Experience
                    </h4>
                    <div className="space-y-1">
                      {baseline.technologyExperience?.slice(0, 3).map((exp, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{exp.technology}</span>
                          <span className="font-medium">{exp.years} yrs</span>
                        </div>
                      ))}
                      {baseline.technologyExperience?.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{baseline.technologyExperience.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <h4 className="flex items-center text-sm font-medium text-gray-700">
                      <FaCheckCircle className="mr-2 text-blue-500" />
                      Certifications
                    </h4>
                    <div className="space-y-1">
                      {baseline.certification?.slice(0, 3).map((cert, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium">{cert.title}</p>
                          <p className="text-xs text-gray-500">{cert.technology}</p>
                        </div>
                      ))}
                      {baseline.certification?.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{baseline.certification.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {baseline.technicalSkills?.slice(0, 8).map((skill, i) => (
                      <div key={i} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-sm">
                        <span className="mr-1">{skill.technology}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, j) => (
                            <FaStar
                              key={j}
                              className={`${j < (parseInt(skill.rating) || 0) ? "text-yellow-400" : "text-gray-300"} w-3 h-3`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {baseline.technicalSkills?.length > 8 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-sm">
                        +{baseline.technicalSkills.length - 8} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback & Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 className="text-xs font-medium text-blue-700 mb-1">FEEDBACK</h4>
                    <p className="text-sm line-clamp-3">
                      {baseline.feedback || "No feedback provided"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <h4 className="text-xs font-medium text-green-700 mb-1">UPSKILL SUGGESTIONS</h4>
                    <p className="text-sm line-clamp-3">
                      {baseline.upskillSuggestion || "No suggestions provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CreateBaselineButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
  >
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
        <FaPlusCircle className="text-blue-500 text-xl" />
      </div>  
      <div className="text-left">
        <h3 className="text-lg font-semibold text-blue-700">Create New Baseline</h3>
        <p className="text-sm text-blue-500">Add a new baseline assessment</p>
      </div>
    </div>
    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
      <span>New Assessment</span>
      <FaChevronDown className="ml-2 transform group-hover:translate-y-0.5 transition-transform" />
    </div>
  </button>
);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleExpChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { technology: "", years: "" }],
    });
  };

  const removeExperience = (index) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  const handleCertChange = (index, field, value) => {
    const updated = [...formData.certification];
    updated[index][field] = value;
    setFormData({ ...formData, certification: updated });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certification: [...formData.certification, { name: "", issuingAuthority: "" }],
    });
  };

  const removeCertification = (index) => {
    const updated = [...formData.certification];
    updated.splice(index, 1);
    setFormData({ ...formData, certification: updated });
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

  const sortedHistories = [...baselineHistories].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
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

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Baseline Management for {resourceDetails?.employeeName || 'Resource'}
      </h2>

      <div className="space-y-4">
        {sortedHistories.length > 0 ? (
          <BaselineAccordion histories={sortedHistories} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500 mb-6">No baseline assessments found</p>
          </div>
        )}
        <CreateBaselineButton onClick={openAddForm} />
      </div>

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

            <div className="flex flex-col md:flex-row">
              {/* Form Section */}
              <div className="flex-1 p-6 border-r border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formStep === 1 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience (years)</label>
                          <input
                            type="number"
                            name="totalExperience"
                            value={formData.totalExperience}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="0.5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Communication Rating</label>
                          <select
                            name="communication"
                            value={formData.communication}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Basic</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Technology Experience</label>
                          <button
                            type="button"
                            onClick={addExperience}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FaPlus className="mr-1" /> Add Experience
                          </button>
                        </div>

                        <div className="space-y-3">
                          {formData.experience.map((exp, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Technology"
                                  value={exp.technology}
                                  onChange={(e) => handleExpChange(index, "technology", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="w-24">
                                <input
                                  type="number"
                                  placeholder="Years"
                                  value={exp.years}
                                  onChange={(e) => handleExpChange(index, "years", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  min="0"
                                  step="0.5"
                                />
                              </div>
                              {formData.experience.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeExperience(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                        <TechSkillSelector
                          techSkills={formData.techSkills}
                          setTechSkills={(skills) => setFormData({ ...formData, techSkills: skills })}
                          technologyCategoriesWithTech={technologyCategoriesWithTech}
                          loading={technologyCategoriesStackLoading}
                          setModalField={setModalField}
                          setSelectedCategoryId={setSelectedCategoryId}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Certifications</label>
                          <button
                            type="button"
                            onClick={addCertification}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FaPlus className="mr-1" /> Add Certification
                          </button>
                        </div>

                        <div className="space-y-3">
                          {formData.certification.map((cert, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Certification Name"
                                  value={cert.name}
                                  onChange={(e) => handleCertChange(index, "name", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex">
                                  <select
                                    value={cert.issuingAuthority}
                                    onChange={(e) => handleCertChange(index, "issuingAuthority", e.target.value)}
                                    className="flex-1 rounded-l-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select Authority</option>
                                    {certificationAuthorities?.map((auth) => (
                                      <option key={auth.publicId} value={auth.publicId}>
                                        {auth.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => setModalField("certification_authority")}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-l-0 border-gray-300 rounded-r-md px-3"
                                  >
                                    <FaPlus className="text-sm" />
                                  </button>
                                </div>
                              </div>
                              {formData.certification.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeCertification(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
                          <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Basic</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                        <textarea
                          name="feedback"
                          value={formData.feedback}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide your feedback on this resource"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upskill Suggestions (Optional)</label>
                        <textarea
                          name="upskillSuggestion"
                          value={formData.upskillSuggestion}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Suggest areas for improvement or upskilling"
                        ></textarea>
                      </div>
                    </>
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

              {/* Previous Baselines Accordion */}
              <div className="w-full md:w-1/3 p-6 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Previous Baselines</h4>
                {sortedHistories.length > 0 ? (
                  <BaselineAccordion histories={sortedHistories} />
                ) : (
                  <p className="text-gray-500 text-sm italic">No previous baselines found</p>
                )}
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

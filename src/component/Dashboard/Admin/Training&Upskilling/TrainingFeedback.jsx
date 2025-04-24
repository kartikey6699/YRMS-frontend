import React, { useState, useEffect } from 'react';
import {
    FaTimes,
    FaPlus,
    FaEdit,
    FaSave,
    FaChartBar,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaSearch,
    FaTrash
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbackList, addFeedback } from '../../../../features/program/programAction';

const TrainingFeedback = ({ training, onClose, onSave }) => {
    const dispatch = useDispatch();
    const feedbackList = useSelector(state => state.program.feedback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [employees, setEmployees] = useState([]);
    const [customFeedbackColumns, setCustomFeedbackColumns] = useState([]);
    const [customScoreColumns, setCustomScoreColumns] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [isAddingFeedback, setIsAddingFeedback] = useState(false);
    const [isAddingScore, setIsAddingScore] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingColumn, setEditingColumn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalScore, setTotalScore] = useState(null);

    const ratingOptions = [
        { value: '', label: 'Select rating' },
        { value: 'poor', label: 'poor' },
        { value: 'average', label: 'Average' },
        { value: 'good', label: 'Good' },
        { value: 'excellent', label: 'Excellent' }
    ];

    useEffect(() => {
        if (training) {
            loadFeedbackData();
        }
    }, [training]);

    const loadFeedbackData = async () => {
        try {
            setLoading(true);
            setError(null);
            await dispatch(fetchFeedbackList(training.publicId)).unwrap();
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to load feedback data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (feedbackList) {
            processFeedbackData(feedbackList);
        }
    }, [feedbackList]);

    const processFeedbackData = (feedbackData) => {
        const processedEmployees = feedbackData.map(emp => {
            const employeeData = {
                id: emp.employeeId,
                name: emp.employeeName,
                userId: emp.userId,
                technicalSkills: emp.feedbacks?.technicalSkills || null,
                attitude: emp.feedbacks?.attitude || null,
                communication: emp.feedbacks?.communication || null,
                workQuality: emp.feedbacks?.workQuality || null
            };

            // Process custom feedback columns
            if (emp.feedbacks?.feedback?.length > 0) {
                const feedbackObj = emp.feedbacks.feedback[0];
                Object.keys(feedbackObj).forEach(key => {
                    if (!key.endsWith('CreatedAt')) {
                        employeeData[`feedback_${key}`] = feedbackObj[key];
                    }
                });
            }

            // Process custom score columns
            if (emp.feedbacks?.score?.length > 0) {
                const scoreObj = emp.feedbacks.score[0];
                Object.keys(scoreObj).forEach(key => {
                    if (!key.endsWith('Total')) {
                        employeeData[`score_${key}`] = scoreObj[key];
                    }
                });
            }

            return employeeData;
        });

        // Extract all unique feedback and score keys from all employees
        const feedbackKeys = new Set();
        const feedbackDates = {};
        const scoreKeys = new Set();
        const scoreTotals = {};

        feedbackData.forEach(emp => {
            if (emp.feedbacks?.feedback?.length > 0) {
                const feedbackObj = emp.feedbacks.feedback[0];
                Object.keys(feedbackObj).forEach(key => {
                    if (!key.endsWith('CreatedAt')) {
                        feedbackKeys.add(key);
                        if (feedbackObj[`${key}CreatedAt`]) {
                            feedbackDates[key] = feedbackObj[`${key}CreatedAt`];
                        }
                    }
                });
            }
            if (emp.feedbacks?.score?.length > 0) {
                const scoreObj = emp.feedbacks.score[0];
                Object.keys(scoreObj).forEach(key => {
                    if (!key.endsWith('Total')) {
                        scoreKeys.add(key);
                        if (scoreObj[`${key}Total`]) {
                            scoreTotals[key] = scoreObj[`${key}Total`];
                        }
                    }
                });
            }
        });

        // Set custom feedback columns with dynamic created_at dates
        setCustomFeedbackColumns(
            Array.from(feedbackKeys).map(key => ({
                id: `feedback_${key}`,
                name: key,
                createdAt: feedbackDates[key] ? new Date(feedbackDates[key]).toLocaleDateString() : new Date().toLocaleDateString()
            }))
        );

        // Set custom score columns with dynamic total scores
        setCustomScoreColumns(
            Array.from(scoreKeys).map(key => ({
                id: `score_${key}`,
                name: key,
                totalScore: scoreTotals[key] || 100
            }))
        );

        setEmployees(processedEmployees);
    };

    const handleRatingChange = (empId, field, value) => {
        if (['poor', 'average', 'good', 'excellent'].includes(value)) {
            setEmployees(employees.map(emp =>
                emp.id === empId ? { ...emp, [field]: value } : emp
            ));
            setHasChanges(true);
        } else {
            alert(`Input for ${field} should be 'poor', 'average', 'good' or 'excellent'`);
        }
    };

    const handleCustomFeedbackChange = (empId, columnId, value) => {
        setEmployees(employees.map(emp =>
            emp.id === empId ? { ...emp, [columnId]: value } : emp
        ));
        setHasChanges(true);
    };

    const handleCustomScoreChange = (empId, columnId, value) => {
        const column = customScoreColumns.find(col => col.id === columnId);
        const maxScore = column?.totalScore || 100;
        const numericValue = value === '' ? null : Math.min(maxScore, Math.max(0, parseInt(value) || 0));
        
        setEmployees(employees.map(emp =>
            emp.id === empId ? { ...emp, [columnId]: numericValue } : emp
        ));
        setHasChanges(true);
    };

    const addFeedbackColumn = () => {
        if (newColumnName.trim()) {
            const columnId = `feedback_${Date.now()}`;
            const currentDate = new Date().toLocaleDateString();
            setCustomFeedbackColumns([...customFeedbackColumns, { 
                id: columnId, 
                name: newColumnName,
                createdAt: currentDate
            }]);
            setEmployees(employees.map(emp => ({
                ...emp,
                [columnId]: ''
            })));
            setNewColumnName('');
            setIsAddingFeedback(false);
            setHasChanges(true);
        }
    };

    const addScoreColumn = () => {
        if (newColumnName.trim()) {
            const columnId = `score_${Date.now()}`;
            setCustomScoreColumns([...customScoreColumns, { 
                id: columnId, 
                name: newColumnName,
                totalScore: totalScore || 100
            }]);
            setEmployees(employees.map(emp => ({
                ...emp,
                [columnId]: null
            })));
            setNewColumnName('');
            setTotalScore(null);
            setIsAddingScore(false);
            setHasChanges(true);
        }
    };

    const deleteColumn = (columnId, isFeedback) => {
        if (isFeedback) {
            setCustomFeedbackColumns(customFeedbackColumns.filter(col => col.id !== columnId));
            setEmployees(employees.map(emp => {
                const newEmp = { ...emp };
                delete newEmp[columnId];
                return newEmp;
            }));
        } else {
            setCustomScoreColumns(customScoreColumns.filter(col => col.id !== columnId));
            setEmployees(employees.map(emp => {
                const newEmp = { ...emp };
                delete newEmp[columnId];
                return newEmp;
            }));
        }
        setHasChanges(true);
    };

    const updateColumnName = (columnId, newName, isFeedback) => {
        if (newName.trim()) {
            if (isFeedback) {
                setCustomFeedbackColumns(customFeedbackColumns.map(col =>
                    col.id === columnId ? { ...col, name: newName } : col
                ));
            } else {
                setCustomScoreColumns(customScoreColumns.map(col =>
                    col.id === columnId ? { ...col, name: newName } : col
                ));
            }
            setEditingColumn(null);
            setHasChanges(true);
        }
    };

    const calculateAverageScore = (employee) => {
        const scoreColumns = customScoreColumns.map(col => ({
            id: col.id,
            totalScore: col.totalScore || 100
        }));
        
        const validScores = scoreColumns
            .map(col => {
                const score = parseInt(employee[col.id]);
                return isNaN(score) ? null : (score / col.totalScore) * 100;
            })
            .filter(score => score !== null);

        if (validScores.length === 0) return '-';

        const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
        return Math.round(average);
    };

    const renderScoreInput = (employee, columnId, totalScore) => {
        const score = employee[columnId] ?? '';
        const percentage = score !== null && totalScore ? Math.round((score / totalScore) * 100) : 0;
        
        return (
            <div className="flex items-center">
                <input
                    type="number"
                    min="0"
                    max={totalScore}
                    value={score ?? ''}
                    onChange={(e) => handleCustomScoreChange(employee.id, columnId, e.target.value)}
                    className="border border-purple-300 rounded px-2 py-1 text-sm w-16 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="ml-2 text-xs text-gray-500">
                    ({percentage}%)
                </div>
            </div>
        );
    };

    const renderRatingStars = (value) => {
        if (!value) return null;

        const ratingMap = {
            poor: 1,
            average: 2.5,
            good: 4,
            excellent: 5
        };

        const rating = ratingMap[value] || 0;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
            }
        }

        return <span>{stars}</span>;
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        try {   
            const feedbackData = {
                feedback: employees.map(emp => {
                    // Standard ratings
                    const standardRatings = {
                        training_id: training.publicId,
                        user_id: emp.userId,
                        technicalSkills: emp.technicalSkills,
                        attitude: emp.attitude,
                        communication: emp.communication,
                        workQuality: emp.workQuality
                    };
                

                // Custom feedbacks
                const feedbacks = {};
                customFeedbackColumns.forEach(col => {
                    const key = col.name;
                    feedbacks[key] = emp[col.id] || '';
                    feedbacks[`${key}CreatedAt`] = col.createdAt ? col.createdAt : new Date().toLocaleDateString();
                });

                // Custom scores
                const scores = {};
                customScoreColumns.forEach(col => {
                    const key = col.name;
                    scores[key] = emp[col.id] || 0;
                    scores[`${key}Total`] = col.totalScore; // Add total score for each score column
                });


                return {
                    ...standardRatings,
                    feedback: [feedbacks],
                    score: [scores]
                };
            }),
        };

        await dispatch(addFeedback(feedbackData)).unwrap();
        setHasChanges(false);
        if (onSave) onSave();
        await loadFeedbackData();
    } catch (error) {
        setError(error.message || 'Failed to save feedback');
    }
};

    const getAverageScoreColor = (score) => {
        if (score === '-') return 'bg-gray-100';
        if (score >= 80) return 'bg-green-100 border-green-300';
        if (score >= 60) return 'bg-blue-100 border-blue-300';
        if (score >= 40) return 'bg-yellow-100 border-yellow-300';
        return 'bg-red-100 border-red-300';
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
                <div className="text-purple-600 text-lg font-semibold">Loading feedback data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
                <div className="text-red-600 text-lg font-semibold">{error}</div>
                <button 
                    onClick={onClose}
                    className="ml-4 px-4 py-2 bg-purple-600 text-white rounded"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"></div>

            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-purple-800">
                            <FaChartBar className="inline mr-2" />
                            TPR for {training?.name || 'Training'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-5 sm:p-6 max-h-[70vh] overflow-y-auto relative">
                        {/* Search and Add Buttons */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search employees by name..."
                                    className="block w-full pl-10 pr-3 py-2 border border-purple-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                                {isAddingFeedback ? (
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Feedback column name"
                                            value={newColumnName}
                                            onChange={(e) => setNewColumnName(e.target.value)}
                                            className="border border-purple-300 rounded px-2 py-1 text-sm w-80 mr-2" // Increased width
                                        />
                                        <button
                                            onClick={addFeedbackColumn}
                                            className="bg-purple-600 text-white rounded px-3 py-1 text-sm hover:bg-purple-700"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => setIsAddingFeedback(false)}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingFeedback(true)}
                                        className="flex items-center bg-purple-600 text-white rounded px-3 py-1 text-sm hover:bg-purple-700"
                                    >
                                        <FaPlus className="mr-1" />
                                        Add Feedback
                                    </button>
                                )}

                                {isAddingScore ? (
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Score column name"
                                            value={newColumnName}
                                            onChange={(e) => setNewColumnName(e.target.value)}
                                            className="border border-purple-300 rounded px-2 py-1 text-sm w-32 mr-2"
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Total"
                                            value={totalScore ?? ''}
                                            onChange={(e) => setTotalScore(e.target.value ? parseInt(e.target.value) : null)}
                                            className="border border-purple-300 rounded px-2 py-1 text-sm w-16 mr-2"
                                        />
                                        <button
                                            onClick={addScoreColumn}
                                            className="bg-purple-600 text-white rounded px-3 py-1 text-sm hover:bg-purple-700"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => setIsAddingScore(false)}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingScore(true)}
                                        className="flex items-center bg-purple-600 text-white rounded px-3 py-1 text-sm hover:bg-purple-700"
                                    >
                                        <FaPlus className="mr-1" />
                                        Add Score
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto relative">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee ID
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee Name
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Technical Skills
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Attitude
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Communication
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Work Quality
                                        </th>

                                        {/* First separator - after standard rating columns */}
                                        {(customFeedbackColumns.length > 0 || customScoreColumns.length > 0) && (
                                            <th className="px-1 py-3 border-l-2 border-gray-300"></th>
                                        )}

                                        {/* Feedback Columns */}
                                        {customFeedbackColumns.map((column) => (
                                            <th key={column.id} className="px-25 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center">
                                                            {editingColumn === column.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={column.name}
                                                                    onChange={(e) => updateColumnName(column.id, e.target.value, true)}
                                                                    onBlur={() => updateColumnName(column.id, column.name, true)}
                                                                    onKeyPress={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name, true)}
                                                                    className="border border-purple-300 rounded px-1 py-0.5 text-xs w-48" // Increased width
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span>{column.name}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xxs text-gray-400 mt-1">
                                                            {column.createdAt}
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <button
                                                            onClick={() => setEditingColumn(column.id)}
                                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                                        >
                                                            <FaEdit className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteColumn(column.id, true)}
                                                            className="ml-1 text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}

                                        {/* Second separator - between feedback and score columns */}
                                        {customFeedbackColumns.length > 0 && customScoreColumns.length > 0 && (
                                            <th className="px-1 py-3 border-l-2 border-gray-300"></th>
                                        )}

                                        {/* Score Columns */}
                                        {customScoreColumns.map((column) => (
                                            <th key={column.id} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {editingColumn === column.id ? (
                                                            <input
                                                                type="text"
                                                                value={column.name}
                                                                onChange={(e) => updateColumnName(column.id, e.target.value, false)}
                                                                onBlur={() => updateColumnName(column.id, column.name, false)}
                                                                onKeyPress={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name, false)}
                                                                className="border border-purple-300 rounded px-1 py-0.5 text-xs w-48" // Increased width
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <span>{column.name} ({column.totalScore})</span>
                                                        )}
                                                    </div>
                                                    <div className="flex">
                                                        <button
                                                            onClick={() => setEditingColumn(column.id)}
                                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                                        >
                                                            <FaEdit className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteColumn(column.id, false)}
                                                            className="ml-1 text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}

                                        {/* Average Score Column */}
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-20">
                                            <div className="flex items-center justify-between">
                                                <span>Average Score</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {employee.id}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.name}
                                            </td>

                                            {/* Standard Rating Columns */}
                                            {['technicalSkills', 'attitude', 'communication', 'workQuality'].map((field) => (
                                                <td key={field} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <select
                                                        value={employee[field]}
                                                        onChange={(e) => handleRatingChange(employee.id, field, e.target.value)}
                                                        className="border border-purple-300 rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                                                    >
                                                        {ratingOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="mt-1">
                                                        {renderRatingStars(employee[field])}
                                                    </div>
                                                </td>
                                            ))}

                                            {/* First separator in table body */}
                                            {(customFeedbackColumns.length > 0 || customScoreColumns.length > 0) && (
                                                <td className="px-1 py-4 border-l-2 border-gray-300"></td>
                                            )}

                                            {/* Custom Feedback Columns */}
                                            {customFeedbackColumns.map((column) => {
                                                const feedbackValue = employees.find(e => e.id === employee.id)?.[column.id] || '';
                                                return (
                                                    <td key={column.id} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <textarea
                                                            value={feedbackValue}
                                                            onChange={(e) => handleCustomFeedbackChange(employee.id, column.id, e.target.value)}
                                                            className="border border-purple-300 rounded px-2 py-1 text-sm w-full focus:ring-purple-500 focus:border-purple-500"
                                                            placeholder="Enter feedback"
                                                            rows={3}
                                                        />
                                                    </td>
                                                );
                                            })}

                                            {/* Second separator in table body */}
                                            {customFeedbackColumns.length > 0 && customScoreColumns.length > 0 && (
                                                <td className="px-1 py-4 border-l-2 border-gray-300"></td>
                                            )}

                                            {/* Custom Score Columns */}
                                            {customScoreColumns.map((column) => {
                                                return (
                                                    <td key={column.id} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {renderScoreInput(employee, column.id, column.totalScore)}
                                                    </td>
                                                );
                                            })}

                                            {/* Average Score Column */}
                                            <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium sticky right-0 z-10 ${getAverageScoreColor(calculateAverageScore(employee))} border-l-2 border-purple-200`}>
                                                <div className="flex items-center justify-center">
                                                    <span className={`font-bold ${calculateAverageScore(employee) === '-' ? 'text-gray-500' : calculateAverageScore(employee) >= 80 ? 'text-green-700' : calculateAverageScore(employee) >= 60 ? 'text-blue-700' : calculateAverageScore(employee) >= 40 ? 'text-yellow-700' : 'text-red-700'}`}>
                                                        {calculateAverageScore(employee)}{calculateAverageScore(employee) !== '-' && '%'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                        {hasChanges && (
                            <button
                                onClick={handleSave}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                            >
                                <FaSave className="mr-2" />
                                Save Changes
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingFeedback;
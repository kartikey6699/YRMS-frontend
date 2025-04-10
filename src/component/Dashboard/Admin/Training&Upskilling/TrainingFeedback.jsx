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

const TrainingFeedback = ({ training, onClose, onSave }) => {
    const [employees, setEmployees] = useState([
        { id: 'EMP001', name: 'John Doe', technicalSkills: '', attitude: '', communication: '', workQuality: '' },
        { id: 'EMP002', name: 'Jane Smith', technicalSkills: '', attitude: '', communication: '', workQuality: '' },
        { id: 'EMP003', name: 'Robert Johnson', technicalSkills: '', attitude: '', communication: '', workQuality: '' },
    ]);

    const [customFeedbackColumns, setCustomFeedbackColumns] = useState([]);
    const [customScoreColumns, setCustomScoreColumns] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [isAddingFeedback, setIsAddingFeedback] = useState(false);
    const [isAddingScore, setIsAddingScore] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingColumn, setEditingColumn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalScore, setTotalScore] = useState(100);

    const ratingOptions = [
        { value: '', label: 'Select rating' },
        { value: 'poor', label: 'poor' },
        { value: 'average', label: 'Average' },
        { value: 'good', label: 'Good' },
        { value: 'excellent', label: 'Excellent' }
    ];

    useEffect(() => {
        if (training) {
            // Load actual employee data here if needed
        }
    }, [training]);

    const handleRatingChange = (empId, field, value) => {
        setEmployees(employees.map(emp =>
            emp.id === empId ? { ...emp, [field]: value } : emp
        ));
        setHasChanges(true);
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
        const numericValue = value === '' ? '' : Math.min(maxScore, Math.max(0, parseInt(value) || 0));
        
        setEmployees(employees.map(emp =>
            emp.id === empId ? { ...emp, [columnId]: numericValue } : emp
        ));
        setHasChanges(true);
    };

    const addFeedbackColumn = () => {
        if (newColumnName.trim()) {
            const columnId = `feedback_${Date.now()}`;
            setCustomFeedbackColumns([...customFeedbackColumns, { id: columnId, name: newColumnName }]);
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
                [columnId]: 0
            })));
            setNewColumnName('');
            setTotalScore(100);
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
        const score = employee[columnId] || 0;
        const percentage = totalScore ? Math.round((score / totalScore) * 100) : 0;
        
        return (
            <div className="flex items-center">
                <input
                    type="number"
                    min="0"
                    max={totalScore}
                    value={score}
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

    const handleSave = () => {
        const dataToSave = {
            training: training?.name || 'Training',
            employees: employees.map(emp => {
                const empData = { ...emp };
                return empData;
            }),
            customFeedbackColumns,
            customScoreColumns
        };
        
        console.log('Saving data:', JSON.stringify(dataToSave, null, 2));
        onSave(employees, customFeedbackColumns, customScoreColumns);
        setHasChanges(false);
    };

    const getAverageScoreColor = (score) => {
        if (score === '-') return 'bg-gray-100';
        if (score >= 80) return 'bg-green-100 border-green-300';
        if (score >= 60) return 'bg-blue-100 border-blue-300';
        if (score >= 40) return 'bg-yellow-100 border-yellow-300';
        return 'bg-red-100 border-red-300';
    };

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
                                            className="border border-purple-300 rounded px-2 py-1 text-sm w-40 mr-2"
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
                                            value={totalScore}
                                            onChange={(e) => setTotalScore(parseInt(e.target.value) || 100)}
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

                                        {/* Feedback Columns */}
                                        {customFeedbackColumns.map((column) => (
                                            <th key={column.id} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {editingColumn === column.id ? (
                                                            <input
                                                                type="text"
                                                                value={column.name}
                                                                onChange={(e) => updateColumnName(column.id, e.target.value, true)}
                                                                onBlur={() => updateColumnName(column.id, column.name, true)}
                                                                onKeyPress={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name, true)}
                                                                className="border border-purple-300 rounded px-1 py-0.5 text-xs w-24"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <span>{column.name}</span>
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
                                                            onClick={() => deleteColumn(column.id, true)}
                                                            className="ml-1 text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}

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
                                                                className="border border-purple-300 rounded px-1 py-0.5 text-xs w-24"
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

                                            {/* Custom Feedback Columns */}
                                            {customFeedbackColumns.map((column) => (
                                                <td key={column.id} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <textarea
                                                        value={employee[column.id] || ''}
                                                        onChange={(e) => handleCustomFeedbackChange(employee.id, column.id, e.target.value)}
                                                        className="border border-purple-300 rounded px-2 py-1 text-sm w-full focus:ring-purple-500 focus:border-purple-500"
                                                        placeholder="Enter feedback"
                                                        rows={2}
                                                    />
                                                </td>
                                            ))}

                                            {/* Custom Score Columns */}
                                            {customScoreColumns.map((column) => (
                                                <td key={column.id} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {renderScoreInput(employee, column.id, column.totalScore)}
                                                </td>
                                            ))}

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
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';

const InternList = () => {
    const [interns, setInterns] = useState([
        {
            "id": 1,
            "name": "Michael Hill",
            "email": "nguyenhannah@example.net",
            "contact": "595.283.4101x12990",
            "location": "Mariaport",
            "mentor": "John Doe",
            "comptency": "Python",
            "startDate": "2025-01-14",
            "endDate": "2025-01-30",
            "rating": "5",
            "status": "Completed",
            "offered": true,
            "feedback": "Standard southern center.",
            "remark": "Support good drop medical memory night.",
            "stipen": 0
        },
        {
            "id": 2,
            "name": "Donna House",
            "email": "ndavis@example.org",
            "contact": "973.273.5528",
            "location": "Rivasstad",
            "mentor": "John Doe",
            "comptency": "Python",
            "startDate": "2025-02-22",
            "endDate": "2025-01-16",
            "rating": "2",
            "status": "Completed",
            "offered": false,
            "feedback": "One and wife financial program cover blood.",
            "remark": "Former in box black they table statement.",
            "stipen": 0
        },
        {
            "id": 3,
            "name": "Sharon Brown",
            "email": "tara27@example.org",
            "contact": "469.746.2632",
            "location": "New Katie",
            "mentor": "John Doe",
            "comptency": "Python",
            "startDate": "2025-01-26",
            "endDate": "2025-03-02",
            "rating": "5",
            "status": "Completed",
            "offered": false,
            "feedback": "Hand white little work.",
            "remark": "Responsibility because seem issue.",
            "stipen": 0
        },
        {
            "id": 4,
            "name": "Ashley Lopez",
            "email": "deanna55@example.com",
            "contact": "+1-639-768-5406",
            "location": "Port Matthewville",
            "mentor": "Bob Brown",
            "comptency": "Machine Learning",
            "startDate": "2025-02-22",
            "endDate": "2025-01-06",
            "rating": "1",
            "status": "running",
            "offered": false,
            "feedback": "Sell wind song and.",
            "remark": "Standard fish research lay.",
            "stipen": 0
        },
        {
            "id": 5,
            "name": "Christina Hoffman",
            "email": "jesse63@example.com",
            "contact": "001-811-968-7079",
            "location": "Lake Anthony",
            "mentor": "Bob Brown",
            "comptency": "DevOps",
            "startDate": "2025-01-27",
            "endDate": "2025-03-16",
            "rating": "4",
            "status": "Completed",
            "offered": false,
            "feedback": "Not direction beyond effort detail apply.",
            "remark": "On mission include identify room without central.",
            "stipen": 0
        },
        {
            "id": 6,
            "name": "Diane Higgins",
            "email": "igray@example.com",
            "contact": "977.420.0159x037",
            "location": "Jamesside",
            "mentor": "Jane Smith",
            "comptency": "Web Development",
            "startDate": "2025-03-25",
            "endDate": "2025-03-20",
            "rating": "4",
            "status": "running",
            "offered": true,
            "feedback": "Campaign magazine although present discussion crime.",
            "remark": "Really what around state chair.",
            "stipen": 0
        },
        {
            "id": 7,
            "name": "Christine Larsen",
            "email": "patrickrussell@example.com",
            "contact": "682.269.3319x69593",
            "location": "New Brittany",
            "mentor": "Bob Brown",
            "comptency": "Machine Learning",
            "startDate": "2025-03-20",
            "endDate": "2025-01-02",
            "rating": "5",
            "status": "running",
            "offered": true,
            "feedback": "Loss authority cut heavy far ago.",
            "remark": "Parent century finally success event could first.",
            "stipen": 0
        },
        {
            "id": 8,
            "name": "Craig Kelley",
            "email": "amandataylor@example.org",
            "contact": "(392)653-8715x9201",
            "location": "West Emily",
            "mentor": "Jane Smith",
            "comptency": "DevOps",
            "startDate": "2025-03-03",
            "endDate": "2025-02-15",
            "rating": "3",
            "status": "Completed",
            "offered": false,
            "feedback": "Fight talk country board size.",
            "remark": "Often wife hit American media life.",
            "stipen": 0
        },
        {
            "id": 9,
            "name": "Rebecca Sullivan",
            "email": "alyssa50@example.net",
            "contact": "(895)494-6499x9017",
            "location": "South Megan",
            "mentor": "John Doe",
            "comptency": "Data Science",
            "startDate": "2025-01-08",
            "endDate": "2025-02-08",
            "rating": "3",
            "status": "running",
            "offered": false,
            "feedback": "System however take recent speech commercial.",
            "remark": "Three purpose they across article.",
            "stipen": 0
        },
        {
            "id": 10,
            "name": "Tyler Davis",
            "email": "jennifer06@example.com",
            "contact": "8324126613",
            "location": "Jessicaside",
            "mentor": "Jane Smith",
            "comptency": "Data Science",
            "startDate": "2025-01-04",
            "endDate": "2025-02-19",
            "rating": "1",
            "status": "Completed",
            "offered": false,
            "feedback": "Manager career floor there account also.",
            "remark": "Fast think relationship him democratic radio over or.",
            "stipen": 0
        },
        {
            "id": 11,
            "name": "Michael Ramsey",
            "email": "dominguezfrank@example.net",
            "contact": "+1-753-820-0266x972",
            "location": "West Theresaton",
            "mentor": "John Doe",
            "comptency": "Data Science",
            "startDate": "2025-02-09",
            "endDate": "2025-03-18",
            "rating": "3",
            "status": "Completed",
            "offered": false,
            "feedback": "Charge when miss worker investment list.",
            "remark": "Game can reveal director manager different.",
            "stipen": 0
        },
        {
            "id": 12,
            "name": "Haley Livingston",
            "email": "emily71@example.net",
            "contact": "210.290.8910",
            "location": "South Andrew",
            "mentor": "Alice Johnson",
            "comptency": "Machine Learning",
            "startDate": "2025-03-04",
            "endDate": "2025-03-09",
            "rating": "2",
            "status": "Completed",
            "offered": false,
            "feedback": "Their my character loss its animal relationship although.",
            "remark": "Few purpose coach people view former use.",
            "stipen": 0
        },
        {
            "id": 13,
            "name": "Hannah Carrillo",
            "email": "gutierrezmichelle@example.com",
            "contact": "7434628630",
            "location": "Samanthaville",
            "mentor": "John Doe",
            "comptency": "DevOps",
            "startDate": "2025-01-20",
            "endDate": "2025-03-20",
            "rating": "1",
            "status": "Completed",
            "offered": false,
            "feedback": "Stock since from responsibility point.",
            "remark": "Or court chance understand I.",
            "stipen": 0
        },
        {
            "id": 14,
            "name": "Larry Alexander",
            "email": "mcintoshlinda@example.com",
            "contact": "(502)848-6599x179",
            "location": "West Scott",
            "mentor": "Bob Brown",
            "comptency": "Data Science",
            "startDate": "2025-01-13",
            "endDate": "2025-01-01",
            "rating": "1",
            "status": "Completed",
            "offered": true,
            "feedback": "Candidate should five knowledge.",
            "remark": "Material adult edge ever.",
            "stipen": 0
        },
        {
            "id": 15,
            "name": "Robert Anderson",
            "email": "danielle11@example.com",
            "contact": "(469)680-8682",
            "location": "Jeremymouth",
            "mentor": "Bob Brown",
            "comptency": "Python",
            "startDate": "2025-03-05",
            "endDate": "2025-01-29",
            "rating": "5",
            "status": "Completed",
            "offered": true,
            "feedback": "High wait ability mean sport.",
            "remark": "Color different join.",
            "stipen": 0
        },
        {
            "id": 16,
            "name": "David Perry",
            "email": "brendacarter@example.com",
            "contact": "745-756-9248x24187",
            "location": "Jenningsstad",
            "mentor": "Jane Smith",
            "comptency": "Machine Learning",
            "startDate": "2025-03-20",
            "endDate": "2025-01-11",
            "rating": "3",
            "status": "Completed",
            "offered": true,
            "feedback": "We require person guess natural where contain improve.",
            "remark": "White design environment ever.",
            "stipen": 0
        },
        {
            "id": 17,
            "name": "Cory Burns",
            "email": "jill52@example.org",
            "contact": "4388871444",
            "location": "Josephmouth",
            "mentor": "John Doe",
            "comptency": "Data Science",
            "startDate": "2025-03-24",
            "endDate": "2025-02-09",
            "rating": "4",
            "status": "Completed",
            "offered": true,
            "feedback": "Fall low say whether.",
            "remark": "Environmental nature make level.",
            "stipen": 0
        },
        {
            "id": 18,
            "name": "Brittany Harvey",
            "email": "beckerleah@example.org",
            "contact": "001-732-905-8033x00436",
            "location": "Lemouth",
            "mentor": "John Doe",
            "comptency": "Machine Learning",
            "startDate": "2025-02-22",
            "endDate": "2025-03-10",
            "rating": "5",
            "status": "running",
            "offered": true,
            "feedback": "Example position grow letter level alone budget interest.",
            "remark": "Subject market probably change.",
            "stipen": 0
        },
        {
            "id": 19,
            "name": "Cassandra Graham",
            "email": "dunderwood@example.org",
            "contact": "001-636-772-7559",
            "location": "Ralphshire",
            "mentor": "Jane Smith",
            "comptency": "Data Science",
            "startDate": "2025-03-25",
            "endDate": "2025-01-22",
            "rating": "3",
            "status": "Completed",
            "offered": false,
            "feedback": "Factor poor knowledge think break join.",
            "remark": "Nearly wrong company deep just second top.",
            "stipen": 0
        },
        {
            "id": 20,
            "name": "Anita Miller",
            "email": "courtneycastaneda@example.org",
            "contact": "001-379-447-3723x9271",
            "location": "New Benjamin",
            "mentor": "Alice Johnson",
            "comptency": "Python",
            "startDate": "2025-02-04",
            "endDate": "2025-03-13",
            "rating": "3",
            "status": "Completed",
            "offered": true,
            "feedback": "Occur bad team increase.",
            "remark": "Any blue key thousand reflect stand partner.",
            "stipen": 0
        }
    ]);

    const [searchTerms, setSearchTerms] = useState({
        name: '',
        email: '',
        mentor: '',
        status: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const [selectedInterns, setSelectedInterns] = useState(null);

    const handleSearchChange = (e, column) => {
        setSearchTerms(prev => ({ ...prev, [column]: e.target.value }));
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedInterns = [...interns]
        .filter(interns =>
            interns.name.toLowerCase().includes(searchTerms.name.toLowerCase()) &&
            interns.email.toLowerCase().includes(searchTerms.email.toLowerCase()) &&
            interns.mentor.toLowerCase().includes(searchTerms.mentor.toLowerCase()) &&
            (!searchTerms.status.toLowerCase() || interns.mentor === searchTerms.status.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];
            return sortConfig.direction === 'ascending' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
        });

    const columns = [
        { key: 'id', label: 'S.No' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'mentor', label: 'Mentored By' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'status', label: 'Status' }
    ];

    return (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold text-blue-800">Interns Details</h2>
                    <Link
                        className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                        to='/interns/add'
                        >
                            <FaPlus className="mr-2" />
                            Add Intern
                    </Link>
                </div>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-800">
                        {columns.map(column => (
                            <th key={column.key} className="p-3 text-left font-semibold text-sm border-b border-gray-200">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span>{column.label}</span>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedInterns.map((intern, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                            <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">{index + 1}</td>
                            <td
                                className="p-3 text-blue-600 text-sm border-r border-gray-200 cursor-pointer hover:underline"
                                onClick={() => setSelectedInterns(intern)}
                            >
                                {intern.name}
                            </td>
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                {intern.email}
                            </td>
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                {intern.mentor}
                            </td>
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{new Date(intern.startDate).toLocaleDateString()}</td>
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{new Date(intern.endDate).toLocaleDateString()}</td>
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                <span className={`px-2 py-1 rounded-full text-xs ${intern.status === 'running' ? 'bg-blue-100 text-blue-800' :
                                    intern.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InternList;
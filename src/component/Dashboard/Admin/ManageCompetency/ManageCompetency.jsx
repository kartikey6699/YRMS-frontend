import React, { useState } from 'react';
import ListCompetency from './CompetencyList';
import AddCompetency from './AddCompetency';

const CompetencyPage = ({ activeSection, setActiveSection }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [selectedCompetency, setSelectedCompetency] = useState(null);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <>
            {activeSection === 'view' && (
                <ListCompetency
                    setActiveSection={setActiveSection}
                    setSelectedCompetency={setSelectedCompetency}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                />
            )}
            {activeSection === 'add' && (
                <AddCompetency
                    setActiveSection={setActiveSection}
                    setSelectedCompetency={setSelectedCompetency}
                    selectedCompetency={selectedCompetency}
                    onSuccess={() => setActiveSection('view')}
                />
            )}
        </>
    );
};

export default CompetencyPage;
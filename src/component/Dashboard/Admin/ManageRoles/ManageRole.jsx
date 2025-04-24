import React, { useState } from 'react';
import RoleList from './RoleList';


const RolesPage = ({ setActiveSection, setSelectedRole }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = (roleId) => {
        // Your delete logic here
    };

    const handleEdit = (role) => {
        // Your edit logic here
    };

    return (
        <RoleList
            setSelectedRole={setSelectedRole}
            setActiveSection={setActiveSection}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSort={handleSort}
            sortConfig={sortConfig}
        />
    );
};

export default RolesPage
import React, { useEffect, useState } from 'react';
import { fetchRoles } from '../../../../features/role/roleAction'
import { useDispatch, useSelector } from 'react-redux';
import RoleList from './RoleList';


const RolesPage = ({setActiveSection}) => {

    const dispatch = useDispatch();
    const { roles } = useSelector(
        (state) => state.role
    );
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    // Fetch roles from API
    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    console.log(roles, "?>>>>>>>>")
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
            roles={roles} 
            setActiveSection={setActiveSection}
            onDelete={handleDelete} 
            onEdit={handleEdit} 
            onSort={handleSort} 
            sortConfig={sortConfig} 
        />
    );
};

export default RolesPage
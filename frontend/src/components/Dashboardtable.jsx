// src/components/Dashboardtable.jsx
import styles from './Table.module.css';

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'applied': return styles.statusApplied;
        case 'interview': return styles.statusInterview;
        case 'rejected': return styles.statusRejected;
        case 'in process': return styles.statusInterview;
        default: return '';
    }
};

const DashboardTable = ({ data, onDelete, onEdit }) => {

    // Helper function to handle the delete click with confirmation
    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this internship entry?")) {
            onDelete(id);
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>COMPANY</th><th>POSITION</th><th>LOCATION</th><th>DEADLINE</th><th>STATUS</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((app) => (
                        <tr key={app.id} className={styles.tableRow}>
                            {/* --- ADDED data-label ATTRIBUTES HERE --- */}
                            <td className={styles.companyName} data-label="Company">{app.company}</td>
                            <td data-label="Position">{app.position}</td>
                            <td className={styles.location} data-label="Location">{app.location}</td>
                            <td data-label="Deadline">{app.deadline}</td>
                            <td data-label="Status">
                                <span className={`${styles.statusBadge} ${getStatusClass(app.status)}`}>
                                    {app.status}
                                </span>
                            </td>
                            <td className={styles.actionsCell} data-label="Actions">
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '100%' }}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => onEdit(app)}
                                        title="Edit Application"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteClick(app.id)}
                                        title="Delete Application"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardTable;
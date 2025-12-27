import styles from "./Dashboard.module.css"
const Dashboardheader=({onAddClick,searchTerm,onSearchChange,statusFilter,onStatusFilterChange})=>{
    return(
        <header className={styles.headercontainer}>
            <h1 className={styles.title}>My Applications</h1>
            <div className={styles.controls}>
                <input type="text" className={styles.searchcompany} placeholder="Search Company..." value={searchTerm} onChange={onSearchChange} />
                <select className={styles.dropdown} value={statusFilter} onChange={onStatusFilterChange}>
                    <option value="all">All Statuses</option>
                    <option value="applied">Applied</option>
                    <option value="rejected">Rejected</option>
                    <option value="inprocess">In Process</option>
                </select>
                {/* <select className={styles.dropdown}>
                    <option value="deadline">Sort: Deadline ↓</option>
                    <option value="company"> Sort: Company</option>
                </select> */}
                <button className={styles.addbutton} onClick={onAddClick}>
                    + Add Application
                </button>
            </div>
        </header>
    );
};
export default  Dashboardheader
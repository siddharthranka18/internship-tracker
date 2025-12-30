// src/components/AddInternshipmodel.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from "./AddInternshipmode.module.css"
import formStyles from "./InternshipForm.module.css"

const initialFormState = {
    company: '',
    position: '', // Correctly uses 'position'
    location: '',
    appliedDate: '',
    status: 'Applied'
};

const AddInternshipmodel = ({ onClose, onAdd, onUpdate, internshipToEdit }) => {
    const [formData, setFormData] = useState(internshipToEdit || initialFormState);

    useEffect(() => {
        if (internshipToEdit) {
            setFormData(internshipToEdit);
        } else {
            setFormData(initialFormState);
        }
    }, [internshipToEdit]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => { // 1. Add async here
        e.preventDefault();
        if (!formData.company || !formData.position) {
            alert("Please fill in required fields.");
            return;
        }

        try {
            if (internshipToEdit) {
                // 2. Add await to ensure the request finishes
                await onUpdate(formData); 
            } else {
                // 2. Add await here too
                await onAdd(formData); 
            }
            // 3. Only close the modal AFTER the request is successful
            onClose(); 
        } catch (error) {
            // If the 400 error happens, the modal stays open so you can see why
            console.error("Submission failed:", error);
            alert("Failed to save. Check the console for details.");
        }
    }
    const modalJSX = (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{internshipToEdit ? 'Edit Internship' : 'Add New Internship'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>

                <form className={formStyles.formContainer} onSubmit={handleSubmit}>
                    <div className={formStyles.formGroup}>
                        <label htmlFor="company" className={formStyles.label}>Company Name</label>
                        {/* Added || '' to prevent console warnings */}
                        <input type="text" id='company' className={formStyles.input} placeholder='e.g. Google' required value={formData.company || ''} onChange={handleChange} />
                    </div>

                    <div className={formStyles.formGroup}>
                        {/* Fixed label htmlFor and text to match input id */}
                        <label htmlFor="position" className={formStyles.label}>Position</label>
                        <input
                            type="text"
                            id='position' // Matches state & DB field
                            className={formStyles.input}
                            placeholder='e.g. SDE'
                            required
                            value={formData.position || ''} // Correctly binds to position
                            onChange={handleChange}
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label htmlFor="location" className={formStyles.label}>Location</label>
                        <input type="text" id='location' className={formStyles.input} placeholder='e.g. hyderabad' required value={formData.location || ''} onChange={handleChange} />
                    </div>
                    <div className={formStyles.formGroup}>
    <label htmlFor="appliedDate" className={formStyles.label}>Application Deadline</label>
    <input 
        type="date" 
        id='appliedDate' // This is the key 'handleChange' uses
        className={formStyles.input} 
        required 
        value={formData.appliedDate || ''} // CHANGE THIS from .deadline to .appliedDate
        onChange={handleChange} 
    />
</div>
                    <div className={formStyles.formGroup}>
                        <label htmlFor="status" className={formStyles.label}>Status</label>
                        <select id="status" className={formStyles.select} value={formData.status || 'Applied'} onChange={handleChange}>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option> {/* Add this line */}
                                <option value="Offer Received">Offer Received</option>
                                <option value="Rejected">Rejected</option>
</select>
                    </div>

                    <div className={formStyles.formActions}>
                        <button type='button' className={formStyles.cancelButton} onClick={onClose}>Cancel</button>
                        <button type='submit' className={formStyles.submitButton}>
                            {internshipToEdit ? 'Update Application' : 'Save Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;
    return ReactDOM.createPortal(modalJSX, modalRoot);
}

export default AddInternshipmodel;
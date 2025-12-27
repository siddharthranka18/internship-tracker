// src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboardheader";
import Table from "./components/Dashboardtable";
import AddInternshipModal from './components/AddInternshipmodel';
import api from './api';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internshipToEdit, setInternshipToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [internships, setInternships] = useState([]);

  // Fetch data on load
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await api.get('/internships');
        // Format data for frontend (map _id to id, format date)
        const formattedData = response.data.map(item => ({
            ...item,
            id: item._id,
            deadline: item.appliedDate ? item.appliedDate.split('T')[0] : ''
        }));
        setInternships(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInternships();
  }, []);

  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
      setStatusFilter(event.target.value);
  };

  // --- FILTERING LOGIC ---
  const filteredInternships = internships.filter(internship => {
      const companyName = internship.company.toLowerCase();
      const search = searchTerm.toLowerCase();
      const matchesSearch = companyName.includes(search);

      const dataStatusStr = internship.status?.toLowerCase() || '';
      const filterValueStr = statusFilter.toLowerCase();

      const matchesStatus = filterValueStr === 'all' || dataStatusStr === filterValueStr;

      return matchesSearch && matchesStatus;
  });


  const openModal = (internship = null) => {
      setInternshipToEdit(internship);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setInternshipToEdit(null);
      setIsModalOpen(false);
  };


  // Add Internship (Connects to Backend)
  const addInternship = async (newInternshipData) => {
      try {
        const dataToSend = {
            company: newInternshipData.company,
            position: newInternshipData.position,
            location: newInternshipData.location,
            status: newInternshipData.status,
            appliedDate: newInternshipData.deadline
        };

        await api.post('/internships/add', dataToSend);

        // Refresh data
        const refreshResponse = await api.get('/internships');
        const formattedData = refreshResponse.data.map(item => ({
            ...item,
            id: item._id,
            deadline: item.appliedDate ? item.appliedDate.split('T')[0] : ''
        }));
        setInternships(formattedData);
        closeModal();
      } catch (error) {
          console.error("Error adding internship:", error);
          alert("Failed to add internship.");
      }
  }

  const updateInternship = async (updatedData) => {
    try {
        // 1. Prepare data for backend (match schema names)
        const dataToSend = {
            company: updatedData.company,
            position: updatedData.position,
            location: updatedData.location,
            status: updatedData.status,
            appliedDate: updatedData.deadline
        };

        // 2. Send PUT request to backend
        await api.put(`/internships/${updatedData.id}`, dataToSend);

        // --- NEW APPROACH: RE-FETCH DATA ---
        // 3. Re-fetch all data from the backend to ensure local state is synced
        const response = await api.get('/internships');
        // Format data for frontend (map _id to id, format date)
        const formattedData = response.data.map(item => ({
            ...item,
            id: item._id,
            deadline: item.appliedDate ? item.appliedDate.split('T')[0] : ''
        }));
        setInternships(formattedData);
        // ------------------------------------

        closeModal();

    } catch (error) {
        console.error("Error updating internship:", error);
        alert("Failed to update internship. Check console.");
    }
}

  // Delete remains local for now
  // In src/App.jsx

  // ==========================================
  // --- BACKEND CHANGE: DELETE FUNCTION ---
  // ==========================================
  const deleteInternship = async (idToDelete) => {
    // Optional: Add a confirmation dialog
    if (!window.confirm("Are you sure you want to delete this internship?")) {
        return;
    }

    try {
        // 1. Send DELETE request to backend
        console.log(`Sending delete request for ID: ${idToDelete}`);
        await api.delete(`/internships/${idToDelete}`);
        console.log("Delete successful on backend");

        // 2. Update local state immediately
        // Filter out the deleted item from the list
        setInternships(prevInternships =>
            prevInternships.filter(item => item.id !== idToDelete)
        );

    } catch (error) {
        console.error("Error deleting internship:", error);
        alert("Failed to delete internship. Check console.");
    }
}


  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <Dashboard
            onAddClick={() => openModal(null)}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
        />
        <Table
            data={filteredInternships}
            onDelete={deleteInternship}
            onEdit={openModal}
        />
      </main>
      {isModalOpen && (
        <AddInternshipModal
            onClose={closeModal}
            onAdd={addInternship}
            onUpdate={updateInternship}
            internshipToEdit={internshipToEdit}
        />
      )}
    </div>
  );
}

export default App;
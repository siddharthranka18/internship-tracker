// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboardheader";
import Table from "./components/Dashboardtable";
import AddInternshipModal from './components/AddInternshipmodel';
import Login from './components/Login'; // Make sure these files exist
import Register from './components/Register'
import api from './api';
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>; // Prevent flickering
  if (!user) return <Navigate to="/login" />; // Redirect to login
  
  return children;
};
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internshipToEdit, setInternshipToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
        try {
            const response = await api.get('/internships');
            
            if (Array.isArray(response.data)) {
                const formattedData = response.data.map(item => ({
                    ...item,
                    id: item._id,
                    deadline: item.appliedDate ? item.appliedDate.split('T')[0] : ''
                }));
                setInternships(formattedData);
            }
        } catch (error) {
            // Only log errors that AREN'T 401 (Unauthorized)
            if (error.response?.status !== 401) {
                console.error("Error fetching data:", error);
            } else {
                console.log("User not authenticated; skipping data fetch.");
            }
            setInternships([]); 
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
  // Add ?. and || '' to handle missing company names safely
  const companyName = (internship.company || '').toLowerCase(); 
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


  const addInternship = async (newInternshipData) => {
    // 1. FIX: Changed 'formData' to 'newInternshipData' to avoid ReferenceError
    console.log("Sending to Backend:", newInternshipData); 
    
    try {
        const dataToSend = {
            company: newInternshipData.company,
            position: newInternshipData.position,
            location: newInternshipData.location,
            status: newInternshipData.status,
            // 2. FIX: Use 'appliedDate' because that is the ID in your form now
            appliedDate: newInternshipData.appliedDate || new Date().toISOString().split('T')[0]
        };

        const response = await api.post('/internships/add', dataToSend);
        setInternships();
        const newItem = {
            ...response.data,
            id: response.data._id,
            // 3. Mapping the response back to the 'deadline' key for your UI list
            deadline: response.data.appliedDate ? response.data.appliedDate.split('T')[0] : ''
        };
        
        setInternships(prev => [...prev, newItem]);
        closeModal();
    } catch (error) {
        console.error("Backend Error Detail:", error.response?.data);
        alert(`Failed to add: ${error.response?.data?.message || "Check console"}`);
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
    <Routes>
      {/* The Main Dashboard Route */}
      <Route path="/" element={
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
      } />

      {/* The New Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>

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
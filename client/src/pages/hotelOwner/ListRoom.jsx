import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import Title from '../../components/Title'

const ListRoom = () => {
    const { axios, getToken, user } = useAppContext()
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    console.log("=== ListRoom component rendered ===");
    console.log("User from context:", user);
    console.log("Axios available:", !!axios);
    console.log("getToken available:", !!getToken);

    // Toggle room availability
    const toggleAvailability = async (roomId) => {
        const { data } = await axios.post("/api/rooms/toggle-availability", { roomId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
        if (data.success) {
            toast.success(data.message)
            fetchRooms()
        } else {
            toast.error(data.message)
        }
    }

        // Fetch Rooms of the Hotel Owner
        const fetchRooms = async () => {
            try {
                console.log("=== Fetching rooms ===");
                console.log("User:", user);
                
                setLoading(true)
                setError(null)
                
                const token = await getToken();
                console.log("Token available:", !!token);
                
                const { data } = await axios.get('/api/rooms/owner', { 
                    headers: { Authorization: `Bearer ${token}` } 
                })
                
                console.log("API Response:", data);
                
                if (data.success) {
                    console.log("Rooms received:", data.rooms);
                    setRooms(data.rooms)
                } else {
                    console.log("API error:", data.message);
                    if (data.needsHotelRegistration) {
                        setError("Please register your hotel first to view rooms.")
                    } else {
                        setError(data.message)
                    }
                    toast.error(data.message)
                }
            } catch (error) {
                console.error("Error fetching rooms:", error)
                console.error("Error details:", error.response?.data || error.message);
                setError("Failed to load rooms")
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }

        useEffect(() => {
            console.log("=== useEffect triggered ===");
            console.log("User state:", user);
            
            if (user) {
                console.log("User available, fetching rooms...");
                fetchRooms()
            } else {
                console.log("No user, waiting...");
            }
        }, [user])

        if (loading) {
            return (
                <div>
                    <Title align='left' font='outfit' title='Room Listings' subTitle='Loading your room listings...'/>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading rooms...</div>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    <Title align='left' font='outfit' title='Room Listings' subTitle='Error loading room listings'/>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">Error: {error}</p>
                        {error.includes("register your hotel") && (
                            <div className="mt-4">
                                <p className="text-red-600 mb-2">You need to register a hotel before you can manage rooms.</p>
                                <button 
                                    onClick={() => window.location.href = '/'}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Go Home & Register Hotel
                                </button>
                            </div>
                        )}
                        <button 
                            onClick={fetchRooms}
                            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

      return (
        <div>
          <Title align='left' font='outfit' title='Room Listings' subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.'/>
          <p className='text-gray-500 mt-8'>All Rooms ({rooms.length})</p>

          {rooms.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-4 text-center">
              <h3 className="text-yellow-800 font-medium text-lg mb-2">No Rooms Found</h3>
              <p className="text-yellow-700 mb-4">You haven't added any rooms yet. Start by adding your first room!</p>
              <button 
                onClick={() => window.location.href = '/owner/add-room'}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Add Your First Room
              </button>
            </div>
          ) : (
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
              <table className='w-full'>
              <thead className='bg-gray-50'>
                  <tr>
                      <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                      <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                      <th className='py-3 px-4 text-gray-800 font-medium'>Price / night</th>
                      <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                  </tr>
              </thead>
              <tbody className='text-sm'>
              {
              rooms.map((item, index)=>(
              <tr key={index}>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                      {item.roomType}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                      {item.amenities?.join(', ') || 'No amenities'}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                      ${item.pricePerNight}
                  </td>
                  <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
                      <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                          <input onChange={() => toggleAvailability(item._id)} type="checkbox" className='sr-only peer' checked={item.isAvailable}/>
                          <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                          <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                  </td>
              </tr>
              ))
              }
              </tbody>
              </table>
        </div>
      )}
    </div>
  )
}

export default ListRoom
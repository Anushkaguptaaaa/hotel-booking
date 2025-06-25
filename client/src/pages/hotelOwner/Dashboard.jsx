import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
    const { axios, getToken } = useAppContext();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            console.log("=== Dashboard: Starting fetch ===");
            const token = await getToken();
            console.log("Dashboard: Token available:", !!token);
            
            if (!token) {
                setError("No authentication token");
                toast.error("Authentication required");
                return;
            }

            console.log("Dashboard: Making API call...");
            const { data } = await axios.get('/api/hotels/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Dashboard: API response:", data);

            if (data.success) {
                console.log("Dashboard: Setting data:", data.data);
                setDashboardData(data.data);
                setError(null);
            } else {
                console.log("Dashboard: API returned error:", data.message);
                if (data.needsHotelRegistration) {
                    setError("Please register your hotel first to access the dashboard.");
                } else {
                    setError(data.message);
                }
                toast.error(data.message || "Failed to load dashboard data");
            }
        } catch (error) {
            console.error("Dashboard: Fetch error:", error);
            setError(error.message);
            toast.error("Failed to load dashboard data");
        } finally {
            console.log("Dashboard: Setting loading to false");
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Dashboard: useEffect triggered");
        fetchDashboardData();
    }, []);

    console.log("Dashboard: Render state - loading:", loading, "error:", error, "data:", dashboardData);

    if (loading) {
        return (
            <div>
                <Title align='left' font='outfit' title='Dashboard' subTitle='Loading your dashboard...'/>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Title align='left' font='outfit' title='Dashboard' subTitle='Dashboard Error'/>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">Error: {error}</p>
                    {error.includes("register your hotel") && (
                        <div className="mt-4">
                            <p className="text-red-600 mb-2">You need to register a hotel before accessing the dashboard.</p>
                            <button 
                                onClick={() => window.location.href = '/'}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Go Home & Register Hotel
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={fetchDashboardData}
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
            <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue—all in one place.'/>

            {/* Hotel Info */}
            {dashboardData?.hotel && (
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                    <h3 className='text-lg font-semibold text-blue-800'>{dashboardData.hotel.name}</h3>
                    <p className='text-blue-600'>{dashboardData.hotel.address}, {dashboardData.hotel.city}</p>
                    <p className='text-blue-600'>Contact: {dashboardData.hotel.contact}</p>
                </div>
            )}

            {/* Basic Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-8'>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <h4 className='text-blue-800 font-medium'>Total Bookings</h4>
                    <p className='text-2xl text-blue-600'>{dashboardData?.totalBookings || 0}</p>
                </div>
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <h4 className='text-green-800 font-medium'>Total Revenue</h4>
                    <p className='text-2xl text-green-600'>${dashboardData?.totalRevenue?.toFixed(2) || '0.00'}</p>
                </div>
                <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
                    <h4 className='text-purple-800 font-medium'>Total Rooms</h4>
                    <p className='text-2xl text-purple-600'>{dashboardData?.totalRooms || 0}</p>
                </div>
            </div>

            {/* Message for next steps */}
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <h4 className='text-yellow-800 font-medium'>Next Steps</h4>
                <p className='text-yellow-700'>Your hotel is registered! Now you can add rooms to start receiving bookings.</p>
            </div>
        </div>
    );
}

export default Dashboard

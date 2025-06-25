import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { assets } from '../../assets/assets'

const Dashboard = () => {
    const { axios, getToken, currency } = useAppContext();
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
            const { data } = await axios.get('/api/bookings/hotel', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Dashboard: API response:", data);

            if (data.success) {
                console.log("Dashboard: Setting data:", data.dashboardData);
                setDashboardData(data.dashboardData);
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
            <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.'/>
            
            <div className='flex gap-4 my-8'>
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img className='max-sm:hidden h-10' src={assets.totalBookingIcon} alt="" />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Bookings</p>
                        <p className='text-neutral-400 text-base'>{dashboardData?.totalBookings || 0}</p>
                    </div>
                </div>
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img className='max-sm:hidden h-10' src={assets.totalRevenueIcon} alt="" />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenue</p>
                        <p className='text-neutral-400 text-base'>{currency} {dashboardData?.totalRevenue || 0}</p>
                    </div>
                </div>
            </div>

            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
            {/* Table with heads User Name, Room Name, Amount Paid, Payment Status */}
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full' >
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData?.bookings?.length > 0 ? (
                            dashboardData.bookings.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.user?.username || 'N/A'}</td>
                                    <td className='py-3 px-4 text-gray-400 border-t border-gray-300 max-sm:hidden'>{item.room?.roomType || 'N/A'}</td>
                                    <td className='py-3 px-4 text-gray-400 border-t border-gray-300 text-center'>{currency} {item.totalPrice || 0}</td>
                                    <td className='py-3 px-4 border-t border-gray-300 flex'>
                                        <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? "bg-green-200 text-green-600" : "bg-amber-200 text-yellow-600"}`}>
                                            {item.isPaid ? "Completed" : "Pending"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className='py-8 text-center text-gray-500'>
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard
